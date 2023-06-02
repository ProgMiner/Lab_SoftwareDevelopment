import { GameWorld } from '../GameWorld';
import { Drawable } from '../Drawable';


export interface Item extends Drawable {

    /**
     * Calls when player uses item
     *
     * @param world game world
     *
     * @return what item must be placed instead of this
     */
    useItem(world: GameWorld): Item | undefined;
}
