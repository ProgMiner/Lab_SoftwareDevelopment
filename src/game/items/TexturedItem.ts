import { drawTexture, Texture } from '../../utils/drawTexture';
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
    protected readonly texture: Texture;

    /**
     * @param texture item texture
     *
     * @protected
     */
    protected constructor(texture: Texture) {
        this.texture = texture;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(this.texture, context, center, scale);
    }

    abstract useItem(world: GameWorld): Item | undefined;
}
