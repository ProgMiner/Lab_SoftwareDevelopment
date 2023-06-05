

/**
 * Create array with numbers 0, 1, ..., n - 1
 *
 * @param size size of array
 */
export const range = (size: number): number[] => [...new Array(size).keys()];
