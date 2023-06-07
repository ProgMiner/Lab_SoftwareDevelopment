import { AggressiveBehaviourModel } from '../../behaviour/AggressiveBehaviourModel';
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

    actualBehaviourModel = new AggressiveBehaviourModel();

    health: number = 10;
    readonly maxHealth: number = 10;

    readonly damage: number = 5;
    readonly armor: number = 2;

    readonly experience: number = 10;

    constructor(coordinates: Coordinates) {
        super(coordinates, robot);
    }
}
