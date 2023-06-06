import { SimpleBehaviourMovable } from './SimpleBehaviourMovable';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';


/**
 * Timed behaviour model
 *
 * Uses specified behaviour model several moves and
 * after replaces self with another specified behaviour model
 *
 * Usable as temporal decorator for mobs
 */
export class TemporalBehaviourModel<Self extends SimpleBehaviourMovable<Self>> implements BehaviourModel<Self> {

    private moves: number;

    private readonly behaviour: BehaviourModel<Self>;
    private readonly oldBehaviour: BehaviourModel<Self>;

    /**
     * @param moves amount of moves that decorator exists
     * @param behaviour Decorator behaviour model
     * @param oldBehaviour behaviour model being decorated
     */
    constructor(moves: number, behaviour: BehaviourModel<Self>, oldBehaviour: BehaviourModel<Self>) {
        this.moves = moves;
        this.behaviour = behaviour;
        this.oldBehaviour = oldBehaviour;
    }

    onMove(self: Self, world: GameWorld): void {
        if (this.moves <= 0) {
            self.actualBehaviourModel = this.oldBehaviour;
            this.oldBehaviour.onMove(self, world);
            return;
        }

        this.behaviour.onMove(self, world);
        --this.moves;
    }

    /**
     * Helper function that decorates behaviour model of object
     *
     * @param object object to decorate behaviour model
     * @param moves amount of moves on that behaviour model will be applied
     * @param behaviour behaviour model that will be applied
     */
    static decorate<Self extends SimpleBehaviourMovable<Self>>(
        object: Self,
        moves: number,
        behaviour: BehaviourModel<Self>,
    ): void {
        object.actualBehaviourModel = new TemporalBehaviourModel(moves, behaviour, object.actualBehaviourModel);
    }
}
