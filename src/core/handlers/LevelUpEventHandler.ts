import { drawText, EMOJI_FONT_FAMILY, formatNumber } from '../../utils/drawText';
import { LevelUpEvent } from '../../game/events/LevelUpEvent';
import { isGameState } from '../../states/GameState';
import { EventHandler } from '../events/EventBus';
import { State } from '../../states/State';


interface LevelUpScreen {
    remainingTime: number;
    event: LevelUpEvent;
}

const LEVEL_UP_SCREEN_TIME = 2000;

/**
 * Event handler that shows level up screen
 */
export const LevelUpEventHandler = (): EventHandler<State> => {
    let levelUpScreen: LevelUpScreen | undefined = undefined;

    return (state, event) => {
        if (!isGameState(state)) {
            return;
        }

        if (event.type === 'levelUp') {
            levelUpScreen = {
                remainingTime: LEVEL_UP_SCREEN_TIME,
                event,
            };

            return;
        }

        if (levelUpScreen !== undefined && event.type === 'tick') {
            levelUpScreen.remainingTime -= performance.now() - state.previousUpdateTime;

            if (levelUpScreen.remainingTime <= 0) {
                levelUpScreen = undefined;
                return;
            }

            const { canvas, context, world } = state;

            context.save();

            const remainingTimeRelative = levelUpScreen.remainingTime / LEVEL_UP_SCREEN_TIME;

            context.fillStyle = `rgba(0, 0, 0, ${remainingTimeRelative * 0.6})`;
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = `rgba(238, 238, 238, ${remainingTimeRelative})`;
            context.font = `bold 42px ${EMOJI_FONT_FAMILY}`;

            // assume that stats only grows with levels

            drawText(
                context,
                '✨ LEVEL UP ✨️\n\n'
                + `👊 +${formatNumber(world.player.actualDamage - levelUpScreen.event.previousDamage)}  |  `
                + `🛡️ +${formatNumber(world.player.actualArmor - levelUpScreen.event.previousArmor)}`,
                canvas.width / 2,
                canvas.height / 2,
                { centerWidth: true, centerHeight: true },
            );

            context.restore();
        }
    };
};
