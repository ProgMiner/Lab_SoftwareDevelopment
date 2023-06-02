import { Coordinates } from './Coordinates';


export interface Collider {

    collides(point: Coordinates): boolean;
}
