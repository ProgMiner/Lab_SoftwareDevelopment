import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { Coordinates } from '../../utils/Coordinates';
import { GameObject } from '../GameObject';

import wall from './wall.png';

loadTexture(wall);

/**
 * Impassable object of complex shape
 */
export class Wall implements GameObject {

    readonly isPassable = false;

    coordinates: Coordinates = Coordinates.ZERO;

    /**
     * Walls matrix, value is `true` if wall is on cell, `false` otherwise
     *
     * Must be rectangle (all rows has same length)
     */
    matrix: boolean[][] = [];

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        for (let i = 0; i < this.matrix.length; ++i) {
            const row = this.matrix[i]!;

            for (let j = 0; j < row.length; ++j) {
                if (row[j]) {
                    drawTexture(wall, context, new Coordinates(
                        center.x + scale.x * j,
                        center.y + scale.y * i - scale.y * 0.25,
                    ), new Coordinates(scale.x, scale.y * 1.5));
                }
            }
        }
    }

    collides(point: Coordinates): boolean {
        return this.getMatrixValueByCoordinates(point) ?? false;
    }

    needUpdate(playerPosition: Coordinates, updateDistance: number): boolean {
        if (this.getMatrixValueByCoordinates(playerPosition) !== undefined) {
            return true;
        }

        const width = this.matrix[0]?.length ?? 0;
        const height = this.matrix.length;

        let minDistance: number;
        if (playerPosition.x < this.coordinates.x) {
            if (playerPosition.y < this.coordinates.y) {
                minDistance = playerPosition.vectorTo(this.coordinates).length();
            } else if (playerPosition.y < this.coordinates.y + height) {
                minDistance = this.coordinates.x - playerPosition.x;
            } else {
                minDistance = playerPosition.vectorTo(new Coordinates(
                    this.coordinates.x,
                    this.coordinates.y + height,
                )).length();
            }
        } else if (playerPosition.x < this.coordinates.x + width) {
            minDistance = Math.min(
                Math.abs(this.coordinates.y - playerPosition.y),
                Math.abs(this.coordinates.y + height - playerPosition.y),
            );
        } else {
            if (playerPosition.y < this.coordinates.y) {
                minDistance = playerPosition.vectorTo(new Coordinates(
                    this.coordinates.x + width,
                    this.coordinates.y,
                )).length();
            } else if (playerPosition.y < this.coordinates.y + height) {
                minDistance = this.coordinates.x + width - playerPosition.x;
            } else {
                minDistance = playerPosition.vectorTo(new Coordinates(
                    this.coordinates.x + width,
                    this.coordinates.y + height,
                )).length();
            }
        }

        return minDistance < updateDistance;
    }

    private getMatrixValueByCoordinates(coordinates: Coordinates): boolean | undefined {
        const i = coordinates.y - this.coordinates.y;
        const j = coordinates.x - this.coordinates.x;

        if (i >= 0 && i < this.matrix.length) {
            const row = this.matrix[i]!;

            if (j >= 0 && j < row.length) {
                return row[j]!;
            }
        }
    }
}
