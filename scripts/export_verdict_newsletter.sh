#!/usr/bin/env bash
# export_verdict_newsletter.sh
# Exports published verdict cases from the last 30 days as a plain-text newsletter snippet.
# Output: content/verdict/newsletter_draft.txt
# Usage: bash scripts/export_verdict_newsletter.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CASES_FILE="$SCRIPT_DIR/../content/verdict/verdict_cases.json"
OUT_FILE="$SCRIPT_DIR/../content/verdict/newsletter_draft.txt"

if [[ ! -f "$CASES_FILE" ]]; then
  echo "Error: $CASES_FILE not found." >&2
  exit 1
fi

CUTOFF=$(date -d "30 days ago" +%Y-%m-%d 2>/dev/null || date -v-30d +%Y-%m-%d)

bun -e "
const cases = JSON.parse(require('fs').readFileSync('$CASES_FILE', 'utf8'));
const cutoff = '$CUTOFF';
const recent = cases.filter(c =>
  c.status === 'published' && c.date >= cutoff
).sort((a, b) => b.date.localeCompare(a.date));

if (recent.length === 0) {
  process.stdout.write('No published cases in the last 30 days.\n');
  process.exit(0);
}

const lines = [];
lines.push('THE VERDICT — Newsletter Digest');
lines.push('Generated: ' + new Date().toISOString().slice(0, 10));
lines.push('='.repeat(60));
lines.push('');

for (const c of recent) {
  const band = c.computed.uncertainty_band;
  const bandStr = band[0] === band[1]
    ? band[0].toFixed(1)
    : band[0].toFixed(1) + '–' + band[1].toFixed(1);
  lines.push(c.title + ' | ' + c.date + ' | ' + c.computed.tier + ' | EDI ' + c.computed.EDI.toFixed(1) + ' ±[' + bandStr + ']');
  lines.push('Summary: ' + (c.summary.length > 160 ? c.summary.slice(0, 157) + '...' : c.summary));
  lines.push('Source: ' + (c.sources[0] ?? 'N/A'));
  lines.push('-'.repeat(60));
  lines.push('');
}

process.stdout.write(lines.join('\n'));
" > "$OUT_FILE"

echo "Written to $OUT_FILE"
