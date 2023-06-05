import { Coordinates } from './Coordinates';


export const NO_TEXTURE = Symbol('no texture');

export type Texture = string | typeof NO_TEXTURE;

const textures = new Map<Texture, HTMLImageElement>();

/**
 * Load texture to use in {@link drawTexture}
 *
 * @param texture imported texture
 */
export const loadTexture = (texture: Texture) => {
    if (process.env.NODE_ENV == 'test') {
        return;
    }

    if (typeof texture !== 'string') {
        return;
    }

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
    texture: Texture,
    context: CanvasRenderingContext2D,
    place: Coordinates,
    scale: Coordinates,
) => {
    if (texture === NO_TEXTURE) {
        return;
    }

    const image = textures.get(texture);

    // noinspection JSIncompatibleTypesComparison
    if (image === undefined) {
        console.error('Texture not loaded', texture);
        return;
    }

    context.drawImage(image, place.x - scale.x / 2, place.y - scale.y / 2, scale.x, scale.y);
}
