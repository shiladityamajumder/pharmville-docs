# `platform.report_runs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds report runs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.report_runs |
| Classification | Derived / Operational |
| Proposed business write owner | Reporting |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `definition_id` | `uuid` | No | — | Reference linking this record to report definitions | Ensures related business data can be joined and validated | FK → `platform.report_definitions` via `fk_platform_report_runs_definition_id_report_definitions` |
| `definition_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.report_definitions` via `fk_platform_report_runs_definition_id_report_definition_1bb3` |
| `error_code` | `character varying(80)` | Yes | — | Code for error | Link to controlled business classification or an external reference | Collation: default |
| `finished_at` | `timestamp with time zone` | Yes | — | Time of finished | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `parameters` | `jsonb` | No | `'{}'::jsonb` | Structured parameters information | Retain a versioned payload or relevant details | Exact constraints below |
| `requested_at` | `timestamp with time zone` | No | `now()` | Time of requested | Support chronology, deadlines or audit evidence | Exact constraints below |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_report_runs_requested_by_user_id_users` |
| `result_expires_at` | `timestamp with time zone` | Yes | — | Time of result expires | Support chronology, deadlines or audit evidence | Exact constraints below |
| `result_file_object_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_platform_report_runs_result_file_object_id_file_objects` |
| `result_file_object_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_platform_report_runs_result_file_object_id_file_obje_a9ad` |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |

## Record lifecycle and users

- **Created:** when the report runs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.report_runs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_report_runs_definition_id_report_definition_1bb3 | `definition_id_internal_id` | [`platform.report_definitions`](../../Tables/platform/report_definitions.md) | `FOREIGN KEY (definition_id_internal_id) REFERENCES platform.report_definitions(internal_id) ON DELETE RESTRICT` |
| fk_platform_report_runs_definition_id_report_definitions | `definition_id` | [`platform.report_definitions`](../../Tables/platform/report_definitions.md) | `FOREIGN KEY (definition_id) REFERENCES platform.report_definitions(id) ON DELETE RESTRICT` |
| fk_platform_report_runs_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_report_runs_result_file_object_id_file_obje_a9ad | `result_file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (result_file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| fk_platform_report_runs_result_file_object_id_file_objects | `result_file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (result_file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.report_runs` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `definition_id_internal_id` | `platform.report_definitions` | `fk_platform_report_runs_definition_id_report_definition_1bb3` |
| `definition_id` | `platform.report_definitions` | `fk_platform_report_runs_definition_id_report_definitions` |
| `requested_by_user_id` | `identity.users` | `fk_platform_report_runs_requested_by_user_id_users` |
| `result_file_object_id_internal_id` | `platform.file_objects` | `fk_platform_report_runs_result_file_object_id_file_obje_a9ad` |
| `result_file_object_id` | `platform.file_objects` | `fk_platform_report_runs_result_file_object_id_file_objects` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_report_runs_numeric_pair_definition_id` | CHECK | `CHECK ((definition_id IS NULL) = (definition_id_internal_id IS NULL))` |
| `ck_platform_report_runs_numeric_pair_result_file_object_id` | CHECK | `CHECK ((result_file_object_id IS NULL) = (result_file_object_id_internal_id IS NULL))` |
| `ck_platform_report_runs_status` | CHECK | `CHECK (status::text = ANY (ARRAY['queued'::text, 'running'::text, 'succeeded'::text, 'failed'::text, 'expired'::text]))` |
| `fk_platform_report_runs_definition_id_report_definition_1bb3` | FOREIGN KEY | `FOREIGN KEY (definition_id_internal_id) REFERENCES platform.report_definitions(internal_id) ON DELETE RESTRICT` |
| `fk_platform_report_runs_definition_id_report_definitions` | FOREIGN KEY | `FOREIGN KEY (definition_id) REFERENCES platform.report_definitions(id) ON DELETE RESTRICT` |
| `fk_platform_report_runs_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_report_runs_result_file_object_id_file_obje_a9ad` | FOREIGN KEY | `FOREIGN KEY (result_file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_platform_report_runs_result_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (result_file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `pk_platform_report_runs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_report_runs_id` | UNIQUE | `UNIQUE (id)` |
| `report_runs_definition_id_internal_id_not_null` | NOT NULL | `NOT NULL definition_id_internal_id` |
| `report_runs_definition_id_not_null` | NOT NULL | `NOT NULL definition_id` |
| `report_runs_id_not_null` | NOT NULL | `NOT NULL id` |
| `report_runs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `report_runs_parameters_not_null` | NOT NULL | `NOT NULL parameters` |
| `report_runs_requested_at_not_null` | NOT NULL | `NOT NULL requested_at` |
| `report_runs_requested_by_user_id_not_null` | NOT NULL | `NOT NULL requested_by_user_id` |
| `report_runs_status_not_null` | NOT NULL | `NOT NULL status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_platform_report_runs_queue` | btree | `(status, requested_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_report_runs_queue ON platform.report_runs USING btree (status, requested_at)` |
| `ix_platform_report_runs_user_time` | btree | `(requested_by_user_id, requested_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_report_runs_user_time ON platform.report_runs USING btree (requested_by_user_id, requested_at DESC)` |
| `pk_platform_report_runs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_report_runs ON platform.report_runs USING btree (internal_id)` |
| `uq_platform_report_runs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_report_runs_id ON platform.report_runs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.report_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["definition_id","definition_id_internal_id","platform","report_definitions"],["result_file_object_id","result_file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `report_run_guard` | `CREATE TRIGGER report_run_guard BEFORE INSERT OR UPDATE ON platform.report_runs FOR EACH ROW EXECUTE FUNCTION platform.guard_report_run()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.report_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["definition_id","definition_id_internal_id","platform","report_definitions"],["result_file_object_id","result_file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
