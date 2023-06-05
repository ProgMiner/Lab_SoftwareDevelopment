import { BaseEvent } from '../../core/events/Event';
import { PlayerDieEvent } from './PlayerDieEvent';


/**
 * Base type of all game events
 */
export interface BaseGameEvent<Type extends string> extends BaseEvent<Type> {}

/**
 * Type of all game events
 */
export type GameEvent = PlayerDieEvent;
