import { GameWorld } from '../GameWorld';
import { Drawable } from '../Drawable';


/**
 * Item, could be used by player
 */
export interface Item extends Drawable {

    /**
     * Calls when player uses item
     *
     * @param world game world
     *
     * @return what item must be placed to inventory instead of this
     */
    useItem(world: GameWorld): Item | undefined;
}
