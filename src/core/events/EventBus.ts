import { KeyDownEvent } from './KeyDownEvent';
import { ResizeEvent } from './ResizeEvent';
import { LoadEvent } from './LoadEvent';
import { TickEvent } from './TickEvent';


/**
 * Generic type for all events
 */
export type Event = LoadEvent | ResizeEvent | KeyDownEvent | TickEvent;

/**
 * Type of event handler
 *
 * @template State type of state
 *
 * @param {State} state current state
 * @param {Event} event fired event
 */
export type EventHandler<State> = (state: State, event: Event) => void;

/**
 * Event bus. Once constructed supplies events and fires them
 * to all handlers in same order as specified
 *
 * @template State type of state
 *
 * @param {State} state state
 * @param {EventHandler<State>[]} handlers list of event handlers
 */
export const EventBus = <State>(state: State, ...handlers: EventHandler<State>[]) => {
    return (event: Event) => {
        for (let handler of handlers) {
            handler(state, event);
        }
    };
}
