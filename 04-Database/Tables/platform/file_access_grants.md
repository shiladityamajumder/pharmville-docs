# `platform.file_access_grants`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds file access grants records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 9 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_access_grants_created_by_users) |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_file_access_grants_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_file_access_grants_file_object_id_file_obje_fef8); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `permission` | `character varying(32)` | No | — | Inferred: stores permission for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `purpose` | `character varying(128)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `revoked_at` | `timestamp with time zone` | Yes | — | Time of revoked | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `subject_id` | `uuid` | No | — | Identifier associated with subject | Link the event or entity to its subject; verify constraints | See exact constraints |
| `subject_type` | `character varying(32)` | No | — | Inferred: stores subject type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_access_grants_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the file access grants business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_access_grants` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_file_access_grants_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_platform_file_access_grants_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `file_object_id` → `platform.file_objects(id)` via `fk_platform_file_access_grants_file_object_id_file_objects`; `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE`
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_file_access_grants_file_object_id_file_obje_fef8`; `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE`

## `platform.file_access_grants` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 9 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_file_access_grants_created_by_users` |
| `updated_by` | `identity.users` | `fk_platform_file_access_grants_updated_by_users` |
| `file_object_id` | `platform.file_objects` | `fk_platform_file_access_grants_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_platform_file_access_grants_file_object_id_file_obje_fef8` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_access_grants_expiry_after_created` | CHECK | `CHECK (expires_at IS NULL OR expires_at > created_at)` |
| `ck_platform_file_access_grants_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_platform_file_access_grants_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_platform_file_access_grants_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_access_grants_file_object_id_file_obje_fef8` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| `fk_platform_file_access_grants_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| `fk_platform_file_access_grants_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_file_access_grants` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_access_grants_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_platform_file_access_grants_file` | `CREATE INDEX ix_platform_file_access_grants_file ON platform.file_access_grants USING btree (file_object_id)` |
| `ix_platform_file_access_grants_subject` | `CREATE INDEX ix_platform_file_access_grants_subject ON platform.file_access_grants USING btree (subject_type, subject_id)` |
| `pk_platform_file_access_grants` | `CREATE UNIQUE INDEX pk_platform_file_access_grants ON platform.file_access_grants USING btree (internal_id)` |
| `uq_platform_file_access_grants_active` | `CREATE UNIQUE INDEX uq_platform_file_access_grants_active ON platform.file_access_grants USING btree (file_object_id, subject_type, subject_id, permission, purpose) WHERE revoked_at IS NULL` |
| `uq_platform_file_access_grants_id` | `CREATE UNIQUE INDEX uq_platform_file_access_grants_id ON platform.file_access_grants USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_access_grants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_access_grants FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_access_grants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
