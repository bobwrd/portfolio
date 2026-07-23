import { Hono } from "hono";
import moe from "./moe";
import onebook from "./onebook/src/index";
import type { Env as OnebookEnv } from "./onebook/src/env";

interface Env extends OnebookEnv {
  ASSETS: Fetcher;
  MOE_DB: D1Database;
  VERDICT_PASSWORD?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.route("/api", moe);
app.route("/api/onebook", onebook);

export default app;
