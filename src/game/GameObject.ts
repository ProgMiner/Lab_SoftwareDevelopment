import { Drawable } from './Drawable';
import { Collider } from './Collider';
import { Coordinates } from './Coordinates';


export interface GameObject extends Drawable, Collider {

    /**
     * Left top cell of object
     */
    coordinates: Coordinates;
}
