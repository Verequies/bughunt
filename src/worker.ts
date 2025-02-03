/// <reference lib="esnext" />
/// <reference lib="webworker" />

//-------------------------- Setup Worker ---------------------------
declare const self: SharedWorkerGlobalScope;

// Check if shared worker
const sharedWorker = self.location.search.includes("shared");

// Initialise an empty array of Message Ports
const ports: MessagePort[] = [];

// Handle new connections
if (sharedWorker) {
	self.onconnect = function(ev) {
		ev.ports[0].start();
		ports.push(ev.ports[0]);
	};
}

// Keep Service Worker alive by sending a ping every second
// Also ping frontend to let it know that the worker is still alive
setInterval(() => {
	void fetch("0.0.0.0" + "/sw_ping").then();
	if (sharedWorker) {
		ports.forEach((port) => {
			port.postMessage("SW_PING");
		});
	} else {
		self.self.postMessage("SW_PING");
	}
}, 1000);

export default null;
