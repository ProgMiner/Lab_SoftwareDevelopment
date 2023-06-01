
export const configureCanvasSize = (canvas: HTMLCanvasElement) => {
    const documentSize = document.body.getBoundingClientRect();

    canvas.width = documentSize.width;
    canvas.height = documentSize.height;
};
