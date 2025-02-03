import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/babel.config.json", 
        "**/node_modules",
        "**/.*"
    ],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            NodeJS: true,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            "ecmaVersion": "latest",
            "project": "./tsconfig.json",
            "sourceType": "module"
        },
    },

    rules: {
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
                    "max": 6,
                },
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
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
}, {
    "files": ["**/*.vue"],

    "languageOptions": {
        "parser": parser, 

        "parserOptions": {
            "parser": "@typescript-eslint/parser",
            "project": "./tsconfig.json",
            "ecmaVersion": "latest",
            "sourceType": "module",
        },
    },
}];