import { BaseGameEvent } from './GameEvent';


/**
 * Fires when player take new level
 */
export interface LevelUpEvent extends BaseGameEvent<'levelUp'> {

    /**
     * Player's damage before level up
     */
    previousDamage: number;

    /**
     * Player's armor before level up
     */
    previousArmor: number;
}
