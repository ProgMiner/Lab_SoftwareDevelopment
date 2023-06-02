import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';
import { drawText } from '../../utils/drawText';


export const DebugInfoEventHandler: () => EventHandler<State> = () => {
    let show = false;

    let lastPressedKey: string | undefined = undefined;

    return (state, event) => {
        if (event.type === 'keyDown') {
            lastPressedKey = event.event.code;

            if (event.event.code === 'F3') {
                show = !show;

                event.event.preventDefault();
            }
        }

        if (event.type !== 'tick' || !show) {
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

        drawText(ctx, ''
            + `Time delta: ${Math.round(timeDelta)}\n`
            + `Ticks per second: ${Math.round(1000 / timeDelta)}\n`
            + `Player position: ${state.game.player.coordinates}\n`
            + `Camera offset: ${state.cameraOffset}\n`
            + `Pressed key: ${lastPressedKey}\n`
            + '', 5, 5);

        ctx.restore();
    };
};
