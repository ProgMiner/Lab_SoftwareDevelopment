import { AbstractGenerator } from './AbstractGenerator';
import { Generator } from './Generator';


class ConstGenerator<T> extends AbstractGenerator<T> implements Generator<T> {

    private readonly fn: () => T;

    constructor(fn: () => T) {
        super();

        this.fn = fn;
    }

    async generate(): Promise<T> {
        return this.fn();
    }
}

// noinspection JSValidateJSDoc
/**
 * Generic generator of non-random values
 *
 * @template T type of generating values
 *
 * @param {() => T} fn factory of generating values
 */
export const constGenerator = <T>(fn: () => T): Generator<T> => new ConstGenerator(fn);
