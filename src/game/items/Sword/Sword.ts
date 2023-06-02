import { loadTexture } from '../../../utils/drawTexture';
import { TexturedItem } from '../TexturedItem';
import { GameWorld } from '../../GameWorld';

import texture from './sword.png';


loadTexture(texture);

export class Sword extends TexturedItem {

    constructor() {
        super(texture);
    }

    useItem(world: GameWorld): boolean {
        return false;
    }
}
