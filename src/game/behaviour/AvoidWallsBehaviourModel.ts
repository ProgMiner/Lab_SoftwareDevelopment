import random from 'random'

import { PassiveBehaviourModel } from './PassiveBehaviourModel';
import { Coordinates } from '../../utils/Coordinates';
import { shuffleInplace } from '../../utils/shuffle';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Avoid walls behaviour model
 *
 * Random move if in wall
 */
export class AvoidWallsBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    /**
     * Behaviour model that used when object is not in wall
     */
    noWallsBehaviour: BehaviourModel<Self>;

    /**
     * @param noWallsBehaviour behaviour model that used when object is not in wall
     */
    constructor(noWallsBehaviour: BehaviourModel<Self> = new PassiveBehaviourModel()) {
        this.noWallsBehaviour = noWallsBehaviour;
    }

    onMove(self: Self, world: GameWorld): void {
        if (world.checkCollisionWithObjects(self.coordinates).length === 0) {
            return this.noWallsBehaviour.onMove(self, world);
        }

        const baseCell = self.coordinates;

        const positions = shuffleInplace([
            new Coordinates(baseCell.x + 1, baseCell.y),
            new Coordinates(baseCell.x, baseCell.y + 1),
            new Coordinates(baseCell.x - 1, baseCell.y),
            new Coordinates(baseCell.x, baseCell.y - 1),
        ], random);

        for (const position of positions) {
            if (self.moveTo(position, world)) {
                return;
            }
        }
    }
}
