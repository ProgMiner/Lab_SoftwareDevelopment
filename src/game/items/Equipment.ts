import { Item } from './Item';


export enum EquipmentType {

    SWORD = 0,
    ARMOR = 1,

    MAX_VALUE,
}

export interface Equipment extends Item {

    readonly equipmentType: EquipmentType;
    readonly equipmentBonus: number;
}
