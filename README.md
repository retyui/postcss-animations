# postcss-animations
[![npm](https://img.shields.io/npm/v/postcss-animations.svg)](https://www.npmjs.com/package/postcss-animations)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-animations.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-animations)
[![Travis](https://img.shields.io/travis/retyui/postcss-animations.svg?label=unix)](https://travis-ci.org/retyui/postcss-animations)
[![David](https://img.shields.io/david/retyui/postcss-animations.svg)](https://david-dm.org/retyui/postcss-animations)

PostCSS plugin that adds `@keyframes` from
- [animate.css](https://daneden.github.io/animate.css/),
- [tuesday.css](https://shakrmedia.github.io/tuesday/),
- [magic.css](https://minimamente.com/example/magic_animations/),
- [mimic.css](https://erictreacy.me/mimic.css/).

## Install
`npm install postcss-animations --save-dev` or  `yarn add postcss-animations --dev`

**Input:**
```css
:root{
  --fade-in-animation-name: tdFadeOut; /* addet css varibles support */
}
.tdFadeIn {
  animation-name: tdFadeIn;
}
/* or css variables */
.tdFadeOut{
  animation-name: var(--fade-in-animation-name);
}
```

**Output:**
```css
:root{
  --fade-in-animation-name: tdFadeOut; /* addet css varibles support */
}
.tdFadeIn {
  animation-name: tdFadeIn;
}
/* or css variables */
.tdFadeOut{
  animation-name: var(--fade-in-animation-name);
}

@keyframes tdFadeIn  { /* ... */ }
@keyframes tdFadeOut { /* ... */ }
```

## Usage
```js
postcss([ require('postcss-magic-animations')(options) ])

// default
postcss([ require('postcss-magic-animations')() ]);

// or custom
postcss([
	require('postcss-magic-animations')({
		disableCheckCssVariables: false,
		defaultData: [ // override default list // https://github.com/retyui/postcss-animations/blob/master/lib/index.js#L16
			require("postcss-animation.css-data"),
			require("postcss-magic.css-data"),
			require("postcss-tuesday.css-data"),
			require("postcss-mimic.css-data")
		],
		custom: {
			muCustomAnimation: "@keyframes custom-animation-name{0%{opacity:0;}100%{opacity:1;}}",
			muCustomAnimation2: "@keyframes custom-animation-name{0%{opacity:1;}100%{opacity:0;}}"
		}
	})
]);
```
## Options

### `defaultData`
type : `Array|Object` Keyframe Objects({"key": "css"}),

By default [we will connect this list](https://github.com/retyui/postcss-animations/blob/master/lib/index.js#L16) of objects:
- [postcss-animation.css-data](https://github.com/retyui/postcss-animation.css-data)
- [postcss-magic.css-data](https://github.com/retyui/postcss-magic.css-data)
- [postcss-mimic.css-data](https://github.com/retyui/postcss-mimic.css-data)
- [postcss-tuesday.css-data](https://github.com/retyui/postcss-tuesday.css-data)

You can override this list!

### `custom`
type : `Array|Object` Keyframe Objects({"key": "css"}),
example object :
```js
{
	"custom-animation-name-in": "@keyframes custom-animation-name-in{0%{opacity:0;}100%{opacity:1;}}",
	"custom-animation-name-out": "@keyframes custom-animation-name-out{0%{opacity:1;}100%{opacity:0;}}"
}
```

### `disableCheckCssVariables`
type: `Boolean`,
default: `false`
Disable checking and search variables css



## [Animista](http://animista.net) support example:
```js
const keyframesParser = require('css-parse-keyframes');

postcss([
	require('postcss-magic-animations')({
		custom: [
			// your Generated code
			keyframesParser.css('@keyframes scale-up-center {0% { transform: scale(0.5); } 100% { transform: scale(1); }}'),
			// or saved
			keyframesParser.files('./animista-demo.css'),
			keyframesParser.files(['./animista-text.css','./animista-base.css']),
		]
	})
]);
```
