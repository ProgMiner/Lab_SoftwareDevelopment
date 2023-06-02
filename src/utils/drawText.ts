

export interface DrawTextOptions {

    lineGap?: number;
    centerWidth?: boolean;
    centerHeight?: boolean;
}

export const EMOJI_FONT_FAMILY = 'Roboto, "Noto Colr Emoji Glyf", sans-serif';

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
