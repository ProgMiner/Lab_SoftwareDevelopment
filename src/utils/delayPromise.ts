

/**
 * Create promise that resolves in specified delay in ms
 *
 * Usable for splitting long computations in order to prevent UI freezes
 *
 * @param delay delay
 *
 * @see setTimeout
 */
export const delayPromise = (delay: number = 0): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, delay));
