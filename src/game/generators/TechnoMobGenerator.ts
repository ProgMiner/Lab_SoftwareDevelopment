import { UniformMobGenerator } from './UniformGenerator';
import { Coordinates } from '../../utils/Coordinates';
import { constGenerator } from './constGenerator';
import { Robot } from '../mobs/Robot/Robot';


type MobTypes = 'Robot';

/**
 * Mob generator that generates Robots
 */
export class TechnoMobGenerator extends UniformMobGenerator {

    constructor(probabilities: Record<MobTypes, number>) {
        super([
            [constGenerator(() => new Robot(Coordinates.ZERO)), probabilities['Robot']],
        ]);
    }
}
