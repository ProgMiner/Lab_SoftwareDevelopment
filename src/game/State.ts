import { Coordinates, MutableCoordinates } from '../utils/Coordinates';
import { GameWorld } from './GameWorld';


/**
 * Main game state
 *
 * Contains all information, needed to more than one event handler
 */
export interface State {

    /**
     * Current canvas HTML tag
     */
    readonly canvas: HTMLCanvasElement;

    /**
     * Current canvas rendering context
     */
    readonly context: CanvasRenderingContext2D;

    /**
     * Current game world
     */
    world: GameWorld;

    /**
     * Radius of darkness around camera
     */
    darknessRadius: number;

    /**
     * Drawing scale of game objects in pixels
     */
    scale: Coordinates;

    /**
     * Current offset of camera, used for camera animation
     */
    readonly cameraOffset: MutableCoordinates;

    /**
     * Previous update time in ms, usable for animations
     *
     * @see performance.now
     */
    previousUpdateTime: number;
}
