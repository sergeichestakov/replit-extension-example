var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
__export(exports, {
  handshake: () => handshake,
  registerMessageListener: () => registerMessageListener,
  request: () => request
});
var import_log = __toModule(require("./log"));
const messageQueue = {};
const messageHandler = (ev) => {
  (0, import_log.debug)("message received", ev);
  const { data } = ev;
  if (!messageQueue[data == null ? void 0 : data.id]) {
    return;
  }
  messageQueue[data.id](data.payload);
  delete messageQueue[data.id];
};
function registerMessageListener() {
  (0, import_log.debug)("registering message handler");
  window.addEventListener("message", messageHandler);
  return () => {
    (0, import_log.debug)("deregistering message handler");
    window.removeEventListener("message", messageHandler);
  };
}
async function handshake({ permissions, timeout }) {
  (0, import_log.debug)("\u{1F91D}");
  const res = await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      (0, import_log.debug)("handshake timed out");
      reject(new Error("timeout"));
    }, timeout);
    return request({ type: "handshake", permissions }).then((res2) => {
      if (res2.error) {
        throw res2.error;
      }
      if (res2.success !== true) {
        throw "handshake not successful";
      }
      (0, import_log.debug)("handshake succeeded");
      clearTimeout(timeoutId);
      resolve(res2);
    }).catch((err) => {
      clearTimeout(timeoutId);
      reject(err);
    });
  });
  return res;
}
async function request(payload) {
  const id = Math.random();
  return new Promise((resolve) => {
    messageQueue[id] = resolve;
    parent.postMessage({
      id,
      payload
    }, "*");
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handshake,
  registerMessageListener,
  request
});
//# sourceMappingURL=talk.js.map
