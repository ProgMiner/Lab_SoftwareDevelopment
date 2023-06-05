import { GameObject } from './GameObject';
import { GameWorld } from './GameWorld';


/**
 * Trigger
 *
 * Reacts on player stepping on
 */
export interface Trigger extends GameObject {

    /**
     * Calls when player stepping on object
     *
     * @param world current game world
     */
    onStep(world: GameWorld): void;
}

/**
 * Checks is game object a trigger
 *
 * @param object object to check
 */
export const isTrigger = (object: GameObject): object is Trigger => {
    return 'onStep' in object;
};
