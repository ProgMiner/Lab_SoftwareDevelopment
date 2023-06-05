import { Coordinates } from '../../utils/Coordinates';
import { AbstractMovable } from '../AbstractMovable';
import { BehaviourModel } from './BehaviourModel';
import { Texture } from '../../utils/drawTexture';
import { GameWorld } from '../GameWorld';


/**
 * Abstract movable, which moves controls by behaviour model
 *
 * @template Self type of this
 */
export abstract class BehaviourMovable<Self extends BehaviourMovable<Self>> extends AbstractMovable {

    coordinates: Coordinates;

    protected abstract readonly self: Self;

    /**
     * @param coordinates initial coordinates
     * @param texture object texture
     * @param isPassable is object passable, default `true`
     */
    protected constructor(coordinates: Coordinates, texture: Texture, isPassable: boolean = true) {
        super(texture, isPassable);

        this.coordinates = coordinates;
    }

    onMove(world: GameWorld): void {
        this.behaviourModel(world).onMove(this.self, world);
    }

    /**
     * Returns current behaviour model
     *
     * Current world passed for convenience, may be used for selecting current model
     *
     * @param world current world object
     */
    protected abstract behaviourModel(world: GameWorld): BehaviourModel<Self>;
}
