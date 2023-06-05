import { Coordinates } from '../utils/Coordinates';
import { Drawable } from './Drawable';
import { Collider } from './Collider';


/**
 * Game object
 *
 * Any object that can be in game world
 */
export interface GameObject extends Drawable, Collider {

    /**
     * Left top cell of object in world coordinates
     */
    coordinates: Coordinates;

    /**
     * Could player step on (or in)
     */
    readonly isPassable: boolean;

    /**
     * Check is object in update distance
     *
     * @param playerPosition current player position
     * @param updateDistance maximum distance allowed to update
     *
     * @return is needed to update
     */
    needUpdate(playerPosition: Coordinates, updateDistance: number): boolean;
}
