import { Movable } from '../Movable';
import { Trigger } from '../Trigger';


/**
 * Mob
 *
 * Game object that acts like living and could interact with player
 */
export interface Mob extends Movable, Trigger {

    /**
     * Current mob health
     */
    health: number;

    /**
     * Maximum mob health
     */
    readonly maxHealth: number;

    /**
     * Amount of health points which gives after each move
     */
    readonly regenerationSpeed: number;

    /**
     * Mob damage
     */
    readonly damage: number;

    /**
     * Mob armor
     */
    readonly armor: number;

    /**
     * Amount of experience points that mob gives player for kill
     */
    readonly experience: number;
}
