import { GameEvent } from '../../game/events/GameEvent';
import { KeyDownEvent } from './KeyDownEvent';
import { ResizeEvent } from './ResizeEvent';
import { ClickEvent } from './ClickEvent';
import { LoadEvent } from './LoadEvent';
import { TickEvent } from './TickEvent';


/**
 * Base event for all events
 */
export interface BaseEvent<Type extends string> {

    /**
     * Type of event, discriminator
     */
    readonly type: Type;
}

/**
 * General type for all events
 */
export type Event = LoadEvent | ResizeEvent | KeyDownEvent | ClickEvent | TickEvent | GameEvent;
