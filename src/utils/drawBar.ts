import { Coordinates } from './Coordinates';


/**
 * Options for {@link drawBar} function
 */
export interface DrawBarOptions {

    /**
     * Background color of bar, default `#ccc`
     */
    backgroundColor?: string;

    /**
     * Border color of bar, default `#000`
     */
    borderColor?: string;

    /**
     * Border width of bar, default `3`
     */
    borderWidth?: number;
}

/**
 * Color for health bar
 */
export const HEALTH_BAR_COLOR = '#e74236';

/**
 * Draws bar filled on specified value (must be in range 0..1)
 *
 * @param value displaying value
 * @param context canvas context
 * @param center center of bar
 * @param size size of bar
 * @param foregroundColor color of filled part of bar
 * @param options options
 */
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
