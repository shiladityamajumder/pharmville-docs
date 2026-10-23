# Documentation conventions

## Files and navigation

Keep the numbered top-level folders. Use descriptive `Title-Case-Words.md` filenames and existing underscore module directories. Add working relative links; do not link outside the checkout. Record sibling-source paths and immutable verification evidence centrally in [migration evidence](../04-Database/Migrations.md).

Use one H1 per page, H2 sections and H3 subsections without skipping levels. Prefer paragraphs for explanations, numbered steps for chronology and short tables for comparison. Tables need an adjacent separator and the same number of cells in every row; escape literal pipes as `\|`. Keep blank lines around blocks.

## Three documentation levels

Business Flow explains purpose, people, normal steps, next process, failures/recovery, visible results, pending approvals and technical links in ordinary language. Each exception names what happened, its cause, concrete outcome, next action, responsible team and record/money/stock effect. Avoid SQL, class definitions and long payloads there.

HLD explains components, ownership, trust and communication. LLD explains the operation, fields, transitions, transaction, concurrency and failures. Link the layers without copying paragraphs. A consuming module is not automatically a table writer.

## Diagrams and icons

Always use a fenced block labelled `mermaid`. Prefer conservative flowchart, sequence and state syntax with short quoted node labels. Keep decision branches meaningful and domain-specific; distinguish request receipt, clinical approval, money truth, stock commitment and dispatch. Avoid semicolons in sequence message text, unsupported directives, external themes and unrelated prose inside fences.

Run the parser, then render changed diagrams. A fence check alone does not validate Mermaid. Use small navigation icons consistently (📘 business, 🏗️ HLD, ⚙️ LLD, 🗄️ data, 🔗 APIs, 🧪 tests); do not decorate technical tables.

## Features, tests and status

[Features-and-Modules](../01-Project/Features-and-Modules.md) defines feature IDs once. [The master register](Coverage-and-Traceability.md) maps each to its owner, Business Flow, HLD, LLD, API, database, edge cases, tests and task. Module views link there instead of maintaining another inventory. Repeated references are expected; duplicate definitions are not.

Keep original IDs stable. Normal tests use established `TC-<feature>-OK`; adverse tests use `TC-<feature>-DENY`, with existing numbered ACC-01/ACC-02 IDs preserved. A DENY test may verify a specific pending/replay outcome rather than an HTTP rejection. Give new distinct scenarios new stable numeric suffixes; record trigger, expected record effect and recovery owner. Attach fixtures/policy version and execution evidence before claiming a pass.

Use **Confirmed** for inspected evidence, **Proposed** for design needing review, **Inferred** for interpretation and **Open/Blocked** for a named unresolved issue. Test states are **Designed / NOT RUN** or an evidenced result. Never equate documentation validation with product tests or business approval.

## Local checks and adding scope

Use Node.js 24 and `npm ci`. If Chrome/Edge is already installed, set `PUPPETEER_SKIP_DOWNLOAD=true` before installation; set `PUPPETEER_EXECUTABLE_PATH` if it is outside the detected paths. Then run:

```text
npm run test:validator
npm run validate
npm run validate:render
npm run validate:database
```

Default validation checks all Markdown, portable links/anchors, table widths, headings, fences, empty files, archive artifacts, exact feature references and actual Mermaid parsing. Render validation writes local SVG/PNG files and JSON results under ignored `artifacts/`. The database check is optional for contributors without the sibling checkout and explicitly fails unavailable; documentation CI does not claim live database parity.

To add a feature: obtain its scope/decision source, assign one unused ID in the inventory, define owner/command/data boundaries, update the master register, add domain BFD coverage and technical/API/data contracts, specify normal and meaningful failure tests, add its development task, and run checks. A new module also needs README, HLD, LLD, Edge-Cases and API entry points. Do not promote a draft threshold or provider detail to an approved requirement.
