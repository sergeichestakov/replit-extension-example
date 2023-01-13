import { extensionPort, proxy } from "src/util/comlink";
import { Event } from "src/types";

/**
 * Reads the file specified at `path` and returns an object containing the contents, or an object containing an error if there was one
 */
export async function emitEvent(event: Omit<Event, 'source'>) {
  return extensionPort.emitEvent(event);
}

/**
 * Reads the file specified at `path` and returns an object containing the contents, or an object containing an error if there was one
 */
export async function onWorkspaceEvent(listener: (event: Event) => void) {
  return extensionPort.onWorkspaceEvent(proxy(listener));
}