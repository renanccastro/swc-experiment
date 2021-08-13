"use strict";

const Visitor = Npm.require("@swc/core/Visitor").default;
const assert = Npm.require("assert");
let namespace;
let ibsPropertyName = "isBlockScoped";
let types;
let cache;

function tryScopedLibDirect() {
    namespace = Npm.require("@babel/types/lib/validators/isBlockScoped");

    // If the above import succeeded, then we should replace the .default
    // property of the isBlockScoped module, instead of .isBlockScoped.
    ibsPropertyName = "default";

    types = types || Npm.require("@babel/types");
    cache = cache || Npm.require("@babel/traverse").default.cache;
}

function tryScoped() {
    namespace = Npm.require("@babel/types");
    types = types || Npm.require("@babel/types");
    cache = cache || Npm.require("@babel/traverse").default.cache;
}

function tryScopedLib() {
    namespace = Npm.require("@babel/types/lib/validators");
    types = types || Npm.require("@babel/types");
    cache = cache || Npm.require("@babel/traverse").default.cache;
}

function tryUnscoped() {
    namespace = Npm.require("babel-types/lib/validators");
    types = types || Npm.require("babel-types");
    cache = cache || Npm.require("babel-traverse").default.cache;
}

[tryScopedLibDirect,
    tryScoped,
    tryScopedLib,
    tryUnscoped
].some(function (fn) {
    try {
        fn();
    } catch (e) {
        return false;
    }

    const wrapped = namespace[ibsPropertyName];
    assert.strictEqual(typeof wrapped, "function")

    // Allow types.isBlockScoped to return true for import-related nodes.
    const wrapper = namespace[ibsPropertyName] = function (node) {
        return node &&
            types.isImportDeclaration(node) ||
            wrapped.apply(this, arguments);
    };

    // The wrapping can fail if namespace[ibsPropertyName] is a non-writable
    // property (such as a getter function).
    if (namespace[ibsPropertyName] !== wrapper) {
        throw new Error(
            "Unable to patch @babel/types isBlockScoped function"
        );
    }

    return true;
});

class ReifyPlugin extends Visitor {
    constructor() {
        super();
        this.compiler = Npm.require("reify/lib/compiler.js");
        this.transformOptions = {
            parse: Npm.require("reify/lib/parsers/babel.js").parse
        };

        let madeChanges = false;

        this.transform = function (node) {
            const result = this.compiler.transform(node, this.transformOptions);
            if (!result.identical) {
                madeChanges = true;
                // If the Reify compiler made any changes, invalidate all existing
                // Scope objects, so that any variable binding changes made by
                // compiler.transform will be reflected accurately.
                cache.clearScope();
            }
            return result;
        }
        return this;
    }

    visitProgram(node) {
        console.log("before");
        console.log(node);
        Object.assign(this.transformOptions, this.opts);
        this.transformOptions.finalCompilationPass = true;
        const ast = this.transform(node);
        console.log("After");
        console.log(ast.ast.body);
        return ast.ast
    }
}
module.exports = {
    ReifyPlugin
}
