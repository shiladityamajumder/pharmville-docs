# platform.report_runs

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds report runs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 10 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `definition_id` | `uuid` | No | — | Reference linking this record to report definitions | Ensures related business data can be joined and validated | FK → `platform.report_definitions` (fk_platform_report_runs_definition_id_report_definitions) |
| `definition_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.report_definitions` (fk_platform_report_runs_definition_id_report_definition_1bb3); Numeric/public-key pair verification required |
| `error_code` | `character varying(80)` | Yes | — | Code for error | Link to controlled business classification or an external reference | See exact constraints |
| `finished_at` | `timestamp with time zone` | Yes | — | Time of finished | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `parameters` | `jsonb` | No | `'{}'::jsonb` | Structured parameters information | Retain a versioned payload or relevant details | See exact constraints |
| `requested_at` | `timestamp with time zone` | No | `now()` | Time of requested | Support chronology, deadlines or audit evidence | See exact constraints |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_report_runs_requested_by_user_id_users) |
| `result_expires_at` | `timestamp with time zone` | Yes | — | Time of result expires | Support chronology, deadlines or audit evidence | See exact constraints |
| `result_file_object_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_report_runs_result_file_object_id_file_objects) |
| `result_file_object_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_report_runs_result_file_object_id_file_obje_a9ad); Numeric/public-key pair verification required |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the report runs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.report_runs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `requested_by_user_id` → `identity.users(id)` via `fk_platform_report_runs_requested_by_user_id_users`; FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `definition_id` → `platform.report_definitions(id)` via `fk_platform_report_runs_definition_id_report_definitions`; FOREIGN KEY (definition_id) REFERENCES platform.report_definitions(id) ON DELETE RESTRICT
- `result_file_object_id` → `platform.file_objects(id)` via `fk_platform_report_runs_result_file_object_id_file_objects`; FOREIGN KEY (result_file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT
- `definition_id_internal_id` → `platform.report_definitions(internal_id)` via `fk_platform_report_runs_definition_id_report_definition_1bb3`; FOREIGN KEY (definition_id_internal_id) REFERENCES platform.report_definitions(internal_id) ON DELETE RESTRICT
- `result_file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_report_runs_result_file_object_id_file_obje_a9ad`; FOREIGN KEY (result_file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT

## platform.report_runs — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 10 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `requested_by_user_id` | `identity.users` | `fk_platform_report_runs_requested_by_user_id_users` |
| `definition_id` | `platform.report_definitions` | `fk_platform_report_runs_definition_id_report_definitions` |
| `result_file_object_id` | `platform.file_objects` | `fk_platform_report_runs_result_file_object_id_file_objects` |
| `definition_id_internal_id` | `platform.report_definitions` | `fk_platform_report_runs_definition_id_report_definition_1bb3` |
| `result_file_object_id_internal_id` | `platform.file_objects` | `fk_platform_report_runs_result_file_object_id_file_obje_a9ad` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_report_runs_queue` | `CREATE INDEX ix_platform_report_runs_queue ON platform.report_runs USING btree (status, requested_at)` |
| `ix_platform_report_runs_user_time` | `CREATE INDEX ix_platform_report_runs_user_time ON platform.report_runs USING btree (requested_by_user_id, requested_at DESC)` |
| `pk_platform_report_runs` | `CREATE UNIQUE INDEX pk_platform_report_runs ON platform.report_runs USING btree (internal_id)` |
| `uq_platform_report_runs_id` | `CREATE UNIQUE INDEX uq_platform_report_runs_id ON platform.report_runs USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.report_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["definition_id","definition_id_internal_id","platform","report_definitions"],["result_file_object_id","result_file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `report_run_guard` | `CREATE TRIGGER report_run_guard BEFORE INSERT OR UPDATE ON platform.report_runs FOR EACH ROW EXECUTE FUNCTION platform.guard_report_run()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.report_runs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["definition_id","definition_id_internal_id","platform","report_definitions"],["result_file_object_id","result_file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
