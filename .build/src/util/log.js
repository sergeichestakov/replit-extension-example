var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
__export(exports, {
  debug: () => debug,
  setDebugMode: () => setDebugMode
});
let debugMode = false;
function debug(msg) {
  if (!debugMode) {
    return;
  }
  console.log(msg);
}
function setDebugMode(mode) {
  debugMode = mode;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  debug,
  setDebugMode
});
//# sourceMappingURL=log.js.map
