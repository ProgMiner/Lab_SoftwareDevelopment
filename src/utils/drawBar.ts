import { Coordinates } from './Coordinates';


export interface DrawBarOptions {

    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
}

export const HEALTH_BAR_COLOR = '#e74236';

export const drawBar = (
    value: number,
    context: CanvasRenderingContext2D,
    center: Coordinates,
    size: Coordinates,
    foregroundColor: string,
    {
        backgroundColor = '#ccc',
        borderColor = '#000',
        borderWidth = 3,
    }: DrawBarOptions = {},
) => {
    context.save();

    context.fillStyle = backgroundColor!;
    context.fillRect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);

    context.beginPath();
    context.rect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);
    context.clip();

    context.fillStyle = foregroundColor;
    context.fillRect(center.x - size.x / 2, center.y - size.y / 2, size.x * value, size.y);

    const gradient = context.createLinearGradient(0, center.y - size.y / 2, 0, center.y + size.y / 2);

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    context.fillStyle = gradient;

    context.fillRect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);

    context.strokeStyle = borderColor!;
    context.lineWidth = borderWidth!;

    context.strokeRect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);

    context.restore();
};
