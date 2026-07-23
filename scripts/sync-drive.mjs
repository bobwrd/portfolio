// Pulls the "Margin of Error" Google Drive folder into the repo's content/
// tree. Run on a schedule (and manually).
//
// Auth: a Google service account. Put the full JSON key in the secret
// GOOGLE_SERVICE_ACCOUNT_KEY, and share the Drive "Margin of Error" folder
// with the service account's client_email (Viewer is enough).
//
// The root folder is discovered by ID (env DRIVE_ROOT_FOLDER_ID, with a
// sensible default). Sub-folders are matched by name, so re-creating a folder
// in Drive won't break the sync as long as the names stay the same.
//
// Routing (Drive sub-folder -> repo path):
//   Daily Brief      -> content/daily_findings/
//   Weekly Article   -> content/articles/
//   Personal Pieces  -> content/articles/
//   Verdict Radar    -> by filename:
//       verdict_cases.json      -> content/verdict/verdict_cases.json
//       verdict_radar_*.md      -> content/verdict/weekly_radar/
//       *.txt                   -> content/verdict/
//       *.md (cross-post drafts) -> content/verdict/cross_post_drafts/
//
// The weekly Verdict-generating automation still drops a cross-post draft
// article alongside each new case, same as before. That draft is kept for
// reference under content/verdict/cross_post_drafts/ instead of
// content/articles/ — Verdict content only ever appears under /mini/verdict,
// never in the writing feed.
//
// Exit code 0 always (so the calling workflow's commit step decides whether
// anything changed). Errors during auth/listing throw and fail the job.

import { google } from "googleapis";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const DRIVE_ROOT_FOLDER_ID =
  process.env.DRIVE_ROOT_FOLDER_ID || "1ih4CFptvOucvs8skIERYJusnC4tmedAw";

// Per sub-folder routing. `route(name)` decides the destination path for
// individual files within that Drive sub-folder.
const FOLDER_ROUTES = {
  "Daily Brief": { route: (name) => `content/daily_findings/${name}` },
  "Weekly Article": { route: (name) => `content/articles/${name}` },
  "Personal Pieces": { route: (name) => `content/articles/${name}` },
  "Verdict Radar": {
    route(name) {
      if (name === "verdict_cases.json") return "content/verdict/verdict_cases.json";
      if (/^verdict_radar_.*\.md$/.test(name)) return `content/verdict/weekly_radar/${name}`;
      if (name.endsWith(".txt")) return `content/verdict/${name}`;
      return `content/verdict/cross_post_drafts/${name}`; // no longer published as an article
    },
  },
};

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set.");
  }
  const creds = JSON.parse(raw);
  return new google.auth.GoogleAuth({
    credentials: creds,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
}

async function listChildren(drive, parentId) {
  const files = [];
  let pageToken;
  do {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and trashed = false`,
      fields: "nextPageToken, files(id, name, mimeType)",
      pageSize: 200,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    files.push(...(res.data.files || []));
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files;
}

async function downloadText(drive, fileId) {
  const res = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "arraybuffer" },
  );
  return Buffer.from(res.data);
}

async function run() {
  const auth = getAuth();
  const drive = google.drive({ version: "v3", auth });

  const subFolders = (await listChildren(drive, DRIVE_ROOT_FOLDER_ID)).filter(
    (f) => f.mimeType === "application/vnd.google-apps.folder",
  );

  let written = 0;
  for (const folder of subFolders) {
    const routing = FOLDER_ROUTES[folder.name];
    if (!routing) {
      console.log(`[sync] skipping unmapped folder: ${folder.name}`);
      continue;
    }
    const files = (await listChildren(drive, folder.id)).filter(
      (f) => f.mimeType !== "application/vnd.google-apps.folder",
    );
    for (const file of files) {
      const relPath = routing.route(file.name);
      const absPath = join(ROOT, relPath);
      const buf = await downloadText(drive, file.id);
      await mkdir(dirname(absPath), { recursive: true });
      await writeFile(absPath, buf);
      written++;
      console.log(`[sync] ${folder.name}/${file.name} -> ${relPath}`);
    }
  }
  console.log(`[sync] done — ${written} files written.`);
}

run().catch((e) => {
  console.error("[sync] failed:", e?.message || e);
  process.exit(1);
});
