import { Coordinates } from '../../utils/Coordinates';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


/**
 * Helper function that implements moving to specified point in world
 *
 * @param point point to move to
 * @param self current game object
 * @param world current game world
 */
export const moveToPoint = <Self extends Movable>(point: Coordinates, self: Self, world: GameWorld) => {
    if (point.equals(self.coordinates)) {
        return;
    }

    const nearestCells = findNearestCellToPoint(self.coordinates, point);

    for (const cell of nearestCells) {
        if (self.moveTo(cell, world)) {
            return;
        }
    }
}

const findNearestCellToPoint = (baseCell: Coordinates, point: Coordinates): Coordinates[] => {
    const candidates: [Coordinates, number][] = baseCell.adjacent()
        .map(c => [c, c.vectorTo(point).length()]);

    return candidates.sort(([_1, a], [_2, b]) => a - b).map(([c, _]) => c);
};
