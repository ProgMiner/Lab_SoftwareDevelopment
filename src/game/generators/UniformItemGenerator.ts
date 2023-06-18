import { Random } from 'random';

import { ItemGenerator } from './Generator';
import { Item } from '../items/Item';


/**
 * Pair of item generator and (relative) probability
 */
export type ItemProbabilityPair = [ItemGenerator, number];

/**
 * Item generator that generates items with specified relative probability using
 * specified item generators
 *
 * Real probability of each item is its relative probability divided by sum of all relative probabilities
 */
export class UniformItemGenerator implements ItemGenerator {

    private readonly items: readonly ItemProbabilityPair[];
    private readonly sumProbability: number;

    /**
     * @param items array of item generators with relative probabilities
     */
    constructor(items: ItemProbabilityPair[]) {
        this.items = [...items];

        this.sumProbability = items.map(([_, x]) => x).reduce((a, b) => a + b, 0);
    }

    generate(random: Random): Promise<Item> {
        let value = random.uniform(0, this.sumProbability)();

        for (const [item, prob] of this.items) {
            if (value < prob) {
                return item.generate(random);
            }

            value -= prob;
        }

        throw new Error('unreachable');
    }
}
