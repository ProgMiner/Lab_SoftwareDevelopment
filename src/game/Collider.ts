import { Coordinates } from './Coordinates';


export interface Collider {

    /**
     * Check is object collides with point in world
     *
     * @param point
     */
    collides(point: Coordinates): boolean;
}
