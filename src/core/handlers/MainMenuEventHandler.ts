import { EventBus, EventHandler } from '../events/EventBus';
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
import { DEFAULT_FONT_FAMILY, drawText } from '../../utils/drawText';
import { CommonGameState } from '../../states/CommonGameState';
import { GameStateState } from '../../states/GameState';
import { Mimic } from '../../game/mobs/Mimic';

import world from '../../worlds/test.world';


const MAIN_MENU_TEXT = `\
Press button to start:

1. Load stub world
2. Load random world
3. Load world from file\
`;

/**
 * Event handler that controls interaction with main menu
 *
 * TODO implement GUI
 *
 * Reacts on {@link KeyDownEvent}:
 * - 1 - load stub world
 * - 2 - load random world
 * - 3 - load world from file {@link world}
 */
export const MainMenuEventHandler: EventHandler<State> = (state, event, eventBus): CommonGameState | void => {
    if (state.state !== 'mainMenu') {
        return;
    }

    if (event.type === 'keyDown') {
        let loadCase: 1 | 2 | 3;

        switch (event.event.code) {
            case 'Digit1':
                loadCase = 1;
                break;

            case 'Digit2':
                loadCase = 2;
                break;

            case 'Digit3':
                loadCase = 3;
                break;

            default:
                return;
        }

        const newState: CommonGameState = {
            ...state,
            state: GameStateState.COMMON,
            world: new GameWorld(eventBus),
            darknessRadius: 130,
            scale: new Coordinates(100, 100),
            updateDistance: 10,
            cameraOffset: new Coordinates(0, 0),
        };

        // TODO load screen

        if (loadCase === 1) {
            newState.world = makeGame1(eventBus);
        } else if (loadCase === 2) {
            makeGame2(eventBus).then(world => {
                newState.world = world;
            });
        } else {
            makeGame3(eventBus).then(world => {
                newState.world = world;
            });
        }

        return newState;
    }

    if (event.type === 'tick') {
        const { canvas, context } = state;

        context.save();

        context.font = `20px ${DEFAULT_FONT_FAMILY}`;
        context.fillStyle = '#eee';

        drawText(context, MAIN_MENU_TEXT, canvas.width / 2, canvas.height / 2, {
            centerWidth: true,
            centerHeight: true,
        });

        context.restore();
    }
};

const makeGame1 = (eventBus: EventBus): GameWorld => {
    const result = new GameWorld(eventBus);

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

    result.objects.push(wall);

    result.placeObject(new DroppedItem(new Sword(), new Coordinates(1, 1)));
    result.placeObject(new DroppedItem(new GoldenApple(), new Coordinates(2, 3)));
    result.placeObject(new Mimic(new GoldenApple(), new Coordinates(2, 2)));

    result.player.health = 4.23;

    return result;
}

const makeGame2 = async (eventBus: EventBus) => {
    return new BoxedWorldGenerator(eventBus, 5, 2, new Coordinates(6, 5), new UniformItemGenerator([
        [constGenerator(() => new Sword()), 1],
        [constGenerator(() => new GoldenApple()), 1],
    ])).generate(seededRandom('' + performance.now()));
}

const makeGame3 = async (eventBus: EventBus) => {
    return (await FileWorldGenerator.loadFile(world, eventBus)).generate();
};
