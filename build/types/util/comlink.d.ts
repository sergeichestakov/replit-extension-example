import * as Comlink from "comlink";
import { ExtensionPortAPI } from "src/types";
export declare const extensionPort: Comlink.Remote<ExtensionPortAPI>;
export declare const proxy: typeof Comlink.proxy;
