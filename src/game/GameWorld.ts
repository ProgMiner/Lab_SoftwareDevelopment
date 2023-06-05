import { Coordinates } from '../utils/Coordinates';
import { EventBus } from '../core/events/EventBus';
import { GameObject } from './GameObject';
import { Player } from './Player/Player';
import { isTrigger } from './Trigger';
import { Drawable } from './Drawable';


/**
 * Game world
 *
 * Holds objects that placed in world and player
 *
 * Implements base game logic
 */
export class GameWorld implements Drawable {

    /**
     * Array of game objects, placed in world
     *
     * By default, only player
     *
     * Order of objects controls drawing order (firstly first objects, at end last)
     *
     * Must contain player (same as {@link player})
     */
    objects: GameObject[] = [];

    /**
     * Player
     */
    player: Player = new Player();

    private readonly _eventBus: EventBus;

    get eventBus(): EventBus {
        return this._eventBus;
    }

    /**
     * @param eventBus current event bus
     */
    constructor(eventBus: EventBus) {
        this.objects.push(this.player);
        this._eventBus = eventBus;
    }

    /**
     * Place new object in world
     *
     * Places object strictly on top under player
     *
     * @param object object to place
     */
    placeObject(object: GameObject) {
        // FIXME dirty hack to select correct place for object,
        //       where it will be on top but under player and walls

        const playerIdx = this.objects.indexOf(this.player);

        if (playerIdx === -1) {
            console.error('Player is not in objects list');
            return;
        }

        this.objects.splice(playerIdx, 0, object);
    }

    /**
     * Removes object from world
     *
     * @param object object to remove
     */
    removeObject(object: GameObject): boolean {
        const idx = this.objects.indexOf(object);

        if (idx === -1) {
            return false;
        }

        this.objects.splice(idx, 1);
        return true;
    }

    /**
     * Move player by specified vector
     *
     * Checks can player step on result cell and runs triggers
     *
     * @param direction vector to add to player's coordinates
     *
     * @return `true` if player was moved, `false` if there is impassable object on cell
     */
    movePlayer(direction: Coordinates): boolean {
        const newPosition = new Coordinates(
            this.player.coordinates.x + direction.x,
            this.player.coordinates.y + direction.y,
        );

        if (this.checkCollisionWithObjects(newPosition).length > 0) {
            return false;
        }

        this.player.coordinates = newPosition;

        const triggers = this.checkCollisionWithObjects(newPosition, false);
        for (const trigger of triggers) {
            if (isTrigger(trigger)) {
                trigger.onStep(this);
            }
        }

        return true;
    }

    hitPlayer(damage: number) {
        const actualDamage = GameWorld.calcDamage(damage, this.player.actualArmor);

        if (actualDamage >= this.player.health) {
            this.player.health = 0;

            this.eventBus({ type: 'playerDie' });
            return;
        }

        this.player.health -= actualDamage;
    }

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates): void {
        for (const object of this.objects) {
            const coords = new Coordinates(
                object.coordinates.x - this.player.coordinates.x,
                object.coordinates.y - this.player.coordinates.y,
            );

            object.draw(context, new Coordinates(
                center.x + coords.x * scale.x,
                center.y + coords.y * scale.y,
            ), scale);
        }
    }

    checkCollisionWithObjects(point: Coordinates, onlyImpassable: boolean = true) {
        let result: GameObject[] = [];

        for (const object of this.objects) {
            if (onlyImpassable) {
                if (object.isPassable) {
                    continue;
                }
            }

            if (object.collides(point)) {
                result.push(object);
            }
        }

        return result;
    }

    static calcDamage(damage: number, armor: number): number {
        return damage - armor;
    }
}
