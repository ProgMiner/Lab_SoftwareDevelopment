

/**
 * Utility class to represent any 2D point, vector or rectangle
 */
export class Coordinates {

    /**
     * Zero coordinates for convenience
     */
    static readonly ZERO: Coordinates = new Coordinates(0, 0);

    /**
     * X coordinate, or width
     */
    readonly x: number;

    /**
     * Y coordinate, or height
     */
    readonly y: number;

    /**
     * @param x X coordinate
     * @param y Y coordinate
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    /**
     * Length of vector
     */
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /**
     * Norm of vector
     */
    norm(): Coordinates {
        const l = this.length();

        return new Coordinates(this.x / l, this.y / l);
    }

    /**
     * Returns vector from `this` to `that`
     *
     * @param that destination of vector
     *
     * @return result vector
     */
    vectorTo(that: Coordinates): Coordinates {
        return new Coordinates(that.x - this.x, that.y - this.y);
    }

    /**
     * Calculates atan2
     *
     * @see Math.atan2
     */
    atan2(): number {
        return Math.atan2(this.y, this.x);
    }

    /**
     * Returns rounded coordinates
     */
    round(): Coordinates {
        return new Coordinates(Math.round(this.x), Math.round(this.y));
    }

    /**
     * Returns adjacent points (for integer coordinates)
     */
    adjacent(): [Coordinates, Coordinates, Coordinates, Coordinates] {
        return [
            new Coordinates(this.x + 1, this.y),
            new Coordinates(this.x - 1, this.y),
            new Coordinates(this.x, this.y + 1),
            new Coordinates(this.x, this.y - 1),
        ];
    }

    /**
     * Check is equals to other coordinates object
     *
     * @param that object to check with
     *
     * @return `true` if equals, `false` otherwise
     */
    equals(that: Coordinates): boolean {
        return this.x === that.x && this.y === that.y;
    }

    /**
     * Pretty-print to string, usable as hash for {@link Map} or logging
     */
    toString(): string {
        return `(${this.x}, ${this.y})`
    }
}

/**
 * Mutable version of {@link Coordinates}
 */
export class MutableCoordinates extends Coordinates {

    x!: number;
    y!: number;
}
