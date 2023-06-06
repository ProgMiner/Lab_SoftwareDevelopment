import { BaseWorldBuilder } from './BaseWorldBuilder';


/**
 * File world builder
 *
 * Provides methods for building world from file
 */
export interface FileWorldBuilder extends BaseWorldBuilder {

    /**
     * Set filename to load from
     *
     * Discards content if set
     *
     * @param filename name of file to load world
     *
     * @return this
     */
    filename(filename: string): this;

    /**
     * Set content of file to load
     *
     * Discards filename if set
     *
     * @param content content of file with world
     *
     * @return this
     */
    content(content: string): this;
}
