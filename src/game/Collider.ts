import { Coordinates } from '../utils/Coordinates';


/**
 * Collider object, could check is collides with point in world
 */
export interface Collider {

    /**
     * Check is object collides with point in world
     *
     * @param point point to check
     *
     * @return `true` if collides, `false` otherwise
     */
    collides(point: Coordinates): boolean;
}
