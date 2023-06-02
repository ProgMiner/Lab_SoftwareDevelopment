import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';
import { Coordinates } from '../../game/Coordinates';
import { INVENTORY_SIZE } from '../../game/Inventory/Inventory';


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
    }

    if (event.type === 'tick') {
        game.player.inventory.draw(
            context,
            new Coordinates(canvas.width / 2, canvas.height - 48),
            new Coordinates(64, 64),
        )
    }
};
