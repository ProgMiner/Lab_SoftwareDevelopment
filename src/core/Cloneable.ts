

/**
 * Interface of objects that could be cloned
 */
export interface Cloneable {

    /**
     * Make clone of object
     *
     * @return clone
     */
    clone(): Cloneable;
}
