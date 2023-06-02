import { INVENTORY_SIZE, ITEM_SCALE_FACTOR } from '../../game/Inventory/Inventory';
import { Equipment, EquipmentType } from '../../game/items/Equipment';
import { drawText, EMOJI_FONT_FAMILY } from '../../utils/drawText';
import { Coordinates } from '../../game/Coordinates';
import { Player } from '../../game/Player/Player';
import { EventHandler } from '../events/EventBus';
import { State } from '../../game/State';


const INVENTORY_SCALE = 64; // px
const HEALTH_BAR_HEIGHT = 16; // px
const STATS_HEIGHT = 16; // px
const GAP = 16; // px

const STATS_FONT = `${STATS_HEIGHT}px ${EMOJI_FONT_FAMILY}`;

const HEALTH_BAR_ANIMATION_SPEED = 0.01; // 1/ms

export const GameInterfaceEventHandler: () => EventHandler<State> = () => {
    let healthBarValue = 0;

    const animateHealthBar = (player: Player, previousUpdateTime: number) => {
        const actualHealthBarValue = player.health / player.maxHealth;

        if (actualHealthBarValue === healthBarValue) {
            return;
        }

        const speed = (actualHealthBarValue - healthBarValue) * HEALTH_BAR_ANIMATION_SPEED;
        const timeDelta = performance.now() - previousUpdateTime;

        const nextValue = healthBarValue + speed * timeDelta;
        const valueDelta = Math.abs(nextValue - actualHealthBarValue);

        if (valueDelta > 1) {
            return;
        }

        if (valueDelta < 0.01) {
            healthBarValue = actualHealthBarValue;
        } else {
            healthBarValue = nextValue;
        }
    };

    return ({ canvas, context, game, previousUpdateTime }, event) => {
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
            animateHealthBar(game.player, previousUpdateTime);

            game.player.inventory.draw(
                context,
                new Coordinates(canvas.width / 2, canvas.height - INVENTORY_SCALE / 2 - GAP),
                new Coordinates(INVENTORY_SCALE, INVENTORY_SCALE),
            )

            drawHealthBar(healthBarValue, canvas, context);

            drawEquipment(game.player, canvas, context);

            context.save();

            context.fillStyle = '#eee';
            context.font = STATS_FONT;
            drawText(
                context,
                `❤ ${game.player.health} / ${game.player.maxHealth}  |  `
                + `👊 ${game.player.actualDamage()}  |  `
                + `🛡️ ${game.player.actualArmor()}`,
                canvas.width / 2,
                canvas.height - INVENTORY_SCALE - 3 * GAP - HEALTH_BAR_HEIGHT - STATS_HEIGHT,
                { centerWidth: true },
            );

            context.restore();
        }
    };
};

const equipmentTypeIcon = (equipmentType: EquipmentType) => {
    switch (equipmentType) {
        case EquipmentType.SWORD:
            return '👊';

        case EquipmentType.ARMOR:
            return '🛡️';

        default:
            return '';
    }
}

const drawEquipment = (player: Player, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const equipment = player.equipment.filter(v => v !== undefined) as Equipment[];

    const itemScale = INVENTORY_SCALE * ITEM_SCALE_FACTOR;
    const scale = new Coordinates(itemScale, itemScale);

    const x = GAP + itemScale / 2;
    let y = canvas.height;

    for (const item of equipment) {
        y -= itemScale / 2 + GAP;

        item.draw(context, new Coordinates(x, y), scale);

        context.save();

        if (item.equipmentBonus === 0) {
            context.fillStyle = '#eee';
        } else if (item.equipmentBonus > 0) {
            context.fillStyle = '#0bce00';
        } else {
            context.fillStyle = '#d00000';
        }

        context.font = STATS_FONT;

        drawText(
            context,
            (item.equipmentBonus < 0 ? '' : '+') + item.equipmentBonus
            + ' ' + equipmentTypeIcon(item.equipmentType),
            x + itemScale / 2 + GAP,
            y,
            { centerHeight: true },
        );

        context.restore();
    }
}

const drawHealthBar = (value: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
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
        INVENTORY_SCALE * INVENTORY_SIZE * value,
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
