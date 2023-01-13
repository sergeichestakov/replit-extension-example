import { LayoutData, Pane } from "src/types";
/**
 * Returns whether a certain pane type is visible within the layout.
 * Example use case: check if the version control pane is visible
 * before doing something.
 */
export declare function isPaneTypeVisible(paneType: string): Promise<boolean>;
/**
 * Returns information about a pane by its type. If multiple panes of a type are open, this returns the first.
 */
export declare function findPaneByType(paneType: string): Promise<{
    paneId: string;
    isHidden: boolean;
    isDialog: boolean;
    type: "tile" | "floating";
    data: any;
}>;
/**
 * Makes a pane the active one within its group
 */
export declare function selectTab(paneId: string): Promise<void>;
/**
 * Inserts a floating pane into the layout if it doesn't exist
 */
export declare function insertFloatingPaneIfNotExist(pane: Pane): Promise<void>;
/**
 * Removes all floating pane of a given type
 */
export declare function removeFloatingPanesByType(paneType: string): Promise<void>;
/**
 * Gets the entire layout tree, with pane data
 */
export declare function getLayoutState(): Promise<LayoutData>;
/**
 * Sets the layout tree and pane data
 */
export declare function setLayoutState(state: LayoutData): Promise<void>;
