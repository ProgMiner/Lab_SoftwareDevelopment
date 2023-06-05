import { MainMenuState } from './MainMenuState';
import { GameState } from './GameState';


/**
 * Base type for all states
 */
export interface BaseState<State extends string> {

    /**
     * State name, discriminator
     */
    readonly state: State;

    /**
     * Current canvas HTML tag
     */
    readonly canvas: HTMLCanvasElement;

    /**
     * Current canvas rendering context
     */
    readonly context: CanvasRenderingContext2D;

    /**
     * Previous update time in ms, usable for animations
     *
     * @see performance.now
     */
    previousUpdateTime: number;
}

/**
 * Type of event bus state
 */
export type State = MainMenuState | GameState;
