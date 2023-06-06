import { Coordinates } from '../utils/Coordinates';
import { GameObject } from './GameObject';
import { GameWorld } from './GameWorld';


/**
 * Object that reacts on player's moves
 */
export interface Movable extends GameObject {

    /**
     * Calls when player moved (after move)
     *
     * @param world current game world
     */
    onMove(world: GameWorld): void;

    /**
     * Moves object to another point in world
     *
     * @param newPosition new position of object
     * @param world current game world
     *
     * @return `true` if object is on `newPosition` after call
     */
    moveTo(newPosition: Coordinates, world: GameWorld): boolean;
}

/**
 * Checks is game object movable
 *
 * @param object game object to check
 *
 * @return is {@link Movable}
 */
export const isMovable = (object: GameObject): object is Movable => {
    return 'onMove' in object;
};
