import { Coordinates } from './Coordinates';


export interface Drawable {

    /**
     * Draw object on context with specified center and scale
     *
     * @param context
     * @param center
     * @param scale
     */
    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void;
}
