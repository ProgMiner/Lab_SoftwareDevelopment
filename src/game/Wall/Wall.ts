import { Drawable } from '../Drawable';
import { Coordinates } from '../Coordinates';
import { Collider } from '../Collider';


export class Wall implements Drawable, Collider {

    leftTop: Coordinates = new Coordinates(0, 0);

    draw(
        context: CanvasRenderingContext2D,
        place: Coordinates,
        scale: Coordinates,
    ): void {
    }

    collides(point: Coordinates): boolean {
        return false;
    }
}
