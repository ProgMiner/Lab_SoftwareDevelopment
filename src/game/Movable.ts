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
}
