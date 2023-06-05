

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
 * Font family usable to display emojis
 */
export const EMOJI_FONT_FAMILY = 'Roboto, "Noto Colr Emoji Glyf", sans-serif';

/**
 * Utility function to draw text on canvas
 *
 * @param context canvas context to draw on
 * @param text text to draw
 * @param x x coordinate of left side of text (or center, see {@link DrawTextOptions})
 * @param y y coordinate of top side of text (or center, see {@link DrawTextOptions})
 * @param options some customization options
 */
export const drawText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    {
        lineGap = 5,
        centerWidth = false,
        centerHeight = false,
    }: DrawTextOptions = {},
) => {
    const lines = text.split('\n');

    if (centerHeight) {
        let height = 0;

        for (const line of lines) {
            const textMetrics = context.measureText(line);

            height += textMetrics.actualBoundingBoxAscent
                + textMetrics.actualBoundingBoxDescent + lineGap;
        }

        y -= height / 2;
    }

    for (const line of lines) {
        const textMetrics = context.measureText(line);

        y += textMetrics.actualBoundingBoxAscent;

        if (centerWidth) {
            context.fillText(line, x - textMetrics.width / 2, y);
        } else {
            context.fillText(line, x, y);
        }

        y += textMetrics.actualBoundingBoxDescent + lineGap;
    }
}
