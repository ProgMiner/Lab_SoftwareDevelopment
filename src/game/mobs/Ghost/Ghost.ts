import { AvoidWallsBehaviourModel } from '../../behaviour/AvoidWallsBehaviourModel';
import { CowardlyBehaviourModel } from '../../behaviour/CowardlyBehaviourModel';
import { Coordinates } from '../../../utils/Coordinates';
import { loadTexture } from '../../../utils/drawTexture';
import { AbstractMob } from '../AbstractMob';
import { GameWorld } from '../../GameWorld';

import ghost from './ghost.png';


loadTexture(ghost);

/**
 * Ghost
 *
 * Coward mob with small stats that avoids player and could pass into walls
 *
 * Don't like to be in wall
 */
export class Ghost extends AbstractMob {

    actualBehaviourModel = new CowardlyBehaviourModel(new AvoidWallsBehaviourModel());

    health: number = 3;
    readonly maxHealth: number = 3;

    readonly armor: number = 0;
    readonly damage: number = 1;

    readonly experience: number = 10;

    private inWall: boolean = false;

    constructor(coordinates: Coordinates) {
        super(coordinates, ghost);
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates) {
        if (this.inWall) {
            context.save();

            context.globalAlpha = 0.6;
            super.draw(context, center, scale);

            context.restore();
        } else {
            super.draw(context, center, scale);
        }
    }

    moveTo(newPosition: Coordinates, world: GameWorld): boolean {
        const result = world.moveObject(this, newPosition, false);

        const walls = world.checkCollisionWithObjects(this.coordinates);
        this.inWall = walls.length > 0;

        if (this.inWall) {
            // FIXME hack to be on top if into the wall
            world.removeObject(this);
            world.objects.push(this);
        }

        return result;
    }
}
