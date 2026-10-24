# `platform.report_definitions`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds report definitions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 6 constraints, 3 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(100)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `data_classification` | `character varying(16)` | Yes | — | Inferred: stores data classification for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `export_ttl_seconds` | `integer` | Yes | — | Inferred: stores export ttl seconds for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `owner_role` | `character varying(64)` | No | — | Inferred: stores owner role for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `parameters_schema` | `jsonb` | No | `'{}'::jsonb` | Structured parameters schema information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the report definitions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.report_definitions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

No outgoing foreign key recorded.

**Referenced by 2 FK constraints** (sample): `platform.report_runs`, `platform.report_runs`.

## `platform.report_definitions` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 6 constraints, 3 indexes, 5 triggers.

### Existing foreign-key dependencies

No foreign-key constraints are recorded for this table in the supplied final catalog.

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_report_definitions_data_classification` | CHECK | `CHECK (data_classification IS NULL OR (data_classification::text = ANY (ARRAY['operational'::text, 'health'::text])))` |
| `ck_platform_report_definitions_export_ttl_range` | CHECK | `CHECK (export_ttl_seconds IS NULL OR export_ttl_seconds >= 60 AND export_ttl_seconds <= 86400)` |
| `ck_platform_report_definitions_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `pk_platform_report_definitions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_report_definitions_code` | UNIQUE | `UNIQUE (code)` |
| `uq_platform_report_definitions_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_platform_report_definitions` | `CREATE UNIQUE INDEX pk_platform_report_definitions ON platform.report_definitions USING btree (internal_id)` |
| `uq_platform_report_definitions_code` | `CREATE UNIQUE INDEX uq_platform_report_definitions_code ON platform.report_definitions USING btree (code)` |
| `uq_platform_report_definitions_id` | `CREATE UNIQUE INDEX uq_platform_report_definitions_id ON platform.report_definitions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `report_definition_guard` | `CREATE TRIGGER report_definition_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.guard_report_definition()` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('timestamp')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.report_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
