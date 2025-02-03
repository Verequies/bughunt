import { createApp } from "vue";
import App from "./App.vue";
import "@/worker?sharedworker";

// SW Active State
let sw_active: boolean = false;

if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		navigator.serviceWorker.register(
			import.meta.env.MODE == "production" ? "/serviceworker.js" : "/serviceworker.ts",
			{ type: "module" , scope: "/"}

		).then(() => {

			navigator.serviceWorker.controller?.postMessage({
				type: "IS_ACTIVE"
			});

			// Initialise service worker active state
			sw_active = false;

			setInterval(() => {
				if (!sw_active)
					window.location.reload();
			}, 100);

		}, function (err) {
			console.log("Service worker failed registration: ", err);
		});

		// Listens for messages sent from the service worker
		navigator.serviceWorker.addEventListener("message", event => {
			const data = event.data as string;

			if (data == "SW_ACTIVE") {
				// Update service worker active state
				sw_active = true;

				// Initialise worker to keep service worker alive
				let worker: Worker | SharedWorker;
				let worker_timeout: NodeJS.Timeout;
				let shared_worker = false;
				const worker_onmessage = function(ev: MessageEvent) {
					if (ev.data == "SW_PING" ) {
						clearTimeout(worker_timeout);
						worker_timeout = setInterval(() => {
							clearTimeout(worker_timeout);
							if (shared_worker)
								setupSharedWorker();
							else
								setupWorker();
						}, 1000);
					}
				};

				// Setup function for shared workers
				const setupWorker = () => {
					worker = new Worker(
						import.meta.env.MODE == "production" ? "worker.js" : "worker.ts",
						{ "name": "Keep Alive", "type": "module" }
					);
					worker.onmessage = worker_onmessage;
				};

				// Setup function for shared workers
				const setupSharedWorker = () => {
					shared_worker = true;
					worker = new SharedWorker(
						import.meta.env.MODE == "production" ? "worker.js?shared" : "worker.ts?shared",
						{ "name": "Keep Alive", "type": "module" }
					);
					worker.port.start();
					worker.port.onmessage = worker_onmessage;
				};

				// Start shared worker if browser supports it
				if (window.SharedWorker)
					setupSharedWorker();
				// Fallback to web workers
				else
					setupWorker();

                // Create app
                createApp(App).mount("#app");
			}
		});
	});
}