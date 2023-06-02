import { EventHandler } from '../../events/EventBus';
import { State } from '../../../game/State';
import { Coordinates } from '../../../game/Coordinates';
import { drawTexture, loadTexture } from '../../../utils/drawTexture';

import floorTexture from './floor.png';


const CAMERA_SPEED_FACTOR = 4; // px/ms^2
const CAMERA_MIN_SPEED = 25; // px/ms
const CAMERA_THRESHOLD = 0.5; // px/ms

loadTexture(floorTexture);

export const GameWorldEventHandler: EventHandler<State> = (state, event) => {
    if (event.type === 'keyDown') {
        switch (event.event.code) {
            case 'KeyW':
                if (state.game.movePlayer(new Coordinates(0, 1))) {
                    state.cameraOffset.y -= state.scale.y;
                }

                break;

            case 'KeyA':
                if (state.game.movePlayer(new Coordinates(-1, 0))) {
                    state.cameraOffset.x -= state.scale.x;
                }

                break;

            case 'KeyS':
                if (state.game.movePlayer(new Coordinates(0, -1))) {
                    state.cameraOffset.y += state.scale.y;
                }

                break;

            case 'KeyD':
                if (state.game.movePlayer(new Coordinates(1, 0))) {
                    state.cameraOffset.x += state.scale.x;
                }

                break;
        }
    }

    if (event.type === 'tick') {
        animateCamera(state);

        const cameraPosition = new Coordinates(
            ~~(state.canvas.width / 2 + state.cameraOffset.x),
            ~~(state.canvas.height / 2 + state.cameraOffset.y),
        );

        drawFloor(
            state.context,
            new Coordinates(state.canvas.width, state.canvas.height),
            cameraPosition,
            state.scale,
        );

        state.game.draw(state.context, cameraPosition, state.scale);

        drawDarkness(state);
    }
};

const animateCamera = ({ cameraOffset, previousUpdateTime }: State) => {
    const calcSpeed = cameraOffset.length() / CAMERA_SPEED_FACTOR;

    if (!isFinite(calcSpeed) || calcSpeed < CAMERA_THRESHOLD) {
        cameraOffset.x = 0;
        cameraOffset.y = 0;
        return;
    }

    const timeDelta = performance.now() - previousUpdateTime;
    const speed = Math.max(calcSpeed, CAMERA_MIN_SPEED);
    const norm = cameraOffset.norm();

    if (Math.abs(cameraOffset.x) < 1) {
        cameraOffset.x = 0;
    } else {
        cameraOffset.x -= norm.x * speed / timeDelta;
    }

    if (Math.abs(cameraOffset.y) < 1) {
        cameraOffset.y = 0;
    } else {
        cameraOffset.y -= norm.y * speed / timeDelta;
    }
}

const drawFloor = (
    context: CanvasRenderingContext2D,
    canvasSize: Coordinates,
    place: Coordinates,
    scale: Coordinates,
) => {
    const width = canvasSize.x;
    const height = canvasSize.y;

    // https://stackoverflow.com/questions/4228356/how-to-perform-an-integer-division-and-separately-get-the-remainder-in-javascr
    const xCount = ~~(width / scale.x) + 2;
    const yCount = ~~(height / scale.y) + 2;

    const xOffset = (scale.x - place.x % scale.x) % scale.x;
    const yOffset = (scale.y - place.y % scale.y) % scale.y;

    for (let x = 0; x <= xCount; ++x) {
        for (let y = 0; y <= yCount; ++y) {
            drawTexture(floorTexture, context, new Coordinates(
                -xOffset + x * scale.x,
                -yOffset + y * scale.y,
            ), scale);
        }
    }
};

const drawDarkness = ({ canvas, context, darknessRadius }: State) => {
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        darknessRadius,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2,
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
}
