import { BehaviourState, StatedBehaviourModel } from './StatedBehaviourModel';
import { ChaoticBehaviourModel } from './ChaoticBehaviourModel';
import { Coordinates } from '../../utils/Coordinates';
import { moveToPoint } from './moveToPoint';
import { GameWorld } from '../GameWorld';
import { Movable } from '../Movable';


const HEARING_DISTANCE = 3;

/**
 * Enhanced aggressive behaviour model
 *
 * When not seeing player, switches to search:
 * - if player nearly, moves to player (like hearing)
 * - if not, moves to last point where player was
 * - if no information about player, moves randomly
 */
export class EnhancedAggressiveBehaviourModel<Self extends Movable> extends StatedBehaviourModel<Self> {

    constructor() {
        super(new NoInformationState());
    }
}

interface BaseState<Self extends Movable> extends BehaviourState<Self> {

    doMove(self: Self, world: GameWorld): void;
}

abstract class PlayerFarState<Self extends Movable> implements BaseState<Self> {

    onMove(self: Self, world: GameWorld): BehaviourState<Self> {
        let nextState: BaseState<Self>;

        if (world.isPlayerVisibleFrom(self.coordinates)) {
            nextState = new PlayerVisibleState(world.player.coordinates);
        } else if (self.coordinates.vectorTo(world.player.coordinates).length() <= HEARING_DISTANCE) {
            nextState = new PlayerNearlyState(world.player.coordinates);
        } else {
            nextState = this;
        }

        nextState.doMove(self, world);
        return nextState;
    }

    abstract doMove(self: Self, world: GameWorld): void;
    abstract clone(): PlayerFarState<Self>;
}

class NoInformationState<Self extends Movable> extends PlayerFarState<Self> {

    private readonly behaviour = new ChaoticBehaviourModel();

    doMove(self: Self, world: GameWorld) {
        this.behaviour.onMove(self, world);
    }

    clone(): NoInformationState<Self> {
        return new NoInformationState();
    }
}

class PlayerWasVisibleState<Self extends Movable> extends PlayerFarState<Self> {

    private readonly playerWas: Coordinates;

    constructor(playerWas: Coordinates) {
        super();

        this.playerWas = playerWas;
    }

    doMove(self: Self, world: GameWorld): void {
        moveToPoint(this.playerWas, self, world);
    }

    clone(): PlayerWasVisibleState<Self> {
        return new PlayerWasVisibleState(this.playerWas);
    }
}

class PlayerVisibleState<Self extends Movable> implements BaseState<Self> {

    private playerWas: Coordinates;

    constructor(playerWas: Coordinates) {
        this.playerWas = playerWas;
    }

    onMove(self: Self, world: GameWorld): BehaviourState<Self> {
        let nextState: BaseState<Self>;

        if (world.isPlayerVisibleFrom(self.coordinates)) {
            this.playerWas = world.player.coordinates;
            nextState = this;
        } else if (self.coordinates.vectorTo(world.player.coordinates).length() <= HEARING_DISTANCE) {
            nextState = new PlayerNearlyState(world.player.coordinates);
        } else {
            nextState = new PlayerWasVisibleState(this.playerWas);
        }

        nextState.doMove(self, world);
        return nextState;
    }

    doMove(self: Self, world: GameWorld): void {
        moveToPoint(this.playerWas, self, world);
    }

    clone(): PlayerVisibleState<Self> {
        return new PlayerVisibleState(this.playerWas);
    }
}

class PlayerNearlyState<Self extends Movable> implements BaseState<Self> {

    private playerWas: Coordinates;

    constructor(playerWas: Coordinates) {
        this.playerWas = playerWas;
    }

    onMove(self: Self, world: GameWorld): BehaviourState<Self> {
        let nextState: BaseState<Self>;

        if (world.isPlayerVisibleFrom(self.coordinates)) {
            nextState = new PlayerVisibleState(world.player.coordinates);
        } else if (self.coordinates.vectorTo(world.player.coordinates).length() <= HEARING_DISTANCE) {
            this.playerWas = world.player.coordinates;
            nextState = this;
        } else {
            nextState = new PlayerWasVisibleState(this.playerWas);
        }

        nextState.doMove(self, world);
        return nextState;
    }

    doMove(self: Self, world: GameWorld): void {
        moveToPoint(this.playerWas, self, world);
    }

    clone(): PlayerNearlyState<Self> {
        return new PlayerNearlyState(this.playerWas);
    }
}
