import { Cloneable as AbstractCloneable } from '../core/Cloneable';
import { GameObject } from './GameObject';


/**
 * Cloneable game object
 */
export interface Cloneable extends AbstractCloneable, GameObject {

    clone(): Cloneable;
}
