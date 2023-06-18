import { Equipment, EquipmentType } from './Equipment';
import { TexturedItem } from './TexturedItem';
import { GameWorld } from '../GameWorld';


/**
 * Abstract class for any simple equipment
 *
 * Equips item on use
 *
 * @see Player.equipItem
 */
export abstract class AbstractEquipment extends TexturedItem implements Equipment {

    readonly equipmentType: EquipmentType;
    readonly equipmentBonus: number;

    /**
     * @param {string} texture item texture
     * @param {EquipmentType} equipmentType equipment type
     * @param {number} equipmentBonus equipment bonus
     */
    constructor(texture: string, equipmentType: EquipmentType, equipmentBonus: number) {
        super(texture);

        this.equipmentType = equipmentType;
        this.equipmentBonus = equipmentBonus;
    }

    useItem(world: GameWorld): Equipment | undefined {
        return world.player.equipItem(this);
    }
}
