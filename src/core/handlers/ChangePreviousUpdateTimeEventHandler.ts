import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';


/**
 * Event handler that updates `previousUpdateTime` of state
 */
export const ChangePreviousUpdateTimeEventHandler: EventHandler<State> = (state, { type }) => {
    if (type === 'tick') {
        state.previousUpdateTime = performance.now();
    }
};
