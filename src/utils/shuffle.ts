import { Random } from 'random';


/**
 * Shuffle array in-place using Fisher-Yates algorithm
 *
 * @param array array to shuffle
 * @param random random instance
 *
 * @return passed array
 */
export const shuffleInplace = <T>(array: T[], random: Random): T[] => {
    let i = array.length;

    while (--i > 0) {
        const randIndex = random.integer(0, i);

        [array[randIndex], array[i]] = [array[i]!, array[randIndex]!];
    }

    return array;
};

/**
 * Shuffle array without modification of source array
 *
 * @param array array to shuffle
 * @param random random instance
 *
 * @return shuffled array
 */
export const shuffle = <T>(array: readonly T[], random: Random): T[] => {
    return shuffleInplace([...array], random);
};

/**
 * Get random sample of specified size from array
 *
 * @param n size of sample
 * @param array array to sample from
 * @param random random instance
 */
export const sample = <T>(n: number, array: readonly T[], random: Random): T[] => {
    return shuffle(array, random).slice(0, n);
};
