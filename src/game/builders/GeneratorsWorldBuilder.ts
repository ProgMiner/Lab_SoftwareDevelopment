import random, { Random } from 'random';

import { BoxedWorldGenerator } from '../generators/BoxedWorldGenerator';
import { FileWorldGenerator } from '../generators/FileWorldGenerator';
import { ItemGenerator, MobGenerator } from '../generators/Generator';
import { RandomWorldBuilder } from './RandomWorldBuilder';
import { FileWorldBuilder } from './FileWorldBuilder';
import { Coordinates } from '../../utils/Coordinates';
import { EventBus } from '../../core/events/EventBus';
import { WorldBuilder } from './WorldBuilder';
import { GameWorld } from '../GameWorld';


/**
 * World builder based on world generators
 */
export class GeneratorsWorldBuilder implements WorldBuilder {

    fromFile(): FileWorldBuilder {
        return new GeneratorFileWorldBuilder();
    }

    random(): GeneratorRandomWorldBuilder {
        return new GeneratorRandomWorldBuilder();
    }
}

/**
 * Random world builder based on {@link BoxedWorldGenerator}
 */
export class GeneratorRandomWorldBuilder implements RandomWorldBuilder {

    private _eventBus?: EventBus = undefined;

    private _random: Random = random;

    private _maxDepth: number = 3;
    private _maxItemsInRoom: number = 2;
    private _maxMobsInRoom: number = 2;

    private _boxSize: Coordinates = new Coordinates(6, 5);

    private _itemGenerator?: ItemGenerator = undefined;
    private _mobGenerator?: MobGenerator = undefined;

    eventBus(eventBus: EventBus): this {
        this._eventBus = eventBus;
        return this;
    }

    randomInstance(random: Random): this {
        this._random = random;
        return this;
    }

    /**
     * Set max depth of generating tree, default `3`
     *
     * @param maxDepth max depth
     *
     * @return this
     */
    maxDepth(maxDepth: number): this {
        this._maxDepth = maxDepth;
        return this;
    }

    /**
     * Set max amount of items in each room, default `2`
     *
     * @param maxItemsInRoom max items in room
     *
     * @return this
     */
    maxItemsInRoom(maxItemsInRoom: number): this {
        this._maxItemsInRoom = maxItemsInRoom;
        return this;
    }

    /**
     * Set max amount of mobs in each room, default `2`
     *
     * @param maxMobsInRoom max mobs in room
     *
     * @return this
     */
    maxMobsInRoom(maxMobsInRoom: number): this {
        this._maxMobsInRoom = maxMobsInRoom;
        return this;
    }

    /**
     * Set one box size, default `(6, 5)`
     *
     * @param boxSize box size
     *
     * @return this
     */
    boxSize(boxSize: Coordinates): this {
        this._boxSize = boxSize;
        return this;
    }

    itemGenerator(itemGenerator: ItemGenerator): this {
        this._itemGenerator = itemGenerator;
        return this;
    }

    mobGenerator(mobGenerator: MobGenerator): this {
        this._mobGenerator = mobGenerator;
        return this;
    }

    build(): Promise<GameWorld> {
        // noinspection JSIncompatibleTypesComparison
        if (this._eventBus === undefined) {
            throw new Error('event bus isn\'t set');
        }

        // noinspection JSIncompatibleTypesComparison
        if (this._itemGenerator === undefined) {
            throw new Error('item generator isn\'t set');
        }

        // noinspection JSIncompatibleTypesComparison
        if (this._mobGenerator === undefined) {
            throw new Error('mob generator isn\'t set');
        }

        return new BoxedWorldGenerator(
            this._eventBus,
            this._maxDepth,
            this._maxItemsInRoom,
            this._maxMobsInRoom,
            this._boxSize,
            this._itemGenerator,
            this._mobGenerator,
        ).generate(this._random);
    }
}

class GeneratorFileWorldBuilder implements FileWorldBuilder {

    private _eventBus?: EventBus = undefined;

    private _content?: string = undefined;
    private _filename?: string = undefined;

    eventBus(eventBus: EventBus): this {
        this._eventBus = eventBus;
        return this;
    }

    filename(filename: string): this {
        this._filename = filename;
        this._content = undefined;
        return this;
    }

    content(content: string): this {
        this._filename = undefined;
        this._content = content;
        return this;
    }

    async build(): Promise<GameWorld> {
        // noinspection JSIncompatibleTypesComparison
        if (this._eventBus === undefined) {
            throw new Error('event bus isn\'t set');
        }

        // noinspection JSIncompatibleTypesComparison
        if (this._filename !== undefined) {
            const generator = await FileWorldGenerator.loadFile(this._filename, this._eventBus)
            return generator.generate();
        }

        // noinspection JSIncompatibleTypesComparison
        if (this._content !== undefined) {
            return new FileWorldGenerator(this._content, this._eventBus).generate();
        }

        throw new Error('neither filename nor content are set')
    }
}
