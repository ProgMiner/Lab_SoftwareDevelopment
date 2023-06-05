import { BaseState } from '../../states/State';
import { Event } from '../events/Event';


/**
 * Event handler that updates canvas size on window load and window resize
 */
export const InitEventHandler = ({ canvas }: BaseState<string>, event: Event): void => {
    if (event.type !== 'load' && event.type != 'resize') {
        return;
    }

    const documentSize = document.body.getBoundingClientRect();

    canvas.width = documentSize.width;
    canvas.height = documentSize.height;
}
