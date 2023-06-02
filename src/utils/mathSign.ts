

interface Math {

    sign(x: number): number;
}

Math.sign = (x: number) => {
    if (x === 0) {
        return 0;
    }

    if (x < 0) {
        return -1;
    }

    return 1;
};
