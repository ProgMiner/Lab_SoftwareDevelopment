import { Item } from '../items/Item';
import { Drawable } from '../Drawable';
import { Coordinates } from '../Coordinates';
import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { DroppedItem } from '../DroppedItem';
import { GameWorld } from '../GameWorld';

import inventoryTexture from './inventory.png';
import selectedItemTexture from './selected_item.png';


export const INVENTORY_SIZE = 9;

loadTexture(inventoryTexture);
loadTexture(selectedItemTexture);

export class Inventory implements Drawable {

    readonly items = new Array<Item | undefined>(INVENTORY_SIZE);
    selectedItem: number = 0;

    itemsCount(): number {
        return this.items.filter(v => v !== undefined).length;
    }

    pickItem(item: Item): boolean {
        for (let i = 0; i < INVENTORY_SIZE; ++i) {
            if (this.items[i] === undefined) {
                this.items[i] = item;
                return true;
            }
        }

        return false;
    }

    useSelectedItem(world: GameWorld) {
        const item = this.items[this.selectedItem];

        if (item === undefined) {
            return;
        }

        if (item.useItem(world)) {
            this.items[this.selectedItem] = undefined;
        }
    }

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
            new Coordinates(scale.x * 68 / 64, scale.y * 68 / 64),
        );

        for (let i = 0; i < INVENTORY_SIZE; ++i) {
            this.items[i]?.draw(
                context,
                new Coordinates(firstItemPosition.x + i * scale.x, firstItemPosition.y),
                new Coordinates(scale.x * 56 / 64, scale.y * 56 / 64),
            );
        }
    }
}
