import { BehaviourMovable } from './BehaviourMovable';
import { Coordinates } from '../../utils/Coordinates';
import { BehaviourModel } from './BehaviourModel';
import { Texture } from '../../utils/drawTexture';


/**
 * Simple behaviour movable, which behaviour model don't depend on current world
 *
 * @template Self this type
 */
export abstract class SimpleBehaviourMovable extends BehaviourMovable {

    /**
     * Current behaviour model
     */
    abstract actualBehaviourModel: BehaviourModel<this>;

    /**
     * @param coordinates initial coordinates
     * @param texture object texture
     * @param isPassable is object passable, default `true`
     */
    protected constructor(
        coordinates: Coordinates,
        texture: Texture,
        isPassable: boolean = true,
    ) {
        super(coordinates, texture, isPassable);
    }

    protected behaviourModel(): BehaviourModel<this> {
        return this.actualBehaviourModel;
    }
}
