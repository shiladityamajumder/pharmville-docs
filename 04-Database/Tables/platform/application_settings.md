# platform.application_settings

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds application settings records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 8 constraints, 4 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_application_settings_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_application_settings_deleted_by_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `is_secret_reference` | `boolean` | No | `false` | Yes/no flag for is secret reference | Control conditional business behavior | See exact constraints |
| `key` | `character varying(128)` | No | — | Inferred: stores key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `namespace` | `character varying(128)` | No | — | Inferred: stores namespace for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_platform_application_settings_updated_by_users) |
| `value` | `jsonb` | No | — | Structured value information | Retain a versioned payload or relevant details | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the application settings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Prescription_Upload, Admin_CMS, Reporting, Audit, Authentication_Access, Notifications. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `platform.application_settings` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_platform_application_settings_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_platform_application_settings_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_platform_application_settings_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## platform.application_settings — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 8 constraints, 4 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_platform_application_settings_created_by_users` |
| `deleted_by` | `identity.users` | `fk_platform_application_settings_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_platform_application_settings_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `application_setting` | UNIQUE | `UNIQUE (namespace, key)` |
| `ck_platform_application_settings_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_platform_application_settings_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(key::text)) > 0 AND key::text = btrim(key::text))` |
| `fk_platform_application_settings_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_application_settings_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_platform_application_settings_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_platform_application_settings` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_platform_application_settings_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `application_setting` | `CREATE UNIQUE INDEX application_setting ON platform.application_settings USING btree (namespace, key)` |
| `ix_platform_application_settings_namespace` | `CREATE INDEX ix_platform_application_settings_namespace ON platform.application_settings USING btree (namespace)` |
| `pk_platform_application_settings` | `CREATE UNIQUE INDEX pk_platform_application_settings ON platform.application_settings USING btree (internal_id)` |
| `uq_platform_application_settings_id` | `CREATE UNIQUE INDEX uq_platform_application_settings_id ON platform.application_settings USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON platform.application_settings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON platform.application_settings FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('key', '["namespace"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON platform.application_settings FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON platform.application_settings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
