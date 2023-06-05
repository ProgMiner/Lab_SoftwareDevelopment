import { GoldenApple } from '../items/GoldenApple/GoldenApple';
import { Coordinates } from '../../utils/Coordinates';
import { WorldGenerator } from './Generator';
import { DroppedItem } from '../DroppedItem';
import { Sword } from '../items/Sword/Sword';
import { GameObject } from '../GameObject';
import { GameWorld } from '../GameWorld';
import { Item } from '../items/Item';
import { Wall } from '../Wall/Wall';


/**
 * World generator that uses formatted text as source.
 *
 * File format:
 * - First line is two integer numbers `n` and `m`, size of world (width and height)
 * - `m` lines with `n` values separated by whitespace chars (maybe several), valid values:
 *   - `W` -- wall
 *   - `.` -- empty
 *   - integer number -- "hole"
 * - several lines, started with integer number and dot (`.`), "hole filler"
 *   after dot (maybe after some spaces) must be filler name, and after data for filler
 *
 * Syntax of hole fillers: `<index>. <name> [data]\n`
 *
 * Available hole fillers: `Player`, `Item`
 * - `Player` hole filler, places player, no data
 * - `Item` hole filler, places item, data is item type: `Sword` or `GoldenApple`
 */
export class FileWorldGenerator implements WorldGenerator {

    private static readonly WHITESPACE = /\s+/;

    private readonly objects: GameObject[] = [];

    private wall!: Wall;
    private playerPosition: Coordinates = new Coordinates(0, 0);

    /**
     * @param content content of file to parse
     */
    constructor(content: string) {
        this.parseFile(content);
    }

    async generate(): Promise<GameWorld> {
        const result = new GameWorld();

        result.player.coordinates = this.playerPosition;
        this.objects.forEach(o => result.placeObject(o));
        result.objects.push(this.wall);

        return result;
    }

    private parseFile(content: string) {
        const [holes, rest] = this.parseWalls(content);

        this.parseHoleFillers(rest, holes);
    }

    private parseWalls(content: string): [Coordinates[], string] {
        const [sizeLine, sizeLineRest] = FileWorldGenerator.parseToken(content);
        const [width, height] = sizeLine.split(FileWorldGenerator.WHITESPACE).map(x => +x);

        // noinspection JSIncompatibleTypesComparison
        if (width === undefined || height === undefined) {
            throw new Error('first line must contain width and height');
        }

        this.wall = new Wall();

        let rest = sizeLineRest;
        const result: Coordinates[] = [];
        for (let i = 0; i < height; ++i) {
            const [line, lineRest] = FileWorldGenerator.parseToken(rest);
            rest = lineRest;

            const values = line.split(FileWorldGenerator.WHITESPACE);
            if (values.length !== width) {
                throw new Error(`amount of values on line ${i} isn't match width ${width}`);
            }

            const matrixLine: boolean[] = [];
            for (let j = 0; j < values.length; j++){
                if (values[j] === 'W') {
                    matrixLine.push(true);
                    continue;
                }

                matrixLine.push(false);

                if (values[j] === '.') {
                    continue;
                }

                result[+values[j]!] = new Coordinates(j, i);
            }

            this.wall.matrix.push(matrixLine);
        }

        return [result, rest];
    }

    private parseHoleFillers(content: string, holes: Coordinates[]) {
        const lines = content.split('\n').map(l => l.trim());

        for (const line of lines) {
            this.parseHoleFiller(line, holes);
        }
    }

    private parseHoleFiller(line: string, holes: Coordinates[]) {
        const [indexStr, indexRest] = FileWorldGenerator.parseToken(line, '.');

        if (indexStr === '') {
            return;
        }

        const index = +indexStr;
        const coords = holes[index];

        // noinspection JSIncompatibleTypesComparison
        if (coords === undefined) {
            throw new Error(`hole ${index} is not on field`);
        }

        const [holeFillerName, holeFillerData] =
            FileWorldGenerator.parseToken(indexRest.trimStart(), FileWorldGenerator.WHITESPACE);

        switch (holeFillerName) {
            case 'Player':
                this.playerPosition = coords;
                break;

            case 'Item':
                this.objects.push(new DroppedItem(FileWorldGenerator.parseItem(holeFillerData), coords));
                break;

            default:
                console.warn(`Ignore unknown hole filler "${holeFillerName}"`);
        }
    }

    private static parseItem(line: string): Item {
        // TODO parse data of items

        switch (line) {
            case 'Sword':
                return new Sword();

            case 'GoldenApple':
                return new GoldenApple();

            default:
                throw new Error(`unknown item "${line}"`);
        }
    }

    private static parseToken(content: string, splitter: string | RegExp = '\n'): [string, string] {
        const idx = typeof splitter === 'string'
            ? content.indexOf(splitter)
            : content.match(splitter)?.index ?? -1
        ;

        if (idx === -1) {
            return [content.trim(), ''];
        }

        return [content.substring(0, idx).trim(), content.substring(idx + 1)];
    }

    /**
     * Loads file using fetch
     *
     * @param file imported world
     */
    public static async loadFile(file: string): Promise<FileWorldGenerator> {
        const response = await fetch(file);

        return new FileWorldGenerator(await response.text());
    }
}
