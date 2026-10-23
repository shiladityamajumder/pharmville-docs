# platform.file_variants

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds file variants records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 14 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_variants_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_variants_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `source_file_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_file_variants_source_file_id_file_objects) |
| `source_file_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_file_variants_source_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `transformation` | `jsonb` | No | `'{}'::jsonb` | Structured transformation information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_file_variants_updated_by_users) |
| `variant_file_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_platform_file_variants_variant_file_id_file_objects) |
| `variant_file_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_platform_file_variants_variant_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `variant_name` | `character varying(64)` | No | — | Inferred: stores variant name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the file variants business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_variants` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_file_variants_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_platform_file_variants_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_platform_file_variants_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `source_file_id` → `platform.file_objects(id)` via `fk_platform_file_variants_source_file_id_file_objects`; FOREIGN KEY (source_file_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE
- `variant_file_id` → `platform.file_objects(id)` via `fk_platform_file_variants_variant_file_id_file_objects`; FOREIGN KEY (variant_file_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE
- `source_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_file_variants_source_file_id_file_objects_numeric`; FOREIGN KEY (source_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE
- `variant_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_platform_file_variants_variant_file_id_file_objects_numeric`; FOREIGN KEY (variant_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE

## platform.file_variants — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 14 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_file_variants_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_file_variants_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_platform_file_variants_updated_by_users` |
| `source_file_id` | `platform.file_objects` | `fk_platform_file_variants_source_file_id_file_objects` |
| `variant_file_id` | `platform.file_objects` | `fk_platform_file_variants_variant_file_id_file_objects` |
| `source_file_id_internal_id` | `platform.file_objects` | `fk_platform_file_variants_source_file_id_file_objects_numeric` |
| `variant_file_id_internal_id` | `platform.file_objects` | `fk_platform_file_variants_variant_file_id_file_objects_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_platform_file_variants_numeric_pair_source_file_id` | CHECK | `CHECK ((source_file_id IS NULL) = (source_file_id_internal_id IS NULL))` |
| `ck_platform_file_variants_numeric_pair_variant_file_id` | CHECK | `CHECK ((variant_file_id IS NULL) = (variant_file_id_internal_id IS NULL))` |
| `ck_platform_file_variants_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_platform_file_variants_source_differs_from_variant` | CHECK | `CHECK (source_file_id <> variant_file_id)` |
| `file_variant_object` | UNIQUE | `UNIQUE (variant_file_id)` |
| `fk_platform_file_variants_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_variants_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_variants_source_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (source_file_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| `fk_platform_file_variants_source_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (source_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| `fk_platform_file_variants_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_file_variants_variant_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (variant_file_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| `fk_platform_file_variants_variant_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (variant_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| `pk_platform_file_variants` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_file_variants_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `file_variant_object` | `CREATE UNIQUE INDEX file_variant_object ON platform.file_variants USING btree (variant_file_id)` |
| `pk_platform_file_variants` | `CREATE UNIQUE INDEX pk_platform_file_variants ON platform.file_variants USING btree (internal_id)` |
| `uq_platform_file_variants_id` | `CREATE UNIQUE INDEX uq_platform_file_variants_id ON platform.file_variants USING btree (id)` |
| `uq_platform_file_variants_source_name_active` | `CREATE UNIQUE INDEX uq_platform_file_variants_source_name_active ON platform.file_variants USING btree (source_file_id, variant_name) WHERE is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_file_id","source_file_id_internal_id","platform","file_objects"],["variant_file_id","variant_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_file_id","source_file_id_internal_id","platform","file_objects"],["variant_file_id","variant_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
