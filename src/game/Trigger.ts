import { GameObject } from './GameObject';
import { GameWorld } from './GameWorld';


export interface Trigger extends GameObject {

    onStep(world: GameWorld): void;
}

export const isTrigger = (object: GameObject): object is Trigger => {
    return 'onStep' in object;
};
