import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { injectManifest } from "rollup-plugin-workbox";

// https://vitejs.dev/config/
export default defineConfig({
	"build": {
		"rollupOptions": {
			"output": {
				"assetFileNames": ({ name }) => {
					// Separate CSS files
					if (/\.css$/.test(name ?? ""))
						return "css/[name]-[hash][extname]";

					// Put everything else in assets
					return "assets/[name]-[hash][extname]";
				},
				"chunkFileNames": "js/[name]-[hash].js",
				"entryFileNames": "js/[name]-[hash].js"
			}
		}
	},
	"envDir": "../",
	"plugins": [
		injectManifest({
			"swSrc": "src/serviceworker.ts",
			"swDest": "build/public/serviceworker.js",
			"globDirectory": "build/public"
		}),
		vue()
	],
	"resolve": {
		"alias": [
			{
				"find": "@",
				"replacement": resolve(__dirname, "src/")
			}
		]
	},
	"worker": {
		"format": "es",
		"rollupOptions": {
			"output": {
				"entryFileNames": "worker.js",
			}
		}
	}
});
