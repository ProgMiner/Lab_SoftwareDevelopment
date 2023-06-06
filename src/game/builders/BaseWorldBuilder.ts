import { EventBus } from '../../core/events/EventBus';
import { GameWorld } from '../GameWorld';


/**
 * World generator's interface
 */
export interface BaseWorldBuilder {

    /**
     * Set event bus for building world
     *
     * @param eventBus event bus
     *
     * @return this
     */
    eventBus(eventBus: EventBus): this;

    /**
     * Build world
     *
     * @return promise of built world
     */
    build(): Promise<GameWorld>;
}
