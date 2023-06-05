import { EventHandler } from '../events/EventBus';
import { State } from '../../states/State';
import { GameWorld } from '../../game/GameWorld';
import { Coordinates } from '../../utils/Coordinates';
import { Wall } from '../../game/Wall/Wall';
import { DroppedItem } from '../../game/DroppedItem';
import { Sword } from '../../game/items/Sword/Sword';
import { GoldenApple } from '../../game/items/GoldenApple/GoldenApple';
import { BoxedWorldGenerator } from '../../game/generators/BoxedWorldGenerator';
import { constGenerator } from '../../game/generators/Generator';
import { UniformItemGenerator } from '../../game/generators/UniformItemGenerator';
import { seededRandom } from '../../utils/seededRandom';
import { FileWorldGenerator } from '../../game/generators/FileWorldGenerator';
import { GameState } from '../../states/GameState';
import { DEFAULT_FONT_FAMILY, drawText } from '../../utils/drawText';

import world from '../../worlds/test.world';


/**
 * Event handler that controls interaction with main menu
 *
 * Reacts on {@link ClickEvent}
 */
export const MainMenuEventHandler: EventHandler<State> = (state, event): GameState | void => {
    if (state.state !== 'mainMenu') {
        return;
    }

    if (event.type === 'click') {
        const newState: GameState = {
            ...state,
            state: 'game',
            world: new GameWorld(),
            darknessRadius: 130,
            scale: new Coordinates(100, 100),
            cameraOffset: new Coordinates(0, 0),
        };

        newState.world = makeGame1();

        // makeGame3().then(world => {
        //     state.world = world;

        //     eventBus({ type: 'tick' });
        // });

        return newState;
    }

    if (event.type === 'tick') {
        const { canvas, context } = state;

        context.save();

        context.font = `20px ${DEFAULT_FONT_FAMILY}`;
        context.fillStyle = '#eee';

        drawText(
            context,
            "Click anywhere to start",
            canvas.width / 2,
            canvas.height / 2,
            { centerWidth: true, centerHeight: true },
        );

        context.restore();
    }
};

const makeGame1 = (): GameWorld => {
    const result = new GameWorld();

    const wall = new Wall();
    wall.coordinates = new Coordinates(-4, -3);
    wall.matrix = [
        [true, true, true, true, true, true, true, true],
        [true, false, false, false, false, false, false, true],
        [true, false, false, true, false, false, false, true],
        [true, false, false, true, false, false, false, true],
        [true, false, false, true, false, false, false, true],
        [true, false, true, true, true, false, false, true],
        [true, false, false, false, false, false, false, true],
        [true, true, true, true, true, true, true, true],
    ]

    result.objects.unshift(new DroppedItem(new Sword(), new Coordinates(1, 1)));
    result.objects.unshift(new DroppedItem(new GoldenApple(), new Coordinates(2, 3)));

    result.objects.push(wall);

    result.player.health = 4.23;

    return result;
}

const makeGame2 = async () => {
    return new BoxedWorldGenerator(5, 2, new Coordinates(6, 5), new UniformItemGenerator([
        [constGenerator(() => new Sword()), 1],
        [constGenerator(() => new GoldenApple()), 1],
    ])).generate(seededRandom('' + performance.now()));
}

const makeGame3 = async () => {
    return (await FileWorldGenerator.loadFile(world)).generate();
};
