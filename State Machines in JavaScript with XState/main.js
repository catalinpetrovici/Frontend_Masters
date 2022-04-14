import './style.css';
import { createMachine } from 'xstate';

// creating a simple state machine
// doesn't need any libraries
// just switch statements
// we're modeling a simple prompt

// state: { status: 'idle'}
// event: { type: 'FETCH'}
function transition(state, event) {
  switch (state.status) {
    case 'idle':
      if (event.type !== 'FETCH') return state;

      console.log('Starting to fetch data');
      return { status: 'loading' };

    case 'loading':
      //other behavior
      break;
    default:
      break;
  }

  //event-first type

  //   switch (event.type) {
  //     case 'FETCH':
  //       if (state.status == 'loading') return;
  //       return { status: 'loading' };
  //     default:
  //       break;
  //   }

  return state;
}

// State Machine using objects

const machine = {
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {},
  },
};

function transition2(state, event) {
  const nextStatus =
    machine.states[state.status].on?.[event.type] ?? state.status;

  return {
    status: nextStatus,
  };
}

window.machine = machine;
window.transition = transition;
window.transition2 = transition2;
