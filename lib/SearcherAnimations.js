const scanKey = '__isScanedPostcssAnimations__';
export default class SearcherAnimations {
	constructor(keyframes, checkCssVariables) {
		this.allCssVars = {};
		this.hasKeyframes = {};
		this.keyframes = keyframes;
		this.checkCssVariables = checkCssVariables;
	}

	static isCssVariable(v) {
		return v.match(/var\(--.+\)/) !== null;
	}

	add(decl) {
		const key = decl.prop;
		const val = decl.value;

		if (this.allCssVars[key] === undefined) {
			this.allCssVars[key] = [val];
		} else if (this.allCssVars[key].indexOf(val) === -1) {
			this.allCssVars[key].push(val);
		}
	}

	get(key) {
		return this.allCssVars[key];
	}

	clearCache() {
		this.hasKeyframes = {};
	}

	appendKeyFrames(css, value) {
		if (!this.keyframes[value] || this.hasKeyframes[value]) {
			return;
		}
		// console.log('[postcss-animations]: '+value);
		if (!this.hasKeyframes[value]) {
			this.hasKeyframes[value] = true;
			css.append(this.keyframes[value]);
		}
	}

	oneScanCSS(css) {
		if (!css[scanKey]) {
			css.walkRules(rule => {
				rule.walkDecls(/^--/, this.add.bind(this));
			});
		}
		css[scanKey] = true;
	}

	appendKeyframes(css, value) {
		if (this.checkCssVariables && SearcherAnimations.isCssVariable(value)) {
			let matchCssVars = value.match(/(--[^\s\,\)]*)/g); // https://regex101.com/r/6qszCQ/2

			if (matchCssVars !== null) {
				this.oneScanCSS(css);

				matchCssVars = matchCssVars.map(el => {
					return this.get(el.trim());
				});

				value = matchCssVars.reduce((allValues, el) => {
					if (el) {
						return allValues.concat(el);
					}
					return allValues;
				}, []);
			}
		}

		if (value && Array.isArray(value)) {
			value.forEach(element => {
				this.appendKeyFrames(css, element);
			});
		} else {
			this.appendKeyFrames(css, value)
		}
	}
}
