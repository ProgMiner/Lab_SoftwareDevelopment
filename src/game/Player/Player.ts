import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { Inventory } from '../Inventory/Inventory';
import { Coordinates } from '../Coordinates';
import { GameObject } from '../GameObject';

import person from './person.png';


loadTexture(person);

export class Player implements GameObject {

    coordinates: Coordinates = new Coordinates(0, 0);

    readonly inventory = new Inventory();

    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void {
        drawTexture(person, context, center, scale);
    }

    collides(point: Coordinates): boolean {
        return point.equals(this.coordinates);
    }
}
