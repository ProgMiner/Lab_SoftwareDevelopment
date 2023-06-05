import { BehaviourMovable } from './BehaviourMovable';
import { Coordinates } from '../../utils/Coordinates';
import { BehaviourModel } from './BehaviourModel';
import { Texture } from '../../utils/drawTexture';


/**
 * Simple behaviour movable, which behaviour model don't depend on current world
 *
 * @template Self this type
 */
export abstract class SimpleBehaviourMovable<Self extends SimpleBehaviourMovable<Self>> extends BehaviourMovable<Self> {

    /**
     * Current behaviour model
     */
    protected actualBehaviourModel: BehaviourModel<Self>;

    /**
     * @param coordinates initial coordinates
     * @param texture object texture
     * @param actualBehaviourModel initial behaviour model
     * @param isPassable is object passable, default `true`
     */
    protected constructor(
        coordinates: Coordinates,
        texture: Texture,
        actualBehaviourModel: BehaviourModel<Self>,
        isPassable: boolean = true,
    ) {
        super(coordinates, texture, isPassable);

        this.actualBehaviourModel = actualBehaviourModel;
    }

    protected behaviourModel(): BehaviourModel<Self> {
        return this.actualBehaviourModel;
    }
}
