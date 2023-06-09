import { loadTexture } from '../../../utils/drawTexture';
import { TexturedItem } from '../TexturedItem';
import { GameWorld } from '../../GameWorld';

import texture from './golden_apple.png';


const HEALING_FACTOR = 0.2;

loadTexture(texture);

/**
 * Golden apple
 *
 * When used, heals player on 0.2 points of maximum health
 */
export class GoldenApple extends TexturedItem {

    constructor() {
        super(texture);
    }

    useItem(world: GameWorld): GoldenApple | undefined {
        if (world.player.healOn(HEALING_FACTOR)) {
            return undefined;
        }

        return this;
    }
}
