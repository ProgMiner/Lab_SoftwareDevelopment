import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';


/**
 * Event handler that updates canvas size on window load and window resize
 */
export const InitEventHandler: EventHandler<State> = ({ canvas }, event) => {
    if (event.type !== 'load' && event.type != 'resize') {
        return;
    }

    const documentSize = document.body.getBoundingClientRect();

    canvas.width = documentSize.width;
    canvas.height = documentSize.height;
}
