import { Random } from 'random';

import { Generator, ItemGenerator, MobGenerator } from './Generator';
import { AbstractGenerator } from './AbstractGenerator';
import { Item } from '../items/Item';
import { Mob } from '../mobs/Mob';


/**
 * Pair of generator and (relative) probability
 */
export type ProbabilityPair<T> = [Generator<T>, number];

/**
 * Generator that generates objects with specified relative probability using
 * specified generators
 *
 * Real probability of each object is its relative probability divided by sum of all relative probabilities
 */
export class UniformGenerator<T> extends AbstractGenerator<T> implements Generator<T> {

    private readonly objects: readonly ProbabilityPair<T>[];
    private readonly sumProbability: number;

    /**
     * @param objects array of generators with relative probabilities
     */
    constructor(objects: ProbabilityPair<T>[]) {
        super();

        this.objects = [...objects];
        this.sumProbability = objects.map(([_, x]) => x).reduce((a, b) => a + b, 0);
    }

    generate(random: Random): Promise<T> {
        let value = random.uniform(0, this.sumProbability)();

        for (const [object, prob] of this.objects) {
            if (value < prob) {
                return object.generate(random);
            }

            value -= prob;
        }

        throw new Error('no generators provided');
    }
}

/**
 * Uniform generator of items
 */
export class UniformItemGenerator extends UniformGenerator<Item> implements ItemGenerator {}

/**
 * Uniform generator of mobs
 */
export class UniformMobGenerator extends UniformGenerator<Mob> implements MobGenerator {}
