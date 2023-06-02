import { Coordinates } from '../Coordinates';
import { Drawable } from '../Drawable';
import { Collider } from '../Collider';
import { drawTexture, loadTexture } from '../../utils/drawTexture';

import obama from './obama.png';


loadTexture(obama);

export class Player implements Drawable, Collider {

    coordinates: Coordinates = new Coordinates(0, 0);

    draw(
        context: CanvasRenderingContext2D,
        place: Coordinates,
        scale: Coordinates,
    ): void {
        drawTexture(obama, context, place, scale);
    }

    collides(point: Coordinates): boolean {
        return point.equals(this.coordinates);
    }
}
