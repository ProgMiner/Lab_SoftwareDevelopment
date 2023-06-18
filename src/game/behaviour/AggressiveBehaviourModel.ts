import { PassiveBehaviourModel } from './PassiveBehaviourModel';
import { BehaviourModel } from './BehaviourModel';
import { moveToPoint } from './moveToPoint';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Aggressive behaviour model
 *
 * Follows player when seeing
 */
export class AggressiveBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    /**
     * Behaviour model that used when player isn't visible
     */
    noPlayerBehaviour: BehaviourModel<Self>;

    /**
     * @param noPlayerBehaviour behaviour model that used when player isn't visible
     */
    constructor(noPlayerBehaviour: BehaviourModel<Self> = new PassiveBehaviourModel()) {
        this.noPlayerBehaviour = noPlayerBehaviour;
    }

    onMove(self: Self, world: GameWorld): void {
        if (!world.isPlayerVisibleFrom(self.coordinates)) {
            return this.noPlayerBehaviour.onMove(self, world);
        }

        moveToPoint(world.player.coordinates, self, world);
    }

    clone(): AggressiveBehaviourModel<Self> {
        return new AggressiveBehaviourModel(this.noPlayerBehaviour);
    }
}
