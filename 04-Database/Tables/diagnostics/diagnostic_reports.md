# `diagnostics.diagnostic_reports`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds diagnostic reports records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.diagnostic_reports |
| Classification | Transactional |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_reports_created_by_users` |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_378a` |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_64d1` |
| `file_object_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_diagnostics_diagnostic_reports_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_diagnostics_diagnostic_reports_file_object_id_file_o_e8a0` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `released_at` | `timestamp with time zone` | Yes | — | Time of released | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `structured_result` | `jsonb` | No | — | Structured structured result information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_reports_updated_by_users` |
| `verified_at` | `timestamp with time zone` | Yes | — | Time of verified | Support chronology, deadlines or audit evidence | Exact constraints below |
| `verified_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_reports_verified_by_user_id_users` |
| `version_no` | `integer` | No | `1` | Inferred: stores version no for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the diagnostic reports business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.diagnostic_reports` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_diagnostic_reports_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_378a | `diagnostic_order_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_64d1 | `diagnostic_order_id_internal_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_diagnostic_reports_file_object_id_file_o_e8a0 | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_reports_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_reports_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_reports_verified_by_user_id_users | `verified_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (verified_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`diagnostics.diagnostic_result_values`](../../Tables/diagnostics/diagnostic_result_values.md) | fk_diagnostics_diagnostic_result_values_report_id_diagn_c377 | `report_id` | `id` |
| [`diagnostics.diagnostic_result_values`](../../Tables/diagnostics/diagnostic_result_values.md) | fk_diagnostics_diagnostic_result_values_report_id_diagn_dc45 | `report_id_internal_id` | `internal_id` |

## `diagnostics.diagnostic_reports` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_diagnostic_reports_created_by_users` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_378a` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_64d1` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_diagnostics_diagnostic_reports_file_object_id_file_o_e8a0` |
| `file_object_id` | `platform.file_objects` | `fk_diagnostics_diagnostic_reports_file_object_id_file_objects` |
| `updated_by` | `identity.users` | `fk_diagnostics_diagnostic_reports_updated_by_users` |
| `verified_by_user_id` | `identity.users` | `fk_diagnostics_diagnostic_reports_verified_by_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_diagnostic_reports_numeric_pair_diagnost_3d0e` | CHECK | `CHECK ((diagnostic_order_id IS NULL) = (diagnostic_order_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_reports_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_reports_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `diagnostic_report_version` | UNIQUE | `UNIQUE (diagnostic_order_id, version_no)` |
| `fk_diagnostics_diagnostic_reports_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_378a` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| `fk_diagnostics_diagnostic_reports_diagnostic_order_id_d_64d1` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_diagnostic_reports_file_object_id_file_o_e8a0` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_reports_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_reports_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_reports_verified_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (verified_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_diagnostics_diagnostic_reports` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_diagnostic_reports_id` | UNIQUE | `UNIQUE (id)` |
| `diagnostic_reports_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `diagnostic_reports_diagnostic_order_id_internal_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id_internal_id` |
| `diagnostic_reports_diagnostic_order_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id` |
| `diagnostic_reports_id_not_null` | NOT NULL | `NOT NULL id` |
| `diagnostic_reports_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `diagnostic_reports_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `diagnostic_reports_status_not_null` | NOT NULL | `NOT NULL status` |
| `diagnostic_reports_structured_result_not_null` | NOT NULL | `NOT NULL structured_result` |
| `diagnostic_reports_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `diagnostic_reports_version_no_not_null` | NOT NULL | `NOT NULL version_no` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `diagnostic_report_version` | btree | `(diagnostic_order_id, version_no)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX diagnostic_report_version ON diagnostics.diagnostic_reports USING btree (diagnostic_order_id, version_no)` |
| `ix_diagnostics_reports_order` | btree | `(diagnostic_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_reports_order ON diagnostics.diagnostic_reports USING btree (diagnostic_order_id)` |
| `pk_diagnostics_diagnostic_reports` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_diagnostic_reports ON diagnostics.diagnostic_reports USING btree (internal_id)` |
| `uq_diagnostics_diagnostic_reports_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_reports_id ON diagnostics.diagnostic_reports USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.diagnostic_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
