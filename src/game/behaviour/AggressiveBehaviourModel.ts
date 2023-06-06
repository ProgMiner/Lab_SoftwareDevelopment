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

    // TODO add ability to pass behaviour model to use when not seeing player

    onMove(self: Self, world: GameWorld): void {
        if (self.coordinates.equals(world.player.coordinates)) {
            return;
        }

        if (!world.isPlayerVisibleFrom(self.coordinates)) {
            return;
        }

        const nearestCells = AggressiveBehaviourModel.findNearestCellToPlayer(
            self.coordinates,
            world.player.coordinates,
        );

        for (const cell of nearestCells) {
            if (self.moveOn(cell, world)) {
                return;
            }
        }
    }

    private static findNearestCellToPlayer(baseCell: Coordinates, playerCell: Coordinates): Coordinates[] {
        const candidates: [Coordinates, number][] = [
            new Coordinates(baseCell.x + 1, baseCell.y),
            new Coordinates(baseCell.x, baseCell.y + 1),
            new Coordinates(baseCell.x - 1, baseCell.y),
            new Coordinates(baseCell.x, baseCell.y - 1),
        ].map(c => [c, c.vectorTo(playerCell).length()]);

        return candidates.sort(([_1, a], [_2, b]) => a - b).map(([c, _]) => c);
    }
}
