import { BaseEvent } from '../../core/events/Event';
import { PlayerDieEvent } from './PlayerDieEvent';
import { LevelUpEvent } from './LevelUpEvent';


/**
 * Base type of all game events
 */
export interface BaseGameEvent<Type extends string> extends BaseEvent<Type> {}

/**
 * Type of all game events
 */
export type GameEvent = PlayerDieEvent | LevelUpEvent;
