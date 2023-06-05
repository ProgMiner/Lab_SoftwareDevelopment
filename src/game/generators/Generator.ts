import { Random } from 'random';

import { GameWorld } from '../GameWorld';
import { Item } from '../items/Item';


/**
 * Generic random (or not) generator of something
 *
 * @template T type of generating values
 */
export interface Generator<T> {

    /**
     * Generate something
     *
     * Returns {@link Promise} to give programmer ability to split generating on several steps
     * in order to not freeze browser UI
     *
     * @param {Random} random instance of random to control random seed
     */
    generate(random: Random): Promise<T>;
}

/**
 * Generator of worlds
 */
export type WorldGenerator = Generator<GameWorld>;

/**
 * Generator of items
 */
export type ItemGenerator = Generator<Item>;

// noinspection JSValidateJSDoc
/**
 * Generic generator of non-random values
 *
 * @template T type of generating values
 *
 * @param {() => T} value factory of generating values
 */
export const constGenerator = <T>(value: () => T): Generator<T> => ({

    generate: async () => value(),
});
