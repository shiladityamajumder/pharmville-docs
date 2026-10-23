# identity.user_profiles

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds user profiles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 10 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `avatar_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_identity_user_profiles_avatar_file_id_file_objects) |
| `avatar_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_identity_user_profiles_avatar_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_profiles_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_profiles_deleted_by_users) |
| `first_name` | `character varying(100)` | Yes | — | Inferred: stores first name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `last_name` | `character varying(100)` | Yes | — | Inferred: stores last name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `preferred_name` | `character varying(100)` | Yes | — | Inferred: stores preferred name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_profiles_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_profiles_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the user profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.user_profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_identity_user_profiles_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_identity_user_profiles_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_identity_user_profiles_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_identity_user_profiles_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `avatar_file_id` → `platform.file_objects(id)` via `fk_identity_user_profiles_avatar_file_id_file_objects`; FOREIGN KEY (avatar_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL
- `avatar_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_identity_user_profiles_avatar_file_id_file_objects_numeric`; FOREIGN KEY (avatar_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL

## identity.user_profiles — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 10 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_identity_user_profiles_user_id_users` |
| `created_by` | `identity.users` | `fk_identity_user_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_identity_user_profiles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_identity_user_profiles_updated_by_users` |
| `avatar_file_id` | `platform.file_objects` | `fk_identity_user_profiles_avatar_file_id_file_objects` |
| `avatar_file_id_internal_id` | `platform.file_objects` | `fk_identity_user_profiles_avatar_file_id_file_objects_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_user_profiles_numeric_pair_avatar_file_id` | CHECK | `CHECK ((avatar_file_id IS NULL) = (avatar_file_id_internal_id IS NULL))` |
| `ck_identity_user_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_user_profiles_avatar_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (avatar_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_identity_user_profiles_avatar_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (avatar_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_identity_user_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_user_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_user_profiles_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_user_profiles_first_name` | `CREATE INDEX ix_identity_user_profiles_first_name ON identity.user_profiles USING btree (first_name)` |
| `ix_identity_user_profiles_last_name` | `CREATE INDEX ix_identity_user_profiles_last_name ON identity.user_profiles USING btree (last_name)` |
| `pk_identity_user_profiles` | `CREATE UNIQUE INDEX pk_identity_user_profiles ON identity.user_profiles USING btree (internal_id)` |
| `uq_identity_user_profiles_id` | `CREATE UNIQUE INDEX uq_identity_user_profiles_id ON identity.user_profiles USING btree (id)` |
| `uq_identity_user_profiles_user_active` | `CREATE UNIQUE INDEX uq_identity_user_profiles_user_active ON identity.user_profiles USING btree (user_id) WHERE is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.user_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["avatar_file_id","avatar_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.user_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.user_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["avatar_file_id","avatar_file_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
