const elBox = document.querySelector('#box');

// Pure function that returns the next state,
// given the current state and sent event
function transition(state, event) {
  // Add your state/event transitions here
  // to determine and return the next state
  switch (state) {
    case 'active':
      switch (event){
        case 'DEACTIVATE':
          return 'inactive';
        default:
          return state;
      }
    case 'inactive':
      switch (event){
        case 'ACTIVATE':
          return 'active';
        default:
          return state;
      }
    default:
      return state;
  }
}

// Keep track of your current state
let currentState = 'inactive';

function send(event) {
  // Determine the next value of `currentState`

  let nextState = transition(currentState,event);
  console.log({nextState});
  currentState = nextState;
  elBox.dataset.state = currentState;
}

elBox.addEventListener('click', () => {
  // send a click event
  const eventToSend = currentState==='active'? 'DEACTIVATE':'ACTIVATE';
  send(eventToSend)
});
