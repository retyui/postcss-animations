module.exports = {
	root: true,
	parser: "babel-eslint",
	plugins: ["prettier"],
	extends: ["eslint:recommended", "plugin:prettier/recommended"],
	env: {
		node: true,
		es6: true,
		jest: true
	},
	parserOptions: {
		ecmaVersion: 2017
	},
	rules: {
		"no-console": "off"
	}
};
