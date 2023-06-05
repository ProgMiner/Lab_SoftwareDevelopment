import { DomEvent } from './DomEvent';


/**
 * Fires when user presses key on canvas
 */
export type KeyDownEvent = DomEvent<'keyDown', KeyboardEvent>;
