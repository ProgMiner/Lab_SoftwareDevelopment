import { drawTexture } from '../../utils/drawTexture';
import { Coordinates } from '../../utils/Coordinates';
import { GameWorld } from '../GameWorld';
import { Item } from './Item';


/**
 * Abstract class that provides convenient way to texture items
 */
export abstract class TexturedItem implements Item {

    /**
     * Item texture
     *
     * @protected
     */
    protected readonly texture: string;

    /**
     * @param texture item texture
     *
     * @protected
     */
    protected constructor(texture: string) {
        this.texture = texture;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(this.texture, context, center, scale);
    }

    abstract useItem(world: GameWorld): Item | undefined;
}
