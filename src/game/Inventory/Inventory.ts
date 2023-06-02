import { Item } from '../Item';
import { Drawable } from '../Drawable';
import { Coordinates } from '../Coordinates';
import { drawTexture, loadTexture } from '../../utils/drawTexture';

import inventoryTexture from './inventory.png';
import selectedItemTexture from './selected_item.png';


export const INVENTORY_SIZE = 9;

loadTexture(inventoryTexture);
loadTexture(selectedItemTexture);

export class Inventory implements Drawable {

    readonly items = new Array<Item>(INVENTORY_SIZE);
    selectedItem: number = 0;

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(
            inventoryTexture,
            context,
            center,
            new Coordinates(scale.x * INVENTORY_SIZE, scale.y),
        );

        // TODO draw items

        drawTexture(
            selectedItemTexture,
            context,
            new Coordinates(center.x - 4 * scale.x + this.selectedItem * scale.x, center.y),
            new Coordinates(scale.x * 68 / 64, scale.y * 68 / 64),
        );
    }
}
