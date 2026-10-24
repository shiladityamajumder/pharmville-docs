# `platform.file_variants`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds file variants records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | platform.file_variants |
| Classification | Mapping / Junction |
| Proposed business write owner | Shared platform file service — engineering owner; no clinical write grant |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 14 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_variants_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_variants_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `source_file_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_platform_file_variants_source_file_id_file_objects` |
| `source_file_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_platform_file_variants_source_file_id_file_objects_numeric` |
| `transformation` | `jsonb` | No | `'{}'::jsonb` | Structured transformation information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_platform_file_variants_updated_by_users` |
| `variant_file_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_platform_file_variants_variant_file_id_file_objects` |
| `variant_file_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_platform_file_variants_variant_file_id_file_objects_numeric` |
| `variant_name` | `character varying(64)` | No | — | Inferred: stores variant name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the file variants business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.file_variants` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_platform_file_variants_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_variants_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_variants_source_file_id_file_objects | `source_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (source_file_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| fk_platform_file_variants_source_file_id_file_objects_numeric | `source_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (source_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |
| fk_platform_file_variants_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_platform_file_variants_variant_file_id_file_objects | `variant_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (variant_file_id) REFERENCES platform.file_objects(id) ON DELETE CASCADE` |
| fk_platform_file_variants_variant_file_id_file_objects_numeric | `variant_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (variant_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `platform.file_variants` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_file_variants_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_file_variants_deleted_by_users` |
| `source_file_id` | `platform.file_objects` | `fk_platform_file_variants_source_file_id_file_objects` |
| `source_file_id_internal_id` | `platform.file_objects` | `fk_platform_file_variants_source_file_id_file_objects_numeric` |
| `updated_by` | `identity.users` | `fk_platform_file_variants_updated_by_users` |
| `variant_file_id` | `platform.file_objects` | `fk_platform_file_variants_variant_file_id_file_objects` |
| `variant_file_id_internal_id` | `platform.file_objects` | `fk_platform_file_variants_variant_file_id_file_objects_numeric` |

### Existing constraints

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
| `file_variants_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `file_variants_id_not_null` | NOT NULL | `NOT NULL id` |
| `file_variants_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `file_variants_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `file_variants_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `file_variants_source_file_id_internal_id_not_null` | NOT NULL | `NOT NULL source_file_id_internal_id` |
| `file_variants_source_file_id_not_null` | NOT NULL | `NOT NULL source_file_id` |
| `file_variants_transformation_not_null` | NOT NULL | `NOT NULL transformation` |
| `file_variants_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `file_variants_variant_file_id_internal_id_not_null` | NOT NULL | `NOT NULL variant_file_id_internal_id` |
| `file_variants_variant_file_id_not_null` | NOT NULL | `NOT NULL variant_file_id` |
| `file_variants_variant_name_not_null` | NOT NULL | `NOT NULL variant_name` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `file_variant_object` | btree | `(variant_file_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX file_variant_object ON platform.file_variants USING btree (variant_file_id)` |
| `pk_platform_file_variants` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_platform_file_variants ON platform.file_variants USING btree (internal_id)` |
| `uq_platform_file_variants_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_file_variants_id ON platform.file_variants USING btree (id)` |
| `uq_platform_file_variants_source_name_active` | btree | `(source_file_id, variant_name)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_platform_file_variants_source_name_active ON platform.file_variants USING btree (source_file_id, variant_name) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.file_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_file_id","source_file_id_internal_id","platform","file_objects"],["variant_file_id","variant_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.file_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.file_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_file_id","source_file_id_internal_id","platform","file_objects"],["variant_file_id","variant_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
