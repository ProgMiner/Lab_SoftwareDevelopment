import { Equipment, EquipmentType } from './Equipment';
import { TexturedItem } from './TexturedItem';
import { GameWorld } from '../GameWorld';


export abstract class AbstractEquipment extends TexturedItem implements Equipment {

    readonly equipmentType: EquipmentType;
    readonly equipmentBonus: number;

    constructor(texture: string, equipmentType: EquipmentType, equipmentBonus: number) {
        super(texture);

        this.equipmentType = equipmentType;
        this.equipmentBonus = equipmentBonus;
    }

    useItem(world: GameWorld): Equipment | undefined {
        return world.player.equipItem(this);
    }
}
