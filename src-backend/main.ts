// Import required modules
import fastify, {
	FastifyInstance,
	FastifyReply,
	FastifyRequest
} from "fastify";
import cors from "@fastify/cors";
import compress from "@fastify/compress";
import express, {
	Application,
	Request,
	Response
} from "express";
import ecors from "cors";
import compression from "compression";
import { randomBytes } from "node:crypto";

async function main(): Promise<void> {
	// Setup server
	const eserver: Application = express();

	// Enable CORS
	eserver.use(ecors({
		"allowedHeaders": [ "content-type", "csrf", "session", "version" ],
		"exposedHeaders": [ "content-disposition" ],
		"credentials": true,
		"methods": [ "DELETE", "GET", "PATCH", "POST" ],
		"origin": "*"
	}));

	// Enable compression
	eserver.use(compression());

	// Bug Hunt Endpoint
	eserver.get("/hunt", (_req: Request, rep: Response) => {
		// Return 200 OK with Random Text
		return rep
			.status(200)
			.type("application/json")
			.send(
				randomBytes(128).toString("hex") + JSON.stringify({"RandomText": randomBytes(8192).toString("hex")})
			);
	});

	// Run Server
	eserver.listen(5000, "0.0.0.0", () => {
		console.log("\n    Bug Hunt running Express on 0.0.0.0:5000!");
	});

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
		return await rep
			.status(200)
			.type("application/json")
			.send(
				randomBytes(128).toString("hex") + JSON.stringify({"RandomText": randomBytes(8192).toString("hex")})
			);
	});

	// Run Server
	await server.listen({
		"host": "0.0.0.0",
		"port": 5001,
	}).then(() => {
		console.log("\n    Bug Hunt running Fastify on 0.0.0.0:5001!");
	});
}

// Start
void main();