import { Coordinates } from '../utils/Coordinates';
import { EventBus } from '../core/events/EventBus';
import { GameObject } from './GameObject';
import { Player } from './Player/Player';
import { isTrigger } from './Trigger';
import { isMovable } from './Movable';
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

    /**
     * Maximum distance from player to object where object could be updated
     */
    updateDistance: number = 0;

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

        const triggers = this.checkCollisionWithObjects(newPosition, (object) => object.isPassable, false);
        for (const trigger of triggers) {
            if (isTrigger(trigger)) {
                trigger.onStep(this);
            }
        }

        for (const object of this.objects) {
            if (!object.needUpdate(newPosition, this.updateDistance)) {
                continue;
            }

            if (isMovable(object)) {
                object.onMove(this);
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
            if (!object.needUpdate(this.player.coordinates, this.updateDistance)) {
                continue;
            }

            const coords = this.player.coordinates.vectorTo(object.coordinates);

            object.draw(context, new Coordinates(
                center.x + coords.x * scale.x,
                center.y + coords.y * scale.y,
            ), scale);
        }
    }

    /**
     * Check collision of objects with point
     *
     * @param point point in world
     * @param filterFunction filter for checking objects
     * @param stopOnFirst if `true` returns only first colliding object
     *
     * @return array of objects that collides
     */
    checkCollisionWithObjects(
        point: Coordinates,
        filterFunction: (object: GameObject) => boolean = (object) => !object.isPassable,
        stopOnFirst: boolean = true,
    ): GameObject[] {
        let result: GameObject[] = [];

        for (const object of this.objects) {
            if (!filterFunction(object)) {
                continue;
            }

            if (object.collides(point)) {
                result.push(object);

                if (stopOnFirst) {
                    return result;
                }
            }
        }

        return result;
    }

    /**
     * Ray trace from point in world in specified direction with
     * maximum ray distance of length of distance vector
     *
     * @param startPoint start point of ray tracing
     * @param direction direction and length vector
     * @param filterFunction filter for checking objects
     * @param stopOnFirst if `true` returns only first colliding object
     *
     * @return array of colliding objects
     */
    rayTrace(
        startPoint: Coordinates,
        direction: Coordinates,
        filterFunction: (object: GameObject) => boolean = (object) => !object.isPassable,
        stopOnFirst: boolean = true,
    ): GameObject[] {
        const result = [];

        for (const cell of GameWorld.rayTraceCells(startPoint, direction)) {
            result.push(...this.checkCollisionWithObjects(cell, filterFunction, stopOnFirst));

            if (stopOnFirst && result.length > 0) {
                return result;
            }
        }

        return result;
    }

    /**
     * Ray trace from point in world in specified direction with
     * maximum ray distance of length of distance vector
     *
     * @param startPoint start point of ray tracing
     * @param direction direction and length vector
     *
     * @return iterable of cells from start to end
     */
    static *rayTraceCells(
        startPoint: Coordinates,
        direction: Coordinates,
    ): IterableIterator<Coordinates> {
        const maxLength = direction.length();
        const angle = direction.atan2();

        let cell = new Coordinates(Math.round(startPoint.x), Math.round(startPoint.y));

        let point = startPoint;
        while (startPoint.vectorTo(point).length() <= maxLength) {
            yield cell;

            let variants: [[Coordinates, Coordinates], [Coordinates, Coordinates], [Coordinates, Coordinates]];

            if (direction.x >= 0 && direction.y >= 0) {
                variants = [
                    [new Coordinates(cell.x + 1, cell.y), new Coordinates(cell.x + 0.5, point.y + direction.y * (cell.x + 0.5 - point.x) / direction.x)],
                    [new Coordinates(cell.x + 1, cell.y + 1), new Coordinates(cell.x + 0.5, cell.y + 0.5)],
                    [new Coordinates(cell.x, cell.y + 1), new Coordinates(point.x + direction.x * (cell.y + 0.5 - point.y) / direction.y, cell.y + 0.5)],
                ];
            } else if (direction.x >= 0 && direction.y < 0) {
                variants = [
                    [new Coordinates(cell.x, cell.y - 1), new Coordinates(point.x + direction.x * (cell.y - 0.5 - point.y) / direction.y, cell.y - 0.5)],
                    [new Coordinates(cell.x + 1, cell.y - 1), new Coordinates(cell.x + 0.5, cell.y - 0.5)],
                    [new Coordinates(cell.x + 1, cell.y), new Coordinates(cell.x + 0.5, point.y + direction.y * (cell.x + 0.5 - point.x) / direction.x)],
                ];
            } else if (direction.x < 0 && direction.y < 0) {
                variants = [
                    [new Coordinates(cell.x - 1, cell.y), new Coordinates(cell.x - 0.5, point.y + direction.y * (cell.x - 0.5 - point.x) / direction.x)],
                    [new Coordinates(cell.x - 1, cell.y - 1), new Coordinates(cell.x - 0.5, cell.y - 0.5)],
                    [new Coordinates(cell.x, cell.y - 1), new Coordinates(point.x + direction.x * (cell.y - 0.5 - point.y) / direction.y, cell.y - 0.5)],
                ];
            } else {
                variants = [
                    [new Coordinates(cell.x, cell.y + 1), new Coordinates(point.x + direction.x * (cell.y + 0.5 - point.y) / direction.y, cell.y + 0.5)],
                    [new Coordinates(cell.x - 1, cell.y + 1), new Coordinates(cell.x - 0.5, cell.y + 0.5)],
                    [new Coordinates(cell.x - 1, cell.y), new Coordinates(cell.x - 0.5, point.y + direction.y * (cell.x - 0.5 - point.x) / direction.x)],
                ];
            }

            const splittingAngle = point.vectorTo(variants[1][1]).atan2();

            if (angle < splittingAngle) {
                cell = variants[0][0];
                point = variants[0][1];
            } else if (angle === splittingAngle) {
                cell = variants[1][0];
                point = variants[1][1];
            } else {
                cell = variants[2][0];
                point = variants[2][1];
            }
        }
    }

    /**
     * Calculate damage
     *
     * @param damage damage points of attacker
     * @param armor armor points of attacked
     *
     * @return result damage
     */
    static calcDamage(damage: number, armor: number): number {
        return damage - armor;
    }
}
