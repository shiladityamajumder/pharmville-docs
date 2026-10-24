# Documentation coverage and audit limits

## Measured feature evidence

The [authoritative feature inventory](../01-Project/Features-and-Modules.md) retains 110 unique draft IDs across 18 module groups. The [master register](Coverage-and-Traceability.md) links each to Business Flow, HLD, LLD, APIs, data mapping, edge cases, tests and original development task.

There are no missing navigation mappings in the executed checks; navigation is not approved implementation.

The 17-page [Business Guide](../00-Business-Guide/README.md) covers all current module groups, normal and alternate paths, failed steps, responsible teams, visible outcomes and approval gaps. Future schema domains do not create launch requirements.

## API and test readiness

87/110 features have an exact ID mention in the owning API file. The 23 remaining historical gaps are preserved with specific explanations in the register; some are cross-module supporting commands, others absent contracts. We do not inflate this metric by inserting feature names without mapping real behavior.

[Critical operation contracts](../05-APIs/Critical-Operation-Contracts.md) refine checkout, hold/release, pharmacy decisions, payment evidence, cancellation/return, refund and delivery proof with proposed typed fields and concrete outcomes. Exact DTO bounds, field writes, runtime grants, enum mappings and provider signatures still need D-024/D-016 review. No feature is declared fully ready from these counts.

All features now have specific normal/adverse assertions in LLD/Edge-Cases. There are 234 distinct named application test designs, including the detailed account cases and nine additional payment-loss, stock-expiry, last-unit, clinical-revision, refund-race and offline-proof scenarios.

They are Designed / NOT RUN. The shared [testing strategy](../07-Engineering/Testing.md) links module views instead of copying generic per-feature tables.

## Schema and source verification

Read-only checks compare 266 table pages and 4,438 column names with the user-supplied final catalog and verify all 103 migration SQL files, including 30 versioned migrations and their fragments, against the [evidence snapshot](Database-Evidence.json). Supporting source hashes are checked as well.

This establishes consistency with the selected documentation source; live deployment remains a separate check.

The user-supplied `healthcare_db/` folder is the selected documentation baseline. Its included migration history and catalog agree with the recorded snapshot. [Migration evidence](../04-Database/Migrations.md) closes the former source-selection warning and retains actual target-ledger/runtime-parity checks under D-015.

## Documentation checks and remaining limits

449 Markdown files, 3,835 relative links/anchors and 1,594 tables pass structural checks. All 52 Mermaid blocks parse and render; the original 51 contained 18 actual parser failures. Feature/test-reference checks and the validator’s negative regression fixture pass.

Seven representative images received visual review; interactive VS Code preview, hosted GitHub rendering and hosted CI remain unverified.

No application/provider/live-database tests ran. Read the [engineering audit](Engineering-Audit.md) for exact evidence, blocker owners and production-readiness limits, and [conventions](Documentation-Conventions.md) to reproduce local checks.
