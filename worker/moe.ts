// Margin of Error + Mini Projects API — mounted at /api in worker/index.ts.
//
//   - Content (articles, profile) is read from a build-time baked JSON module
//     (worker/generated/content.json) — Workers have no filesystem at runtime.
//   - Dynamic tables (likes, contact, newsletter) use D1.

import { Hono } from "hono";
import baked from "./generated/content.json";

type Bindings = {
  MOE_DB: D1Database;
  VERDICT_PASSWORD?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  await next();
  if (c.req.method !== "GET") return;
  const p = c.req.path;
  if (
    p.startsWith("/content") ||
    p === "/profile" ||
    p.startsWith("/verdict/cases") ||
    p.startsWith("/ledger") ||
    p.startsWith("/observatory") ||
    p.startsWith("/distlab")
  ) {
    c.header("Cache-Control", "public, max-age=300, stale-while-revalidate=3600");
  }
});

type Baked = {
  articles: Record<string, string>;
  profile: string;
  verdictCases: Record<string, unknown>[];
  ledgerActions: Record<string, unknown>[];
  ledgerCsv: string;
  ledgerCodebook: string;
  observatory: Record<string, unknown> | null;
  distlab: Record<string, unknown> | null;
};
const CONTENT = baked as Baked;

function loadVerdictCases(): Record<string, unknown>[] {
  return CONTENT.verdictCases || [];
}

function loadLedgerActions(): Record<string, unknown>[] {
  return CONTENT.ledgerActions || [];
}

interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  form: "article" | "newsletter";
  category: "short" | "weekly" | "personal" | "other";
  wordCount: number;
  pdf?: string;
}
interface ContentItem extends ContentMeta {
  body: string;
}

function parseFrontmatter(raw: string, fallbackSlug: string): ContentItem {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return {
      slug: fallbackSlug,
      title: fallbackSlug,
      date: "",
      tags: [],
      summary: "",
      form: "article",
      category: "weekly",
      wordCount: raw.split(/\s+/).filter(Boolean).length,
      body: raw,
    };
  }
  const frontmatter = match[1];
  const body = match[2];
  const data: Record<string, string> = {};
  for (const line of frontmatter.split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  const tags = data.tags
    ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  const form: ContentMeta["form"] =
    data.form === "newsletter"
      ? "newsletter"
      : data.form === "article"
        ? "article"
        : wordCount >= 500
          ? "article"
          : "newsletter";

  const category: ContentMeta["category"] =
    data.category === "personal" ||
    data.category === "weekly" ||
    data.category === "short" ||
    data.category === "other"
      ? (data.category as ContentMeta["category"])
      : form === "article"
        ? "weekly"
        : "short";

  return {
    slug: data.slug || fallbackSlug,
    title: data.title || fallbackSlug,
    date: data.date || "",
    tags,
    summary: data.summary || "",
    form,
    category,
    wordCount,
    body,
    pdf: data.pdf || undefined,
  };
}

function loadAllArticles(): ContentItem[] {
  const items: ContentItem[] = [];
  for (const [slug, raw] of Object.entries(CONTENT.articles)) {
    items.push(parseFrontmatter(raw, slug));
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

function loadArticleBySlug(slug: string): ContentItem | null {
  if (CONTENT.articles[slug] !== undefined) {
    return parseFrontmatter(CONTENT.articles[slug], slug);
  }
  for (const [filenameSlug, raw] of Object.entries(CONTENT.articles)) {
    const item = parseFrontmatter(raw, filenameSlug);
    if (item.slug === slug) return item;
  }
  return null;
}

function stripBody({ body: _body, ...meta }: ContentItem) {
  return meta;
}

async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content_type TEXT NOT NULL,
        slug TEXT NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        UNIQUE(content_type, slug)
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS contact_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS newsletter_signups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        name TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS verdict_drafts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`,
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Content routes — static paths MUST come before /:slug param routes
// ---------------------------------------------------------------------------
app.get("/content", (c) => {
  const items = loadAllArticles().map(stripBody);
  return c.json({ items });
});

app.get("/content/weekly", (c) =>
  c.json({ items: loadAllArticles().filter((i) => i.category === "weekly").map(stripBody) }),
);
app.get("/content/personal", (c) =>
  c.json({ items: loadAllArticles().filter((i) => i.category === "personal").map(stripBody) }),
);
app.get("/content/other", (c) =>
  c.json({ items: loadAllArticles().filter((i) => i.category === "other").map(stripBody) }),
);
app.get("/content/short", (c) =>
  c.json({ items: loadAllArticles().filter((i) => i.category === "short").map(stripBody) }),
);
app.get("/content/articles", (c) =>
  c.json({
    items: loadAllArticles()
      .filter((i) => i.category === "weekly" || i.category === "personal")
      .map(stripBody),
  }),
);

app.get("/content/:slug", (c) => {
  const item = loadArticleBySlug(c.req.param("slug"));
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

app.get("/profile", (c) => c.json({ markdown: CONTENT.profile || "" }));

// ---------------------------------------------------------------------------
// Likes (D1)
// ---------------------------------------------------------------------------
app.get("/likes/:type/:slug", async (c) => {
  const { type, slug } = c.req.param();
  await ensureSchema(c.env.MOE_DB);
  const row = await c.env.MOE_DB.prepare(
    "SELECT count FROM likes WHERE content_type = ? AND slug = ?",
  )
    .bind(type, slug)
    .first<{ count: number }>();
  return c.json({ count: row?.count ?? 0 });
});

app.post("/likes/:type/:slug", async (c) => {
  const { type, slug } = c.req.param();
  await ensureSchema(c.env.MOE_DB);
  await c.env.MOE_DB.prepare(
    `INSERT INTO likes (content_type, slug, count) VALUES (?, ?, 1)
     ON CONFLICT(content_type, slug) DO UPDATE SET count = count + 1`,
  )
    .bind(type, slug)
    .run();
  const row = await c.env.MOE_DB.prepare(
    "SELECT count FROM likes WHERE content_type = ? AND slug = ?",
  )
    .bind(type, slug)
    .first<{ count: number }>();
  return c.json({ count: row?.count ?? 0 });
});

// ---------------------------------------------------------------------------
// Contact form (D1)
// ---------------------------------------------------------------------------
app.post("/contact", async (c) => {
  const body = await c.req.json<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>();
  const { name, email, subject, message } = body;
  if (!name || !email || !subject || !message) {
    return c.json({ error: "All fields are required." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return c.json({ error: "Invalid email address." }, 400);
  }
  await ensureSchema(c.env.MOE_DB);
  await c.env.MOE_DB.prepare(
    "INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)",
  )
    .bind(name.trim(), email.trim(), subject.trim(), message.trim())
    .run();
  return c.json({ success: true });
});

app.post("/newsletter/signup", async (c) => {
  try {
    const body = await c.req.json<{ email?: string; name?: string }>();
    if (body?.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      await ensureSchema(c.env.MOE_DB);
      await c.env.MOE_DB.prepare(
        "INSERT INTO newsletter_signups (email, name) VALUES (?, ?)",
      )
        .bind(body.email.trim(), body.name?.trim() ?? null)
        .run();
      return c.json({ success: true, contactCreated: true });
    }
  } catch {
    /* fall through */
  }
  return c.json({ success: true, contactCreated: false });
});

// ---------------------------------------------------------------------------
// Verdict routes (Mini Projects)
// ---------------------------------------------------------------------------
app.get("/verdict/cases", (c) =>
  c.json({ cases: loadVerdictCases().filter((v) => v.status === "published") }),
);

app.get("/verdict/cases/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const item = loadVerdictCases().find((v) => v.case_id === id);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ case: item });
});

// Submit a draft case. The published verdict database is fed from Google
// Drive, so drafts can't be written back to the bundled file. Instead we
// store the submission in D1 for the author to review and publish via Drive.
app.post("/verdict/submit", async (c) => {
  const expected = c.env.VERDICT_PASSWORD;
  const authHeader = c.req.header("x-verdict-password");
  if (!expected || authHeader !== expected) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const body = await c.req.json<Record<string, unknown>>();
  await ensureSchema(c.env.MOE_DB);
  const res = await c.env.MOE_DB.prepare(
    "INSERT INTO verdict_drafts (payload) VALUES (?)",
  )
    .bind(JSON.stringify(body))
    .run();
  return c.json({
    success: true,
    draft_id: res.meta.last_row_id,
    note: "Draft stored. Review it in D1 and publish via the Google Drive verdict_cases.json.",
  });
});

// ---------------------------------------------------------------------------
// Ledger routes (MAS enforcement actions) — baked, read-only
// ---------------------------------------------------------------------------
app.get("/ledger/actions", (c) => c.json({ actions: loadLedgerActions() }));

// Bulk downloads — static paths BEFORE the /:id param route.
app.get("/ledger/download/json", (c) => {
  c.header("Content-Type", "application/json");
  c.header("Content-Disposition", 'attachment; filename="ledger_enforcement_actions.json"');
  return c.body(JSON.stringify(loadLedgerActions(), null, 2));
});
app.get("/ledger/download/csv", (c) => {
  c.header("Content-Type", "text/csv");
  c.header("Content-Disposition", 'attachment; filename="ledger_enforcement_actions.csv"');
  return c.body(CONTENT.ledgerCsv || "");
});
app.get("/ledger/download/codebook", (c) => {
  c.header("Content-Type", "text/markdown");
  c.header("Content-Disposition", 'attachment; filename="ledger_codebook.md"');
  return c.body(CONTENT.ledgerCodebook || "");
});

app.get("/ledger/actions/:id", (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const item = loadLedgerActions().find((a) => a.action_id === id);
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ action: item });
});

// ---------------------------------------------------------------------------
// Observatory (AI / productivity / prices) — baked dataset, read-only.
// ---------------------------------------------------------------------------
app.get("/observatory", (c) => {
  if (!CONTENT.observatory) return c.json({ error: "Observatory data unavailable" }, 503);
  return c.json(CONTENT.observatory);
});

// ---------------------------------------------------------------------------
// The Distribution Lab (inequality / mobility / wellbeing) — baked dataset,
// read-only.
// ---------------------------------------------------------------------------
app.get("/distlab", (c) => {
  if (!CONTENT.distlab) return c.json({ error: "Distribution Lab data unavailable" }, 503);
  return c.json(CONTENT.distlab);
});

export default app;
