import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';
import { Coordinates } from '../../game/Coordinates';
import { INVENTORY_SIZE } from '../../game/Inventory/Inventory';
import { Player } from '../../game/Player/Player';


const INVENTORY_SCALE = 64; // px
const HEALTH_BAR_HEIGHT = 16; // px
const GAP = 16; // px

export const GameInterfaceEventHandler: EventHandler<State> = ({ canvas, context, game }, event) => {
    if (event.type === 'keyDown') {
        const oldSelectedItem = game.player.inventory.selectedItem;
        let newSelectedItem = oldSelectedItem;

        switch (event.event.code) {
            case 'Digit1':
                newSelectedItem = 0;
                break;

            case 'Digit2':
                newSelectedItem = 1;
                break;

            case 'Digit3':
                newSelectedItem = 2;
                break;

            case 'Digit4':
                newSelectedItem = 3;
                break;

            case 'Digit5':
                newSelectedItem = 4;
                break;

            case 'Digit6':
                newSelectedItem = 5;
                break;

            case 'Digit7':
                newSelectedItem = 6;
                break;

            case 'Digit8':
                newSelectedItem = 7;
                break;

            case 'Digit9':
                newSelectedItem = 8;
                break;

            case 'ArrowLeft':
                newSelectedItem = (INVENTORY_SIZE + oldSelectedItem - 1) % INVENTORY_SIZE;
                break;

            case 'ArrowRight':
                newSelectedItem = (oldSelectedItem + 1) % INVENTORY_SIZE;
                break;
        }

        game.player.inventory.selectedItem = newSelectedItem;

        if (event.event.code === 'Enter') {
            game.player.inventory.useSelectedItem(game);
        }

        if (event.event.code === 'Backspace') {
            game.player.inventory.dropSelectedItem(game);
        }
    }

    if (event.type === 'tick') {
        game.player.inventory.draw(
            context,
            new Coordinates(canvas.width / 2, canvas.height - INVENTORY_SCALE / 2 - GAP),
            new Coordinates(INVENTORY_SCALE, INVENTORY_SCALE),
        )

        drawHealthBar(game.player, canvas, context);
    }
};

const drawHealthBar = (player: Player, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    context.save();

    context.fillStyle = '#ccc';
    context.fillRect(
        canvas.width / 2 - INVENTORY_SCALE * INVENTORY_SIZE / 2,
        canvas.height - INVENTORY_SCALE - 2 * GAP - HEALTH_BAR_HEIGHT,
        INVENTORY_SCALE * INVENTORY_SIZE,
        HEALTH_BAR_HEIGHT,
    );

    context.fillStyle = '#e74236';
    context.fillRect(
        canvas.width / 2 - INVENTORY_SCALE * INVENTORY_SIZE / 2,
        canvas.height - INVENTORY_SCALE - 2 * GAP - HEALTH_BAR_HEIGHT,
        INVENTORY_SCALE * INVENTORY_SIZE * player.health / player.maxHealth,
        HEALTH_BAR_HEIGHT,
    );

    const gradient = context.createLinearGradient(
        0,
        canvas.height - INVENTORY_SCALE - 2 * GAP - HEALTH_BAR_HEIGHT,
        0,
        canvas.height - INVENTORY_SCALE - 2 * GAP,
    )

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    context.fillStyle = gradient;

    context.fillRect(
        canvas.width / 2 - INVENTORY_SCALE * INVENTORY_SIZE / 2,
        canvas.height - INVENTORY_SCALE - 2 * GAP - HEALTH_BAR_HEIGHT,
        INVENTORY_SCALE * INVENTORY_SIZE,
        HEALTH_BAR_HEIGHT,
    );

    context.strokeStyle = '#000';
    context.lineWidth = 3;

    context.strokeRect(
        canvas.width / 2 - INVENTORY_SCALE * INVENTORY_SIZE / 2,
        canvas.height - INVENTORY_SCALE - 2 * GAP - HEALTH_BAR_HEIGHT,
        INVENTORY_SCALE * INVENTORY_SIZE,
        HEALTH_BAR_HEIGHT,
    );

    context.restore();
};
