import { BaseEvent } from './Event';


/**
 * Timer tick event, must be used for drawing, but could be used for any other purposes
 *
 * Fires once on a global timer tick with same frequency
 */
export type TickEvent = BaseEvent<'tick'>;
