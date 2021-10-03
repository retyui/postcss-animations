import { PluginCreator } from "postcss";

/**
 * Example: {
 *  "slideOutUp": "@keyframes slideOutUp{...}}",
 *  "slideOutRight": "@keyframes slideOutRight{...}}",
 *  ...
 * }
 */
type PluginData = Record<string, string>;

interface PluginOptions {
  data: PluginData[] | PluginData;
  checkDuplications?: boolean;
  disableCheckCssVariables?: boolean;
}

declare const postcssAnimations: PluginCreator<PluginOptions>;

export = postcssAnimations;
