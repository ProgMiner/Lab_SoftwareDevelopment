import { Random, RNGFactory } from 'random';


/**
 * Type of random seed
 */
export type Seed = string;

/**
 * Create {@link Random} instance with specified seed
 *
 * @param seed random seed
 */
export const seededRandom = (seed: Seed) => new Random(RNGFactory(seed));
