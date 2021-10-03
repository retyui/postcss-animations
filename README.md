# postcss-animations

[![npm](https://img.shields.io/npm/v/postcss-animations.svg)](https://www.npmjs.com/package/postcss-animations)
[![CI](https://github.com/retyui/postcss-animations/actions/workflows/nodejs.yml/badge.svg)](https://github.com/retyui/postcss-animations/actions/workflows/nodejs.yml)

PostCSS plugin that adds `@keyframes` from:

- [![npm postcss-animation.css-data](https://img.shields.io/npm/dm/postcss-animation.css-data.svg)](https://www.npmjs.com/package/postcss-animation.css-data) [postcss-animation.css-data](https://github.com/retyui/postcss-animation.css-data)
- [![npm postcss-magic.css-data](https://img.shields.io/npm/dm/postcss-magic.css-data.svg)](https://www.npmjs.com/package/postcss-magic.css-data) [postcss-magic.css-data](https://github.com/retyui/postcss-magic.css-data)
- [![npm postcss-mimic.css-data](https://img.shields.io/npm/dm/postcss-mimic.css-data.svg)](https://www.npmjs.com/package/postcss-mimic.css-data) [postcss-mimic.css-data](https://github.com/retyui/postcss-mimic.css-data)
- [![npm postcss-tuesday.css-data](https://img.shields.io/npm/dm/postcss-tuesday.css-data.svg)](https://www.npmjs.com/package/postcss-tuesday.css-data) [postcss-tuesday.css-data](https://github.com/retyui/postcss-tuesday.css-data)

### Install

```bash
yarn add -D postcss-animations

# and the animation data set you need
yarn add -D postcss-animation.css-data postcss-magic.css-data postcss-mimic.css-data postcss-tuesday.css-data
```

**Input:**

```css
:root {
  --fade-in-animation-name: tdFadeOut; /* add css variables support (Disabled default) */
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
  /* will be added if 'disableCheckCssVariables: false' */
  /* ... */
}
```

### Usage

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
      require("postcss-tuesday.css-data"),
    ],
    checkDuplications: true,
    disableCheckCssVariables: true,
  }),
];

(async () => {
  try {
    const { css, messages } = await postcss(PLUGINS).process(CSS, { from, to });
    messages
      .filter(({ type }) => type === "warning")
      .map((msg) => console.log(msg.toString()));
    console.log(css);
    fs.writeFileSync(to, css);
  } catch (e) {
    console.error(e);
  }
})();
```

### Options

#### `data: Array<{[animationName: string]: string}> | {[animationName: string]: string}`

`data` is a simple object where:

- `key`: animation name
- `value`: css code of animation

```js
// Plain object
const data = {
  myAnimationName: `@keyframes myAnimationName { 0%{opacity:1;} 100%{opacity:0;} }`,
};

// or Array
const data = [
  {
    myAnimationName: `@keyframes myAnimationName { 0%{opacity:1;} 100%{opacity:0;} }`,
  },
  require("postcss-animation.css-data"),
];
```

#### `disableCheckCssVariables: boolean`

Disable checking and search variables css `var(--name)` (default: `true`)

#### `checkDuplications: boolean`

Display a warning if find duplicate name of the animation (default: `true`)

---

### [Animista](http://animista.net) support example:

```js
const {
  css: parseFromCss,
  files: parseFromFile,
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
      parseFromFile(["./animista-text.css", "./animista-base.css"]),
    ],
  }),
]);
```
