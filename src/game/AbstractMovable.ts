import { drawTexture, Texture } from '../utils/drawTexture';
import { Coordinates } from '../utils/Coordinates';
import { GameWorld } from './GameWorld';
import { Movable } from './Movable';


/**
 * Abstract movable object for convenience
 */
export abstract class AbstractMovable implements Movable {

    readonly isPassable: boolean;

    abstract coordinates: Coordinates;

    protected readonly texture: Texture;

    /**
     * @param texture texture of object
     * @param isPassable is object passable, default `true`
     */
    protected constructor(texture: Texture, isPassable: boolean = true) {
        this.isPassable = isPassable;
        this.texture = texture;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(this.texture, context, center, scale);
    }

    collides(point: Coordinates): boolean {
        return this.coordinates.equals(point);
    }

    needUpdate(playerPosition: Coordinates, updateDistance: number): boolean {
        return playerPosition.vectorTo(this.coordinates).length() <= updateDistance;
    }

    moveOn(newPosition: Coordinates, world: GameWorld): boolean {
        return world.moveObject(this, newPosition);
    }

    abstract onMove(world: GameWorld): void;
}
