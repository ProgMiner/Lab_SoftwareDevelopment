import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { Coordinates } from '../Coordinates';
import { GameObject } from '../GameObject';

import wall from './wall.png';


loadTexture(wall);

export class Wall implements GameObject {

    coordinates: Coordinates = new Coordinates(0, 0);

    matrix: boolean[][] = [];

    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void {
        for (let i = 0; i < this.matrix.length; ++i) {
            for (let j = 0; j < this.matrix[i].length; ++j) {
                if (this.matrix[i][j]) {
                    drawTexture(wall, context, new Coordinates(
                        center.x + scale.x * j,
                        center.y - scale.y * (this.matrix.length - i - 1) - scale.y * 0.25,
                    ), new Coordinates(scale.x, scale.y * 1.5));
                }
            }
        }
    }

    collides(point: Coordinates): boolean {
        const i = this.matrix.length - point.y + this.coordinates.y - 1;
        const j = point.x - this.coordinates.x;

        if (i >= 0 && i < this.matrix.length) {
            if (j >= 0 && j < this.matrix[i].length) {
                return this.matrix[i][j];
            }
        }

        return false;
    }
}
