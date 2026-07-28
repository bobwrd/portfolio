import { Hono } from "hono";
import moe from "./moe";
import onebook from "./onebook/src/index";
import tradewinds from "./tradewinds";
import type { Env as OnebookEnv } from "./onebook/src/env";

interface Env extends OnebookEnv {
  ASSETS: Fetcher;
  MOE_DB: D1Database;
  VERDICT_PASSWORD?: string;
  TRADEWINDS_PASSWORD?: string;
}

const app = new Hono<{ Bindings: Env }>();

app.route("/api", moe);
app.route("/api/onebook", onebook);
app.route("/api/tradewinds", tradewinds);

export default app;
