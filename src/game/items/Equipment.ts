import { Item } from './Item';


/**
 * Equipment type
 *
 * Specifies player stats that equipment changed when equipped
 * Used to index players equipment array
 */
export enum EquipmentType {

    /**
     * Swords increases player's damage
     */
    SWORD = 0,

    /**
     * Armors increases player's armor
     */
    ARMOR = 1,

    /**
     * Max value, used to set size of player's equipment array
     *
     * Must be last in enumeration
     */
    MAX_VALUE,
}

/**
 * Equipment
 */
export interface Equipment extends Item {

    /**
     * Equipment type, controls changed player stats
     */
    readonly equipmentType: EquipmentType;

    /**
     * Equipment bonus, value of player stats changing
     */
    readonly equipmentBonus: number;
}
