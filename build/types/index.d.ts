import { extensionPort } from "./util/comlink";
export * from "./api";
export * from "./jets";
export * from "./util/log";
export { extensionPort };
export * from './types';
export declare function init({ permissions, timeout, debug, }: {
    permissions?: string[];
    timeout?: number;
    debug?: boolean;
}): Promise<() => void>;
