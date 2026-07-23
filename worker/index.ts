import { Hono } from "hono";

interface Env {
  ASSETS: Fetcher;
}

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

export default app;
