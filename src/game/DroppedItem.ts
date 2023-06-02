import { Coordinates } from './Coordinates';
import { GameObject } from './GameObject';
import { Item } from './items/Item';
import { Trigger } from './Trigger';
import { Player } from './Player/Player';
import { GameWorld } from './GameWorld';


const ITEM_SCALE_FACTOR = 0.5;

export class DroppedItem implements Trigger {

    readonly isPassable = true;

    readonly item: Item;

    readonly coordinates: Coordinates;

    constructor(item: Item, coordinates: Coordinates) {
        this.item = item;
        this.coordinates = coordinates;
    }

    onStep(world: GameWorld): void {
        if (world.player.inventory.pickItem(this.item)) {
            world.removeObject(this);
        }
    }

    collides(point: Coordinates): boolean {
        return this.coordinates.equals(point);
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        context.save();

        context.fillStyle = 'rgba(0, 0, 0, 0.3)';

        context.beginPath();
        context.ellipse(
            center.x,
            center.y + scale.y * ITEM_SCALE_FACTOR / 2,
            scale.x * ITEM_SCALE_FACTOR / 2,
            scale.y * ITEM_SCALE_FACTOR / 4,
            0,
            0,
            2 * Math.PI,
        )
        context.closePath();
        context.fill();

        context.restore();

        this.item.draw(context, center, new Coordinates(scale.x * ITEM_SCALE_FACTOR, scale.y * ITEM_SCALE_FACTOR));
    }
}
