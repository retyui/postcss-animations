# postcss-animations

[![npm](https://img.shields.io/npm/v/postcss-animations.svg)](https://www.npmjs.com/package/postcss-animations)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-animations.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-animations)
[![Travis](https://img.shields.io/travis/retyui/postcss-animations.svg?label=unix)](https://travis-ci.org/retyui/postcss-animations)
[![David](https://img.shields.io/david/retyui/postcss-animations.svg)](https://david-dm.org/retyui/postcss-animations)

PostCSS plugin that adds `@keyframes` from:
- [animate.css](https://daneden.github.io/animate.css/) - [postcss-animation.css-data](https://github.com/retyui/postcss-animation.css-data);
- [magic.css](https://minimamente.com/example/magic_animations/) - [postcss-magic.css-data](https://github.com/retyui/postcss-magic.css-data);
- [tuesday.css](https://shakrmedia.github.io/tuesday/) - [postcss-tuesday.css-data](https://github.com/retyui/postcss-tuesday.css-data);
- [mimic.css](https://erictreacy.me/mimic.css/) - [postcss-mimic.css-data](https://github.com/retyui/postcss-mimic.css-data).

## Install
```bash
npm install --save-dev postcss-animations

# and the animation data set you need
npm install --save-dev postcss-animation.css-data postcss-magic.css-data
npm install --save-dev postcss-tuesday.css-data postcss-mimic.css-data
```

**Input:**
```css
:root{
    --fade-in-animation-name: tdFadeOut; /* addet css varibles support (Disabled default)*/ }

.tdFadeIn {
    animation-name: tdFadeIn; }

.tdFadeOut{
    animation-name: var(--fade-in-animation-name); /* or css variables */ }
```

**Output:**
```css
:root{
    --fade-in-animation-name: tdFadeOut; }

.tdFadeIn {
    animation-name: tdFadeIn; }

.tdFadeOut{
    animation-name: var(--fade-in-animation-name); }

@keyframes tdFadeIn  { /* ... */ }
@keyframes tdFadeOut { /* ... */ }
```

## Usage
```js
postcss([
    require('postcss-animations')({
        disableCheckCssVariables: false,
        checkDuplications: true,
        data: [
            require("postcss-animation.css-data"),
            require("postcss-magic.css-data"),
            require("postcss-tuesday.css-data"),
            require("postcss-mimic.css-data"),
            { // or custom
                muCustomAnimation: "@keyframes custom-animation-name{0%{opacity:0;}100%{opacity:1;}}",
                muCustomAnimation2: "@keyframes custom-animation-name{0%{opacity:1;}100%{opacity:0;}}"
            }
        ]
    })
]);
```
## Options

### `data`
type : `Array|Object` Keyframe Objects({"animation-name": "css"}),

### `disableCheckCssVariables`
type: `Boolean`,
default: `true`
Disable checking and search variables css (`var(--name)`)

### `checkDuplications`
type: `Boolean`,
default: `true`
Display a warning if find duplicate name of the animation



## [Animista](http://animista.net) support example:
```js
const { css, files } = require('css-parse-keyframes');

postcss([
    require('postcss-animations')({
        data: [
            // your Generated code
            css('@keyframes scale-up-center {0% { transform: scale(0.5); } 100% { transform: scale(1); }}'),
            // or saved
            files('./animista-demo.css'),
            files(['./animista-text.css','./animista-base.css']),
        ]
    })
]);
```
