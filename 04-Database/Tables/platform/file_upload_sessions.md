# `platform.file_upload_sessions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds file upload sessions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.file_upload_sessions |
| Classification | Derived / Operational |
| Proposed business write owner | Shared platform file service — engineering owner; no clinical write grant |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `aborted_at` | `timestamp with time zone` | Yes | — | Time of aborted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_upload_sessions_created_by_users` |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `failure_reason` | `text` | Yes | — | Inferred: stores failure reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_platform_file_upload_sessions_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_platform_file_upload_sessions_file_object_id_file_ob_88b9` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `multipart_upload_id` | `character varying(512)` | Yes | — | Identifier associated with multipart upload | Link the event or entity to its subject; verify constraints | Collation: default |
| `requested_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_upload_sessions_requested_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scope` | `character varying(128)` | No | — | Inferred: stores scope for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_upload_sessions_updated_by_users` |
| `upload_method` | `character varying(32)` | No | `'single'::character varying` | Inferred: stores upload method for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the file upload sessions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_upload_sessions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_file_upload_sessions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_upload_sessions_file_object_id_file_ob_88b9 | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| fk_platform_file_upload_sessions_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| fk_platform_file_upload_sessions_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_platform_file_upload_sessions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.file_upload_sessions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_file_upload_sessions_created_by_users` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_platform_file_upload_sessions_file_object_id_file_ob_88b9` |
| `file_object_id` | `platform.file_objects` | `fk_platform_file_upload_sessions_file_object_id_file_objects` |
| `requested_by_user_id` | `identity.users` | `fk_platform_file_upload_sessions_requested_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_platform_file_upload_sessions_updated_by_users` |

### Existing constraints

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
| `file_upload_sessions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `file_upload_sessions_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `file_upload_sessions_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `file_upload_sessions_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `file_upload_sessions_id_not_null` | NOT NULL | `NOT NULL id` |
| `file_upload_sessions_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `file_upload_sessions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `file_upload_sessions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `file_upload_sessions_scope_not_null` | NOT NULL | `NOT NULL scope` |
| `file_upload_sessions_status_not_null` | NOT NULL | `NOT NULL status` |
| `file_upload_sessions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `file_upload_sessions_upload_method_not_null` | NOT NULL | `NOT NULL upload_method` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `file_upload_scope_key` | btree | `(scope, idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX file_upload_scope_key ON platform.file_upload_sessions USING btree (scope, idempotency_key)` |
| `ix_platform_file_upload_sessions_file` | btree | `(file_object_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_upload_sessions_file ON platform.file_upload_sessions USING btree (file_object_id)` |
| `ix_platform_file_upload_sessions_status_expiry` | btree | `(status, expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_platform_file_upload_sessions_status_expiry ON platform.file_upload_sessions USING btree (status, expires_at)` |
| `pk_platform_file_upload_sessions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_file_upload_sessions ON platform.file_upload_sessions USING btree (internal_id)` |
| `uq_platform_file_upload_sessions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_file_upload_sessions_id ON platform.file_upload_sessions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_upload_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_upload_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_upload_sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
