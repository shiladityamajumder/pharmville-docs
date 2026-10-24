# `diagnostics.test_package_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds test package items records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.test_package_items |
| Classification | Mapping / Junction |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_test_package_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `package_id` | `uuid` | No | — | Reference linking this record to test packages | Ensures related business data can be joined and validated | FK → `diagnostics.test_packages` via `fk_diagnostics_test_package_items_package_id_test_packages` |
| `package_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_packages` via `fk_diagnostics_test_package_items_package_id_test_packa_0d15` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `test_definition_id` | `uuid` | No | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` via `fk_diagnostics_test_package_items_test_definition_id_te_2de4` |
| `test_definition_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` via `fk_diagnostics_test_package_items_test_definition_id_te_c996` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_test_package_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the test package items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.test_package_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_test_package_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_test_package_items_package_id_test_packa_0d15 | `package_id_internal_id` | [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | `FOREIGN KEY (package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_test_package_items_package_id_test_packages | `package_id` | [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | `FOREIGN KEY (package_id) REFERENCES diagnostics.test_packages(id) ON DELETE CASCADE` |
| fk_diagnostics_test_package_items_test_definition_id_te_2de4 | `test_definition_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| fk_diagnostics_test_package_items_test_definition_id_te_c996 | `test_definition_id_internal_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_test_package_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `diagnostics.test_package_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_test_package_items_created_by_users` |
| `package_id_internal_id` | `diagnostics.test_packages` | `fk_diagnostics_test_package_items_package_id_test_packa_0d15` |
| `package_id` | `diagnostics.test_packages` | `fk_diagnostics_test_package_items_package_id_test_packages` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_test_package_items_test_definition_id_te_2de4` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_test_package_items_test_definition_id_te_c996` |
| `updated_by` | `identity.users` | `fk_diagnostics_test_package_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_test_package_items_numeric_pair_package_id` | CHECK | `CHECK ((package_id IS NULL) = (package_id_internal_id IS NULL))` |
| `ck_diagnostics_test_package_items_numeric_pair_test_def_f3d7` | CHECK | `CHECK ((test_definition_id IS NULL) = (test_definition_id_internal_id IS NULL))` |
| `ck_diagnostics_test_package_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_test_package_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_package_items_package_id_test_packa_0d15` | FOREIGN KEY | `FOREIGN KEY (package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_test_package_items_package_id_test_packages` | FOREIGN KEY | `FOREIGN KEY (package_id) REFERENCES diagnostics.test_packages(id) ON DELETE CASCADE` |
| `fk_diagnostics_test_package_items_test_definition_id_te_2de4` | FOREIGN KEY | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_package_items_test_definition_id_te_c996` | FOREIGN KEY | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_package_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `package_test` | UNIQUE | `UNIQUE (package_id, test_definition_id)` |
| `pk_diagnostics_test_package_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_test_package_items_id` | UNIQUE | `UNIQUE (id)` |
| `test_package_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `test_package_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `test_package_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `test_package_items_package_id_internal_id_not_null` | NOT NULL | `NOT NULL package_id_internal_id` |
| `test_package_items_package_id_not_null` | NOT NULL | `NOT NULL package_id` |
| `test_package_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `test_package_items_test_definition_id_internal_id_not_null` | NOT NULL | `NOT NULL test_definition_id_internal_id` |
| `test_package_items_test_definition_id_not_null` | NOT NULL | `NOT NULL test_definition_id` |
| `test_package_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_package_items_package` | btree | `(package_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_package_items_package ON diagnostics.test_package_items USING btree (package_id)` |
| `package_test` | btree | `(package_id, test_definition_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX package_test ON diagnostics.test_package_items USING btree (package_id, test_definition_id)` |
| `pk_diagnostics_test_package_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_test_package_items ON diagnostics.test_package_items USING btree (internal_id)` |
| `uq_diagnostics_test_package_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_test_package_items_id ON diagnostics.test_package_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.test_package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["package_id","package_id_internal_id","diagnostics","test_packages"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.test_package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.test_package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["package_id","package_id_internal_id","diagnostics","test_packages"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
