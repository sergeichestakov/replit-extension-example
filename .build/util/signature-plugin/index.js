const { SignatureReflection, ReflectionKind, ReflectionType } = require("typedoc");
exports.load = function(app) {
  app.serializer.addSerializer({
    supports(x) {
      return x instanceof SignatureReflection;
    },
    priority: 0,
    toObject(signature, obj) {
      const parts = [signature.name];
      if (signature.kind === ReflectionKind.ConstructorSignature) {
        if (signature.flags.isAbstract)
          parts.push("abstract ");
        parts.push("new ");
      }
      if (signature.typeParameters) {
        parts.push("<");
        let first2 = true;
        for (const typeParam of signature.typeParameters) {
          if (!first2)
            parts.push(", ");
          parts.push(typeParam.name);
          if (typeParam.type) {
            parts.push(" extends ", typeParam.type.toString());
          }
          if (typeParam.default) {
            parts.push(" = ", typeParam.default.toString());
          }
          first2 = false;
        }
        parts.push(">");
      }
      parts.push("(");
      let first = true;
      for (const param of signature.parameters || []) {
        if (!first)
          parts.push(", ");
        parts.push(param.name, ": ", param.type.toString());
        first = false;
      }
      parts.push("): ");
      parts.push(signature.type.toString());
      obj.stringifiedSignature = parts.join("");
      return obj;
    }
  });
  app.serializer.addSerializer({
    supports(x) {
      return x instanceof ReflectionType;
    },
    priority: 1,
    toObject: (x, obj) => {
      let oldStringify = x.stringify;
      x.stringify = () => {
        if (!x.declaration.children) {
          if (oldStringify.call(x) === "Object") {
            return "{}";
          }
          return oldStringify.call(x);
        }
        return `{ ${x.declaration.children.map((ch) => `${ch.name}: ${ch.type.stringify()}`).join(", ")} }`;
      };
      return obj;
    }
  });
  app.serializer.addSerializer({
    supports(x) {
      return x.kind === ReflectionKind.Interface;
    },
    priority: 0,
    toObject: (x, obj) => {
      obj.stringifiedInterface = `interface ${x.name} {
${x.children.map((c) => `    ${c.name}: ${c.type.toString()},`).join("\n")}
}`;
      return obj;
    }
  });
};
//# sourceMappingURL=index.js.map
