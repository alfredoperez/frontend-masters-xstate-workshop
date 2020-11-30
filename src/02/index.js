import {createMachine} from 'xstate';

const elBox = document.querySelector('#box');


const machine = createMachine({
  // Add your object machine definition here
  initial:'inactive',
  states:{
    active:{
      on:{CLICK: 'inactive'}
    },
    inactive: {on:{CLICK:'active'}}
  }
});

// Change this to the initial state
let currentState = machine.initialState;
elBox.dataset.state = currentState.value;
console.log({currentState});

function send(event) {
  // Determine and update the `currentState`
  currentState = machine.transition(currentState, event);
  console.log({currentState});
  elBox.dataset.state = currentState.value;
}

elBox.addEventListener('click', () => {
  // Send a click event
  send('CLICK');
});
