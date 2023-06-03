import { Random } from 'random';

import { ItemGenerator } from './Generator';
import { Item } from '../items/Item';


export type ItemProbabilityPair = [ItemGenerator, number];

export class UniformItemGenerator implements ItemGenerator {

    readonly items: readonly ItemProbabilityPair[];
    private readonly sumProbability: number;

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
