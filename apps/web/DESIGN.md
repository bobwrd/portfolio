---
name: Arin Jain, Working Paper Series
description: One portfolio issued as one working-paper series: white paper, ink, hairline rules, and a coloured series band per section.
colors:
  ink: "oklch(0.18 0.004 60)"
  paper: "oklch(0.995 0.002 90)"
  ink-muted: "oklch(0.45 0.008 60)"
  hairline: "oklch(0.87 0.008 80)"
  input-rule: "oklch(0.80 0.008 80)"
  paper-tint: "oklch(0.965 0.004 80)"
  series-oxblood: "oklch(0.40 0.12 25)"
  link-blue: "oklch(0.45 0.13 255)"
  destructive: "oklch(0.50 0.17 27)"
  band-ask-indigo: "#3b3f8f"
  band-onebook-olive: "#55611a"
  tool-paper-bg: "#fdfdfc"
  tool-paper-surface-2: "#f4f2ee"
  tool-paper-text: "#1a1816"
  tool-paper-muted: "#57524b"
  verdict-teal: "#0e5e74"
  ledger-amber: "#9c4a0e"
  obs-sea-green: "#146e64"
  arena-claret: "#962850"
  distlab-brick: "#a04028"
  docket-forest: "#2a6a44"
  tradewinds-navy: "#1d3557"
typography:
  display:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "3.5rem"
    fontWeight: 400
    lineHeight: 1.08
  headline:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.25
  title:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Libre Caslon Text, Georgia, Times New Roman, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label-heading:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.6
  small:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "IBM Plex Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    fontFeature: "tnum"
rounded:
  none: "0px"
  base: "4px"
  full: "9999px"
spacing:
  gutter-mobile: "20px"
  gutter-desktop: "32px"
  row: "16px"
  block: "48px"
  page-max: "72rem"
  contents-max: "48rem"
  measure: "42rem"
components:
  site-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    height: "56px"
  series-band:
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    padding: "10px 0"
  abstract-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "20px 24px"
    width: "26rem"
  contents-row:
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "16px 0"
  link:
    textColor: "{colors.link-blue}"
  tool-toggle:
    textColor: "{colors.ledger-amber}"
    typography: "{typography.small}"
    rounded: "{rounded.base}"
    padding: "4px 10px"
  select-filter:
    backgroundColor: "transparent"
    rounded: "{rounded.none}"
    padding: "4px 8px"
---

# Design System: Arin Jain, Working Paper Series

## Overview

**Creative North Star: "The Working Paper Series"**

Every section of the site is issued like a paper in one series: a coloured series band carrying the series line and a number, a Caslon title, an author line, keywords, a ruled abstract box, and a numbered contents list. The look borrows from two plain sources at once: the cover sheet of an economics working paper and the unstyled academic homepage, with blue underlined links. The site's credibility comes from how plain it is. Nothing is shown off. Everything is filed.

The paper is white, the ink is warm near-black, and structure comes from warm grey hairlines rather than from boxes, fills or shadows. Colour is spent in one place per section, the 6px band above the title, plus that section's figures and its active navigation. The site and the writing take oxblood. Each research tool has its own accent, all tuned to a similar mid-dark weight so none of them shouts. Density is that of a reading page: generous line height and a 42rem prose measure. Inside the tools, data rows run dense with tabular figures.

Reading surfaces (About, guide, writing, Ask) use the reading face throughout. Operating surfaces (the six tools, OneBook, Tradewinds) keep the same cover sheet and chrome, but their controls stay standard and use the system sans.

**Key Characteristics:**
- A 6px series band in the section's colour opens every section, with the series line ("Working Paper Series, No. NN") and a date or scope on a hairline-ruled strip.
- Libre Caslon Text for titles and prose, the system sans for navigation, labels and tool UI, IBM Plex Mono only for code and figures.
- Indexes are numbered, hairline-ruled rows. Never cards.
- Flat: no shadows, square or near-square corners, hairline borders.
- Blue underlined links, offset 0.18em, as on an academic homepage.

## Colors

Warm white paper and near-black ink carry the site. Hairlines carry the structure. One saturated band colour per section carries the identity.

### Primary
- **Series Oxblood** (series-oxblood): the band colour for the site itself and for Margin of Error. It appears in the 6px band above About, guide and writing titles, and in the active-tab underline of the writing nav. Its code name is `--warm-accent`, kept from the previous system. In dark mode it lifts to a lighter oxblood.

### Secondary
- **Academic Link Blue** (link-blue): every inline link (underlined, `text-link underline`), the focus ring, the text caret and the selection tint (18% alpha). It is the only blue on reading pages.

### Tertiary: section band colours
Each band colour stands for one section. It is used on that section's band, its contents numbers, its active nav item and its chart lead series, and nowhere else.
- **Verdict Teal** (verdict-teal): The Verdict, AI regulation index.
- **Ledger Burnt Amber** (ledger-amber): The Ledger, MAS enforcement register. Penalty figures are set in it.
- **Observatory Sea Green** (obs-sea-green): The Observatory.
- **Arena Claret** (arena-claret): The Arena.
- **Distribution Lab Brick** (distlab-brick): The Distribution Lab, with a five-step sequential ramp from sand to deep brick for choropleths.
- **Docket Forest** (docket-forest): The Docket.
- **Tradewinds Navy** (tradewinds-navy): Tradewinds, on a parchment variant with ocean and land map tones.
- **Ask Indigo** (band-ask-indigo) and **OneBook Olive** (band-onebook-olive): band-only tokens for sections without their own theme block.

Every tool accent pairs with a border at about 16 to 18% alpha, a hover border at about 42% and a dim fill at 7 to 8%. All of them derive from the same RGB.

### Neutral
- **Ink** (ink): titles, body and the abstract box's rule. It also marks the current item in the site bar (as a 2px underline, not a colour).
- **Paper** (paper): page background. It is warm, a hair off pure white.
- **Muted Ink** (ink-muted): series lines, bylines, keywords, row meta, summaries and the section numbers in h2s.
- **Hairline** (hairline): every rule, row divider and bar border.
- **Paper Tint** (paper-tint): code blocks and quiet fills.
- **Tool paper set** (tool-paper-bg, tool-paper-surface-2, tool-paper-text, tool-paper-muted): the shared paper of all six tools, plus a fixed categorical chart set (blue, green, rose, ochre, plum, teal) that each tool draws its secondary series from.

### Named Rules
**The One Band Rule.** A section owns exactly one colour. It appears on the 6px band, the contents numbers, the active nav and the lead data series. It never appears as a fill behind text or as a page background.

**The Ink Marks Place Rule.** The site bar shows the current section with an ink underline (2px, offset 0.4em), never a colour. Section navs use their own band colour for the underline.

**The Severity Is Not Accent Rule.** Severity and P&L colours (seismic red, gain, loss, critical) are reserved for encoding data. OneBook's gain and loss are never used as categorical colours.

## Typography

**Display Font:** Libre Caslon Text (with Georgia, Times New Roman)
**Body Font:** Libre Caslon Text for reading prose. The system sans (-apple-system, Segoe UI, system-ui) for UI.
**Label/Mono Font:** IBM Plex Mono, for code and figures only.

**Character:** A bookish transitional serif set at weight 400 throughout, against the quiet system sans of a university web page. Contrast comes from face and size, never from heavy weights.

### Hierarchy
- **Display** (400, 2.25rem mobile, 3rem small, 3.5rem large, line-height 1.08): the cover-sheet title. One per page.
- **Headline** (400, 1.75rem, tight): numbered paper sections ("1. Who I am"). The number is set in muted ink.
- **Title** (400, 1.125 to 1.25rem, snug): contents-row titles, article-list titles (1.5rem in the list variant), and the tool name in the tool bar (1.25rem).
- **Body** (400, 1.0625rem, relaxed, 42rem measure): abstract text, the About paper, tool intros, article prose. Readers can pick sm, md, lg or xl sizes and a serif, sans or mono face in the article.
- **Byline** (serif, 1.125 to 1.25rem, muted): the author line under the title.
- **Label** (sans 400, 0.9375rem): series lines, keywords, row numbers and meta, the site bar, footers. "Contents" and "Abstract" headings use the same size at 600.
- **Small** (sans 400, 0.875rem): article meta, tool navs, tool footers. Tool controls go down to 0.75rem.

### Named Rules
**The Weight 400 Rule.** h1 to h3 are Caslon at 400. Emphasis comes from size and placement. The only semibold on the site is the sans label heading.

**The Sentence-Case Rule.** No uppercase, no tracked-out labels, no kickers. Section labels are plain sentence-case sans at label size.

**The Tabular Figures Rule.** Tables and every tool section set `font-variant-numeric: tabular-nums`, so figures line up.

## Layout

There is one page frame: a 72rem column with 20px gutters on mobile and 32px from the small breakpoint up. The site bar (56px) sits in normal flow on top of every page, followed by an optional section bar (48px, sticky, for the writing and the tools), then the cover sheet. On large screens the cover sheet uses two columns: the title block takes the flexible column and the abstract box a 26rem column, with a 64px gap. Below that breakpoint the abstract stacks under the title.

Under the cover, the contents list runs at a 48rem maximum and reading prose at a 42rem measure, left-aligned, never centred. Blocks are separated by 48px. Paper sections are divided by full hairline `hr`s with 48px above and below. Contents rows use a 2.5rem number column, a flexible title column and a 15rem right-aligned meta column, with 16px of vertical padding. The meta column hides on mobile. In the site bar, the section list scrolls horizontally on narrow screens, with a right-edge fade mask, and lays flat from medium up.

## Elevation & Depth

The system is flat. Depth comes from hairline rules, ink-ruled boxes and the series band, not from shadows or tonal stacking. Bars are separated by a bottom hairline on the paper colour. OneBook uses inset 2px edge strokes (`inset 2px 0 0`) to mark active and warning states. These are rules, not elevation.

### Named Rules
**The Ruled Not Raised Rule.** Never lift a surface with a shadow. If something needs separation, give it a hairline. If it needs emphasis, give it an ink rule (the abstract box) or the section's band.

## Shapes

Corners are square. Tailwind's `rounded-sm` resolves to 0 under the radius scale, and that is the default for tool panels, tables, filter selects and register frames. The base 4px radius (`--radius`) is used only on small interactive pills: tool sort toggles, inline tags like "repeat", and OneBook controls. Full circles are reserved for status dots and slider thumbs. Borders are 1px hairlines everywhere except the 6px series band and the 2px active underline.

## Components

### Series Band and Cover Sheet (signature)
The cover sheet opens every section. It starts with a strip whose top border is the 6px band colour, padded 10px vertically and closed by a hairline. The strip carries the series line on the left and the date or scope on the right, in muted sans at label size. Below it come the display title, the serif byline, a sans "Keywords:" line, and optionally the abstract box. Tools reuse it with their own band colour, ink, muted ink and border tokens, numbered "Working Paper Series, No. NN".

### Abstract Box
A square box with a 1px ink border (the section's ink in tools), padded 20px by 24px. It holds a semibold sans heading ("Abstract" or "Snapshot") and serif body text at 1.0625rem.

### Contents List (replaces cards)
An ordered list with a top hairline and a hairline under every row. Each row shows a sans tabular number (in the section colour inside tools, muted elsewhere), a serif title that underlines on hover (1px, offset 4px), an optional sans summary and right-aligned meta. The whole row is the link.

### Navigation
- **Site bar:** paper background with a bottom hairline. The name sits left in serif at 1.0625rem and the sections sit right in sans at label size, 24px apart. Inactive sections are muted and turn to ink on hover. The current section gets an ink underline (2px, offset 0.4em) and `aria-current`.
- **Section bar (writing):** sticky and 48px high, with the section title in serif on the left. Its active item is underlined 2px in oxblood.
- **Tool bar:** sticky. A muted "Research tools" back-link leads into the tool name in serif at 1.25rem, and the in-page section links follow in sans at 0.875rem. The active link is set in the tool accent with a 2px underline. A bordered "Technical note" link closes the row.

### Article Entries
These are ruled list rows, not cards. A sans meta line (category, date, read time, 0.875rem, muted) sits above a serif 1.5rem title with hover underline, a sans summary at a 42rem measure, and a "Tags:" line. The grid variant replaces the bottom rule with an ink top rule.

### Links
Inline links use link blue with an underline offset of 0.18em. Index and row links take ink with a hover underline instead.

### Buttons / Toggles (tools)
- **Shape:** gently rounded pill (4px).
- **Default:** transparent fill, muted text, 1px border in the tool's border tone, padded 4px by 10px, at 0.75rem.
- **Selected:** accent text, 1px accent border and accent-dim fill. Colour transitions take 150ms.

### Inputs / Fields
Filter selects have a transparent background, a square 1px hairline border and padding of 4px by 8px. Range sliders use a 4px track on the tool's tint and a 16px accent thumb with a 2px paper ring. Focus is the global 2px link-blue outline at 2px offset, shown instantly. Range sliders use a 4px offset in the tool accent.

### Focus
There is one ring for the whole site: `outline: 2px solid` link blue, offset 2px, with no transition.

## Do's and Don'ts

### Do:
- **Do** open every new section or tool with the cover sheet: a 6px band in the section's colour, "Working Paper Series, No. NN", title, byline, keywords, and a ruled abstract.
- **Do** list any index as numbered hairline rows (2.5rem number column, 16px row padding, right meta column).
- **Do** set titles and prose in Libre Caslon Text at 400, and UI, labels and controls in the system sans.
- **Do** give a new tool one accent at the same mid-dark weight as the others, with border, hover-border and dim variants derived from it at about 16%, 42% and 8% alpha, sitting on the shared tool paper.
- **Do** make inline links blue and underlined. Mark the current place with a 2px underline.
- **Do** keep tool figures tabular, and respect `prefers-reduced-motion` in every tool scope.

### Don't:
- **Don't** use cards, shadows or rounded panels for indexes or content blocks.
- **Don't** use uppercase labels, tracked-out kickers or eyebrows above titles.
- **Don't** spend a section's colour on fills or backgrounds. It belongs to the band, the numbers, the active nav and the lead series.
- **Don't** use bold for headings. Caslon stays at 400.
- **Don't** use severity, gain or loss colours for categories.
- **Don't** hard-code hex values in components when a section token exists.
