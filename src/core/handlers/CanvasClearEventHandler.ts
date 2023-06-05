import { EventHandler } from '../events/EventBus';
import { State } from '../../states/State';


/**
 * Event handler that clears canvas every tick
 */
export const CanvasClearEventHandler: EventHandler<State> = ({ canvas, context }, { type }) => {
    if (type === 'tick') {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
};
