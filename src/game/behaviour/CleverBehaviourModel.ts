import { BehaviourState, StatedBehaviourModel } from './StatedBehaviourModel';
import { CowardlyBehaviourModel } from './CowardlyBehaviourModel';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Mob } from '../mobs/Mob';


/**
 * Clever behaviour model
 *
 * Stated behaviour model that could switch between following states:
 * - normal state: use default behaviour model
 * - panic state: use panic state
 *
 * Normal state switches to panic when health of mob being less than previous damage from player
 * Panic state switches to normal when health being greater than previous damage from player
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
     * Current critical health
     */
    criticalHealth: number | undefined = undefined;

    private previousHealth: number | undefined = undefined;

    /**
     * @param defaultBehaviour behaviour model that used in normal state
     */
    constructor(defaultBehaviour: BehaviourModel<Self>) {
        const initialState = new DefaultState();

        super(initialState);

        initialState.model = this;

        this.defaultBehaviour = defaultBehaviour;
    }

    onMove(self: Self, world: GameWorld) {
        if (this.previousHealth !== undefined && self.health < this.previousHealth) {
            this.criticalHealth = this.previousHealth - self.health;
        }

        super.onMove(self, world);

        this.previousHealth = self.health;
    }

    clone(): CleverBehaviourModel<Self> {
        const result = new CleverBehaviourModel(this.defaultBehaviour);

        result.state = this.state;
        result.panicBehaviour = this.panicBehaviour;
        result.previousHealth = this.previousHealth;
        return result;
    }
}

interface CleverState<Self extends Mob> extends BehaviourState<Self> {

    doMove(self: Self, world: GameWorld): void;
}

class DefaultState<Self extends Mob> implements CleverState<Self> {

    model!: CleverBehaviourModel<Self>;

    constructor(model?: CleverBehaviourModel<Self>) {
        if (model !== undefined) {
            this.model = model;
        }
    }

    onMove(self: Self, world: GameWorld): CleverState<Self> {
        let nextState: CleverState<Self>;

        if (this.model.criticalHealth !== undefined && self.health < this.model.criticalHealth) {
            nextState = new PanicState(this.model);
        } else {
            nextState = this;
        }

        nextState.doMove(self, world);
        return nextState;
    }

    doMove(self: Self, world: GameWorld) {
        this.model.defaultBehaviour.onMove(self, world);
    }

    clone(): DefaultState<Self> {
        return new DefaultState(this.model);
    }
}

class PanicState<Self extends Mob> implements CleverState<Self> {

    private readonly model: CleverBehaviourModel<Self>;

    constructor(model: CleverBehaviourModel<Self>) {
        this.model = model;
    }

    onMove(self: Self, world: GameWorld): CleverState<Self> {
        let nextState: CleverState<Self>;

        if (this.model.criticalHealth !== undefined && self.health > this.model.criticalHealth) {
            nextState = new DefaultState(this.model);
        } else {
            nextState = this;
        }

        nextState.doMove(self, world);
        return nextState;
    }

    doMove(self: Self, world: GameWorld) {
        this.model.panicBehaviour.onMove(self, world);
    }

    clone(): PanicState<Self> {
        return new PanicState(this.model);
    }
}
