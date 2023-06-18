import { Cloneable } from '../../core/Cloneable';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Behaviour model
 *
 * Controls behaviour of movable object, how it moves in world on step
 *
 * @template Self type of movable object
 */
export interface BehaviourModel<Self extends Movable> extends Cloneable {

    /**
     * Calls after player's move
     *
     * @param self current game object
     * @param world current game world
     */
    onMove(self: Self, world: GameWorld): void;

    clone(): BehaviourModel<Self>;
}
