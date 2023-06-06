import { Coordinates } from '../../utils/Coordinates';
import { AbstractMovable } from '../AbstractMovable';
import { BehaviourModel } from './BehaviourModel';
import { Texture } from '../../utils/drawTexture';
import { GameWorld } from '../GameWorld';


/**
 * Abstract movable, which moves controls by behaviour model
 */
export abstract class BehaviourMovable extends AbstractMovable {

    coordinates: Coordinates;

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
        // noinspection TypeScriptValidateTypes: WebStorm shows as error, but TypeScript accepts
        this.behaviourModel(world).onMove(this, world);
    }

    /**
     * Returns current behaviour model
     *
     * Current world passed for convenience, may be used for selecting current model
     *
     * @param world current world object
     */
    protected abstract behaviourModel(world: GameWorld): BehaviourModel<this>;
}
