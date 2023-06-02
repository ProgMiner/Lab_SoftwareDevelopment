import { Coordinates } from './Coordinates';
import { Player } from './Player/Player';
import { Drawable } from './Drawable';
import { GameObject } from './GameObject';


export class GameWorld implements Drawable {

    objects: GameObject[] = [];

    player: Player = new Player();

    movePlayer(direction: Coordinates): boolean {
        const newPosition = new Coordinates(
            this.player.coordinates.x + direction.x,
            this.player.coordinates.y + direction.y,
        );

        if (this.checkCollisionWithObjects(newPosition)) {
            return false;
        }

        this.player.coordinates = newPosition;
        return true;
    }

    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void {
        this.player.draw(context, center, scale);

        for (const object of this.objects) {
            const coords = new Coordinates(
                object.coordinates.x - this.player.coordinates.x,
                object.coordinates.y - this.player.coordinates.y,
            );

            object.draw(context, new Coordinates(
                center.x + coords.x * scale.x,
                center.y - coords.y * scale.y,
            ), scale);
        }
    }

    checkCollisionWithObjects(point: Coordinates) {
        for (const object of this.objects) {
            if (object.collides(point)) {
                return true;
            }
        }

        return false;
    }
}
