import { loadTexture } from '../../../utils/drawTexture';
import { AbstractEquipment } from '../AbstractEquipment';
import { EquipmentType } from '../Equipment';

import texture from './sword.png';


loadTexture(texture);

export class Sword extends AbstractEquipment {

    constructor() {
        super(texture, EquipmentType.SWORD, 5);
    }
}
