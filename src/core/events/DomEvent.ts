

export interface DomEvent<Type extends string, EventType extends Event> {
    type: Type;
    event: EventType;
}
