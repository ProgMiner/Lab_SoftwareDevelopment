import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { Equipment, EquipmentType } from '../items/Equipment';
import { Inventory } from '../Inventory/Inventory';
import { Coordinates } from '../Coordinates';
import { GameObject } from '../GameObject';

import person from './person.png';


const DEFAULT_MAX_HEALTH = 10;
const DEFAULT_BASE_DAMAGE = 1;
const DEFAULT_BASE_ARMOR = 0;

loadTexture(person);

export class Player implements GameObject {

    readonly isPassable = true;

    coordinates: Coordinates = new Coordinates(0, 0);

    readonly inventory = new Inventory();

    maxHealth: number = DEFAULT_MAX_HEALTH;
    health: number = DEFAULT_MAX_HEALTH;

    baseDamage: number = DEFAULT_BASE_DAMAGE;
    baseArmor: number = DEFAULT_BASE_ARMOR;

    readonly equipment = new Array<Equipment | undefined>(EquipmentType.MAX_VALUE);

    /**
     * Heal player of factor of max health
     *
     * @param factor healing factor
     *
     * @return true if player was healed or false if player's health is already max
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
     * Calc actual damage
     */
    actualDamage(): number {
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
     * Calc actual armor
     */
    actualArmor(): number {
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

    draw(
        context: CanvasRenderingContext2D,
        center: Coordinates,
        scale: Coordinates,
    ): void {
        drawTexture(person, context, center, scale);
    }

    collides(point: Coordinates): boolean {
        return point.equals(this.coordinates);
    }
}
