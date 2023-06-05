import { BaseEvent } from './Event';


/**
 * Wrapper for DOM events
 *
 * @template Type event type
 * @template EventType concrete type of DOM event
 */
export interface DomEvent<Type extends string, EventType extends Event> extends BaseEvent<Type> {

    /**
     * Wrapped DOM event
     */
    event: EventType;
}
