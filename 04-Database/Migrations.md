# Database source and migration evidence

## Supplied database reference

The user supplied [healthcare_db/](../healthcare_db/README.md) inside this documentation repository as the exact database reference. Its README identifies `postgresql/migrations/` as the deployment source of truth and freezes historical Alembic execution.

The supplied folder contains **30 versioned SQL migrations, V0001 through V0030**, plus included fragments: **103 SQL files in total**. These files are retained as the database’s history. The documentation now follows this supplied source; the previous claim that V0030 had been removed is retired.

The supplied folder has no standalone Git metadata. Its identity is recorded using SHA-256 checksums in [Database-Evidence.json](../09-References/Database-Evidence.json), covering every migration/fragment, the final table register, supporting model/schema sources and the recorded acceptance report. The earlier sibling checkout revision is retained only as historical provenance; the documentation repository’s Git HEAD must not be mistaken for a database revision.

## Verification performed

Read-only validation checks the supplied migration file set and hashes, the catalog hash and all 266 table-page column inventories. The source matches the previously recorded 30 versioned migration hashes and final catalog hash. The [ER diagrams](ER-Diagrams/README.md) are regenerated from that same verified catalog.

Source selection is resolved for this documentation. D-015 retains the separate deployment tasks: compare the actual target database ledger and runtime ORM/data-access parity with this source before deployment. No live database connection, migration execution or new PostgreSQL acceptance run is claimed.

## Recorded schema evidence

The supplied `FINAL_DATABASE_ACCEPTANCE_REPORT.md` records isolated PostgreSQL 18 validation on **22 October 2026** for this migration history:

| Recorded object | Count |
|---|---:|
| Schemas | 24 |
| Tables | 266 |
| Columns | 4,438 |
| Foreign keys | 1,461 |
| Unique constraints | 438 |
| Checks | 1,033 |
| Indexes | 1,204 |
| Functions | 56 |
| Triggers | 879 |

The machine-readable catalog is `healthcare_db/docs/upgrade/final_assignment/final_table_register.json`. These are supplied historical results, not fresh live-database measurements. PostgreSQL 15, hosted CI and production deployment remain separately unverified here.

## Reproduce the source checks

Run `npm run validate:database` from the documentation repository root. It uses the supplied `healthcare_db/` folder by default. To inspect an explicitly selected copy, set `PHARMVILLE_DATABASE_SOURCE` to its path; the same recorded checksums must match. Missing or changed files fail verification. The checker never opens a database connection.

Run `npm run generate:erd`, `npm run validate:erd` and `npm run validate` to regenerate and validate the derived documentation. `npm run test:database-source` checks local-folder selection, source identity and rejection of altered or missing migrations, fragments and supporting files.

No supplied SQL migrations, SQLAlchemy models or database configuration were modified or executed.
