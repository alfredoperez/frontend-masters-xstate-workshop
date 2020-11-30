import {assign, createMachine, interpret} from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

/**
 * Assign the point values (`px`, `py`) to wherever the `#box` was clicked
 * on the `idle (mousedown) -> dragging` transition.
 * @param context
 * @param event
 */
const assignPoint = assign({
    px: (context, event) => event.clientX,
    py: (context, event) => event.clientY,
});

/**
 * Assign the delta values (`dx`, `dy`) to how far from the original `px` and `py`
 * values the mouse has moved on the `dragging (mousemove)` transition.
 *
 * @param context
 * @param event
 */
const assignDelta = assign({
    dx: (context, event) => {
        return event.clientX - context.px;
    },
    dy: (context, event) => {
        return event.clientY - context.py;
    },
});


/**
 * Assign the resting position (`x`, `y`) as the current position
 * + the delta on the `dragging (mouseup) -> idle` transition.
 *
 * @param context
 * @param event
 */
const assignPosition = assign({
    x: (context, event) => context.x + context.dx,
    y: (context, event) => context.y + context.dy,
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
});

const showDelta = (context) => {
    elBox.dataset.delta = `delta: ${context.dx}, ${context.dy}`;
};

const resetPosition = assign({
    dx: 0,
    dy: 0,
    px: 0,
    py: 0,
});

const machine = createMachine({
    initial: 'idle',
    context: {
        x: 0,  //  resting position
        y: 0,
        dx: 0, // Delta
        dy: 0,
        px: 0, //  point values
        py: 0,
    },
    states: {
        idle: {
            on: {
                mousedown: {
                    // Assign the point
                    actions: assignPoint,
                    target: 'dragging',
                },
            },
        },
        dragging: {
            on: {
                mousemove: {
                    // Assign the delta
                    // ...
                    // (no target!)
                    actions: [assignDelta, showDelta],
                },
                mouseup: {
                    // Assign the position
                    actions: assignPosition,
                    target: 'idle',
                },
                'keyup.escape': {
                    target: 'idle',
                    actions: resetPosition,
                },
            },
        },
    },
});

const service = interpret(machine);

service.onTransition((state) => {
    if (state.changed) {
        console.log(state.context);

        elBox.dataset.state = state.value;

        elBox.style.setProperty('--dx', state.context.dx);
        elBox.style.setProperty('--dy', state.context.dy);
        elBox.style.setProperty('--x', state.context.x);
        elBox.style.setProperty('--y', state.context.y);
    }
});

service.start();

elBody.addEventListener('mousedown', service.send);

elBody.addEventListener('mouseup', service.send);

elBody.addEventListener('mousemove', service.send);
elBody.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
        service.send('keyup.escape');
    }
});
// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody
