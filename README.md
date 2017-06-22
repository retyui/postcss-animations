# postcss-animations [![npm version](https://badge.fury.io/js/postcss-animations.svg)](https://badge.fury.io/js/postcss-animations) [![Build Status](https://travis-ci.org/retyui/postcss-animations.svg?branch=master)](https://travis-ci.org/retyui/postcss-animations) [![dependencies Status](https://david-dm.org/retyui/postcss-animations/status.svg)](https://david-dm.org/retyui/postcss-animations)
PostCSS plugin that adds `@keyframes` from 

- [animate.css](https://daneden.github.io/animate.css/), 
- [tuesday.css](https://shakrmedia.github.io/tuesday/),
- [magic.css](https://minimamente.com/example/magic_animations/).

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
```javascript
postcss([ require('postcss-magic-animations')(options) ])

//default
postcss([ require('postcss-magic-animations')() ]);

// or custom
postcss([require('postcss-magic-animations')({
	disableCheckCssVariables: false,
	default: [ // override default list // https://github.com/retyui/postcss-animations/blob/master/lib/index.js#L16
		require("postcss-animation.css-data"),
		require("postcss-magic.css-data"),
		require("postcss-tuesday.css-data")
	],
	custom: {
		muCustomAnimation: "@keyframes custom-animation-name{0%{opacity:0;}100%{opacity:1;}}",
		muCustomAnimation2: "@keyframes custom-animation-name{0%{opacity:1;}100%{opacity:0;}}"
	}
})]);
```
## Options

### `defaultData`
type : `Array|Object` Keyframe Objects({"key": "css"}), 

By default [we will connect this list](https://github.com/retyui/postcss-animations/blob/master/lib/index.js#L16) of objects:
- [postcss-animation.css-data](https://github.com/retyui/postcss-animation.css-data)
- [postcss-magic.css-data](https://github.com/retyui/postcss-magic.css-data)
- [postcss-tuesday.css-data](https://github.com/retyui/postcss-tuesday.css-data)
You can override this list!

### `custom`
type : `Array|Object` Keyframe Objects({"key": "css"}), 
example object :  
```javascript
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
```javascript
const kfParser = require('css-parse-keyframes');

postcss([require('postcss-magic-animations')({
	custom: [
		// your Generated code
		kfParser.css('@keyframes scale-up-center {0% { transform: scale(0.5); } 100% { transform: scale(1); }}'), 
		// or saved 
		kfParser.files('./animista-demo.css'),                      
		kfParser.files(['./animista-text.css','./animista-base.css']),
	]
})]);
```

[![NPM](https://nodei.co/npm-dl/postcss-animations.png?height=3)](https://nodei.co/npm/postcss-animations/)
