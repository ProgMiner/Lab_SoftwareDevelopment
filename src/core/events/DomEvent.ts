

/**
 * Wrapper for DOM events
 *
 * @template Type event type
 * @template EventType concrete type of DOM event
 */
export interface DomEvent<Type extends string, EventType extends Event> {
    type: Type;

    /**
     * Wrapped DOM event
     */
    event: EventType;
}
