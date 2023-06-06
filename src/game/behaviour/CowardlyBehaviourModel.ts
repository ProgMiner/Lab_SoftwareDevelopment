import { PassiveBehaviourModel } from './PassiveBehaviourModel';
import { Coordinates } from '../../utils/Coordinates';
import { BehaviourModel } from './BehaviourModel';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Cowardly behaviour model
 *
 * Avoids player when seeing
 */
export class CowardlyBehaviourModel<Self extends Movable> implements BehaviourModel<Self> {

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
        if (!world.isPlayerVisibleFrom(self.coordinates)) {
            return this.noPlayerBehaviour.onMove(self, world);
        }

        const farthestCells = CowardlyBehaviourModel.findFarthestCellFromPlayer(
            self.coordinates,
            world.player.coordinates,
        );

        for (const cell of farthestCells) {
            if (self.moveTo(cell, world)) {
                return;
            }
        }
    }

    private static findFarthestCellFromPlayer(baseCell: Coordinates, playerCell: Coordinates): Coordinates[] {
        const candidates: [Coordinates, number][] = [
            new Coordinates(baseCell.x + 1, baseCell.y),
            new Coordinates(baseCell.x, baseCell.y + 1),
            new Coordinates(baseCell.x - 1, baseCell.y),
            new Coordinates(baseCell.x, baseCell.y - 1),
        ].map(c => [c, c.vectorTo(playerCell).length()]);

        return candidates.sort(([_1, a], [_2, b]) => b - a).map(([c, _]) => c);
    }
}
