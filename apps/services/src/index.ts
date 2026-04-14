import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.json({
		name: "@zapp/services",
		version: "0.0.0",
		status: "ok",
		timestamp: new Date().toISOString(),
	});
});

export const startServer = (port = Number(process.env.PORT) || 4993) => {
	console.log(`Services running on http://localhost:${port}`);
	return serve({ fetch: app.fetch, port });
};

const shouldStartServer =
	process.env.NODE_ENV !== "test" && process.env.VITEST !== "true";

if (shouldStartServer) {
	startServer();
}

export default app;
