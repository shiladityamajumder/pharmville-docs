# Migration history and evidence

## Available checkout and authority

Checked on **23 October 2026**. The sibling `healthcare_db` repository’s README names `postgresql/migrations/` as the SQL deployment authority and freezes historical Alembic execution. The actual directory is `healthcare_db/postgresql/migrations/`, with no second nested directory.

The available checkout contains **30 versioned SQL files, V0001 through V0030**. Its Git revision and every versioned migration’s SHA-256 are recorded in [Database-Evidence.json](../09-References/Database-Evidence.json). Both the documentation and database directories have their own Git metadata; earlier outer-repository/untracked claims do not describe this checkout.

## Intended release discrepancy

The user reports that V0030 was removed from their intended latest database. The available checkout nevertheless contains `V0030__fulfillment_completion_and_settlement_gates.sql`; its SHA-256 is `5e0c2647933d8106d9da4c140aeb0899260f1388a77a04ec21345c3207924043`. The recorded acceptance report also explicitly describes V0030.

These facts do not establish which release the user intends to deploy. **The discrepancy remains open under D-015.** Do not remove, reintroduce, renumber or execute migrations based on this documentation pass. The database/release owner must identify the intended Git revision, compare its sealed checksums with the target ledger, and regenerate schema/guard evidence for that exact baseline. Product confirms the intended release; the DBA/Tech lead approves compatibility and evidence.

V0030 adds fulfillment completion and dispatch money/stock gates in the available source. If excluded from the intended release, those protections cannot be claimed as present in that target until equivalent evidence is supplied. Business safety expectations remain requirements for implementation.

## Recorded schema evidence

The sibling source `docs/upgrade/final_assignment/final_table_register.json` contains 266 table entries. Its checksum is retained in the snapshot. This pass compares table-page column inventories with that catalog; it does not introspect a live database.

The source `FINAL_DATABASE_ACCEPTANCE_REPORT.md` records isolated PostgreSQL 18 validation on **22 October 2026**, explicitly for the V0030 baseline:

| Recorded object | Count |
| --- | ---: |
| Schemas | 24 |
| Tables | 266 |
| Columns | 4,438 |
| Foreign keys | 1,461 |
| Unique constraints | 438 |
| Checks | 1,033 |
| Indexes | 1,204 |
| Functions | 56 |
| Triggers | 879 |

These are historical local results for that baseline, not fresh tests or evidence for a hypothetical V0029 release. The report says the temporary test cluster was removed; re-execution needs a new isolated cluster. PostgreSQL 15, hosted CI, production deployment, live providers and the target ledger remain unverified here.

## Reproducible documentation evidence

The portable [snapshot](../09-References/Database-Evidence.json) preserves filenames/checksums and source revision without links outside this repository. With the sibling checkout available, `npm run validate:database` compares its revision, SQL bytes and catalog fields against the snapshot and documentation. This read-only check never opens a database connection. Missing source or a different revision is reported as unavailable/mismatched, not passed.

No migrations, models, application files or database configuration were changed or executed in this pass. Documentation-only CI checks internal references; the intended release still needs owner review.
