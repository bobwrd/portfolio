import { Hono } from "hono";
import moe from "./moe";

interface Env {
  ASSETS: Fetcher;
  MOE_DB: D1Database;
}

const app = new Hono<{ Bindings: Env }>();

app.route("/api", moe);

export default app;
