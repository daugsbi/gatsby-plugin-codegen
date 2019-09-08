import { run } from "apollo";
import { writeFile } from "fs";
import { NodePluginArgs, PluginCallback } from "gatsby";
import merge from "lodash.mergewith";
import * as path from "path";
const { introspectionQuery, graphql } = require("gatsby/graphql");

export interface PluginCodegenOptions {
  // Name of the generated apollo config file
  apolloConfigFile?: string;

  // apollo:codegen options configured for usage with gatsby
  addTypename?: boolean;
  excludes?: string[];
  includes?: string[];
  localSchemaFile?: string;
  output?: string;
  tsFileExtension?: string;
  watch?: boolean;
  tagName?: string;
  target?: "typescript" | "swift" | "flow" | "scala";

  // apollo:codegen additional options
  globalTypesFile?: string;
  mergeInFieldsFromFragmentSpreads?: boolean;
  namespace?: string;
  outputFlat?: boolean;
  passthroughCustomScalars?: boolean;
  useFlowExactObjects?: boolean;
  useReadOnlyTypes?: boolean;

  // Gatsby specific, not used in this plugin
  plugins?: unknown[];
}

const defaultOptions = {
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
    "./node_modules/gatsby-*/**/*.js"
  ],
  watch: process.env.NODE_ENV === "production" ? false : true
};

/**
 * Maps options to apollo codegen flags
 * @param options to map for apollo codegen
 */
function mapCodegenAdditionalFlags(
  options: Partial<PluginCodegenOptions>
): string[] {
  let params: string[] = [];
  for (let [key, value] of Object.entries(options)) {
    if (typeof value === "boolean") {
      value && params.push(`--${key}`);
    } else {
      params.push(`--${key}=${value}`);
    }
  }
  return params;
}

/**
 * Merge Array includes/exludes with additional provided paths
 */
function mergeArraysCustomizer(objValue: any, srcValue: any) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/**
 * Gatsby Plugin API to create schema, apollo config and generated types
 */
export const onPostBootstrap: (
  args: NodePluginArgs,
  options: PluginCodegenOptions,
  callback?: PluginCallback
) => void = async ({ store, actions, reporter }, userOptions, callback) => {
  // Merge defaultOptions with provided options
  const options = merge(defaultOptions, userOptions, mergeArraysCustomizer);
  const {
    addTypename,
    apolloConfigFile,
    excludes,
    includes,
    localSchemaFile,
    output,
    tagName,
    target,
    plugins,
    ...additionalParams
  } = options;

  // Resolve gatsby's schema and write it to localSchemaFile
  const { schema } = store.getState();
  const res = await graphql(schema, introspectionQuery);

  const schemaFile = path.resolve(process.cwd(), localSchemaFile);
  writeFile(schemaFile, JSON.stringify(res, null, 2), "utf8", async err => {
    if (err) {
      reporter.error(
        `[gatsby-plugin-codegen] could not save localSchemaFile: ${localSchemaFile}`
      );
      callback && callback(err);
    }
    reporter.success(
      `[gatsby-plugin-codegen] saved localSchemaFile: ${localSchemaFile}`,
      {}
    );

    // Write apollo config
    const apolloConfig = path.resolve(process.cwd(), apolloConfigFile);
    writeFile(
      apolloConfig,
      `module.exports = {
  client: {
    addTypename: ${addTypename},
    excludes: ${JSON.stringify(excludes)},
    includes: ${JSON.stringify(includes)},
    service: {
      name: "gatsbySchema",
      localSchemaFile: "./${localSchemaFile}"
    },
    tagName: "${tagName}"
  }
}`,
      "utf8",
      async err => {
        if (err) {
          reporter.error(
            `[gatsby-plugin-codegen] could not save apollo config file: ${apolloConfigFile}`
          );
          callback && callback(err);
        }
        reporter.success(
          `[gatsby-plugin-codegen] saved apollo config: ${apolloConfigFile}`
        );

        // Generate typings for specified target
        const apolloCodegenParams = [
          "client:codegen",
          `--config=./${apolloConfigFile}`,
          ...mapCodegenAdditionalFlags(additionalParams),
          `--target=${target}`,
          output
        ];
        options.watch
          ? run(apolloCodegenParams)
          : await run(apolloCodegenParams);
        reporter.success(`generated types`);

        // Return Plugin
        callback && callback(null);
      }
    );
  });
};
