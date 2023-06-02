import { Coordinates } from './Coordinates';
import { Player } from './Player/Player';
import { Drawable } from './Drawable';


export class GameWorld implements Drawable {

    player: Player = new Player();

    movePlayer(direction: Coordinates) {
        const newPosition = new Coordinates(
            this.player.coordinates.x + direction.x,
            this.player.coordinates.y + direction.y,
        );

        // TODO check collision

        this.player.coordinates = newPosition;
    }

    draw(
        context: CanvasRenderingContext2D,
        place: Coordinates,
        scale: Coordinates,
    ): void {
        this.player.draw(context, place, scale);
    }
}
