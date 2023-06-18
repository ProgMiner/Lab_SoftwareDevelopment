import { BehaviourModel } from './BehaviourModel';
import { Cloneable } from '../../core/Cloneable';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * State for {@link StatedBehaviourModel}
 */
export interface BehaviourState<Self extends Movable> extends Cloneable {

    /**
     * Calls in {@link StatedBehaviourModel.onMove}
     *
     * @param self current game object
     * @param world current game world
     *
     * @return new state or this
     */
    onMove(self: Self, world: GameWorld): BehaviourState<Self>;

    clone(): BehaviourState<Self>;
}

/**
 * Stated behaviour model
 *
 * Useful to specify behaviour models with several states
 */
export class StatedBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    /**
     * Current state
     */
    state: BehaviourState<Self>;

    /**
     * @param initialState first state
     */
    constructor(initialState: BehaviourState<Self>) {
        this.state = initialState;
    }

    onMove(self: Self, world: GameWorld): void {
        this.state = this.state.onMove(self, world);
    }

    clone(): StatedBehaviourModel<Self> {
        return new StatedBehaviourModel(this.state.clone());
    }
}
