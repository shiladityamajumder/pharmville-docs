# platform.file_upload_sessions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds file upload sessions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 14 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `aborted_at` | `timestamp with time zone` | Yes | — | Time of aborted | Support chronology, deadlines or audit evidence | See exact constraints |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_upload_sessions_created_by_users) |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `failure_reason` | `text` | Yes | — | Inferred: stores failure reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_file_upload_sessions_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_file_upload_sessions_file_object_id_file_ob_88b9); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `multipart_upload_id` | `character varying(512)` | Yes | — | Identifier associated with multipart upload | Link the event or entity to its subject; verify constraints | See exact constraints |
| `requested_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_upload_sessions_requested_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scope` | `character varying(128)` | No | — | Inferred: stores scope for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_upload_sessions_updated_by_users) |
| `upload_method` | `character varying(32)` | No | `'single'::character varying` | Inferred: stores upload method for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the file upload sessions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_upload_sessions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `requested_by_user_id` → `identity.users(id)` via `fk_platform_file_upload_sessions_requested_by_user_id_users`; FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_platform_file_upload_sessions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_platform_file_upload_sessions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `file_object_id` → `platform.file_objects(id)` via `fk_platform_file_upload_sessions_file_object_id_file_objects`; FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_file_upload_sessions_file_object_id_file_ob_88b9`; FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE

## platform.file_upload_sessions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 14 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `requested_by_user_id` | `identity.users` | `fk_platform_file_upload_sessions_requested_by_user_id_users` |
| `created_by` | `identity.users` | `fk_platform_file_upload_sessions_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_file_upload_sessions_updated_by_users` |
| `file_object_id` | `platform.file_objects` | `fk_platform_file_upload_sessions_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_platform_file_upload_sessions_file_object_id_file_ob_88b9` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_upload_sessions_completed_has_timestamp` | CHECK | `CHECK (status::text <> 'completed'::text OR completed_at IS NOT NULL)` |
| `ck_platform_file_upload_sessions_completion_after_created` | CHECK | `CHECK (completed_at IS NULL OR completed_at >= created_at)` |
| `ck_platform_file_upload_sessions_expiry_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_platform_file_upload_sessions_fileuploadstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'uploading'::text, 'completed'::text, 'failed'::text, 'expired'::text, 'aborted'::text]))` |
| `ck_platform_file_upload_sessions_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_platform_file_upload_sessions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `file_upload_scope_key` | UNIQUE | `UNIQUE (scope, idempotency_key)` |
| `fk_platform_file_upload_sessions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_upload_sessions_file_object_id_file_ob_88b9` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| `fk_platform_file_upload_sessions_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| `fk_platform_file_upload_sessions_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_platform_file_upload_sessions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_file_upload_sessions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_upload_sessions_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `file_upload_scope_key` | `CREATE UNIQUE INDEX file_upload_scope_key ON platform.file_upload_sessions USING btree (scope, idempotency_key)` |
| `ix_platform_file_upload_sessions_file` | `CREATE INDEX ix_platform_file_upload_sessions_file ON platform.file_upload_sessions USING btree (file_object_id)` |
| `ix_platform_file_upload_sessions_status_expiry` | `CREATE INDEX ix_platform_file_upload_sessions_status_expiry ON platform.file_upload_sessions USING btree (status, expires_at)` |
| `pk_platform_file_upload_sessions` | `CREATE UNIQUE INDEX pk_platform_file_upload_sessions ON platform.file_upload_sessions USING btree (internal_id)` |
| `uq_platform_file_upload_sessions_id` | `CREATE UNIQUE INDEX uq_platform_file_upload_sessions_id ON platform.file_upload_sessions USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_upload_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_upload_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_upload_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
