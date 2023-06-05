import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { Equipment, EquipmentType } from '../items/Equipment';
import { Coordinates } from '../../utils/Coordinates';
import { Inventory } from '../Inventory/Inventory';
import { GameObject } from '../GameObject';

import person from './person.png';


const DEFAULT_MAX_HEALTH = 10;
const DEFAULT_BASE_DAMAGE = 1;
const DEFAULT_BASE_ARMOR = 0;

loadTexture(person);

/**
 * Game player
 */
export class Player implements GameObject {

    readonly isPassable = true;

    coordinates: Coordinates = new Coordinates(0, 0);

    /**
     * Player's inventory
     */
    readonly inventory = new Inventory();

    /**
     * Maximum health
     */
    maxHealth: number = DEFAULT_MAX_HEALTH;

    /**
     * Current health
     */
    health: number = DEFAULT_MAX_HEALTH;

    /**
     * Player's damage without equipment
     */
    baseDamage: number = DEFAULT_BASE_DAMAGE;

    /**
     * Player's armor without equipment
     */
    baseArmor: number = DEFAULT_BASE_ARMOR;

    /**
     * Player's experience points
     */
    xp: number = 0;

    /**
     * Equipped items
     *
     * For each {@link EquipmentType} may be equipped only one item in same time
     *
     * Uses {@link EquipmentType.MAX_VALUE} as size
     */
    readonly equipment = new Array<Equipment | undefined>(EquipmentType.MAX_VALUE);

    /**
     * Calculate actual damage
     */
    get actualDamage(): number {
        let result = this.baseDamage;

        for (const item of this.equipment) {
            if (item === undefined) {
                continue;
            }

            if (item.equipmentType === EquipmentType.SWORD) {
                result += item.equipmentBonus;
            }
        }

        return result;
    }

    /**
     * Calculate actual armor
     */
    get actualArmor(): number {
        let result = this.baseArmor;

        for (const item of this.equipment) {
            if (item === undefined) {
                continue;
            }

            if (item.equipmentType === EquipmentType.ARMOR) {
                result += item.equipmentBonus;
            }
        }

        return result;
    }

    /**
     * Heal player on factor of max health
     *
     * @param factor healing factor
     *
     * @return `true` if player was healed or `false` if player's health is already max
     */
    healOn(factor: number): boolean {
        if (this.health == this.maxHealth) {
            return false;
        }

        const points = this.maxHealth * factor;

        this.health += points;
        this.health = Math.min(this.health, this.maxHealth);
        return true;
    }

    /**
     * Equip item instead of equipped item of same type
     *
     * @param item item to equip
     */
    equipItem(item: Equipment): Equipment | undefined {
        const prev = this.equipment[item.equipmentType]

        this.equipment[item.equipmentType] = item;

        return prev;
    }

    /**
     * Increases player's experience points on specified value
     *
     * @param xp experience points
     */
    giveXp(xp: number) {
        this.xp += xp;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        drawTexture(person, context, center, scale);
    }

    collides(point: Coordinates): boolean {
        return point.equals(this.coordinates);
    }

    needUpdate(): boolean {
        return true;
    }
}
