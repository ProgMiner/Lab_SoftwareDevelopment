import { Coordinates } from './Coordinates';


const textures = new Map();

/**
 * Load texture to use in {@link drawTexture}
 *
 * @param texture imported texture
 */
export const loadTexture = (texture: string) => {
    const img = new Image();
    img.src = texture;

    textures.set(texture, img);
}

/**
 * Draw loaded texture on canvas
 *
 * This is an error if texture wasn't loaded before call
 *
 * @param texture texture to draw
 * @param context context to draw on
 * @param place center of texture in pixels
 * @param scale size of texture in pixels (resolution of texture isn't preserved)
 *
 * @see loadTexture
 */
export const drawTexture = (
    texture: string,
    context: CanvasRenderingContext2D,
    place: Coordinates,
    scale: Coordinates,
) => {
    if (!textures.has(texture)) {
        console.error('Texture not loaded', texture);
        return;
    }

    context.drawImage(textures.get(texture), place.x - scale.x / 2, place.y - scale.y / 2, scale.x, scale.y);
}
