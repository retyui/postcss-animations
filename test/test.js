const { expect } = require("chai");
const postcss = require("postcss");
const animationData = require("postcss-animation.css-data");
const magicData = require("postcss-magic.css-data");
const mimicData = require("postcss-mimic.css-data");
const tuesdayData = require("postcss-tuesday.css-data");
const postcssAnimations = require("../lib/index");

function clearWhiteSpaces(css) {
  return css.replace(/[ \n\t]/g, "");
}

function test(input, output, plOpt) {
  const options = {
    data: [animationData, magicData, mimicData, tuesdayData],
    disableCheckCssVariables: false,
    checkDuplications: false,
    ...plOpt,
  };
  const plugins = [postcssAnimations(options)];

  return postcss(plugins)
    .process(input, { from: "test.css" })
    .then(({ css }) =>
      expect(clearWhiteSpaces(css)).to.eql(clearWhiteSpaces(output))
    );
}

describe("postcss-animations", () => {
  describe("default options", () => {
    describe("animation-name", () => {
      it("Base example", async () => {
        const input = ".tdFadeIn { animation-name: tdFadeIn; }";

        await test(
          input,
          `
					.tdFadeIn {
						animation-name:tdFadeIn;
					}
					@keyframes tdFadeIn {
						0%{ opacity: 0; }
						100%{ opacity: 1; }
					}`
        );
      });

      it("Duplicate example", async () => {
        const input =
          ".tdFadeIn { animation-name: tdFadeIn; }" +
          ".tdFadeIn2 { animation-name: tdFadeIn; }";

        await test(
          input,
          `
					.tdFadeIn {
						animation-name:tdFadeIn;
					}
					.tdFadeIn2 {
						animation-name:tdFadeIn;
					}
					@keyframes tdFadeIn {
						0%{ opacity: 0; }
						100%{ opacity: 1; }
					}`
        );
      });

      it("Custom properties (--*)", async () => {
        const input = `
					:root {
						--fade-in-animation-name: tdFadeOut;
					}
					.tdFadeOut {
						animation-name: var(--fade-in-animation-name);
					}`;

        await test(
          input,
          `
					:root{
						--fade-in-animation-name: tdFadeOut;
					}
					.tdFadeOut {
						animation-name: var(--fade-in-animation-name);
					}
					@keyframes tdFadeOut {
						0%{opacity:1;}
						100%{opacity:0;}
					}`
        );
      });

      it("Duplicate custom properties (--*)", async () => {
        const input = `
					:root {
						--fade-in-animation-name: tdFadeOut;
					}
					.tdFadeOut {
						animation-name: var(--fade-in-animation-name);
					}
					.tdFadeOut2 {
						animation-name: var(--fade-in-animation-name);
					}
					.tdFadeOut3 {
						animation-name: tdFadeOut;
					}`;

        await test(
          input,
          `
					:root{
						--fade-in-animation-name: tdFadeOut;
					}
					.tdFadeOut {
						animation-name: var(--fade-in-animation-name);
					}
					.tdFadeOut2 {
						animation-name: var(--fade-in-animation-name);
					}
					.tdFadeOut3 {
						animation-name: tdFadeOut;
					}
					@keyframes tdFadeOut {
						0%{opacity:1;}
						100%{opacity:0;}
					}`
        );
      });
    });

    describe("animation", () => {
      it("Base example", async () => {
        const input = `
				.tdFadeIn {
					animation: tdFadeIn 5s infinite;
				}`;

        await test(
          input,
          `
					.tdFadeIn {
						animation:tdFadeIn 5s infinite;
					}
					@keyframes tdFadeIn {
						0%{opacity:0;}
						100%{opacity:1;}
					}`
        );
      });

      it("Custom properties (--*)", async () => {
        const input = `
				:root {
					--fade-in-animation: tdFadeOut;
				}
				.tdFadeOut {
					animation: var(--fade-in-animation) 5s infinite;
				}`;

        await test(
          input,
          `
					:root {
						--fade-in-animation: tdFadeOut;
					}
					.tdFadeOut {
						animation: var(--fade-in-animation) 5s infinite;
					}
					@keyframes tdFadeOut {
						0%{opacity:1;}
						100%{opacity:0;}
					}`
        );
      });
    });
  });

  describe("animation libs", () => {
    it("animation.css", async () => {
      const input = `
			.jackInTheBox {
				animation-name: jackInTheBox;
			}`;

      await test(
        input,
        `
				.jackInTheBox {
					animation-name: jackInTheBox;
				}
				@keyframes jackInTheBox {
					from{opacity:0;transform:scale(0.1)rotate(30deg);transform-origin:centerbottom;}
					50%{transform:rotate(-10deg);}
					70%{transform:rotate(3deg);}
					to{opacity:1;transform:scale(1);}
				}`
      );
    });

    it("magic.css", async () => {
      const input = `
			:root {
				--fade-in-animation-name: bombLeftOut;
			}
			.bombLeftOut{
				animation-name: var(--fade-in-animation-name);
			}`;

      await test(
        input,
        `
				:root {
					--fade-in-animation-name: bombLeftOut;
				}
				.bombLeftOut {
					animation-name: var(--fade-in-animation-name);
				}
				@keyframes bombLeftOut {
					0%{opacity:1;transform-origin:50%50%;transform:rotate(0deg);filter:blur(0px);}
					50%{opacity:1;transform-origin:-100%50%;transform:rotate(-160deg);filter:blur(0px);}
					100%{opacity:0;transform-origin:-100%50%;transform:rotate(-160deg);filter:blur(20px);}
				}`
      );
    });
    it("tuesday", async () => {
      const input = `
			:root {
				--fade-in-animation-name: tdHingeFlipIn;
			}
			.tdHingeFlipIn{
				animation-name: var(--fade-in-animation-name);
			}`;

      await test(
        input,
        `
				:root {
					--fade-in-animation-name: tdHingeFlipIn;
				}
				.tdHingeFlipIn{
					animation-name: var(--fade-in-animation-name);
				}
				@keyframes tdHingeFlipIn{
					0%{opacity:0;transform:perspective(600px)rotateX(0deg);transform-origin:centertop;animation-timing-function:cubic-bezier(0,0.59,0.375,1);}
					50%{transform:perspective(600px)rotateX(-10deg);transform-origin:centertop;animation-timing-function:ease-in;}
					100%{opacity:1;transform:perspective(600px)rotateX(0deg);transform-origin:centertop;animation-timing-function:ease-out;}
				}`
      );
    });

    it("mimic", async () => {
      const input = `
			:root {
				--fade-in-animation-name: lawnMower;
			}
			.lawnMower{
				animation-name: var(--fade-in-animation-name);
			}`;

      await test(
        input,
        `
				:root {
					--fade-in-animation-name: lawnMower;
				}
				.lawnMower{
					animation-name: var(--fade-in-animation-name);
				}
				@keyframes lawnMower{
					0%{opacity:1;}
					to{opacity:1;transform:translate3d(0, 0, 0) rotateY(12225deg);}
				}`
      );
    });
  });

  describe("Options", () => {
    it("disableCheckCssVariables: true", async () => {
      const input = `
			:root {
				--fade-in-animation-name: bombLeftOut;
			}
			.bombLeftOut {
				animation-name: var(--fade-in-animation-name);
			}`;
      await test(input, input, { disableCheckCssVariables: true });
    });

    it("disableCheckCssVariables: false", async () => {
      const input = `
			:root {
				--fade-in-animation-name: bombLeftOut;
			}
			.bombLeftOut {
				animation-name: var(--fade-in-animation-name);
			}`;
      await test(
        input,
        `
				:root {
					--fade-in-animation-name: bombLeftOut;
				}
				.bombLeftOut {
					animation-name: var(--fade-in-animation-name);
				}
				@keyframes bombLeftOut{
					0%{opacity:1;transform-origin:50%50%;transform:rotate(0deg);filter:blur(0px);}
					50%{opacity:1;transform-origin:-100%50%;transform:rotate(-160deg);filter:blur(0px);}
					100%{opacity:0;transform-origin:-100%50%;transform:rotate(-160deg);filter:blur(20px);}
				}`,
        { disableCheckCssVariables: false }
      );
    });

    it("custom: [{},{},...]", async () => {
      const input = `:root{ animation-name: customAnim2; }`;
      await test(
        input,
        `
				:root {
					animation-name: customAnim2;
				}
				@keyframes customAnim2 {
					0%{opacity:0;}
					100%{opacity:1;}
				}`,
        {
          data: [
            {
              customAnim: `@keyframes customAnim{
								0%{opacity:1;}
								100%{opacity:0;}
							}`,
            },
            {
              customAnim2: `@keyframes customAnim2{
								0%{opacity:0;}
								100%{opacity:1;}
							}`,
            },
          ],
        }
      );
    });

    it("custom: {}", async () => {
      const input = `
			:root {
				animation-name: custom-animation-name-out;
			}`;
      await test(
        input,
        `
				:root {
					animation-name: custom-animation-name-out;
				}
				@keyframes custom-animation-name-out {
					0%{opacity:1;}
					100%{opacity:0;}
				}`,
        {
          data: {
            "custom-animation-name-in": `@keyframes custom-animation-name-in{
							0%{opacity:0;}
							100%{opacity:1;}
						}`,
            "custom-animation-name-out": `@keyframes custom-animation-name-out{
							0%{opacity:1;}
							100%{opacity:0;}
						}`,
          },
        }
      );
    });
  });
});
