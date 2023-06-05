import { Coordinates } from '../utils/Coordinates';
import { GameWorld } from './GameWorld';
import { Trigger } from './Trigger';
import { Item } from './items/Item';


const ITEM_SCALE_FACTOR = 0.5;

/**
 * Dropped item object
 *
 * When player steps on, tries to pick item and self-remove on success
 *
 * @see Inventory.pickItem
 */
export class DroppedItem implements Trigger {

    readonly isPassable = true;

    coordinates: Coordinates;

    /**
     * Holding item
     */
    readonly item: Item;

    constructor(item: Item, coordinates: Coordinates) {
        this.coordinates = coordinates;
        this.item = item;
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
