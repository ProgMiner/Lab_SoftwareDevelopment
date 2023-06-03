import { Random } from 'random';


export const shuffleInplace = <T>(array: T[], random: Random): T[] => {
    let i = array.length;

    while (--i > 0) {
        const randIndex = random.integer(0, i);

        [array[randIndex], array[i]] = [array[i]!!, array[randIndex]!!];
    }

    return array;
};

export const shuffle = <T>(array: readonly T[], random: Random): T[] => {
    return shuffleInplace([...array], random);
};

export const sample = <T>(n: number, array: readonly T[], random: Random): T[] => {
    return shuffle(array, random).slice(0, n);
};
