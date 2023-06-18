import { isGameState } from '../../states/GameState';
import { EventHandler } from '../events/EventBus';
import { drawText } from '../../utils/drawText';
import { State } from '../../states/State';


/**
 * Event handler that shows debug panel on F3 key
 */
export const DebugInfoEventHandler: () => EventHandler<State> = () => {
    let lastPressedKey: string | undefined = undefined;

    return (state, event) => {
        if (event.type === 'keyDown') {
            lastPressedKey = event.event.code;

            if (event.event.code === 'F3') {
                state.debug = !state.debug;

                event.event.preventDefault();
            }
        }

        if (event.type !== 'tick' || !state.debug) {
            return;
        }

        const ctx = state.context;

        ctx.save();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, state.canvas.width * 0.3, state.canvas.height * 0.4);

        ctx.beginPath();
        ctx.rect(5, 5, state.canvas.width * 0.3 - 10, state.canvas.height * 0.4 - 10);
        ctx.clip();

        ctx.fillStyle = 'white';

        const timeDelta = performance.now() - state.previousUpdateTime;

        let text = '';

        text += `Time delta: ${Math.round(timeDelta)}\n`;
        text += `Ticks per second: ${Math.round(1000 / timeDelta)}\n`;

        if (isGameState(state)) {
            text += `Player position: ${state.world.player.coordinates}\n`;
            text += `Camera offset: ${state.cameraOffset}\n`;
        }

        text += `Pressed key: ${lastPressedKey}\n`;

        drawText(ctx, text, 5, 5);

        ctx.restore();
    };
};
