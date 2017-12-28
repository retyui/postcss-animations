import SearcherAnimations from "./SearcherAnimations";
import valueParser from "postcss-value-parser";
import { concatMap } from "./helps";
import { plugin } from "postcss";
import { PLUGIN_NAME } from "./info.js";

const ignoredWords = [
	"infinite",
	"alternate",
	"alternate-reverse",
	"backwards",
	"both",
	"ease",
	"ease-in",
	"ease-in-out",
	"ease-out",
	"forwards",
	"linear",
	"none",
	"normal",
	"paused",
	"reverse",
	"running",
	"step-end",
	"step-start"
];

export default plugin(
	PLUGIN_NAME,
	({ data, disableCheckCssVariables = true, checkDuplications = true }) => {
		if (!data || Array.isArray(data) && data.length === 0) {
			return console.log(
				`[${PLUGIN_NAME}] Error: Options data for the css animations can not be empty!`
			);
		}

		const proxyAllCssVar = new SearcherAnimations(
			concatMap({
				data,
				checkDuplications
			}),
			!disableCheckCssVariables
		);

		return root => {
			proxyAllCssVar.clearCache();

			root.walkDecls("animation-name", decl => {
				proxyAllCssVar.appendKeyframes(root, decl.value);
			});

			root.walkDecls("animation", decl => {
				valueParser(decl.value)
					.nodes.filter(el => {
						if (
							!disableCheckCssVariables &&
							el.type === "function" &&
							el.value === "var"
						) {
							return true;
						}
						if (el.type === "word") {
							const checkVal = parseFloat(el.value);
							if (checkVal !== checkVal) {
								return ignoredWords.indexOf(el.value) === -1;
							}
						}
						return false;
					})
					.forEach(e => {
						proxyAllCssVar.appendKeyframes(
							root,
							e.type === "function"
								? valueParser.stringify(e)
								: e.value
						);
					});
			});
		};
	}
);
