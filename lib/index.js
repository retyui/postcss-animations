import SearcherAnimations from './SearcherAnimations';
import animationData from 'postcss-animation.css-data';
import { groupKeys } from './helps';
import magicData from 'postcss-magic.css-data';
import postcss from 'postcss';
import tuesdayData from 'postcss-tuesday.css-data';
import valueParser from 'postcss-value-parser';

const ignoredWords = ['infinite', 'alternate', 'alternate-reverse', 'backwards', 'both',
	'ease', 'ease-in', 'ease-in-out', 'ease-out', 'forwards', 'linear', 'none', 'normal',
	'paused', 'reverse', 'running', 'step-end', 'step-start'];

export default postcss.plugin('postcss-animations', options => {
	const keyframes = {};
	const {
		defaultData = [animationData, tuesdayData, magicData],
		custom = {},
		disableCheckCssVariables = false
	} = options || {};

	groupKeys(defaultData, keyframes);
	groupKeys(custom, keyframes);

	const proxyAllCssVar = new SearcherAnimations(keyframes, !disableCheckCssVariables);

	return function (css) {

		proxyAllCssVar.clearCache();

		css.walkDecls('animation-name', decl => {
			proxyAllCssVar.appendKeyframes(css, decl.value);
		});

		css.walkDecls('animation', decl => {
			valueParser(decl.value).nodes.filter(el => {
				if (!disableCheckCssVariables && el.type === 'function' && el.value === 'var') {
					return true;
				}
				if (el.type === 'word') {
					const checkVal = parseFloat(el.value);
					if (checkVal !== checkVal) {
						return ignoredWords.indexOf(el.value) === -1
					}
				}
				return false;
			}).forEach(e => {
				proxyAllCssVar.appendKeyframes(css, e.type === 'function' ? valueParser.stringify(e) : e.value);
			});
		});
	};
});
