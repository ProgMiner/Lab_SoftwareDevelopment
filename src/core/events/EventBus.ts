import { KeyDownEvent } from './KeyDownEvent';
import { ResizeEvent } from './ResizeEvent';
import { LoadEvent } from './LoadEvent';
import { TickEvent } from './TickEvent';


export type Event = LoadEvent | ResizeEvent | KeyDownEvent | TickEvent;

export type EventHandler<State> = (state: State, event: Event) => void;

export const EventBus = <State>(state: State, ...handlers: EventHandler<State>[]) => {
    return (event: Event) => {
        for (let handler of handlers) {
            handler(state, event);
        }
    };
}
