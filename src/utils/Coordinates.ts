

/**
 * Utility class to represent any 2D point, vector or rectangle
 */
export class Coordinates {

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
