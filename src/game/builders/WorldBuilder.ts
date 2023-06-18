import { RandomWorldBuilder } from './RandomWorldBuilder';
import { FileWorldBuilder } from './FileWorldBuilder';


/**
 * World builder
 *
 * Provides methods to build various types of worlds
 */
export interface WorldBuilder {

    /**
     * Build world from file
     *
     * @return file world builder
     */
    fromFile(): FileWorldBuilder;

    /**
     * Build world randomly
     *
     * @return random world builder
     */
    random(): RandomWorldBuilder;
}
