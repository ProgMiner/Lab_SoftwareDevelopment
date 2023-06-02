import { drawTexture, loadTexture } from '../../utils/drawTexture';
import { Inventory } from '../Inventory/Inventory';
import { Coordinates } from '../Coordinates';
import { GameObject } from '../GameObject';

import person from './person.png';


const DEFAULT_MAX_HEALTH = 10;

loadTexture(person);

export class Player implements GameObject {

    readonly isPassable = true;

    coordinates: Coordinates = new Coordinates(0, 0);

    readonly inventory = new Inventory();

    maxHealth: number = DEFAULT_MAX_HEALTH;
    health: number = DEFAULT_MAX_HEALTH;

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
