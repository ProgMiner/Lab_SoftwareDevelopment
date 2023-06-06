import { Item } from '../items/Item';
import { Drawable } from '../Drawable';
import { Coordinates } from '../../utils/Coordinates';
import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { DroppedItem } from '../DroppedItem';
import { GameWorld } from '../GameWorld';

import inventoryTexture from './inventory.png';
import selectedItemTexture from './selected_item.png';


/**
 * Amount of inventory slots
 */
export const INVENTORY_SIZE = 9;

/**
 * Drawing scale factor for items
 */
export const ITEM_SCALE_FACTOR = 56 / 64;

const SELECTED_ITEM_SCALE_FACTOR = 68 / 64;

if (process.env.NODE_ENV !== 'test') {
    loadTexture(inventoryTexture);
    loadTexture(selectedItemTexture);
}

/**
 * Player's inventory
 */
export class Inventory implements Drawable {

    /**
     * Contents of inventory
     */
    readonly items = new Array<Item | undefined>(INVENTORY_SIZE);

    /**
     * Current selected slot number, must be in range 0..{@link INVENTORY_SIZE}
     */
    selectedItem: number = 0;

    /**
     * Counts items in inventory
     */
    itemsCount(): number {
        return this.items.filter(v => v !== undefined).length;
    }

    /**
     * Try to pick item into inventory
     *
     * @param item item to pick
     *
     * @return `true` if item picked, `false` if inventory is fully filled
     */
    pickItem(item: Item): boolean {
        for (let i = 0; i < INVENTORY_SIZE; ++i) {
            if (this.items[i] === undefined) {
                this.items[i] = item;
                return true;
            }
        }

        return false;
    }

    /**
     * Use item in selected slot, does nothing if no item in selected slot
     *
     * @param world current game world
     */
    useSelectedItem(world: GameWorld) {
        const item = this.items[this.selectedItem];

        if (item === undefined) {
            return;
        }

        this.items[this.selectedItem] = item.useItem(world);
    }

    /**
     * Drop item from selected slot into world, does nothing if no item in selected slot
     *
     * @param world current game world
     */
    dropSelectedItem(world: GameWorld) {
        const item = this.items[this.selectedItem];

        if (item === undefined) {
            return;
        }

        world.placeObject(new DroppedItem(item, world.player.coordinates));
        this.items[this.selectedItem] = undefined;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(
            inventoryTexture,
            context,
            center,
            new Coordinates(scale.x * INVENTORY_SIZE, scale.y),
        );

        const firstItemPosition = new Coordinates(center.x - (INVENTORY_SIZE - 1) / 2 * scale.x, center.y);

        drawTexture(
            selectedItemTexture,
            context,
            new Coordinates(firstItemPosition.x + this.selectedItem * scale.x, firstItemPosition.y),
            new Coordinates(scale.x * SELECTED_ITEM_SCALE_FACTOR, scale.y * SELECTED_ITEM_SCALE_FACTOR),
        );

        for (let i = 0; i < INVENTORY_SIZE; ++i) {
            this.items[i]?.draw(
                context,
                new Coordinates(firstItemPosition.x + i * scale.x, firstItemPosition.y),
                new Coordinates(scale.x * ITEM_SCALE_FACTOR, scale.y * ITEM_SCALE_FACTOR),
            );
        }
    }
}
