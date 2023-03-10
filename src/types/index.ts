export type Pane = {
  type: string;
  id: string;
};

/**
 * Enumeration of file types.
 */
export enum FileType {
  /**
   * A regular file.
   */
  File = "FILE",
  /**
   * A directory/folder
   */
  Directory = "DIRECTORY",
}

/**
 * A base interface for nodes, just includes
 * the type of the node and the path, This interface
 * does not expose the node's content/children
 */
export interface FsNode {
  /**
   * Full path of the node relative to the root
   */
  path: string;

  /**
   * node is a file
   */
  type: FileType;
}

export interface WatchFileWatchers {
  onChange: (newContent: string) => void;
  onError: (error: string) => void;
  onMoveOrDelete: (args: {
    eventType: "MOVE" | "DELETE";
    node: FsNode;
  }) => void;
}

export interface WatchTextFileWatchers {
  onReady: (readyArgs: { initialContent: string; version: number }) => void;
  onChange: (changeArgs: {
    latestContent: string;
    version: number;
    changeSource: string;
    changes: any; // TODO fix
  }) => void;
  onError: (error: string) => void;
  onMoveOrDelete: (args: {
    eventType: "MOVE" | "DELETE";
    node: FsNode;
  }) => void;
}

/**
 * A unique id for a pane in the layout
 */
export type PaneId = string;

/**
 * A unique id for a pane group in the layout
 */
export type PaneGroupId = string;

/**
 * Represents the Repl's layout and pane data in a serializable manner
 */
export interface LayoutData {
  layout: {
    floating: Array<FloatingPaneGroup>
    tiling: any;
  },
  data: Record<string, any>,
  sidebarPercent: number;
}

/**
 * The size in pixles within the layout
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * The position in pixles within the layout
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Size and position in pixles within the layout
 */
export interface Rect extends Point, Size { }

/**
 * A floating group of panes
 */
export interface FloatingPaneGroup {
  id: string;
  type: 'floatingPaneGroup';
  panes: Array<PaneId>;
  activeIndex: number;
  rect: Rect;
}

type Source = 'workspace' | 'extension';

export type Event = {
  type: 'string';
  source: Source;
  data?: any;
}

export type ExtensionPortAPI = {
  // misc
  handshake: (args: { permissions: Array<string> }) => void;
  // fs
  readFile: (path: string) => Promise<{ content: string } | { error: string }>;
  writeFile: (
    path: string,
    content: string | Blob
  ) => Promise<{ success: boolean } | { error: string }>;
  readDir: (path: string) => Promise<{
    children: Array<{ filename: string; type: "FILE" | "DIRECTORY" }>;
    error: string;
  }>;
  createDir: (path: string) => Promise<{} | { error: string }>;
  deleteFile: (path: string) => Promise<{} | { error: string }>;
  deleteDir: (path: string) => Promise<{} | { error: string }>;
  move: (path: string, to: string) => Promise<{ error: string | null }>;
  copyFile: (path: string, to: string) => Promise<{ error: string | null }>;
  watchFile: (path: string, watcher: WatchFileWatchers) => () => void;
  watchTextFile: (path: string, watcher: WatchTextFileWatchers) => () => void;

  // replDb
  setReplDbValue: (key: string, value: string) => Promise<void>;
  getReplDbValue: (key: string) => Promise<string | null>;
  listReplDbKeys: (
    prefix: string
  ) => Promise<{ keys: string[] } | { error: string }>;
  deleteReplDbKey: (key: string) => Promise<void>;

  // layout
  isPaneTypeVisible: (paneType: string) => Promise<boolean>;
  findPaneByType: (paneType: string) => Promise<{
    paneId: string;
    isHidden: boolean;
    isDialog: boolean;
    type: "tile" | "floating";
    data: any;
  } | null>;
  selectTab: (paneId: string) => Promise<void>;
  insertFloatingPaneIfNotExist(pane: Pane): Promise<void>;
  removeFloatingPanesByType(paneType: string): Promise<void>;
  getLayoutState(): Promise<LayoutData>;
  setLayoutState(state: LayoutData): Promise<void>;

  // Events

  emitEvent(event: Omit<Event, 'source'>): void;
  onWorkspaceEvent(listener: (event: Event) => void): Promise<() => void>;

  // jets (will be deprecated)

  // graphql
  queryGraphql(args: { query: string, variables?: Record<string, any> }): any;
  mutateGraphql(args: { mutation: string, variables?: Record<string, any> }): any;

  // eval
  eval(code: string): any;
};
