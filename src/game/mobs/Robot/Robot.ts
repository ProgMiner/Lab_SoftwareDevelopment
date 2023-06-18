import { EnhancedAggressiveBehaviourModel } from '../../behaviour/EnhancedAggressiveBehaviourModel';
import { CleverBehaviourModel } from '../../behaviour/CleverBehaviourModel';
import { Coordinates } from '../../../utils/Coordinates';
import { loadTexture } from '../../../utils/drawTexture';
import { AbstractMob } from '../AbstractMob';

import robot from './robot.png';


loadTexture(robot);

/**
 * Robot
 *
 * Aggressive mob with huge stats that follows player
 */
export class Robot extends AbstractMob {

    // noinspection TypeScriptValidateTypes: WebStorm shows as error, but TypeScript accepts
    actualBehaviourModel = new CleverBehaviourModel(new EnhancedAggressiveBehaviourModel());

    health: number = 10;
    readonly maxHealth: number = 10;
    readonly regenerationSpeed: number = 2;

    readonly damage: number = 5;
    readonly armor: number = 2;

    readonly experience: number = 10;

    constructor(coordinates: Coordinates) {
        super(coordinates, robot);
    }
}
