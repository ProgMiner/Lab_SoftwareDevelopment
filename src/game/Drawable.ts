import { Coordinates } from './Coordinates';


export interface Drawable {

    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void;
}
