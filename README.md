# gatsby-plugin-codegen

Generate TypeScript/Flow definitions from your gatsby queries.

Export schema and apollo config file to give autocomplete feature in vscode through apollographql.vscode-apollo (https://marketplace.visualstudio.com/items?itemName=apollographql.vscode-apollo).

## Install

`npm install --save gatsby-plugin-codegen`

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  // other plugins
  {
    resolve: "gatsby-plugin-codegen",
    options: {}
  }
];
```

## Available options

Please check the documentation of apollo tooling (https://www.npmjs.com/package/apollo) for further explanation. This plugin creates an apollo config file (apolloConfigFile), a file from the gatsby schema (localSchemaFile) and the directory for the generated types (output).

```typescript
export interface PluginCodegenOptions {
  // Name of the generated apollo config file
  apolloConfigFile?: string;

  // apollo:codegen options configured for usage with gatsby, see defaultOptions
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
  localSchemaFile: "./schema.json",
  output: "__generated__",
  target: "typescript",
  tagName: "graphql",
  tsFileExtension: "d.ts",
  includes: [
    "./src/**/*.tsx",
    "./src/**/*.ts",
    "./plugins/**/*.js",
    "./node_modules/gatsby-source-contentful/src/fragments.js",
    "./node_modules/gatsby-source-datocms/fragments/*.js",
    "./node_modules/gatsby-source-sanity/fragments/*.js",
    "./node_modules/gatsby-transformer-sharp/src/fragments.js",
    // "./node_modules/gatsby-*/**/*.js" Performance reasons
  ],
  // True can result in missed error messages through the console
  // Set it the following way to catch the errors during the build and still have watch mode:
  // process.env.NODE_ENV === "development" ? true : false
  watch: false
};
```
 