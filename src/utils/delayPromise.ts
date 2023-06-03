

export const delayPromise = (delay: number = 0): Promise<void> =>
    new Promise(resolve => setTimeout(resolve, delay));
