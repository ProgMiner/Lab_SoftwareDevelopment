import { PassiveBehaviourModel } from './PassiveBehaviourModel';
import { Coordinates } from '../../utils/Coordinates';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Aggressive behaviour model
 *
 * Follows player when seeing
 */
export class AggressiveBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

    /**
     * Behaviour model that used when player isn't visible
     */
    noPlayerBehaviour: BehaviourModel<Self>;

    /**
     * @param noPlayerBehaviour behaviour model that used when player isn't visible
     */
    constructor(noPlayerBehaviour: BehaviourModel<Self> = new PassiveBehaviourModel()) {
        this.noPlayerBehaviour = noPlayerBehaviour;
    }

    onMove(self: Self, world: GameWorld): void {
        if (self.coordinates.equals(world.player.coordinates)) {
            return;
        }

        if (!world.isPlayerVisibleFrom(self.coordinates)) {
            return this.noPlayerBehaviour.onMove(self, world);
        }

        const nearestCells = AggressiveBehaviourModel.findNearestCellToPlayer(
            self.coordinates,
            world.player.coordinates,
        );

        for (const cell of nearestCells) {
            if (self.moveTo(cell, world)) {
                return;
            }
        }
    }

    clone(): AggressiveBehaviourModel<Self> {
        return new AggressiveBehaviourModel(this.noPlayerBehaviour);
    }

    private static findNearestCellToPlayer(baseCell: Coordinates, playerCell: Coordinates): Coordinates[] {
        const candidates: [Coordinates, number][] = baseCell.adjacent()
            .map(c => [c, c.vectorTo(playerCell).length()]);

        return candidates.sort(([_1, a], [_2, b]) => a - b).map(([c, _]) => c);
    }
}
