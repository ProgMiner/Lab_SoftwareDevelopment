import { InitEventHandler } from './core/handlers/InitEventHandler';
import { CanvasClearEventHandler } from './core/handlers/CanvasClearEventHandler';
import { GameWorldEventHandler } from './core/handlers/GameWorldEventHandler/GameWorldEventHandler';
import { ChangePreviousUpdateTimeEventHandler } from './core/handlers/ChangePreviousUpdateTimeEventHandler';
import { GameInterfaceEventHandler } from './core/handlers/GameInterfaceEventHandler';
import { DebugInfoEventHandler } from './core/handlers/DebugInfoEventHandler';
import { PlayerDieEventHandler } from './core/handlers/PlayerDieEventHandler';
import { MainMenuEventHandler } from './core/handlers/MainMenuEventHandler';
import { LevelUpEventHandler } from './core/handlers/LevelUpEventHandler';
import { EventBus } from './core/events/EventBus';
import { State } from './states/State';

import './index.css';


const canvas = document.getElementById('canvas');

if (canvas instanceof HTMLCanvasElement) {
    canvas.tabIndex = 1000;
    canvas.focus();

    const state: State = {
        state: 'mainMenu',
        canvas,
        context: canvas.getContext('2d')!,
        previousUpdateTime: performance.now(),
        debug: false,
    };

    const eventBus = EventBus<State>(
        state,
        CanvasClearEventHandler,
        InitEventHandler,
        MainMenuEventHandler,
        GameWorldEventHandler,
        GameInterfaceEventHandler(),
        LevelUpEventHandler(),
        PlayerDieEventHandler,
        DebugInfoEventHandler(),
        ChangePreviousUpdateTimeEventHandler,
    );

    window.onload = (event) => {
        eventBus({ type: 'load', event });

        const fireTick = () => {
            eventBus({ type: 'tick' });

            setTimeout(fireTick, 1000 / 60);
        };

        fireTick();
    };

    window.onresize = (event) => {
        eventBus({ type: 'resize', event });
    };

    canvas.onkeydown = (event) => {
        eventBus({ type: 'keyDown', event });
    }

    canvas.onclick = (event) => {
        eventBus({ type: 'click', event });
    }
}
