import { Coordinates } from './Coordinates';
import { Player } from './Player/Player';
import { Drawable } from './Drawable';
import { GameObject } from './GameObject';
import { isTrigger } from './Trigger';


export class GameWorld implements Drawable {

    objects: GameObject[] = [];

    player: Player = new Player();

    constructor() {
        this.objects.push(this.player);
    }

    placeObject(object: GameObject) {
        // FIXME dirty hack to select correct place for object,
        //       where it will be on top but under player and walls

        const playerIdx = this.objects.indexOf(this.player);

        if (playerIdx === -1) {
            console.error('Player is not in objects list');
            return;
        }

        this.objects.splice(playerIdx, 0, object);
    }

    removeObject(object: GameObject): boolean {
        const idx = this.objects.indexOf(object);

        if (idx === -1) {
            return false;
        }

        this.objects.splice(idx, 1);
        return true;
    }

    movePlayer(direction: Coordinates): boolean {
        const newPosition = new Coordinates(
            this.player.coordinates.x + direction.x,
            this.player.coordinates.y + direction.y,
        );

        if (this.checkCollisionWithObjects(newPosition) !== null) {
            return false;
        }

        this.player.coordinates = newPosition;

        const trigger = this.checkCollisionWithObjects(newPosition, false);
        if (trigger !== null && isTrigger(trigger)) {
            trigger.onStep(this);
        }

        return true;
    }

    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void {
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

    checkCollisionWithObjects(point: Coordinates, onlyImpassable: boolean = true) {
        for (const object of this.objects) {
            if (onlyImpassable) {
                if (object.isPassable) {
                    continue;
                }
            }

            if (object.collides(point)) {
                return object;
            }
        }

        return null;
    }
}
