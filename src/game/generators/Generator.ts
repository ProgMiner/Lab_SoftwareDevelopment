import { Random } from 'random';

import { GameWorld } from '../GameWorld';
import { Item } from '../items/Item';


export interface Generator<T> {

    generate(random: Random): Promise<T>;
}

export type WorldGenerator = Generator<GameWorld>;
export type ItemGenerator = Generator<Item>;

export const constGenerator = <T>(value: () => T): Generator<T> => ({ generate: async () => value() });
