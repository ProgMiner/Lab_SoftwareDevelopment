import { EventBus } from './core/events/EventBus';
import { InitEventHandler } from './core/handlers/InitEventHandler';
import { CanvasClearEventHandler } from './core/handlers/CanvasClearEventHandler';
import { GameWorldEventHandler } from './core/handlers/GameWorldEventHandler/GameWorldEventHandler';
import { ChangePreviousUpdateTimeEventHandler } from './core/handlers/ChangePreviousUpdateTimeEventHandler';
import { DebugInfoEventHandler } from './core/handlers/DebugInfoEventHandler';
import { Coordinates } from './game/Coordinates';
import { GameWorld } from './game/GameWorld';
import { State } from './game/State';

import './index.css';


const canvas = document.getElementById("canvas");

if (canvas instanceof HTMLCanvasElement) {
    const state: State = {
        canvas,
        context: canvas.getContext('2d')!!,
        game: new GameWorld(),
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
        DebugInfoEventHandler(),
        ChangePreviousUpdateTimeEventHandler,
    );

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
