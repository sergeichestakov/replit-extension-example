/**
 * Sets the value for a given key
 */
export declare function set(args: {
    key: string;
    value: any;
}): Promise<void>;
/**
 * Returns a value associated with the given key
 */
export declare function get(args: {
    key: string;
}): Promise<string>;
/**
 * Lists keys in the replDb. Accepts an optional `prefix`, which filters for keys beginning with the given prefix.
 */
export declare function list(args: {
    prefix: string;
}): Promise<{
    keys: string[];
} | {
    error: string;
}>;
/**
 * Deletes a key in the replDb.
 */
export declare function del(args: {
    key: string;
}): Promise<void>;
