# Database reconciliation

## Executed comparison

The supplied V0030 table register and the independently reconstructed catalog agree on **all 266 tables, 4,438 columns, 3,198 key/check constraints, 1,204 indexes and 879 triggers**. The bidirectional register comparison found **zero differences**, recorded in [Historical-Register-Differences.json](Historical-Register-Differences.json). The prior Markdown field comparison likewise found zero type/default/nullability differences; [Documentation-Reconciliation.json](Documentation-Reconciliation.json) records the baseline. No speculative object was added to SQL.

The standalone schema was installed into another empty PostgreSQL 18.6 database. Its effective catalog agrees with the migration-replayed source across all 23 compared object categories: **zero unexplained structural differences**. See [parity evidence](../09-References/Database-Parity-Result.json).

## Resolved documentation discrepancies

| Difference | Classification | Resolution |
| --- | --- | --- |
| `healthcare_db` versus inspected `heathcare_db` source; stale source-Git/live-validation claims | Outdated provenance | Current evidence records the actual nested Git revision, directly hashed replay inputs, private archive and executed isolated replay. The 26 SQL-checksum differences from the superseded supplied-folder manifest are preserved as historical provenance, not asserted as identical inputs. The full effective table register still has zero structural differences. |
| Table pages lacked a complete standalone ownership/classification and inbound dependency reference | Existing authoritative objects plus proposed business ownership | All pages regenerated from the validated catalog, preserving business descriptions and all master-data appendices. Proposed module write ownership is separate from SQL grants. |
| Named PostgreSQL 18 NOT NULL constraints were implicit in column nullability | Existing authoritative database objects | All 2,929 named constraints now appear explicitly, alongside 3,198 key/check constraints. |
| Sequences, complete functions, ACL/default privileges and RLS were distributed among source fragments | Existing authoritative database objects | [Database objects](Database-Objects.md) and [catalog](Schema-Catalog.json) document every effective object. |
| Final schema required historical migration tooling | Architecture correction expressly requested | Final SQL is extracted effective DDL and installs without Python, Alembic or migrations. Original sources and nested Git history remain private and intact. |
| Source contains confirmed P/M/O bootstrap rows; final SQL must contain no records | Intentional data exclusion | Record definitions remain confirmed master planning; owner-controlled bootstrap is a separate prerequisite. |
| Future service domains exist physically without committed product requirements | Unresolved scope/ownership | Retain every object. Mark future ownership D-027; no public APIs or product approvals inferred from table existence. |

## Authority and proposals

[pharmville_schema.sql](../pharmville-database/pharmville_schema.sql) is authoritative structure. [Schema-Catalog.json](Schema-Catalog.json), [Table-Register.json](Table-Register.json), table pages and ER diagrams are derived references. `npm run validate:database` checks structure in both directions. `python3 scripts/validate-database.py --fresh` re-executes the SQL in an independent private cluster and compares catalogs.

The [master-data inventory](Master-Data-Inventory.md), permission assignments, runtime login provisioning, module write-owner decisions, provider contracts and future capabilities remain planning decisions. Their proposed state does not alter constraints or authorize production activation. No evidence-backed approved requirement was found missing from the effective SQL; API fields identified as proposals remain separately recorded in planning decisions.
