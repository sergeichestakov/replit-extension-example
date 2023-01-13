import { WatchFileWatchers, WatchTextFileWatchers } from "src/types";
/**
 * Reads the file specified at `path` and returns an object containing the contents, or an object containing an error if there was one
 */
export declare function readFile(path: string): Promise<{
    content: string;
} | {
    error: string;
}>;
/**
 * Writes the file specified at `path` with the contents `content`
 */
export declare function writeFile(path: string, content: string | Blob): Promise<{
    success: boolean;
} | {
    error: string;
}>;
/**
 * Reads the directory specified at `path` and returns an object containing the contents, or an object containing an error if there was one
 */
export declare function readDir(path: string): Promise<{
    children: {
        filename: string;
        type: "FILE" | "DIRECTORY";
    }[];
    error: string;
}>;
/**
 * Creates a directory at the specified path
 */
export declare function createDir(path: string): Promise<{} | {
    error: string;
}>;
/**
 * Deletes the file at the specified path
 */
export declare function deleteFile(path: string): Promise<{} | {
    error: string;
}>;
/**
 * Deletes the directory at the specified path
 */
export declare function deleteDir(path: string): Promise<{} | {
    error: string;
}>;
/**
 * Moves the file or directory at `from` to `to`
 */
export declare function move(path: string, to: string): Promise<{
    error: string;
}>;
/**
 * Copies the file at `from` to `to`
 */
export declare function copyFile(path: string, to: string): Promise<{
    error: string;
}>;
/**
 * Watches the file at `path` for changes with the provided `watchers`. Returns a dispose method which cleans up the watchers
 */
export declare function watchFile(path: string, watchers: WatchFileWatchers): Promise<() => void>;
/**
 * Watches a text file at `path` for changes with the provided `watchers`. Returns a dispose method which cleans up the watchers.
 *
 * Use this for watching text files, and receive changes as versioned operational transform (OT) operations annotated with their source.
 */
export declare function watchTextFile(path: string, watchers: WatchTextFileWatchers): Promise<() => void>;
