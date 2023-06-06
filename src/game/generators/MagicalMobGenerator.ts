import { UniformMobGenerator } from './UniformGenerator';
import { Coordinates } from '../../utils/Coordinates';
import { constGenerator } from './constGenerator';
import { ItemGenerator } from './Generator';
import { Ghost } from '../mobs/Ghost/Ghost';
import { Mimic } from '../mobs/Mimic';


type MobTypes = 'Ghost' | 'Mimic';

/**
 * Mob generator that generates Ghosts and Mimics
 */
export class MagicalMobGenerator extends UniformMobGenerator {

    constructor(itemGenerator: ItemGenerator, probabilities: Record<MobTypes, number>) {
        super([
            [constGenerator(() => new Ghost(Coordinates.ZERO)), probabilities['Ghost']],
            [itemGenerator.map(item => new Mimic(item, Coordinates.ZERO)), probabilities['Mimic']],
        ]);
    }
}
