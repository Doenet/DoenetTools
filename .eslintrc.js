module.exports = {
	"env": {
		"browser": true,
		"es2020": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended",
		"prettier"
	],
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 11,
		"sourceType": "module"
	},
	"plugins": [
		"react",
		"prettier"
	],
	"rules": {
		"linebreak-style": [
			"error",
			"unix",
		],
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
};
