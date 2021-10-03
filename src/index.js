import valueParser from "postcss-value-parser";
import SearcherAnimations from "./SearcherAnimations";
import { concatMap } from "./helps";
import { PLUGIN_NAME, ignoredWords } from "./info";

function animationWalker({ decl, disableCheckCssVariables, proxyAllCssVar }) {
  valueParser(decl.value)
    .nodes.filter((el) => {
      if (
        !disableCheckCssVariables &&
        el.type === "function" &&
        el.value === "var"
      ) {
        return true;
      }

      if (el.type === "word") {
        const checkVal = parseFloat(el.value, 10);

        if (checkVal !== checkVal) {
          return ignoredWords.indexOf(el.value) === -1;
        }
      }

      return false;
    })
    .forEach((e) => {
      proxyAllCssVar.appendKeyframes(
        decl.root(),
        e.type === "function" ? valueParser.stringify(e) : e.value
      );
    });
}

/**
 * @typedef {{name: string, lang: string}} PluginData (Example: {"slideOutUp": "@keyframes slideOutUp{...}}", "slideOutRight": "@keyframes slideOutRight{...}}", ...})
 */

/**
 * @param {Array.<PluginData>|PluginData} data
 * @param {boolean|undefined} disableCheckCssVariables - Disable checking and search variables css `var(--name)`
 * @param {boolean|undefined} checkDuplications - Display a warning if find duplicate name of the animation
 */
function createPostcssAnimationsPlugin({
  data,
  disableCheckCssVariables = true,
  checkDuplications = true,
} = {}) {
  if ((Array.isArray(data) && data.length === 0) || !data) {
    return console.log(
      `[${PLUGIN_NAME}] Error: Options data for the css animations can not be empty!`
    );
  }

  const proxyAllCssVar = new SearcherAnimations(
    concatMap({ data, checkDuplications }),
    !disableCheckCssVariables
  );

  proxyAllCssVar.clearCache();

  return {
    postcssPlugin: PLUGIN_NAME,
    Declaration: {
      "animation-name": (decl) => {
        proxyAllCssVar.appendKeyframes(decl.root(), decl.value);
      },
      animation: (decl) => {
        animationWalker({ decl, disableCheckCssVariables, proxyAllCssVar });
      },
    },
  };
}

module.exports = createPostcssAnimationsPlugin;
module.exports.postcss = true;
