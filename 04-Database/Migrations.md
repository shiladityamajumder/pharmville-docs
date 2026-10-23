# Migration history and evidence

## Source of truth

The available [SQL migration directory](../../healthcare_db/healthcare_db/postgresql/migrations/) contains V0001 through V0030. The [database repository policy](../../healthcare_db/healthcare_db/README.md) names SQL migrations as the deployment authority and freezes historical Alembic execution. Do not remove, recreate, or choose migrations based on an unsupported removal claim in documentation.

The workspace has a Git repository. The database and current product documentation directories are untracked in that outer repository, so its history cannot establish their intended upstream revision. No live migration ledger was inspected. The deployment owner must compare the target ledger and checksums with the intended release before applying changes; local file presence does not prove deployment.

## Recorded schema evidence

The [final table register](../../healthcare_db/healthcare_db/docs/upgrade/final_assignment/final_table_register.json) records 266 tables. The database repository reports local PostgreSQL 18 validation dated 2026-10-22: 24 schemas, 4,438 columns, 1,461 foreign keys, 438 unique constraints, 1,033 checks, 1,204 indexes, 56 functions and 879 triggers. These are recorded local results, not a fresh validation or production state. See the [database acceptance report](../../healthcare_db/healthcare_db/FINAL_DATABASE_ACCEPTANCE_REPORT.md).

No schema, ORM, migration or runtime configuration changes are part of this documentation audit.
