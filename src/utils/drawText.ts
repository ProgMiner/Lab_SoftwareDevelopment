import { Coordinates } from './Coordinates';


/**
 * {@link drawText} options object
 */
export interface DrawTextOptions {

    /**
     * Vertical gap between lines, default is 5
     */
    lineGap?: number;

    /**
     * Need to center text horizontally, default `false`
     */
    centerWidth?: boolean;

    /**
     * Need to center text vertically, default `false`
     */
    centerHeight?: boolean;
}

/**
 * Font family usable to display in-game text
 */
export const DEFAULT_FONT_FAMILY = 'Roboto, sans-serif';

/**
 * Font family usable to display emojis
 */
export const EMOJI_FONT_FAMILY = 'Roboto, "Noto Colr Emoji Glyf", sans-serif';

/**
 * Default line gap in pixels
 */
export const DEFAULT_LINE_GAP = 5; // px

/**
 * Utility function to draw text on canvas
 *
 * @param context canvas context to draw on
 * @param text text to draw
 * @param x x coordinate of left side of text (or center, see {@link DrawTextOptions.centerWidth})
 * @param y y coordinate of top side of text (or center, see {@link DrawTextOptions.centerHeight})
 * @param options some customization options
 */
export const drawText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    {
        lineGap = DEFAULT_LINE_GAP,
        centerWidth = false,
        centerHeight = false,
    }: DrawTextOptions = {},
) => {
    const lines = text.split('\n');

    const lineHeight = Math.max(...lines.map(l => context.measureText(l)).map(tm =>
        tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent));

    if (centerHeight) {
        const height = (lineHeight + lineGap) * lines.length - lineGap;

        y -= height / 2;
    }

    for (const line of lines) {
        const textMetrics = context.measureText(line);

        y += lineHeight - textMetrics.actualBoundingBoxDescent;

        if (centerWidth) {
            context.fillText(line, x - textMetrics.width / 2, y);
        } else {
            context.fillText(line, x, y);
        }

        y += textMetrics.actualBoundingBoxDescent + lineGap;
    }
};

/**
 * Utility function to measure size of text that will be drawn by {@link drawText}
 *
 * @param context canvas context to measure on
 * @param text text to measure
 * @param options some customization options for {@drawText}
 *
 * @return size of text
 */
export const measureText = (
    context: CanvasRenderingContext2D,
    text: string,
    { lineGap = DEFAULT_LINE_GAP }: DrawTextOptions = {},
): Coordinates => {
    const linesTextMetrics = text.split('\n').map(l => context.measureText(l));

    const lineHeight = Math.max(...linesTextMetrics.map(tm =>
        tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent));

    const width = Math.max(...linesTextMetrics.map(tm => tm.width));
    const height = (lineHeight + lineGap) * linesTextMetrics.length - lineGap;

    return new Coordinates(width, height);
};
