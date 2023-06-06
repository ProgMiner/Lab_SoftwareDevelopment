import { Random } from 'random';

import { Generator } from './Generator';


class MappedGenerator<T, R> implements Generator<R> {

    private readonly generator: Generator<T>;
    private readonly fn: (value: T, random: Random) => R;

    constructor(generator: Generator<T>, fn: (value: T, random: Random) => R) {
        this.generator = generator;
        this.fn = fn;
    }

    async generate(random: Random): Promise<R> {
        return this.fn(await this.generator.generate(random), random);
    }

    map<V>(fn: (value: R, random: Random) => V): Generator<V> {
        return new MappedGenerator(this, fn);
    }
}

/**
 * Abstract generator class
 *
 * Useful to not implement {@link map} manually
 */
export abstract class AbstractGenerator<T> implements Generator<T> {

    map<V>(fn: (value: T, random: Random) => V): Generator<V> {
        return new MappedGenerator(this, fn);
    }

    abstract generate(random: Random): Promise<T>;
}
