import { Coordinates, MutableCoordinates } from '../utils/Coordinates';
import { CommonGameState } from './CommonGameState';
import { PlayerDeadState } from './PlayerDeadState';
import { GameWorld } from '../game/GameWorld';
import { BaseState, State } from './State';


/**
 * Type of all states of game state
 *
 * Used to check is state is game state
 *
 * @see isGameState
 */
export enum GameStateState {

    COMMON = 'game',
    PLAYER_DIE = 'playerDie',
}

/**
 * Type of all event bus states when player in game
 *
 * Contains all information, needed to more than one event handler
 */
export interface BaseGameState<State extends GameStateState> extends BaseState<State> {

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
     * Maximum distance from object to player where object will be updated
     */
    updateDistance: number;

    /**
     * Current offset of camera, used for camera animation
     */
    readonly cameraOffset: MutableCoordinates;
}

/**
 * Type of all game states
 */
export type GameState = CommonGameState | PlayerDeadState;

// noinspection TypeScriptValidateTypes
export const isGameState = (state: State): state is GameState =>
    Object.values<State['state']>(GameStateState).includes(state.state);
