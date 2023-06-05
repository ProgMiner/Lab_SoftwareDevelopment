import { Event } from './Event';


/**
 * Type of event handler
 *
 * @template State type of state
 *
 * @param {State} state current state
 * @param {Event} event fired event
 *
 * @return new state or nothing
 */
export type EventHandler<State> = (state: State, event: Event) => State | void;

/**
 * Event bus. Once constructed supplies events and fires them
 * to all handlers in same order as specified
 *
 * Event handlers could change and replace state object
 *
 * @template State type of state
 *
 * @param {State} state initial state
 * @param {EventHandler<State>[]} handlers list of event handlers
 */
export const EventBus = <State>(state: State, ...handlers: EventHandler<State>[]) => {
    return (event: Event) => {
        for (let handler of handlers) {
            const result = handler(state, event);

            if (result !== undefined) {
                state = result;
            }
        }
    };
};
