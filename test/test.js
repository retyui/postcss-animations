import { expect } from "chai";
import postcss from "postcss";
import animationData from "postcss-animation.css-data";
import magicData from "postcss-magic.css-data";
import mimicData from "postcss-mimic.css-data";
import tuesdayData from "postcss-tuesday.css-data";
import postcssAnimations from "../lib/index";

function test(input, output, done, plOpt) {
	const opt = {
		data: [animationData, magicData, mimicData, tuesdayData],
		disableCheckCssVariables: false,
		...plOpt
	};

	postcss(postcssAnimations(opt))
		.process(input)
		.then(({ css }) => {
			expect(css.replace(/[ \n\t]/g, "")).to.eql(
				output.replace(/[ \n\t]/g, "")
			);
			done();
		});
}

describe("postcss-animations", () => {
	describe("dafault options", () => {
		describe("animation-name", () => {
			it("Base example", done => {
				const input = ".tdFadeIn { animation-name: tdFadeIn; }";

				test(
					input,
					`
					.tdFadeIn {
						animation-name:tdFadeIn;
					}
					@keyframes tdFadeIn {
						0%{ opacity: 0; }
						100%{ opacity: 1; }
					}`,
					done
				);
			});

			it("Custom properties (--*)", done => {
				const input = `
					:root {
						--fade-in-animation-name: tdFadeOut;
					}
					.tdFadeOut {
						animation-name: var(--fade-in-animation-name);
					}`;

				test(
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
					}`,
					done
				);
			});
		});

		describe("animation", () => {
			it("Base example", done => {
				const input = `
				.tdFadeIn {
					animation: tdFadeIn 5s infinite;
				}`;

				test(
					input,
					`
					.tdFadeIn {
						animation:tdFadeIn 5s infinite;
					}
					@keyframes tdFadeIn {
						0%{opacity:0;}
						100%{opacity:1;}
					}`,
					done
				);
			});

			it("Custom properties (--*)", done => {
				const input = `
				:root {
					--fade-in-animation: tdFadeOut;
				}
				.tdFadeOut {
					animation: var(--fade-in-animation) 5s infinite;
				}`;

				test(
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
					}`,
					done
				);
			});
		});
	});

	describe("animation libs", () => {
		it("animation.css", done => {
			const input = `
			.jackInTheBox {
				animation-name: jackInTheBox;
			}`;

			test(
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
				}`,
				done
			);
		});

		it("magic.css", done => {
			const input = `
			:root {
				--fade-in-animation-name: bombLeftOut;
			}
			.bombLeftOut{
				animation-name: var(--fade-in-animation-name);
			}`;

			test(
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
				}`,
				done
			);
		});
		it("tuesday", done => {
			const input = `
			:root {
				--fade-in-animation-name: tdHingeFlipIn;
			}
			.tdHingeFlipIn{
				animation-name: var(--fade-in-animation-name);
			}`;

			test(
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
				}`,
				done
			);
		});

		it("mimic", done => {
			const input = `
			:root {
				--fade-in-animation-name: lawnMower;
			}
			.lawnMower{
				animation-name: var(--fade-in-animation-name);
			}`;

			test(
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
				}`,
				done
			);
		});
	});

	describe("Options", () => {
		it("disableCheckCssVariables: true", done => {
			const input = `
			:root {
				--fade-in-animation-name: bombLeftOut;
			}
			.bombLeftOut {
				animation-name: var(--fade-in-animation-name);
			}`;
			test(input, input, done, { disableCheckCssVariables: true });
		});

		it("disableCheckCssVariables: false", done => {
			const input = `
			:root {
				--fade-in-animation-name: bombLeftOut;
			}
			.bombLeftOut {
				animation-name: var(--fade-in-animation-name);
			}`;
			test(
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
				done,
				{ disableCheckCssVariables: false }
			);
		});

		it("custom: [{},{},...]", done => {
			const input = `:root{ animation-name: customAnim2; }`;
			test(
				input,
				`
				:root {
					animation-name: customAnim2;
				}
				@keyframes customAnim2 {
					0%{opacity:0;}
					100%{opacity:1;}
				}`,
				done,
				{
					data: [
						{
							customAnim: `@keyframes customAnim{
								0%{opacity:1;}
								100%{opacity:0;}
							}`
						},
						{
							customAnim2: `@keyframes customAnim2{
								0%{opacity:0;}
								100%{opacity:1;}
							}`
						}
					]
				}
			);
		});

		it("custom: [{},{},...]", done => {
			const input = `:root{ animation-name: customAnim; }`;
			test(
				input,
				`
				:root {
					animation-name: customAnim;
				}
				@keyframes customAnim {
					0%{opacity:1;}
					100%{opacity:0;}
				}`,
				done,
				{
					data: [
						{
							customAnim: `@keyframes customAnim{
								0%{opacity:1;}
								100%{opacity:0;}
							}`
						},
						{
							customAnim: `@keyframes customAnim2{
								0%{opacity:0;}
								100%{opacity:1;}
							}`
						}
					]
				}
			);
		});

		it("custom: {}", done => {
			const input = `
			:root {
				animation-name: custom-animation-name-out;
			}`;
			test(
				input,
				`
				:root {
					animation-name: custom-animation-name-out;
				}
				@keyframes custom-animation-name-out {
					0%{opacity:1;}
					100%{opacity:0;}
				}`,
				done,
				{
					data: {
						"custom-animation-name-in": `@keyframes custom-animation-name-in{
							0%{opacity:0;}
							100%{opacity:1;}
						}`,
						"custom-animation-name-out": `@keyframes custom-animation-name-out{
							0%{opacity:1;}
							100%{opacity:0;}
						}`
					}
				}
			);
		});
	});
});
