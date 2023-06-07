import { PassiveBehaviourModel } from './PassiveBehaviourModel';
import { ChaoticBehaviourModel } from './ChaoticBehaviourModel';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Avoid walls behaviour model
 *
 * Random move if in wall
 */
export class AvoidWallsBehaviourModel<Self extends Movable> extends ChaoticBehaviourModel<Self> {

    /**
     * Behaviour model that used when object is not in wall
     */
    noWallsBehaviour: BehaviourModel<Self>;

    /**
     * @param noWallsBehaviour behaviour model that used when object is not in wall
     */
    constructor(noWallsBehaviour: BehaviourModel<Self> = new PassiveBehaviourModel()) {
        super();

        this.noWallsBehaviour = noWallsBehaviour;
    }

    onMove(self: Self, world: GameWorld): void {
        if (world.checkCollisionWithObjects(self.coordinates).length === 0) {
            this.noWallsBehaviour.onMove(self, world);
            return;
        }

        super.onMove(self, world);
    }

    clone(): AvoidWallsBehaviourModel<Self> {
        return new AvoidWallsBehaviourModel(this.noWallsBehaviour);
    }
}
