import { Random } from 'random';

import { ItemGenerator, MobGenerator, WorldGenerator } from './Generator';
import { AbstractGenerator } from './AbstractGenerator';
import { delayPromise } from '../../utils/delayPromise';
import { Coordinates } from '../../utils/Coordinates';
import { EventBus } from '../../core/events/EventBus';
import { DroppedItem } from '../DroppedItem';
import { sample } from '../../utils/shuffle';
import { GameObject } from '../GameObject';
import { range } from '../../utils/range';
import { GameWorld } from '../GameWorld';
import { Wall } from '../Wall/Wall';


class Box {

    coordinates: Coordinates;
    objects: GameObject[];

    constructor(coordinates: Coordinates, objects: GameObject[]) {
        this.coordinates = coordinates;
        this.objects = objects;
    }
}

/**
 * World generator that generates world as closed area,
 * consisting of boxes with same size (like in The binding of Isaac)
 *
 * Each box has random number of doors to other boxes and random number of random items,
 * generated by specified item generator
 */
export class BoxedWorldGenerator extends AbstractGenerator<GameWorld> implements WorldGenerator {

    private readonly eventBus: EventBus;

    private readonly maxDepth: number;
    private readonly maxItemsInRoom: number;
    private readonly maxMobsInRoom: number;
    private readonly boxSize: Coordinates;

    private readonly itemGenerator: ItemGenerator;
    private readonly mobGenerator: MobGenerator;

    /**
     * @param eventBus event bus to set in world
     * @param maxDepth max depth of generating tree
     * @param maxItemsInRoom max amount of items in each room
     * @param maxMobsInRoom max amount of mobs in each room
     * @param boxSize box size (width and height)
     * @param itemGenerator items generator
     * @param mobGenerator mobs generator
     */
    constructor(
        eventBus: EventBus,
        maxDepth: number,
        maxItemsInRoom: number,
        maxMobsInRoom: number,
        boxSize: Coordinates,
        itemGenerator: ItemGenerator,
        mobGenerator: MobGenerator,
    ) {
        super();

        this.eventBus = eventBus;
        this.maxDepth = maxDepth;
        this.maxItemsInRoom = maxItemsInRoom;
        this.maxMobsInRoom = maxMobsInRoom;
        this.boxSize = boxSize;
        this.itemGenerator = itemGenerator;
        this.mobGenerator = mobGenerator;
    }

    async generate(random: Random): Promise<GameWorld> {
        const [boxes, doors] = await this.generateBoxes(random);

        return this.buildWorld(boxes, doors);
    }

    private buildWorld(boxes: Box[], doors: Set<string>): GameWorld {
        const minBoxCoordinates = new Coordinates(
            Math.min(...boxes.map(box => box.coordinates.x)),
            Math.min(...boxes.map(box => box.coordinates.y)),
        );

        const worldSize = new Coordinates(
            Math.max(...boxes.map(box => box.coordinates.x)) - minBoxCoordinates.x + 1,
            Math.max(...boxes.map(box => box.coordinates.y)) - minBoxCoordinates.y + 1,
        );

        const walls = new Wall();
        walls.coordinates = new Coordinates(
            minBoxCoordinates.x * (this.boxSize.x + 1),
            minBoxCoordinates.y * (this.boxSize.y + 1),
        );

        walls.matrix = range(worldSize.y * (this.boxSize.y + 1) + 1).map(_ =>
            range(worldSize.x * (this.boxSize.x + 1) + 1).map(_ => false));

        for (const box of boxes) {
            const baseX = (box.coordinates.x - minBoxCoordinates.x) * (this.boxSize.x + 1);
            const baseY = (box.coordinates.y - minBoxCoordinates.y) * (this.boxSize.y + 1);

            for (let x = 0; x <= this.boxSize.x + 1; ++x) {
                walls.matrix[baseY]![baseX + x] = true;
                walls.matrix[baseY + this.boxSize.y + 1]![baseX + x] = true;
            }

            for (let y = 0; y <= this.boxSize.y + 1; ++y) {
                walls.matrix[baseY + y]![baseX] = true;
                walls.matrix[baseY + y]![baseX + this.boxSize.x + 1] = true;
            }
        }

        for (const box of boxes) {
            const coords = box.coordinates;

            const boxDoors = [
                new Coordinates(coords.x + 1, coords.y),
                new Coordinates(coords.x, coords.y + 1),
            ].filter(door => doors.has(stringifyDoor(coords, door)));

            for (const door of boxDoors) {
                if (door.x === coords.x) {
                    // vertical door

                    const x = (coords.x - minBoxCoordinates.x) * (this.boxSize.x + 1) + ~~(this.boxSize.x / 2) + 1;
                    const y = (coords.y - minBoxCoordinates.y + 1) * (this.boxSize.y + 1);

                    walls.matrix[y]![x] = false;

                    if (this.boxSize.x % 2 === 0) {
                        walls.matrix[y]![x - 1] = false;
                    }
                }

                if (door.y === coords.y) {
                    // horizontal door

                    const x = (coords.x - minBoxCoordinates.x + 1) * (this.boxSize.x + 1);
                    const y = (coords.y - minBoxCoordinates.y) * (this.boxSize.y + 1) + ~~(this.boxSize.y / 2) + 1;

                    walls.matrix[y]![x] = false;

                    if (this.boxSize.y % 2 === 0) {
                        walls.matrix[y - 1]![x] = false;
                    }
                }
            }
        }

        const world = new GameWorld(this.eventBus);
        world.objects.push(walls);

        for (const box of boxes) {
            const x = box.coordinates.x * (this.boxSize.x + 1) + 1;
            const y = box.coordinates.y * (this.boxSize.y + 1) + 1;

            for (const object of box.objects) {
                object.coordinates = new Coordinates(
                    object.coordinates.x + x,
                    object.coordinates.y + y,
                )
                world.placeObject(object);
            }
        }

        world.player.coordinates = new Coordinates(
            ~~(this.boxSize.x / 2) + 1,
            ~~(this.boxSize.y / 2) + 1,
        );

        return world;
    }

    private async generateBoxes(random: Random): Promise<[Box[], Set<string>]> {
        const doors = new Set<string>();
        const boxes: Box[] = [];

        const indexToCoords: Coordinates[] = [new Coordinates(0, 0)];
        const coordsToIndex = new Map<string, number>();
        const queue: [number, number][] = [[0, 0]];
        const remaining = new Set<number>();

        coordsToIndex.set(new Coordinates(0, 0).toString(), 0);
        remaining.add(0);

        const doorsNumberGenerator = random.uniformInt(0, 4);
        console.log(doorsNumberGenerator());

        let counter = 1;
        while (queue.length > 0) {
            const [index, depth] = queue.pop()!;

            if (!remaining.has(index)) {
                continue;
            }

            remaining.delete(index);

            const coords = indexToCoords[index]!;

            const itemsCount = random.integer(0, this.maxItemsInRoom);
            const mobsCount = random.integer(0, this.maxMobsInRoom);

            const cells = sample(itemsCount + mobsCount, range(this.boxSize.x).flatMap(x =>
                range(this.boxSize.y).map(y => new Coordinates(x, y))), random);

            const items = await Promise.all(cells.splice(0, itemsCount).map(async (c: Coordinates) =>
                new DroppedItem(await this.itemGenerator.generate(random), c)));

            const mobs = await Promise.all(cells.splice(0, mobsCount).map(async (c: Coordinates) => {
                const mob = await this.mobGenerator.generate(random);

                mob.coordinates = c;
                return mob;
            }));

            boxes[index] = new Box(coords, [...items, ...mobs]);

            if (depth < this.maxDepth) {
                const doorsNumber = doorsNumberGenerator();

                const boxDoors = sample(doorsNumber, coords.adjacent(), random);

                for (const door of boxDoors) {
                    doors.add(stringifyDoor(coords, door));

                    const doorStr = door.toString();
                    if (coordsToIndex.has(doorStr)) {
                        continue;
                    }

                    const newIndex = counter++;

                    indexToCoords[newIndex] = door;
                    coordsToIndex.set(doorStr, newIndex);
                    remaining.add(newIndex);
                    queue.unshift([newIndex, depth + 1]);
                }
            }

            // switch context to prevent UI lags
            await delayPromise();
        }

        return [boxes, doors];
    }
}

const stringifyDoor = (u: Coordinates, v: Coordinates): string => {
    let uStr = u.toString(), vStr = v.toString();

    if (uStr > vStr) {
        [uStr, vStr] = [vStr, uStr];
    }

    return `${uStr}:${vStr}`;
}
