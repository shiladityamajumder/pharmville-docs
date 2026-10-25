# Standalone schema installation

## Scope and prerequisites

[pharmville_schema.sql](../pharmville-database/pharmville_schema.sql) creates an empty final schema through V0030. The directory intentionally contains only this SQL file. Historical migrations, Python models and runners are private archived reconstruction inputs, not deployment dependencies. PostgreSQL **18.6** is the version actually validated; compatibility with earlier versions is unverified.

Use a newly created, dedicated empty database. The installation identity must own it and have permission to install `pgcrypto`, create schemas/functions, change its own default privileges and create the four NOLOGIN capability groups. Database/role provisioning belongs to the deployment owner. Do not reuse an application login or run against an existing database. No credentials or connection string are supplied here.

The SQL creates four hardened NOLOGIN/NOINHERIT capability groups only when absent. Existing privileged or login-enabled groups with those names cause an exception; the script does not weaken them. Runtime login identities and memberships require a separate least-privilege deployment decision. RLS, PUBLIC routine-execution revocations, SECURITY DEFINER search paths and column-level grants are retained. SQL ownership and default privileges bind to the installation identity; application access remains permission- and scope-checked.

## Fresh installation

Using an explicitly provisioned empty database and an explicit local connection, execute with `psql -X --set=ON_ERROR_STOP=1 --file=pharmville-database/pharmville_schema.sql`. The file supplies its own transaction and final constraints; no migration framework is required. Configure PostgreSQL lock capacity for the 266-table installation. The isolated reconstruction required `max_locks_per_transaction=2048` for historical V0022; increasing that private setting resolved a rolled-back lock-allocation failure. No user database was altered.

## Data and activation

There are **no data/seed INSERTs** in the standalone deployment script. INSERT statements inside stored routine bodies are retained behavior, not executed seed scripts. The source chain inserted the three confirmed P/M/O commerce-class rows; those rows are deliberately excluded from the schema-only export. Before activating catalog writes, the owning team must create those confirmed records through an independently reviewed bootstrap process compatible with their IDs and constraints. See [master-data inventory](Master-Data-Inventory.md). Proposed medicines, tax rates, provider identifiers and permission assignments remain unapproved. A successful empty-schema installation is not a production readiness or seed approval.

## Reproduce verification

Run `npm run validate:database` for checksum and full documentation/catalog comparison. Run `python3 scripts/validate-database.py --fresh` to initialize a private disposable PostgreSQL cluster, install the one SQL file, compare all 23 catalog dimensions and stop that cluster. It never reads `.env`, connects to a supplied production URL, or runs the archived application. PostgreSQL binaries must be available (or `--pg-bin` must name their directory). Run `python3 scripts/generate-database-docs.py`, then `npm run generate:erd` only when intentionally updating derived references.

The checked-in [parity evidence](../09-References/Database-Parity-Result.json) records the executed source-chain-versus-standalone comparison. No production database was queried.

## D-028 current schema revision

The counts/source-only statements above describe the preserved V0030 historical baseline. Current canonical SQL additionally contains the explicit **Proposed / Unapproved / Not Implemented** unified Identity design: 268 tables, 4,485 columns, 1,476 FKs, 1,222 indexes, 58 functions, 883 user triggers, 267 identity sequences and 3 unchanged RLS policies. The baseline retained all objects; current SQL installs into two isolated empty databases with zero catalog differences. See [current verification](../09-References/Unified-Authentication-Database-Validation.json) and [identity reconciliation](Identity-Authentication-Assessment.md). No production database or data migration is involved.
