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
     *
     * TODO replace with result of {@link GameObject.collides} call
     */
    readonly isPassable: boolean;
}
