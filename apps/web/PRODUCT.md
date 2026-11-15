# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

A mixed academic audience: university admissions readers judging Arin Jain as an applicant, plus professors, mentors and research contacts who will open the tools, read the papers and check the methods. They arrive from a CV, an application or a link, usually on a laptop, and decide within a minute whether the work is serious. Some return for the writing and the weekly briefing.

## Product Purpose

The personal research portfolio of Arin Jain, a Grade 11 (IB Year 1) student in Singapore studying economics and law. It collects one line of inquiry, where legal systems and economic policy fail the people they are meant to serve, and shows it as writing, interactive research tools and software. Success: a reader leaves convinced the work is genuine, rigorous and self-directed, and knows where to look next.

## Positioning

Not a résumé site with project thumbnails: the evidence is the working thing itself. Six hand-built research tools with published methods, a writing project with a weekly briefing, a portfolio-risk dashboard and a small data-analysis language, all built by one student around one question.

## Operating Context

- `/` About: the CV, written as an academic paper (abstract, numbered sections, appendix).
- `/overview` Site guide: what is here and why.
- `/writing` Margin of Error: essays, analysis and a weekly briefing (published each weekend), with article pages, reading preferences, likes and a newsletter signup.
- `/mini` Research tools: The Verdict (AI regulation index), The Ledger (MAS enforcement register), The Observatory (AI, productivity and prices), The Arena (competition and market structure), The Distribution Lab (inequality and institutions), The Docket (India's court backlog). Each has charts, controls and a technical note.
- `/onebook` OneBook: a portfolio risk dashboard for equities, options and bonds, with optional broker connections.
- `/ask` Ask: a beginner-friendly data-analysis language (macOS download, source on GitHub).
- `/tradewinds` Tradewinds: a daily trade-voyage deduction puzzle.

Deployed on Cloudflare Workers from GitHub; bots refresh Observatory data weekly.

## Capabilities and Constraints

- React + Vite + Tailwind v4 + TypeScript; routes, data, APIs, tests and deployment must keep working.
- All current content and data must survive. Text may be rewritten to read plainer and less inflated, never replaced or invented.
- Section and tool names are kept.
- Tests assert some OneBook labels ("Add position", "Instruments", "No matches", "Market value" and others).

## Brand Commitments

- The About page keeps its CV-as-paper format: abstract, numbered sections, appendix.
- Each research tool keeps a distinct colour of its own.
- Voice: precise, plain, intellectually honest; first person; no startup language or inflated claims.
- Author name only on the site: no tool or AI attribution anywhere.

## Evidence on Hand

Real: the CV facts on `/`, the articles in `content/articles/`, verdict cases, MAS ledger actions, Observatory and Distribution Lab data in `content/`, Ask screenshots in `public/ask/`, the TEDx talk link, the GitHub repos. Absent and never to be invented: testimonials, photos of the author, logos, visitor or usage metrics.

## Product Principles

1. Show the working thing, not a description of it.
2. One question ties every section together; the design should make that visible.
3. Rigor over polish: methods, sources and limits stay one click away.
4. Plain language a smart outsider can follow.
5. One site, many instruments: shared chrome and type, each tool keeps its own colour.

## Accessibility & Inclusion

WCAG AA contrast, keyboard focus on every control, reduced-motion respected.
