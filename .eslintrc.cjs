module.exports = {
	"root": true,
	"env": {
		"es2022": true,
		"node": true
	},
	"globals": {
		"NodeJS": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:vue/vue3-essential",
		"plugin:vue/vue3-strongly-recommended",
		"plugin:vue/vue3-recommended",
		"@vue/typescript/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"project": "./tsconfig.json",
		"sourceType": "module"
	},
	
	"overrides": [{
		"files": ["*.vue"],
		"parser": "vue-eslint-parser",
		"parserOptions": {
			"parser": "@typescript-eslint/parser",
			"ecmaVersion": "latest",
			"project": "./tsconfig.json",
			"sourceType": "module"
		}
	}],
	"plugins": [
		"@typescript-eslint"
	],
	"rules": {
		"vue/html-indent": [
			"warn",
			"tab"
		],
		"vue/html-closing-bracket-spacing": [
			"warn",
			{ "selfClosingTag": "never" }
		],
		"vue/max-attributes-per-line": [
			"warn",
			{
				"singleline": {
					"max": 6
				}
			}
		],
		"indent": [
			"error",
			"tab",
			{ "SwitchCase": 1 }
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
	}
};
