import { Coordinates, MutableCoordinates } from '../utils/Coordinates';
import { GameWorld } from '../game/GameWorld';
import { BaseState } from './State';


/**
 * Type of event bus state when in game
 *
 * Contains all information, needed to more than one event handler
 */
export interface GameState extends BaseState<'game'> {

    /**
     * Current game world
     */
    world: GameWorld;

    /**
     * Radius of darkness around camera, px
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
}
