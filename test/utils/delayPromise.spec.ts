import {delayPromise} from "../../src/utils/delayPromise";

describe('delayPromise', () => {
    jest.useFakeTimers();

    test('resolves after specified delay', async () => {
        const delay = 1000;
        const promise = delayPromise(delay);

        jest.advanceTimersByTime(delay);
        await expect(promise).resolves.toBeUndefined();
    });

    test('resolves immediately with default delay', async () => {
        const promise = delayPromise();
        jest.advanceTimersByTime(0);
        await expect(promise).resolves.toBeUndefined();
    });
});