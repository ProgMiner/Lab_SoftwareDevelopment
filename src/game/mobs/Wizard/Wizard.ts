import random from 'random';

import { AggressiveBehaviourModel } from '../../behaviour/AggressiveBehaviourModel';
import { CleverBehaviourModel } from '../../behaviour/CleverBehaviourModel';
import { loadTexture } from '../../../utils/drawTexture';
import { Coordinates } from '../../../utils/Coordinates';
import { shuffleInplace } from '../../../utils/shuffle';
import { AbstractMob } from '../AbstractMob';
import { Cloneable } from '../../Cloneable';
import { GameWorld } from '../../GameWorld';

import wizard from './wizard.png';


loadTexture(wizard);

/**
 * Wizard
 *
 * Aggressive mob that could clone self on attack
 */
export class Wizard extends AbstractMob implements Cloneable {

    // noinspection TypeScriptValidateTypes: WebStorm shows as error, but TypeScript accepts
    actualBehaviourModel = new CleverBehaviourModel(new AggressiveBehaviourModel());

    health: number = 10;
    readonly maxHealth: number = 10;
    readonly regenerationSpeed: number = 1;

    readonly damage: number = 3;
    readonly armor: number = 1;

    readonly experience: number = 3;

    constructor(coordinates: Coordinates) {
        super(coordinates, wizard);
    }

    clone(): Wizard {
        const result = new Wizard(this.coordinates);

        result.actualBehaviourModel = this.actualBehaviourModel.clone();
        result.health = this.health;

        return result;
    }

    protected hit(damage: number, world: GameWorld) {
        super.hit(damage, world);

        const cloneProb = 1 - this.health / this.maxHealth;
        if (world.isObjectInWorld(this) && random.uniform()() < cloneProb) {
            this.makeClone(world);
        }
    }

    private makeClone(world: GameWorld) {
        const cells = shuffleInplace(this.coordinates.adjacent(), random);

        for (const cell of cells) {
            if (world.checkCollisionWithObjects(cell).length === 0) {
                const clone = this.clone();

                clone.coordinates = cell;
                world.placeObject(clone);
                return;
            }
        }
    }
}
