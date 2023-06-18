import { BaseGameState, GameStateState } from './GameState';


/**
 * Game state after player death
 */
export type PlayerDeadState = BaseGameState<GameStateState.PLAYER_DIE>;
