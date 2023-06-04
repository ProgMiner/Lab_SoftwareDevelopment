import { EventBus } from './core/events/EventBus';
import { InitEventHandler } from './core/handlers/InitEventHandler';
import { CanvasClearEventHandler } from './core/handlers/CanvasClearEventHandler';
import { GameWorldEventHandler } from './core/handlers/GameWorldEventHandler/GameWorldEventHandler';
import { ChangePreviousUpdateTimeEventHandler } from './core/handlers/ChangePreviousUpdateTimeEventHandler';
import { GameInterfaceEventHandler } from './core/handlers/GameInterfaceEventHandler';
import { DebugInfoEventHandler } from './core/handlers/DebugInfoEventHandler';
import { UniformItemGenerator } from './game/generators/UniformItemGenerator';
import { BoxedWorldGenerator } from './game/generators/BoxedWorldGenerator';
import { FileWorldGenerator } from './game/generators/FileWorldGenerator';
import { GoldenApple } from './game/items/GoldenApple/GoldenApple';
import { constGenerator } from './game/generators/Generator';
import { seededRandom } from './utils/seededRandom';
import { DroppedItem } from './game/DroppedItem';
import { Coordinates } from './game/Coordinates';
import { Sword } from './game/items/Sword/Sword';
import { GameWorld } from './game/GameWorld';
import { Wall } from './game/Wall/Wall';
import { State } from './game/State';

import world from './worlds/test.world';
import './index.css';


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

const canvas = document.getElementById("canvas");

if (canvas instanceof HTMLCanvasElement) {
    const state: State = {
        canvas,
        context: canvas.getContext('2d')!!,
        world: new GameWorld(),
        darknessRadius: 130,
        scale: new Coordinates(100, 100),
        cameraOffset: new Coordinates(0, 0),
        previousUpdateTime: performance.now(),
    };

    const eventBus = EventBus<State>(
        state,
        CanvasClearEventHandler,
        InitEventHandler,
        GameWorldEventHandler,
        GameInterfaceEventHandler(),
        DebugInfoEventHandler(),
        ChangePreviousUpdateTimeEventHandler,
    );

    // state.world = makeGame1();

    makeGame3().then(world => {
        state.world = world;

        eventBus({ type: 'tick' });
    });

    window.onload = (event) => {
        eventBus({ type: 'load', event });
    };

    window.onresize = (event) => {
        eventBus({ type: 'resize', event });
    };

    window.onkeydown = (event) => {
        eventBus({ type: 'keyDown', event });
    }

    eventBus({ type: 'tick' });

    setInterval(() => {
        eventBus({ type: 'tick' });
    }, 1000 / 60);
}
