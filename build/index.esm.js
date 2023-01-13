var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/util/log.ts
var debugMode = false;
function debug(msg) {
  if (!debugMode) {
    return;
  }
  console.log(msg);
}
function setDebugMode(mode) {
  debugMode = mode;
}

// node_modules/comlink/dist/esm/comlink.mjs
var proxyMarker = Symbol("Comlink.proxy");
var createEndpoint = Symbol("Comlink.endpoint");
var releaseProxy = Symbol("Comlink.releaseProxy");
var throwMarker = Symbol("Comlink.thrown");
var isObject = (val) => typeof val === "object" && val !== null || typeof val === "function";
var proxyTransferHandler = {
  canHandle: (val) => isObject(val) && val[proxyMarker],
  serialize(obj) {
    const { port1, port2 } = new MessageChannel();
    expose(obj, port1);
    return [port2, [port2]];
  },
  deserialize(port) {
    port.start();
    return wrap(port);
  }
};
var throwTransferHandler = {
  canHandle: (value) => isObject(value) && throwMarker in value,
  serialize({ value }) {
    let serialized;
    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      };
    } else {
      serialized = { isError: false, value };
    }
    return [serialized, []];
  },
  deserialize(serialized) {
    if (serialized.isError) {
      throw Object.assign(new Error(serialized.value.message), serialized.value);
    }
    throw serialized.value;
  }
};
var transferHandlers = /* @__PURE__ */ new Map([
  ["proxy", proxyTransferHandler],
  ["throw", throwTransferHandler]
]);
function expose(obj, ep = self) {
  ep.addEventListener("message", function callback(ev) {
    if (!ev || !ev.data) {
      return;
    }
    const { id, type, path } = Object.assign({ path: [] }, ev.data);
    const argumentList = (ev.data.argumentList || []).map(fromWireValue);
    let returnValue;
    try {
      const parent = path.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
      const rawValue = path.reduce((obj2, prop) => obj2[prop], obj);
      switch (type) {
        case "GET":
          {
            returnValue = rawValue;
          }
          break;
        case "SET":
          {
            parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
            returnValue = true;
          }
          break;
        case "APPLY":
          {
            returnValue = rawValue.apply(parent, argumentList);
          }
          break;
        case "CONSTRUCT":
          {
            const value = new rawValue(...argumentList);
            returnValue = proxy(value);
          }
          break;
        case "ENDPOINT":
          {
            const { port1, port2 } = new MessageChannel();
            expose(obj, port2);
            returnValue = transfer(port1, [port1]);
          }
          break;
        case "RELEASE":
          {
            returnValue = void 0;
          }
          break;
        default:
          return;
      }
    } catch (value) {
      returnValue = { value, [throwMarker]: 0 };
    }
    Promise.resolve(returnValue).catch((value) => {
      return { value, [throwMarker]: 0 };
    }).then((returnValue2) => {
      const [wireValue, transferables] = toWireValue(returnValue2);
      ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
      if (type === "RELEASE") {
        ep.removeEventListener("message", callback);
        closeEndPoint(ep);
      }
    });
  });
  if (ep.start) {
    ep.start();
  }
}
function isMessagePort(endpoint) {
  return endpoint.constructor.name === "MessagePort";
}
function closeEndPoint(endpoint) {
  if (isMessagePort(endpoint))
    endpoint.close();
}
function wrap(ep, target) {
  return createProxy(ep, [], target);
}
function throwIfProxyReleased(isReleased) {
  if (isReleased) {
    throw new Error("Proxy has been released and is not useable");
  }
}
function createProxy(ep, path = [], target = function() {
}) {
  let isProxyReleased = false;
  const proxy3 = new Proxy(target, {
    get(_target, prop) {
      throwIfProxyReleased(isProxyReleased);
      if (prop === releaseProxy) {
        return () => {
          return requestResponseMessage(ep, {
            type: "RELEASE",
            path: path.map((p) => p.toString())
          }).then(() => {
            closeEndPoint(ep);
            isProxyReleased = true;
          });
        };
      }
      if (prop === "then") {
        if (path.length === 0) {
          return { then: () => proxy3 };
        }
        const r = requestResponseMessage(ep, {
          type: "GET",
          path: path.map((p) => p.toString())
        }).then(fromWireValue);
        return r.then.bind(r);
      }
      return createProxy(ep, [...path, prop]);
    },
    set(_target, prop, rawValue) {
      throwIfProxyReleased(isProxyReleased);
      const [value, transferables] = toWireValue(rawValue);
      return requestResponseMessage(ep, {
        type: "SET",
        path: [...path, prop].map((p) => p.toString()),
        value
      }, transferables).then(fromWireValue);
    },
    apply(_target, _thisArg, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const last = path[path.length - 1];
      if (last === createEndpoint) {
        return requestResponseMessage(ep, {
          type: "ENDPOINT"
        }).then(fromWireValue);
      }
      if (last === "bind") {
        return createProxy(ep, path.slice(0, -1));
      }
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: "APPLY",
        path: path.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    },
    construct(_target, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: "CONSTRUCT",
        path: path.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    }
  });
  return proxy3;
}
function myFlat(arr) {
  return Array.prototype.concat.apply([], arr);
}
function processArguments(argumentList) {
  const processed = argumentList.map(toWireValue);
  return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
}
var transferCache = /* @__PURE__ */ new WeakMap();
function transfer(obj, transfers) {
  transferCache.set(obj, transfers);
  return obj;
}
function proxy(obj) {
  return Object.assign(obj, { [proxyMarker]: true });
}
function windowEndpoint(w, context = self, targetOrigin = "*") {
  return {
    postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
    addEventListener: context.addEventListener.bind(context),
    removeEventListener: context.removeEventListener.bind(context)
  };
}
function toWireValue(value) {
  for (const [name, handler] of transferHandlers) {
    if (handler.canHandle(value)) {
      const [serializedValue, transferables] = handler.serialize(value);
      return [
        {
          type: "HANDLER",
          name,
          value: serializedValue
        },
        transferables
      ];
    }
  }
  return [
    {
      type: "RAW",
      value
    },
    transferCache.get(value) || []
  ];
}
function fromWireValue(value) {
  switch (value.type) {
    case "HANDLER":
      return transferHandlers.get(value.name).deserialize(value.value);
    case "RAW":
      return value.value;
  }
}
function requestResponseMessage(ep, msg, transfers) {
  return new Promise((resolve) => {
    const id = generateUUID();
    ep.addEventListener("message", function l(ev) {
      if (!ev.data || !ev.data.id || ev.data.id !== id) {
        return;
      }
      ep.removeEventListener("message", l);
      resolve(ev.data);
    });
    if (ep.start) {
      ep.start();
    }
    ep.postMessage(Object.assign({ id }, msg), transfers);
  });
}
function generateUUID() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
}

// src/util/comlink.ts
var extensionPort = wrap(
  windowEndpoint(self.parent, self, "*")
);
var proxy2 = proxy;

// src/api/fs.ts
var fs_exports = {};
__export(fs_exports, {
  copyFile: () => copyFile,
  createDir: () => createDir,
  deleteDir: () => deleteDir,
  deleteFile: () => deleteFile,
  move: () => move,
  readDir: () => readDir,
  readFile: () => readFile,
  watchFile: () => watchFile,
  watchTextFile: () => watchTextFile,
  writeFile: () => writeFile
});
async function readFile(path) {
  return extensionPort.readFile(path);
}
async function writeFile(path, content) {
  return extensionPort.writeFile(path, content);
}
async function readDir(path) {
  return extensionPort.readDir(path);
}
async function createDir(path) {
  return extensionPort.createDir(path);
}
async function deleteFile(path) {
  return extensionPort.deleteFile(path);
}
async function deleteDir(path) {
  return extensionPort.deleteDir(path);
}
async function move(path, to) {
  return extensionPort.move(path, to);
}
async function copyFile(path, to) {
  return extensionPort.copyFile(path, to);
}
async function watchFile(path, watchers) {
  return extensionPort.watchFile(path, proxy2({
    onChange: () => {
    },
    onMoveOrDelete: () => {
    },
    onError: () => {
    },
    ...watchers
  }));
}
async function watchTextFile(path, watchers) {
  return extensionPort.watchTextFile(path, proxy2({
    onReady: () => {
    },
    onChange: () => {
    },
    onMoveOrDelete: () => {
    },
    onError: () => {
    },
    ...watchers
  }));
}

// src/api/layout.ts
var layout_exports = {};
__export(layout_exports, {
  findPaneByType: () => findPaneByType,
  getLayoutState: () => getLayoutState,
  insertFloatingPaneIfNotExist: () => insertFloatingPaneIfNotExist,
  isPaneTypeVisible: () => isPaneTypeVisible,
  removeFloatingPanesByType: () => removeFloatingPanesByType,
  selectTab: () => selectTab,
  setLayoutState: () => setLayoutState
});
async function isPaneTypeVisible(paneType) {
  return extensionPort.isPaneTypeVisible(paneType);
}
async function findPaneByType(paneType) {
  return extensionPort.findPaneByType(paneType);
}
async function selectTab(paneId) {
  return extensionPort.selectTab(paneId);
}
async function insertFloatingPaneIfNotExist(pane) {
  return extensionPort.insertFloatingPaneIfNotExist(pane);
}
async function removeFloatingPanesByType(paneType) {
  return extensionPort.removeFloatingPanesByType(paneType);
}
async function getLayoutState() {
  return extensionPort.getLayoutState();
}
async function setLayoutState(state) {
  return extensionPort.setLayoutState(state);
}

// src/api/events.ts
var events_exports = {};
__export(events_exports, {
  emitEvent: () => emitEvent,
  onWorkspaceEvent: () => onWorkspaceEvent
});
async function emitEvent(event) {
  return extensionPort.emitEvent(event);
}
async function onWorkspaceEvent(listener) {
  return extensionPort.onWorkspaceEvent(proxy2(listener));
}

// src/api/replDb.ts
var replDb_exports = {};
__export(replDb_exports, {
  del: () => del,
  get: () => get,
  list: () => list,
  set: () => set
});
async function set(args) {
  return extensionPort.setReplDbValue(args.key, args.value);
}
async function get(args) {
  return extensionPort.getReplDbValue(args.key);
}
async function list(args) {
  return extensionPort.listReplDbKeys(args.prefix);
}
async function del(args) {
  return extensionPort.deleteReplDbKey(args.key);
}

// src/jets/graphql.ts
var graphql_exports = {};
__export(graphql_exports, {
  mutateGraphql: () => mutateGraphql,
  queryGraphql: () => queryGraphql
});
var queryWarned = false;
async function queryGraphql({ query, variables }) {
  if (!queryWarned) {
    console.warn("@replit/extensions: queryGraphql() will be deprecated very soon");
    queryWarned = true;
  }
  return extensionPort.queryGraphql({ query, variables });
}
var mutateWarned = false;
async function mutateGraphql({ mutation, variables }) {
  if (!mutateWarned) {
    console.warn("@replit/extensions: mutateGraphql() will be deprecated very soon");
    mutateWarned = true;
  }
  return extensionPort.mutateGraphql({ mutation, variables });
}

// src/jets/eval.ts
var warned = false;
async function evalCode({ code }) {
  if (!warned) {
    console.warn("@replit/extensions: evalCode() will be deprecated very soon");
    warned = true;
  }
  return await extensionPort.eval(code);
}

// src/types/index.ts
var FileType = /* @__PURE__ */ ((FileType2) => {
  FileType2["File"] = "FILE";
  FileType2["Directory"] = "DIRECTORY";
  return FileType2;
})(FileType || {});

// src/index.ts
async function init({
  permissions = [],
  timeout = 1e3,
  debug: debug2 = false
}) {
  setDebugMode(debug2);
  try {
    await extensionPort.handshake({ permissions });
  } catch (e) {
    console.error(e);
    throw e;
  }
  return () => {
  };
}
export {
  FileType,
  copyFile,
  createDir,
  debug,
  deleteDir,
  deleteFile,
  evalCode,
  events_exports as events,
  extensionPort,
  fs_exports as fs,
  graphql_exports as graphql,
  init,
  layout_exports as layout,
  move,
  readDir,
  readFile,
  replDb_exports as replDb,
  setDebugMode,
  watchFile,
  watchTextFile,
  writeFile
};
//# sourceMappingURL=index.esm.js.map
