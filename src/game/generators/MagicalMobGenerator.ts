import { UniformMobGenerator } from './UniformGenerator';
import { Coordinates } from '../../utils/Coordinates';
import { constGenerator } from './constGenerator';
import { Wizard } from '../mobs/Wizard/Wizard';
import { ItemGenerator } from './Generator';
import { Ghost } from '../mobs/Ghost/Ghost';
import { Mimic } from '../mobs/Mimic';


type MobTypes = 'Ghost' | 'Mimic' | 'Wizard';

/**
 * Mob generator that generates Ghosts, Mimics and Wizards
 *
 * @see Ghost
 * @see Mimic
 * @see Wizard
 */
export class MagicalMobGenerator extends UniformMobGenerator {

    constructor(itemGenerator: ItemGenerator, probabilities: Record<MobTypes, number>) {
        super([
            [constGenerator(() => new Ghost(Coordinates.ZERO)), probabilities['Ghost']],
            [constGenerator(() => new Wizard(Coordinates.ZERO)), probabilities['Wizard']],
            [itemGenerator.map(item => new Mimic(item, Coordinates.ZERO)), probabilities['Mimic']],
        ]);
    }
}
