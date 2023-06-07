import { BehaviourState, StatedBehaviourModel } from './StatedBehaviourModel';
import { CowardlyBehaviourModel } from './CowardlyBehaviourModel';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Mob } from '../mobs/Mob';


const PANIC_HEALTH_FACTOR = 0.25;

/**
 * Clever behaviour model
 *
 * Stated behaviour model that could switch between following states:
 * - normal state: use default behaviour model
 * - panic state: use panic state
 *
 * Normal state switches to panic when health of mob being less than 0.25 of maximum health
 * Panic state switches to normal when health being greater than 0.25 of maximum health
 */
export class CleverBehaviourModel<Self extends Mob> extends StatedBehaviourModel<Self> {

    /**
     * Behaviour model that used in normal state
     */
    defaultBehaviour: BehaviourModel<Self>;

    /**
     * Behaviour model that used in panic
     */
    panicBehaviour: BehaviourModel<Self> = new CowardlyBehaviourModel();

    /**
     * @param defaultBehaviour behaviour model that used in normal state
     */
    constructor(defaultBehaviour: BehaviourModel<Self>) {
        const initialState = new DefaultState();

        super(initialState);

        initialState.model = this;

        this.defaultBehaviour = defaultBehaviour;
    }

    clone(): CleverBehaviourModel<Self> {
        const result = new CleverBehaviourModel(this.defaultBehaviour);

        result.state = this.state;
        result.panicBehaviour = this.panicBehaviour;
        return result;
    }
}

class DefaultState<Self extends Mob> implements BehaviourState<Self> {

    model!: CleverBehaviourModel<Self>;

    constructor(model?: CleverBehaviourModel<Self>) {
        if (model !== undefined) {
            this.model = model;
        }
    }

    onMove(self: Self, world: GameWorld): BehaviourState<Self> {
        let nextState: BehaviourState<Self>;

        if (self.health < self.maxHealth * PANIC_HEALTH_FACTOR) {
            nextState = new PanicState(this.model);
            nextState.onMove(self, world);
        } else {
            nextState = this;
            this.model.defaultBehaviour.onMove(self, world);
        }

        return nextState;
    }

    clone(): DefaultState<Self> {
        return new DefaultState(this.model);
    }
}

class PanicState<Self extends Mob> implements BehaviourState<Self> {

    private readonly model: CleverBehaviourModel<Self>;

    constructor(model: CleverBehaviourModel<Self>) {
        this.model = model;
    }

    onMove(self: Self, world: GameWorld): BehaviourState<Self> {
        let nextState: BehaviourState<Self>;

        if (self.health > self.maxHealth * PANIC_HEALTH_FACTOR) {
            nextState = new DefaultState(this.model);
            nextState.onMove(self, world);
        } else {
            this.model.panicBehaviour.onMove(self, world);
            nextState = this;
        }

        return nextState;
    }

    clone(): PanicState<Self> {
        return new PanicState(this.model);
    }
}
