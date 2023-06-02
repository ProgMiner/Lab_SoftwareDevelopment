import { GameWorld } from './GameWorld';
import { Coordinates, MutableCoordinates } from './Coordinates';


export interface State {
    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;

    readonly game: GameWorld;

    darknessRadius: number;
    scale: Coordinates;

    readonly cameraOffset: MutableCoordinates;
    previousUpdateTime: number;
}
