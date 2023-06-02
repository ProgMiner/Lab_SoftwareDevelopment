

export const drawText = (
    context: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    lineGap: number = 5,
) => {
    const lines = text.split('\n');

    for (const line of lines) {
        const textMetrics = context.measureText(line);

        y += textMetrics.actualBoundingBoxAscent;
        context.fillText(line, x, y);

        y += textMetrics.actualBoundingBoxDescent + lineGap;
    }
}
