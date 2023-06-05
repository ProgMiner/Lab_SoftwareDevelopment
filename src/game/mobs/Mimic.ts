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

    armor: number = 1;
    damage: number = 1;

    experience: number = 1;

    get self() {
        return this;
    }

    item: Item;

    constructor(item: Item, coordinates: Coordinates) {
        super(coordinates, NO_TEXTURE, new PassiveBehaviourModel());

        this.item = item;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates) {
        new DroppedItem(this.item, this.coordinates).draw(context, center, scale);

        // draw health bar on top
        super.draw(context, center, scale);
    }
}
