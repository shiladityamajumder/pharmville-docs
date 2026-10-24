# `diagnostics.diagnostic_result_values`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds diagnostic result values records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.diagnostic_result_values |
| Classification | Transactional |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `abnormal_flag` | `character varying(32)` | Yes | — | Inferred: stores abnormal flag for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `analyte_code` | `character varying(128)` | No | — | Code for analyte | Link to controlled business classification or an external reference | Collation: default |
| `analyte_name` | `character varying(255)` | No | — | Inferred: stores analyte name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_result_values_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `reference_range` | `character varying(255)` | Yes | — | Inferred: stores reference range for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `report_id` | `uuid` | No | — | Reference linking this record to diagnostic reports | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_reports` via `fk_diagnostics_diagnostic_result_values_report_id_diagn_c377` |
| `report_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_reports` via `fk_diagnostics_diagnostic_result_values_report_id_diagn_dc45` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `test_definition_id` | `uuid` | Yes | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` via `fk_diagnostics_diagnostic_result_values_test_definition_ed77` |
| `test_definition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` via `fk_diagnostics_diagnostic_result_values_test_definition_9bb2` |
| `unit` | `character varying(64)` | Yes | — | Inferred: stores unit for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_result_values_updated_by_users` |
| `value_numeric` | `numeric(18,6)` | Yes | — | Inferred: stores value numeric for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `value_text` | `text` | Yes | — | Inferred: stores value text for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the diagnostic result values business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.diagnostic_result_values` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_diagnostic_result_values_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_result_values_report_id_diagn_c377 | `report_id` | [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | `FOREIGN KEY (report_id) REFERENCES diagnostics.diagnostic_reports(id) ON DELETE CASCADE` |
| fk_diagnostics_diagnostic_result_values_report_id_diagn_dc45 | `report_id_internal_id` | [`diagnostics.diagnostic_reports`](../../Tables/diagnostics/diagnostic_reports.md) | `FOREIGN KEY (report_id_internal_id) REFERENCES diagnostics.diagnostic_reports(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_diagnostic_result_values_test_definition_9bb2 | `test_definition_id_internal_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_result_values_test_definition_ed77 | `test_definition_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_result_values_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `diagnostics.diagnostic_result_values` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_diagnostic_result_values_created_by_users` |
| `report_id` | `diagnostics.diagnostic_reports` | `fk_diagnostics_diagnostic_result_values_report_id_diagn_c377` |
| `report_id_internal_id` | `diagnostics.diagnostic_reports` | `fk_diagnostics_diagnostic_result_values_report_id_diagn_dc45` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_diagnostic_result_values_test_definition_9bb2` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_diagnostic_result_values_test_definition_ed77` |
| `updated_by` | `identity.users` | `fk_diagnostics_diagnostic_result_values_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_diagnostic_result_values_finite_numeric_values` | CHECK | `CHECK (value_numeric IS NULL OR (value_numeric <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_diagnostics_diagnostic_result_values_numeric_pair_report_id` | CHECK | `CHECK ((report_id IS NULL) = (report_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_result_values_numeric_pair_te_44d8` | CHECK | `CHECK ((test_definition_id IS NULL) = (test_definition_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_result_values_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_diagnostic_result_values_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_result_values_report_id_diagn_c377` | FOREIGN KEY | `FOREIGN KEY (report_id) REFERENCES diagnostics.diagnostic_reports(id) ON DELETE CASCADE` |
| `fk_diagnostics_diagnostic_result_values_report_id_diagn_dc45` | FOREIGN KEY | `FOREIGN KEY (report_id_internal_id) REFERENCES diagnostics.diagnostic_reports(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_diagnostic_result_values_test_definition_9bb2` | FOREIGN KEY | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_result_values_test_definition_ed77` | FOREIGN KEY | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_result_values_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_diagnostic_result_values` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_diagnostic_result_values_id` | UNIQUE | `UNIQUE (id)` |
| `diagnostic_result_values_analyte_code_not_null` | NOT NULL | `NOT NULL analyte_code` |
| `diagnostic_result_values_analyte_name_not_null` | NOT NULL | `NOT NULL analyte_name` |
| `diagnostic_result_values_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `diagnostic_result_values_id_not_null` | NOT NULL | `NOT NULL id` |
| `diagnostic_result_values_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `diagnostic_result_values_report_id_internal_id_not_null` | NOT NULL | `NOT NULL report_id_internal_id` |
| `diagnostic_result_values_report_id_not_null` | NOT NULL | `NOT NULL report_id` |
| `diagnostic_result_values_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `diagnostic_result_values_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_result_values_report` | btree | `(report_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_result_values_report ON diagnostics.diagnostic_result_values USING btree (report_id)` |
| `ix_diagnostics_result_values_test` | btree | `(test_definition_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_result_values_test ON diagnostics.diagnostic_result_values USING btree (test_definition_id)` |
| `pk_diagnostics_diagnostic_result_values` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_diagnostic_result_values ON diagnostics.diagnostic_result_values USING btree (internal_id)` |
| `uq_diagnostics_diagnostic_result_values_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_result_values_id ON diagnostics.diagnostic_result_values USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_result_values FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["report_id","report_id_internal_id","diagnostics","diagnostic_reports"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.diagnostic_result_values FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_result_values FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["report_id","report_id_internal_id","diagnostics","diagnostic_reports"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
