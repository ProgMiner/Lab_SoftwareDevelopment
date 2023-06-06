import { Random } from 'random';

import { BaseWorldBuilder } from './BaseWorldBuilder';
import { ItemGenerator, MobGenerator } from '../generators/Generator';


/**
 * File world builder
 *
 * Provides methods for building random world
 */
export interface RandomWorldBuilder extends BaseWorldBuilder {

    /**
     * Set random instance to use
     *
     * @param random random instance
     *
     * @return this
     */
    randomInstance(random: Random): this;

    /**
     * Set item generator
     *
     * @param itemGenerator item generator
     *
     * @return this
     */
    itemGenerator(itemGenerator: ItemGenerator): this;

    /**
     * Set mob generator
     *
     * @param mobGenerator mob generator
     *
     * @return this
     */
    mobGenerator(mobGenerator: MobGenerator): this;
}
