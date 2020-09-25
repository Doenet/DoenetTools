module.exports = {
	"env": {
		"browser": true,
		"es2020": true,
		"node": true
	},
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"ecmaVersion": 11,
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"linebreak-style": [
			"error",
			"unix"
		],

	},
	"settings": {
		"react": {
			"version": "detect"
		}
	}
};
