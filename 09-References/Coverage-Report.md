# Documentation coverage and audit limits

## Measured feature evidence

The [authoritative feature inventory](../01-Project/Features-and-Modules.md) retains 110 unique draft IDs across 18 module groups. The [master register](Coverage-and-Traceability.md) links each to Business Flow, HLD, LLD, APIs, data mapping, edge cases, tests and original development task.

There are no missing navigation mappings in the executed checks; navigation is not approved implementation.

The 17-page [Business Guide](../00-Business-Guide/README.md) covers all current module groups, normal and alternate paths, failed steps, responsible teams, visible outcomes and approval gaps. Future schema domains do not create launch requirements.

## API and test readiness

The owning API documents now explicitly account for all 110 feature IDs in operation/feature tables. This is a textual traceability measure, not 110 complete journeys: the [feature-to-operation gap register](../05-APIs/Journey-API-Gaps.md) separates actual cross-module operation links, 16 candidate commands and unresolved workflow/policy gaps. The [API ledger](../05-APIs/API-Contract-Coverage.md) records 97/107 documentation-complete proposals (90.65%), 10 incomplete contracts and 0 approved contracts. The earlier 87/110 mention count is the historical baseline.

[Critical operation contracts](../05-APIs/Critical-Operation-Contracts.md) refine checkout, hold/release, pharmacy decisions, payment evidence, cancellation/return, refund and delivery proof with proposed typed fields and concrete outcomes. Exact DTO bounds, field writes, runtime grants, enum mappings and provider signatures still need D-024/D-016 review. No feature is declared fully ready from these counts.

All features now have specific normal/adverse assertions in LLD/Edge-Cases. There are 234 distinct named application test designs, including the detailed account cases and nine additional payment-loss, stock-expiry, last-unit, clinical-revision, refund-race and offline-proof scenarios.

They are Designed / NOT RUN. The shared [testing strategy](../07-Engineering/Testing.md) links module views instead of copying generic per-feature tables.

## Schema and source verification

Historical source verification compared 266 table pages and 4,438 column names with the user-supplied final catalog and verified all 103 migration SQL files, including 30 versioned migrations and their fragments, against the [evidence snapshot](Database-Evidence.json). Supporting source hashes were checked in that historical pass.

That historical evidence established consistency with the selected source at its recorded date. The current checkout lacks the selected healthcare_db/ directory; an untracked heathcare_db/ copy has a different catalog and 26 recorded SQL-file hash mismatches. Current planning uses checked-in table pages; live deployment and source parity are unverified.

The user-supplied `healthcare_db/` folder remains the selected documentation baseline; its historical migration/catalog evidence is retained, rather than replaced by the mismatched current copy. [Migration evidence](../04-Database/Migrations.md) closes the former source-selection warning and retains actual target-ledger/runtime-parity checks under D-015.

## Documentation checks and remaining limits

The earlier validation baseline recorded 449 Markdown files, 3,835 relative links/anchors and 1,594 tables passing structural checks. All 52 Mermaid blocks parse and render; the original 51 contained 18 actual parser failures. Feature/test-reference checks and the validator’s negative regression fixture pass.

Seven representative images received visual review; interactive VS Code preview, hosted GitHub rendering and hosted CI remain unverified.

No application/provider/live-database tests ran. Read the [engineering audit](Engineering-Audit.md) for exact evidence, blocker owners and production-readiness limits, and [conventions](Documentation-Conventions.md) to reproduce local checks.

## API and master-data planning validation

The current [validation record](../05-APIs/Planning-Validation.md) reports OpenAPI 3.1, JSON Schema examples, exact documented columns, authorization, feature/master mappings and repository commands. All 266 tables are classified, with 44 master plans and 11 explicit initial-value lists; 33 master datasets remain Open. No application tests, source migrations or seeds were changed.
