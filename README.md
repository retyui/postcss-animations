# postcss-animations

[![npm](https://img.shields.io/npm/v/postcss-animations.svg)](https://www.npmjs.com/package/postcss-animations)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-animations.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-animations)
[![Travis](https://img.shields.io/travis/retyui/postcss-animations.svg?label=unix)](https://travis-ci.org/retyui/postcss-animations)

PostCSS plugin that adds `@keyframes` from:

* [![npm postcss-animation.css-data](https://img.shields.io/npm/dm/postcss-animation.css-data.svg)](https://www.npmjs.com/package/postcss-animation.css-data) [postcss-animation.css-data](https://github.com/retyui/postcss-animation.css-data)
* [![npm postcss-magic.css-data](https://img.shields.io/npm/dm/postcss-magic.css-data.svg)](https://www.npmjs.com/package/postcss-magic.css-data) [postcss-magic.css-data](https://github.com/retyui/postcss-magic.css-data)
* [![npm postcss-mimic.css-data](https://img.shields.io/npm/dm/postcss-mimic.css-data.svg)](https://www.npmjs.com/package/postcss-mimic.css-data) [postcss-mimic.css-data](https://github.com/retyui/postcss-mimic.css-data)
* [![npm postcss-tuesday.css-data](https://img.shields.io/npm/dm/postcss-tuesday.css-data.svg)](https://www.npmjs.com/package/postcss-tuesday.css-data) [postcss-tuesday.css-data](https://github.com/retyui/postcss-tuesday.css-data)

## Install

```bash
yarn add -D postcss-animations

# and the animation data set you need
yarn add -D postcss-animation.css-data
yarn add -D postcss-magic.css-data
yarn add -D postcss-mimic.css-data
yarn add -D postcss-tuesday.css-data
```

**Input:**

```css
:root {
  --fade-in-animation-name: tdFadeOut; /* addet css varibles support (Disabled default)*/
}

.tdFadeIn {
  animation-name: tdFadeIn;
}

.tdFadeOut {
  animation-name: var(--fade-in-animation-name); /* or css variables */
}
```

**Output:**

```css
:root {
  --fade-in-animation-name: tdFadeOut;
}

.tdFadeIn {
  animation-name: tdFadeIn;
}

.tdFadeOut {
  animation-name: var(--fade-in-animation-name);
}

@keyframes tdFadeIn {
  /* ... */
}
@keyframes tdFadeOut {
  /* added if 'disableCheckCssVariables: false' */
  /* ... */
}
```

## Usage

```js
const fs = require("fs");
const postcss = require("postcss");
const postcssAnimations = require("postcss-animations");

const [from, to] = ["./src/style.css", "./dist/style.css"];
const CSS = fs.readFileSync(from);
const PLUGINS = [
  postcssAnimations({
    data: [
      require("postcss-animation.css-data"),
      require("postcss-magic.css-data"),
      require("postcss-mimic.css-data"),
      require("postcss-tuesday.css-data")
    ],
    checkDuplications: true,
    disableCheckCssVariables: true
  })
];

(async () => {
  try {
    const { css, messages } = await postcss(PLUGINS).process(CSS, { from, to });
    messages
      .filter(({ type }) => type === "warning")
      .map(msg => console.log(msg.toString()));
    console.log(css);
    fs.writeFileSync(to, css);
  } catch (e) {
    console.error(e);
  }
})();
```

## Options

### `data`

type : `Array|Object`CssKeyframe Set {"animation-name": "css"},

### `disableCheckCssVariables`

type: `Boolean`,
default: `true`

Disable checking and search variables css `var(--name)`

### `checkDuplications`

type: `Boolean`,
default: `true`

Display a warning if find duplicate name of the animation

## [Animista](http://animista.net) support example:

```js
const {
  css: parseFromCss,
  files: parseFromFile
} = require("css-parse-keyframes");

postcss([
  require("postcss-animations")({
    data: [
      // your Generated code
      parseFromCss(
        "@keyframes scale-up-center {0% { transform: scale(0.5); } 100% { transform: scale(1); }}"
      ),
      // or saved
      parseFromFile("./animista-demo.css"),
      parseFromFile(["./animista-text.css", "./animista-base.css"])
    ]
  })
]);
```
