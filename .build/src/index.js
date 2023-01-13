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
  extensionPort: () => import_comlink.extensionPort,
  init: () => init
});
var import_talk = __toModule(require("src/util/talk"));
var import_log = __toModule(require("src/util/log"));
var import_comlink = __toModule(require("./util/comlink"));
__reExport(exports, __toModule(require("./api")));
__reExport(exports, __toModule(require("./jets")));
__reExport(exports, __toModule(require("./util/log")));
__reExport(exports, __toModule(require("./types")));
async function init({
  permissions = [],
  timeout = 1e3,
  debug: debug2 = false
}) {
  (0, import_log.setDebugMode)(debug2);
  const disposeMessageListener = (0, import_talk.registerMessageListener)();
  try {
    await (0, import_talk.handshake)({ permissions, timeout });
  } catch (e) {
    console.error(e);
    disposeMessageListener();
    throw e;
  }
  return () => {
    disposeMessageListener();
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  extensionPort,
  init
});
//# sourceMappingURL=index.js.map
