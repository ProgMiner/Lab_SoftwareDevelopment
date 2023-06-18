import { Coordinates } from '../utils/Coordinates';


/**
 * Drawable object
 */
export interface Drawable {

    /**
     * Draw object on context with specified center and scale
     *
     * @param context canvas context to draw on
     * @param center center of drawing in pixels
     * @param scale scale of drawing in pixels (abstract, uses on purpose)
     */
    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void;
}
