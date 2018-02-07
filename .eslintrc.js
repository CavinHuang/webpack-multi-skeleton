module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaFeatures": {
			"jsx": true
		},
		"sourceType": "module"
	},
	"rules": {
		'no-console': 'off',
		"indent": [
            "error",
            "tab"
        ],
		"linebreak-style": [
            "off",
            "windows"
        ],
		"quotes": [
            "error",
            "single"
        ],
		"semi": [
            "error",
            "never"
        ]
	}
};