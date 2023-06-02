import { drawTexture } from '../../utils/drawTexture';
import { Coordinates } from '../Coordinates';
import { GameWorld } from '../GameWorld';
import { Item } from './Item';


export abstract class TexturedItem implements Item {

    protected readonly texture: string;

    protected constructor(texture: string) {
        this.texture = texture;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(this.texture, context, center, scale);
    }

    abstract useItem(world: GameWorld): Item | undefined;
}
