# `platform.file_objects`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds file objects records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 32 columns, 16 constraints, 7 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `access_type` | `character varying(16)` | No | `'private'::character varying` | Inferred: stores access type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `available_at` | `timestamp with time zone` | Yes | — | Time of available | Support chronology, deadlines or audit evidence | See exact constraints |
| `bucket` | `character varying(128)` | No | — | Inferred: stores bucket for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `classification` | `character varying(32)` | No | `'internal'::character varying` | Inferred: stores classification for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `content_type` | `character varying(128)` | No | — | Inferred: stores content type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_objects_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_objects_deleted_by_users) |
| `encryption_key_ref` | `character varying(255)` | Yes | — | Inferred: stores encryption key ref for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `etag` | `character varying(255)` | Yes | — | Inferred: stores etag for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expected_size_bytes` | `bigint` | No | — | Inferred: stores expected size bytes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `malware_scan_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores malware scan status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `object_key` | `character varying(512)` | No | — | Inferred: stores object key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `original_filename` | `character varying(255)` | No | — | Inferred: stores original filename for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `owner_id` | `uuid` | No | — | Identifier associated with owner | Link the event or entity to its subject; verify constraints | See exact constraints |
| `owner_type` | `character varying(64)` | No | — | Inferred: stores owner type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `public_url` | `character varying(2048)` | Yes | — | Inferred: stores public url for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `retention_until` | `timestamp with time zone` | Yes | — | Inferred: stores retention until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sha256` | `character varying(64)` | Yes | — | Inferred: stores sha256 for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `size_bytes` | `bigint` | Yes | — | Inferred: stores size bytes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(16)` | No | `'pending_upload'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `storage_provider` | `character varying(32)` | No | `'s3'::character varying` | Inferred: stores storage provider for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `storage_version_id` | `character varying(255)` | Yes | — | Identifier associated with storage version | Link the event or entity to its subject; verify constraints | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_objects_updated_by_users) |
| `uploaded_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_objects_uploaded_by_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the file objects business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_objects` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `uploaded_by_user_id` → `identity.users(id)` via `fk_platform_file_objects_uploaded_by_user_id_users`; `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL`
- `created_by` → `identity.users(id)` via `fk_platform_file_objects_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_platform_file_objects_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_platform_file_objects_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 58 FK constraints** (sample): `appointment.teleconsultation_sessions`, `catalog.brands`, `catalog.product_media`, `clinical.prescription_documents`, `compliance.regulatory_registrations`, `compliance.evidence`, `customer.profiles`, `diagnostics.diagnostic_reports`, `finance.invoices`, `finance.credit_notes`, `identity.user_profiles`, `insurance.claim_documents`.

## `platform.file_objects` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 32 columns, 16 constraints, 7 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `uploaded_by_user_id` | `identity.users` | `fk_platform_file_objects_uploaded_by_user_id_users` |
| `created_by` | `identity.users` | `fk_platform_file_objects_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_file_objects_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_platform_file_objects_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_objects_available_has_safe_final_metadata` | CHECK | `CHECK (status::text <> 'available'::text OR size_bytes IS NOT NULL AND sha256 IS NOT NULL AND malware_scan_status::text = 'clean'::text)` |
| `ck_platform_file_objects_expected_size_positive` | CHECK | `CHECK (expected_size_bytes > 0)` |
| `ck_platform_file_objects_fileaccesstype` | CHECK | `CHECK (access_type::text = ANY (ARRAY['public'::text, 'private'::text]))` |
| `ck_platform_file_objects_fileobjectstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending_upload'::text, 'uploaded'::text, 'scanning'::text, 'available'::text, 'quarantined'::text, 'rejected'::text, 'deleted'::text]))` |
| `ck_platform_file_objects_malwarescanstatus` | CHECK | `CHECK (malware_scan_status::text = ANY (ARRAY['pending'::text, 'scanning'::text, 'clean'::text, 'infected'::text, 'failed'::text]))` |
| `ck_platform_file_objects_private_has_no_public_url` | CHECK | `CHECK (access_type::text <> 'private'::text OR public_url IS NULL)` |
| `ck_platform_file_objects_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_platform_file_objects_sha256_length` | CHECK | `CHECK (sha256 IS NULL OR char_length(sha256::text) = 64)` |
| `ck_platform_file_objects_size_positive` | CHECK | `CHECK (size_bytes IS NULL OR size_bytes > 0)` |
| `file_bucket_object_key` | UNIQUE | `UNIQUE (bucket, object_key)` |
| `fk_platform_file_objects_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_objects_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_objects_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_objects_uploaded_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (uploaded_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_platform_file_objects` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_objects_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `file_bucket_object_key` | `CREATE UNIQUE INDEX file_bucket_object_key ON platform.file_objects USING btree (bucket, object_key)` |
| `ix_platform_file_objects_owner` | `CREATE INDEX ix_platform_file_objects_owner ON platform.file_objects USING btree (owner_type, owner_id)` |
| `ix_platform_file_objects_sha256` | `CREATE INDEX ix_platform_file_objects_sha256 ON platform.file_objects USING btree (sha256)` |
| `ix_platform_file_objects_status` | `CREATE INDEX ix_platform_file_objects_status ON platform.file_objects USING btree (status, created_at)` |
| `ix_platform_file_objects_uploaded_by` | `CREATE INDEX ix_platform_file_objects_uploaded_by ON platform.file_objects USING btree (uploaded_by_user_id)` |
| `pk_platform_file_objects` | `CREATE UNIQUE INDEX pk_platform_file_objects ON platform.file_objects USING btree (internal_id)` |
| `uq_platform_file_objects_id` | `CREATE UNIQUE INDEX uq_platform_file_objects_id ON platform.file_objects USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `reviewed_file_identity_guard` | `CREATE TRIGGER reviewed_file_identity_guard BEFORE UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.guard_reviewed_file_identity()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_objects FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
