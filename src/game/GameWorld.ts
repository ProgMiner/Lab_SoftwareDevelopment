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
     * Amount of rays in {@link isPlayerVisibleFrom}
     */
    private static readonly IS_PLAYER_VISIBLE_FROM_RAYS_COUNT = 10;

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

        // need to copy because of concurrent modification
        for (const object of [...this.objects]) {
            if (!object.needUpdate(newPosition, this.updateDistance)) {
                continue;
            }

            if (isMovable(object)) {
                object.onMove(this);
            }
        }

        const triggers = this.checkCollisionWithObjects(newPosition, (object) => object.isPassable, false);
        for (const trigger of triggers) {
            if (isTrigger(trigger)) {
                trigger.onStep(this);
            }
        }

        return true;
    }

    /**
     * Moves object to another cell
     *
     * @param object object to move
     * @param newPosition new position
     * @param onlyOnPassable if `true` moves only on passable cells
     *
     * @return `true` if object is on `newPosition` after call
     */
    moveObject(object: GameObject, newPosition: Coordinates, onlyOnPassable: boolean = true): boolean {
        if (object.coordinates.equals(newPosition)) {
            return true;
        }

        this.removeObject(object);

        if (onlyOnPassable) {
            if (this.checkCollisionWithObjects(newPosition).length > 0) {
                return false;
            }
        }

        object.coordinates = newPosition;

        this.placeObject(object);
        return true;
    }

    /**
     * Hits player with specified damage
     *
     * @param damage damage of attacker
     */
    hitPlayer(damage: number) {
        const actualDamage = GameWorld.calcDamage(damage, this.player.actualArmor);

        if (actualDamage >= this.player.health) {
            this.player.health = 0;

            this.eventBus({ type: 'playerDie' });
            return;
        }

        this.player.health -= actualDamage;
    }

    /**
     * Increases player's experience points on specified value
     *
     * @param xp experience points
     */
    givePlayerXp(xp: number) {
        this.player.xp += xp;

        const nextLevelCost = this.player.nextLevelCost;
        if (this.player.xp >= nextLevelCost) {
            this.player.xp -= nextLevelCost;

            const oldStats = {
                damage: this.player.actualDamage,
                armor: this.player.actualArmor,
            }

            ++this.player.level;

            this.eventBus({
                type: 'levelUp',
                previousDamage: oldStats.damage,
                previousArmor: oldStats.armor,
            });
        }
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
     * Checks is player's cell visible from specified point in world
     *
     * @param point point of view
     * @param filterFunction filter for opaque objects, default all impassable
     *
     * @return is player visible from point
     */
    isPlayerVisibleFrom(
        point: Coordinates,
        filterFunction: (object: GameObject) => boolean = object => !object.isPassable,
    ): boolean {
        if (this.player.collides(point)) {
            return true;
        }

        const newFilterFunction = (object: GameObject) => object instanceof Player || filterFunction(object);

        const cell = this.player.coordinates;
        if (cell.equals(point.round())) {
            return true;
        }

        const corners: [Coordinates, number][] = [
            new Coordinates(cell.x + 0.5, cell.y + 0.5),
            new Coordinates(cell.x + 0.5, cell.y - 0.5),
            new Coordinates(cell.x - 0.5, cell.y + 0.5),
            new Coordinates(cell.x - 0.5, cell.y - 0.5),
        ].map(c => point.vectorTo(c)).map(c => [c, c.atan2()]);

        const negCount = corners.filter(([_, a]) => a < 0).length;

        if (negCount % 2 != 0) {
            console.error('Unexpected case', corners, point);
            return false;
        }

        corners.sort(([_1, a], [_2, b]) => a - b);

        let cornerA: Coordinates, cornerB: Coordinates;
        // let angle: number;

        // bad case for atan2
        if (negCount === 2 && corners.every(([_, a]) => Math.abs(a) > Math.PI / 2)) {
            cornerA = corners[2]![0];
            cornerB = corners[1]![0];
            // angle = 2 * Math.PI + corners[1][1] - corners[2][1];
        } else {
            cornerA = corners[0]![0];
            cornerB = corners[3]![0];
            // angle = corners[3][1] - corners[0][1];
        }

        const n = GameWorld.IS_PLAYER_VISIBLE_FROM_RAYS_COUNT;
        for (let i = 0; i <= n; ++i) {
            const visibleObjects = this.rayTrace(point, new Coordinates(
                (cornerA.x * i + cornerB.x * (n - i)) / n,
                (cornerA.y * i + cornerB.y * (n - i)) / n,
            ), newFilterFunction, true, true);

            if (visibleObjects.includes(this.player)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Ray trace from point in world in specified direction with
     * maximum ray distance of length of distance vector
     *
     * @param startPoint start point of ray tracing
     * @param direction direction and length vector
     * @param filterFunction filter for checking objects
     * @param stopOnFirst if `true` returns only first colliding object
     * @param handleCorners if `true` checks adjacent cells when ray passing on diagonal cell
     *
     * @return array of colliding objects
     */
    rayTrace(
        startPoint: Coordinates,
        direction: Coordinates,
        filterFunction: (object: GameObject) => boolean = (object) => !object.isPassable,
        stopOnFirst: boolean = true,
        handleCorners: boolean = true,
    ): GameObject[] {
        const result = [];

        for (const cell of GameWorld.rayTraceCells(startPoint, direction, handleCorners)) {
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
     * @param handleCorners if `true` returns adjacent cells when ray passing on diagonal cell
     *
     * @return iterable of cells from start to end
     */
    static *rayTraceCells(
        startPoint: Coordinates,
        direction: Coordinates,
        handleCorners: boolean = false,
    ): IterableIterator<Coordinates> {
        const maxLength = direction.length();
        const angle = direction.atan2();

        let cell = startPoint.round();

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
                if (handleCorners) {
                    yield variants[0][0];
                    yield variants[2][0];
                }

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
