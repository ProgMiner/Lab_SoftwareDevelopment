import { SimpleBehaviourMovable } from '../behaviour/SimpleBehaviourMovable';
import { TemporalBehaviourModel } from '../behaviour/TemporalBehaviourModel';
import { ConfusedBehaviourModel } from '../behaviour/ConfusedBehaviourModel';
import { drawBar, HEALTH_BAR_COLOR } from '../../utils/drawBar';
import { Coordinates } from '../../utils/Coordinates';
import { GameWorld } from '../GameWorld';
import { Mob } from './Mob';


const HEALTH_BAR_OFFSET_FACTOR = 0.4; // px

const HEALTH_BAR_WIDTH_FACTOR = 0.8; // px
const HEALTH_BAR_HEIGHT_FACTOR = 0.1; // px

/**
 * Abstract mob
 *
 * Mobs are behaviour movables that fights with player on step on
 */
export abstract class AbstractMob extends SimpleBehaviourMovable implements Mob {

    abstract health: number;
    readonly abstract maxHealth: number;
    readonly abstract regenerationSpeed: number;

    readonly abstract damage: number;
    readonly abstract armor: number;

    readonly abstract experience: number;

    draw(context: CanvasRenderingContext2D, center: Coordinates, scale: Coordinates) {
        super.draw(context, center, scale);

        if (this.health < this.maxHealth) {
            drawBar(
                this.health / this.maxHealth,
                context,
                new Coordinates(center.x, center.y - scale.y * HEALTH_BAR_OFFSET_FACTOR),
                new Coordinates(scale.x * HEALTH_BAR_WIDTH_FACTOR, scale.y * HEALTH_BAR_HEIGHT_FACTOR),
                HEALTH_BAR_COLOR,
            );
        }
    }

    onMove(world: GameWorld) {
        super.onMove(world);

        if (world.isObjectInWorld(this)) {
            this.health = Math.min(this.health + this.regenerationSpeed, this.maxHealth);
        }
    }

    onStep(world: GameWorld): void {
        const { player } = world;

        const damage = GameWorld.calcDamage(player.actualDamage, this.armor);

        this.hit(damage, world);
        // noinspection TypeScriptValidateTypes: WebStorm shows as error, but TypeScript accepts
        TemporalBehaviourModel.decorate(this, damage, new ConfusedBehaviourModel());

        world.hitPlayer(this.damage);
    }

    /**
     * Calls when player hits mob
     *
     * @param damage player's damage
     * @param world current world
     */
    protected hit(damage: number, world: GameWorld): void {
        if (damage >= this.health) {
            world.givePlayerXp(this.experience);
            world.removeObject(this);
        }

        this.health -= damage;
    }
}
