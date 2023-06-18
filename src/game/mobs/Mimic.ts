import { PassiveBehaviourModel } from '../behaviour/PassiveBehaviourModel';
import { Coordinates } from '../../utils/Coordinates';
import { NO_TEXTURE } from '../../utils/drawTexture';
import { DroppedItem } from '../DroppedItem';
import { AbstractMob } from './AbstractMob';
import { Item } from '../items/Item';


/**
 * Mimic
 *
 * Simple mob that stays on one cell and looks like some item
 */
export class Mimic extends AbstractMob<Mimic> {

    health: number = 5;
    readonly maxHealth: number = 5;

    damage: number = 1;
    armor: number = 0;

    experience: number = 1;

    private _item: Item;

    private droppedItem: DroppedItem;

    protected readonly self: Mimic = this;

    /**
     * Item used as Mimic's look
     */
    get item(): Item {
        return this._item;
    }

    set item(value: Item) {
        this._item = value;
        this.droppedItem = new DroppedItem(value, this.coordinates);
    }

    constructor(item: Item, coordinates: Coordinates) {
        super(coordinates, NO_TEXTURE, new PassiveBehaviourModel());

        this._item = item;
        this.droppedItem = new DroppedItem(item, this.coordinates);
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates) {
        this.droppedItem.coordinates = this.coordinates;
        this.droppedItem.draw(context, center, scale);

        // draw health bar on top
        super.draw(context, center, scale);
    }
}
