import { GameStateState, isGameState } from '../../states/GameState';
import { drawText, EMOJI_FONT_FAMILY } from '../../utils/drawText';
import { EventHandler } from '../events/EventBus';
import { State } from '../../states/State';


export const PlayerDieEventHandler: EventHandler<State> = (state, event) => {
    if (!isGameState(state)) {
        return;
    }

    if (event.type === 'playerDie') {
        return {
            ...state,
            state: GameStateState.PLAYER_DIE,
        };
    }

    if (state.state === GameStateState.PLAYER_DIE && event.type === 'tick') {
        const { canvas, context } = state;

        context.save();

        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = '#d71919';
        context.font = `bold 42px ${EMOJI_FONT_FAMILY}`;
        drawText(context, '☠️ YOU DIED ☠️', canvas.width / 2, canvas.height / 2, {
            centerWidth: true,
            centerHeight: true,
        });

        context.restore();
    }
};
