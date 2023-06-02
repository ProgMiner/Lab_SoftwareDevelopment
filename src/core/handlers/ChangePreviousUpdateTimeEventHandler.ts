import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';


export const ChangePreviousUpdateTimeEventHandler: EventHandler<State> = (state, { type }) => {
    if (type === 'tick') {
        state.previousUpdateTime = performance.now();
    }
};
