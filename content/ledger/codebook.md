# The Ledger — Codebook

A structured dataset of formal enforcement actions taken by the Monetary Authority of Singapore (MAS). One row is one published enforcement action; multi-party actions carry a nested list of respondents. The dataset turns MAS's unstructured notice list into coded, analysable variables for research on regulatory deterrence, AML enforcement, and financial-sector conduct.

## Files

- `ledger_actions.json` — full structured dataset (nested respondents).
- `enforcement_actions.csv` — flat export, one row per respondent.
- `codebook.md` — this file.

## Coverage

Curated v1 spans **2016 to 2025** and prioritises the most significant and well-documented actions (the 1MDB-era penalties, the Wirecard-linked 2023 set, the August-2023 S$3 billion money-laundering case penalties of 2025, plus a spread of prohibition orders, civil penalties, and criminal prosecutions). It is **not yet the complete MAS register**. The `harvest_ledger.mjs` script pulls the full notice list from the OpenSanctions MAS export so the remaining actions can be coded and merged. Coverage is reported, not implied: as of this version, 50 actions.

MAS keeps most notices on its site for five years (prohibition orders that remain in force stay longer), so older actions are reconstructed from MAS media releases and the biennial Enforcement Reports.

## Variables

| Field | Type | Definition |
|---|---|---|
| `action_id` | int | Unique action identifier. |
| `date_published` | ISO date | Date MAS published the action. |
| `respondents` | array | Nested list: `{name, is_individual, fi_type}`. |
| `respondent_type` | enum | `FI`, `individual`, or `both`. |
| `fi_subtype` | enum | `bank`, `merchant bank`, `insurer`, `broker`, `fund/asset manager`, `capital markets`, `financial adviser`, `payment/crypto`, `other`, or null. |
| `action_type` | enum | `Composition penalty`, `Civil penalty`, `Criminal prosecution`, `Prohibition order`, `Licence revocation`, `Conditional warning`, `Reprimand`, `Warning`, `Investigation`. |
| `violation_category` | enum | `AML-CFT`, `market abuse`, `fraud/dishonesty`, `conduct/mis-selling`, `disclosure/reporting`, `licensing breach`, `tech/operational risk`, `other`. |
| `penalty_amount_sgd` | number/null | Monetary penalty in SGD. Null where the action carries no monetary penalty. Foreign-currency penalties are recorded in their SGD equivalent as stated by MAS. |
| `prohibition_years` | number/null | Length of a prohibition order in years; null = not applicable or lifetime (noted in summary). |
| `statutes` | array | Acts and MAS Notices cited (e.g. SFA, FAA, MAS Notice 626). |
| `conduct_start` / `conduct_end` | ISO date/null | Period of the underlying conduct, where stated by MAS. |
| `enforcement_lag_days` | int/null | Days from `conduct_end` to `date_published`. Computed; null when `conduct_end` is unknown. |
| `repeat_offender` | bool | True where the same respondent appears in an earlier action in the dataset. |
| `joint_action_with` | array | Co-enforcers (e.g. AGC, CAD, SPF, SGX RegCo). |
| `group` | string/null | Case-cluster tag linking related actions (`1mdb`, `wirecard`, `sg3b`). |
| `source_url` | url | MAS notice or media release. |
| `summary` | string | One to two sentence description. |
| `coding_confidence` | int 0-10 | Coder confidence, 10 = highest. Reflects source quality and how much was inferred (see below). |

## Coding-confidence scale (0-10)

- **9-10** — Action sourced to a specific MAS notice/media release with the penalty amount, parties, and basis explicitly stated.
- **7-8** — Sourced to MAS plus reputable secondary reporting; one or two fields (exact statute, conduct dates) inferred.
- **5-6** — Action confirmed from the MAS enforcement list but detail fields are thin; some coding inferred from the headline.
- **0-4** — Stub or weakly sourced; not for analysis without further verification. Harvested stubs start at 0.

## Sources and method

Primary source is MAS (`mas.gov.sg/regulation/enforcement`). Penalty totals are validated against MAS's own aggregate figures: the 1MDB penalties reconcile to S$29.1m, the 2023 Wirecard set to S$3.8m, and the 2025 S$3-billion-case set to S$27.45m. Secondary reporting (law-firm alerts, trade press) is used only to corroborate. The OpenSanctions MAS export (CC BY-NC 4.0) is used as a harvest aid to enumerate notices, never as the coded value.

## Citation

> Jain, A. *The Ledger: MAS Enforcement Actions Database.* Margin of Error. Primary source: Monetary Authority of Singapore.

## Disclaimer

The Ledger is an independent research project by Arin Jain. It is **not affiliated with, endorsed by, or produced in conjunction with the Monetary Authority of Singapore, the Singapore Government, or any of their agencies.** All information is compiled from public sources and reproduced in good faith for research and educational purposes. The data may contain errors, omissions, or outdated entries and is provided "as is" without warranty of any kind. The author accepts no liability for any loss or decision arising from use of this dataset. For authoritative information, always consult the primary MAS notice linked from each entry. Nothing here constitutes legal, financial, or compliance advice.
