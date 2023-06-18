import { Coordinates } from '../../src/utils/Coordinates';

describe('Coordinates', () => {
    test('length', () => {
        const coordinates = new Coordinates(3, 4);
        const result = coordinates.length();
        expect(result).toBe(5);
    });

    test('norm', () => {
        const coordinates = new Coordinates(3, 4);
        const result = coordinates.norm();
        expect(result.x).toBe(0.6);
        expect(result.y).toBe(0.8);
    });

    test('equals', () => {
        const coordinates1 = new Coordinates(3, 4);
        const coordinates2 = new Coordinates(3, 4);
        const coordinates3 = new Coordinates(5, 6);

        expect(coordinates1.equals(coordinates2)).toBe(true);
        expect(coordinates1.equals(coordinates3)).toBe(false);
    });

    test('toString', () => {
        const coordinates = new Coordinates(3, 4);
        const result = coordinates.toString();
        expect(result).toBe('(3, 4)');
    });
});
