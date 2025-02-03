// Import required modules
import fastify, {
	FastifyInstance,
	FastifyReply,
	FastifyRequest
} from "fastify";
import cors from "@fastify/cors";
import compress from "@fastify/compress";
import { randomBytes } from "node:crypto";

async function main(): Promise<void> {
	// Setup Fastify
	const server: FastifyInstance = fastify();

	// Enable CORS
	await server.register(cors, {
		"allowedHeaders": [ "content-type", "csrf", "session", "version" ],
		"exposedHeaders": [ "content-disposition" ],
		"credentials": true,
		"methods": [ "DELETE", "GET", "PATCH", "POST" ],
		"origin": "*"
	});

	// Enable compression
	await server.register(compress, {
		"global": true,
		"removeContentLengthHeader": false,
		"encodings": [
			"gzip"
		]
	});

	// Bug Hunt Endpoint
	server.get("/hunt", async (req: FastifyRequest, rep: FastifyReply) => {
		// Return 200 OK with Random Text
		return await rep.code(200).send({
			"RandomText": randomBytes(8192).toString("hex")
		});
	});

	// Outgoing token injection
	server.addHook("onSend", async (req: FastifyRequest, rep: FastifyReply, payload: unknown) => {
		// Do not run hook for CORS preflight checks
		if (req.method !== "OPTIONS") {
			// Inject token into payload
			return payload = randomBytes(64).toString("hex") + (payload as string);
		}
	});

	// Run Server
	await server.listen({
		"host": "0.0.0.0",
		"port": 5000,
	}).then(() => {
		console.log("\n    Bug Hunt running on 0.0.0.0:5000!");
	});
}

// Start
void main();