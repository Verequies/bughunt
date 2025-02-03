/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

//-------------------------- Types ---------------------------
export interface ServiceWorkerData {
	type: "IS_ACTIVE"
	data: string
}


//-------------------------- Set up service worker ---------------------------
declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// This is where files can be pre-cached
self.addEventListener("install", () => { return void self.skipWaiting(); });

// This is where we clean up outdated caches
self.addEventListener("activate", () => { return void self.clients.claim(); });

/**
 * Intercept all fetch requests
 */
self.addEventListener("fetch", event => {
	// Return empty 200 OK response for keep alive pings
	if (event.request.url.includes("/sw_ping"))
		return event.respondWith(new Response(null, { "status": 200 }));

	// Create new request paramters using modified headers
	const request = new Request(event.request, { mode: "cors" });

	// Setup request processing
	const rep = async (request: Request) => {
		// Make request
		const response = await fetch(request);

		// Return with extracted data
		return new Response(
			new Blob([await response.arrayBuffer()]),
			{
				"headers": response.headers,
				"status": response.status,
				"statusText": response.statusText
			}
		);
	};

	// Respond with processed data
	event.respondWith(rep(request));
});

self.addEventListener("message", event => {
	if (!event.data) {
		console.log("No data sent to service worker");
		return;
	}

	const data = event.data as ServiceWorkerData;

	switch(data.type) {
		case "IS_ACTIVE": {
			event.source?.postMessage("SW_ACTIVE");
			return;
		}
	}
});

export default null;
