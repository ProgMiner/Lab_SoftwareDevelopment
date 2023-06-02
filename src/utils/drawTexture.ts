import { Coordinates } from '../game/Coordinates';


const textures = new Map();

export const loadTexture = (texture: string) => {
    const img = new Image();
    img.src = texture;

    textures.set(texture, img);
}

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
