import { BehaviourModel } from './BehaviourModel';
import { Movable } from '../Movable';


/**
 * Passive behaviour model
 *
 * Just staying on one cell
 */
export class PassiveBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    onMove(): void {
        // do nothing
    }

    clone(): PassiveBehaviourModel<Self> {
        return new PassiveBehaviourModel();
    }
}
