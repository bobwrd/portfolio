import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("worker/generated", { recursive: true });
writeFileSync(
  "worker/generated/content.json",
  JSON.stringify({ articles: [], profile: "" }, null, 2),
);
