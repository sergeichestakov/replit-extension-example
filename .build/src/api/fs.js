var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
var import_comlink = __toModule(require("src/util/comlink"));
async function readFile(path) {
  return import_comlink.extensionPort.readFile(path);
}
async function writeFile(path, content) {
  return import_comlink.extensionPort.writeFile(path, content);
}
async function readDir(path) {
  return import_comlink.extensionPort.readDir(path);
}
async function createDir(path) {
  return import_comlink.extensionPort.createDir(path);
}
async function deleteFile(path) {
  return import_comlink.extensionPort.deleteFile(path);
}
async function deleteDir(path) {
  return import_comlink.extensionPort.deleteDir(path);
}
async function move(path, to) {
  return import_comlink.extensionPort.move(path, to);
}
async function copyFile(path, to) {
  return import_comlink.extensionPort.copyFile(path, to);
}
async function watchFile(path, watchers) {
  return import_comlink.extensionPort.watchFile(path, (0, import_comlink.proxy)(__spreadValues({
    onChange: () => {
    },
    onMoveOrDelete: () => {
    },
    onError: () => {
    }
  }, watchers)));
}
async function watchTextFile(path, watchers) {
  return import_comlink.extensionPort.watchTextFile(path, (0, import_comlink.proxy)(__spreadValues({
    onReady: () => {
    },
    onChange: () => {
    },
    onMoveOrDelete: () => {
    },
    onError: () => {
    }
  }, watchers)));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  copyFile,
  createDir,
  deleteDir,
  deleteFile,
  move,
  readDir,
  readFile,
  watchFile,
  watchTextFile,
  writeFile
});
//# sourceMappingURL=fs.js.map
