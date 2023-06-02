import { GameWorld } from '../GameWorld';
import { Drawable } from '../Drawable';


export interface Item extends Drawable {

    /**
     * Calls when player uses item
     *
     * @param world game world
     *
     * @return is item used and must be removed from inventory
     */
    useItem(world: GameWorld): boolean;
}
