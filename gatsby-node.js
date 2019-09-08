"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_1 = require("apollo");
var fs_1 = require("fs");
var lodash_mergewith_1 = __importDefault(require("lodash.mergewith"));
var path = __importStar(require("path"));
var _a = require("gatsby/graphql"), introspectionQuery = _a.introspectionQuery, graphql = _a.graphql;
var defaultOptions = {
    apolloConfigFile: "apollo.config.js",
    addTypename: false,
    excludes: [],
    localSchemaFile: "schema.json",
    output: "__generated__",
    target: "typescript",
    tagName: "graphql",
    tsFileExtension: "d.ts",
    includes: [
        "./src/**/*.tsx",
        "./src/**/*.ts",
        "./node_modules/gatsby-source-contentful/src/*.js",
        "./node_modules/gatsby-transformer-sharp/src/*.js",
        "./node_modules/gatsby-image/src/*.js"
        // "./node_modules/gatsby-source-contentful/**/*.js"
        // "./node_modules/gatsby-*/**/*.js"
    ],
    watch: process.env.NODE_ENV === "production" ? false : true
};
/**
 * Maps options to apollo codegen flags
 * @param options to map for apollo codegen
 */
function mapCodegenAdditionalFlags(options) {
    var params = [];
    for (var _i = 0, _a = Object.entries(options); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (typeof value === "boolean") {
            value && params.push("--" + key);
        }
        else {
            params.push("--" + key + "=" + value);
        }
    }
    return params;
}
/**
 * Merge Array includes/exludes with additional provided paths
 */
function mergeArraysCustomizer(objValue, srcValue) {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
}
/**
 * Gatsby Plugin API to create schema, apollo config and generated types
 */
exports.onPostBootstrap = function (_a, userOptions, callback) {
    var store = _a.store, actions = _a.actions, reporter = _a.reporter;
    return __awaiter(void 0, void 0, void 0, function () {
        var options, addTypename, apolloConfigFile, excludes, includes, localSchemaFile, output, tagName, target, plugins, additionalParams, schema, res, schemaFile;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    options = lodash_mergewith_1.default(defaultOptions, userOptions, mergeArraysCustomizer);
                    addTypename = options.addTypename, apolloConfigFile = options.apolloConfigFile, excludes = options.excludes, includes = options.includes, localSchemaFile = options.localSchemaFile, output = options.output, tagName = options.tagName, target = options.target, plugins = options.plugins, additionalParams = __rest(options, ["addTypename", "apolloConfigFile", "excludes", "includes", "localSchemaFile", "output", "tagName", "target", "plugins"]);
                    schema = store.getState().schema;
                    return [4 /*yield*/, graphql(schema, introspectionQuery)];
                case 1:
                    res = _b.sent();
                    schemaFile = path.resolve(process.cwd(), localSchemaFile);
                    fs_1.writeFile(schemaFile, JSON.stringify(res, null, 2), "utf8", function (err) { return __awaiter(void 0, void 0, void 0, function () {
                        var apolloConfig;
                        return __generator(this, function (_a) {
                            if (err) {
                                reporter.error("[gatsby-plugin-codegen] could not save localSchemaFile: " + localSchemaFile);
                                callback && callback(err);
                            }
                            reporter.success("[gatsby-plugin-codegen] saved localSchemaFile: " + localSchemaFile);
                            apolloConfig = path.resolve(process.cwd(), apolloConfigFile);
                            fs_1.writeFile(apolloConfig, "module.exports = {\n  client: {\n    addTypename: " + addTypename + ",\n    excludes: " + JSON.stringify(excludes) + ",\n    includes: " + JSON.stringify(includes) + ",\n    service: {\n      name: \"gatsbySchema\",\n      localSchemaFile: \"./" + localSchemaFile + "\"\n    },\n    tagName: \"" + tagName + "\"\n  }\n}", "utf8", function (err) { return __awaiter(void 0, void 0, void 0, function () {
                                var apolloCodegenParams, _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (err) {
                                                reporter.error("[gatsby-plugin-codegen] could not save apollo config file: " + apolloConfigFile);
                                                callback && callback(err);
                                            }
                                            reporter.success("[gatsby-plugin-codegen] saved apollo config: " + apolloConfigFile);
                                            apolloCodegenParams = __spreadArrays([
                                                "client:codegen",
                                                "--config=./" + apolloConfigFile
                                            ], mapCodegenAdditionalFlags(additionalParams), [
                                                "--target=" + target,
                                                output
                                            ]);
                                            if (!options.watch) return [3 /*break*/, 1];
                                            _a = apollo_1.run(apolloCodegenParams);
                                            return [3 /*break*/, 3];
                                        case 1: return [4 /*yield*/, apollo_1.run(apolloCodegenParams)];
                                        case 2:
                                            _a = _b.sent();
                                            _b.label = 3;
                                        case 3:
                                            _a;
                                            reporter.success("generated types");
                                            // Return Plugin
                                            callback && callback(null);
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            return [2 /*return*/];
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
};
