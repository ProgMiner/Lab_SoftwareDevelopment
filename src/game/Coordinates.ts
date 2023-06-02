
export class Coordinates {

    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    norm(): Coordinates {
        const l = this.length();

        return new Coordinates(this.x / l, this.y / l);
    }

    equals(that: Coordinates): boolean {
        return this.x === that.x && this.y == that.y;
    }

    toString(): string {
        return `(${this.x}, ${this.y})`
    }
}

export class MutableCoordinates extends Coordinates {

    // @ts-ignore
    x: number;
    // @ts-ignore
    y: number;
}
