# `platform.report_definitions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds report definitions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.report_definitions |
| Classification | Configuration |
| Proposed business write owner | Reporting |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(100)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `data_classification` | `character varying(16)` | Yes | — | Inferred: stores data classification for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `export_ttl_seconds` | `integer` | Yes | — | Inferred: stores export ttl seconds for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `owner_role` | `character varying(64)` | No | — | Inferred: stores owner role for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `parameters_schema` | `jsonb` | No | `'{}'::jsonb` | Structured parameters schema information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |

## Record lifecycle and users

- **Created:** when the report definitions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.report_definitions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

No outbound FK is present in the validated catalog.

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`platform.report_runs`](../../Tables/platform/report_runs.md) | fk_platform_report_runs_definition_id_report_definition_1bb3 | `definition_id_internal_id` | `internal_id` |
| [`platform.report_runs`](../../Tables/platform/report_runs.md) | fk_platform_report_runs_definition_id_report_definitions | `definition_id` | `id` |

## `platform.report_definitions` — exact structural contracts

### Existing foreign-key dependencies

Not Applicable.

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_report_definitions_data_classification` | CHECK | `CHECK (data_classification IS NULL OR (data_classification::text = ANY (ARRAY['operational'::text, 'health'::text])))` |
| `ck_platform_report_definitions_export_ttl_range` | CHECK | `CHECK (export_ttl_seconds IS NULL OR export_ttl_seconds >= 60 AND export_ttl_seconds <= 86400)` |
| `ck_platform_report_definitions_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `pk_platform_report_definitions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_report_definitions_code` | UNIQUE | `UNIQUE (code)` |
| `uq_platform_report_definitions_id` | UNIQUE | `UNIQUE (id)` |
| `report_definitions_code_not_null` | NOT NULL | `NOT NULL code` |
| `report_definitions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `report_definitions_id_not_null` | NOT NULL | `NOT NULL id` |
| `report_definitions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `report_definitions_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `report_definitions_name_not_null` | NOT NULL | `NOT NULL name` |
| `report_definitions_owner_role_not_null` | NOT NULL | `NOT NULL owner_role` |
| `report_definitions_parameters_schema_not_null` | NOT NULL | `NOT NULL parameters_schema` |
| `report_definitions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_platform_report_definitions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_report_definitions ON platform.report_definitions USING btree (internal_id)` |
| `uq_platform_report_definitions_code` | btree | `(code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_report_definitions_code ON platform.report_definitions USING btree (code)` |
| `uq_platform_report_definitions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_report_definitions_id ON platform.report_definitions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `report_definition_guard` | `CREATE TRIGGER report_definition_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.guard_report_definition()` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
