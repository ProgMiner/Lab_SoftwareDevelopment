import { RandomWorldBuilder } from './RandomWorldBuilder';
import { FileWorldBuilder } from './FileWorldBuilder';


/**
 * World builder
 *
 * Provides methods to build various types of worlds
 */
export interface WorldBuilder {

    fromFile(): FileWorldBuilder;

    random(): RandomWorldBuilder;
}
