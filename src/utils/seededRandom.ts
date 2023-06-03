import { Random, RNGFactory } from 'random';


export type Seed = string;

export const seededRandom = (seed: Seed) => new Random(RNGFactory(seed));
