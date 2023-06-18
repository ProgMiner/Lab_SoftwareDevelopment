import random from 'random';

import { shuffleInplace } from '../../utils/shuffle';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Confused behaviour model
 *
 * Moves randomly
 */
export class ConfusedBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    onMove(self: Self, world: GameWorld): void {
        const positions = shuffleInplace(self.coordinates.adjacent(), random);

        for (const position of positions) {
            if (self.moveTo(position, world)) {
                return;
            }
        }
    }
}
