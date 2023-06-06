import { loadTexture } from '../../../utils/drawTexture';
import { AbstractEquipment } from '../AbstractEquipment';
import { EquipmentType } from '../Equipment';

import texture from './sword.png';

if (process.env.NODE_ENV !== 'test')
    loadTexture(texture);

/**
 * Sword
 *
 * When equipped, increases player's damage on 5 points
 */
export class Sword extends AbstractEquipment {

    constructor() {
        super(texture, EquipmentType.SWORD, 5);
    }
}
