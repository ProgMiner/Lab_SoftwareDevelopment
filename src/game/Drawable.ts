import { Coordinates } from './Coordinates';


export interface Drawable {

    draw(
        context: CanvasRenderingContext2D,
        place: Coordinates,
        scale: Coordinates,
    ): void;
}
