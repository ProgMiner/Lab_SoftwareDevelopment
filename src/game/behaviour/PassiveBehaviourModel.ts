import { BehaviourModel } from './BehaviourModel';
import { Movable } from '../Movable';


export class PassiveBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    onMove(): void {
        // do nothing
    }
}
