import { createCanvas } from 'canvas';

import { GameWorld } from '../../src/game/GameWorld';
import { Player } from '../../src/game/Player/Player';
import { GameObject } from '../../src/game/GameObject';
import { Coordinates } from '../../src/utils/Coordinates';
import { EventBus } from '../../src/core/events/EventBus';
import { State } from '../../src/states/State';

describe('GameWorld', () => {
    let eventBus: EventBus;
    let gameWorld: GameWorld;
    // let ctx!: any; // It CanvasRenderingContext2D mock

    beforeEach(() => {
        jest.resetAllMocks();

        const canvas = createCanvas(200, 100) as unknown as HTMLCanvasElement;

        eventBus = EventBus<State>({
            state: 'mainMenu',
            canvas,
            context: canvas.getContext('2d')!,
            previousUpdateTime: performance.now(),
            debug: false,
        });

        gameWorld = new GameWorld(eventBus);
    });

    test('initialization', () => {
        expect(gameWorld.objects.length).toBe(1); // Only player object is present initially
        expect(gameWorld.objects[0]).toBeInstanceOf(Player); // First object is the player
        expect(gameWorld.player).toBe(gameWorld.objects[0]); // Player reference is correct
    });

    test('placeObject', () => {
        const object = {
            isPassable: false,
            coordinates: new Coordinates(0, 0),
            collides: jest.fn((point: Coordinates) => false),
            draw: jest.fn((c: CanvasRenderingContext2D, t: Coordinates, d: Coordinates) => {
            }),
        };

        gameWorld.placeObject(object as unknown as GameObject);

        expect(gameWorld.objects.length).toBe(2); // Player + placed object
        expect(gameWorld.objects[0]).toBe(object); // Placed object is at index 0
    });

    test('removeObject', () => {
        const object = new Player();
        gameWorld.placeObject(object);

        expect(gameWorld.objects.length).toBe(2); // Player + placed object

        const removed = gameWorld.removeObject(object);
        expect(removed).toBe(true); // Object removal is successful
        expect(gameWorld.objects.length).toBe(1); // Only player object remains
    });
});
