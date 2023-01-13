import { Event } from "src/types";
/**
 * Reads the file specified at `path` and returns an object containing the contents, or an object containing an error if there was one
 */
export declare function emitEvent(event: Omit<Event, 'source'>): Promise<void>;
/**
 * Reads the file specified at `path` and returns an object containing the contents, or an object containing an error if there was one
 */
export declare function onWorkspaceEvent(listener: (event: Event) => void): Promise<() => void>;
