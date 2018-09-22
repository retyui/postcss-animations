const scanKey = `__isScannedPostCssAnimations__${Math.random()}`;

export default class SearcherAnimations {
	constructor(keyframes, checkCssVariables) {
		this._allCssVars = {};
		this._keyframes = keyframes;
		this._checkCssVariables = checkCssVariables;

		this.clearCache();
	}

	static isCssVariable(v) {
		return v.match(/var\(--.+\)/) !== null;
	}

	add = decl => {
		const key = decl.prop;
		const val = decl.value;

		if (this._allCssVars[key] === undefined) {
			this._allCssVars[key] = [val];
		} else if (this._allCssVars[key].indexOf(val) === -1) {
			this._allCssVars[key].push(val);
		}
	};

	get(key) {
		return this._allCssVars[key];
	}

	clearCache() {
		this._hasKeyframes = new Set();
	}

	_alreadyAdded(key) {
		return this._hasKeyframes.has(key);
	}

	_addCache(val) {
		return this._hasKeyframes.add(val);
	}

	appendKeyFrames(root, value) {
		const isAnimationAdded = this._alreadyAdded(value);
		if (!this._keyframes.has(value) || isAnimationAdded) {
			return;
		}

		if (!isAnimationAdded) {
			this._addCache(value);
			root.append(this._keyframes.get(value));
		}
	}

	oneScanCSS(css) {
		if (!css[scanKey]) {
			css.walkRules(rule => {
				rule.walkDecls(/^--/, this.add);
			});
		}
		css[scanKey] = true;
	}

	appendKeyframes(css, value) {
		if (this._checkCssVariables && SearcherAnimations.isCssVariable(value)) {
			let matchCssVars = value.match(/(--[^\s,)]*)/g); // https://regex101.com/r/6qszCQ/2

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
			this.appendKeyFrames(css, value);
		}
	}
}
