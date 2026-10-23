# identity.api_clients

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds api clients records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 7 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `allowed_cidrs` | `jsonb` | No | `'[]'::jsonb` | Structured allowed cidrs information | Retain a versioned payload or relevant details | See exact constraints |
| `allowed_scopes` | `jsonb` | No | `'[]'::jsonb` | Structured allowed scopes information | Retain a versioned payload or relevant details | See exact constraints |
| `client_key` | `character varying(128)` | No | — | Inferred: stores client key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `client_name` | `character varying(128)` | No | — | Inferred: stores client name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_api_clients_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_api_clients_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `last_used_at` | `timestamp with time zone` | Yes | — | Time of last used | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `secret_hash` | `character varying(255)` | No | — | Inferred: stores secret hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `secret_rotated_at` | `timestamp with time zone` | Yes | — | Time of secret rotated | Support chronology, deadlines or audit evidence | See exact constraints |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_api_clients_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the api clients business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.api_clients` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_api_clients_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_identity_api_clients_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_identity_api_clients_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `identity.api_client_secrets`, `identity.api_client_secrets`.

## identity.api_clients — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 7 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_api_clients_created_by_users` |
| `deleted_by` | `identity.users` | `fk_identity_api_clients_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_identity_api_clients_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_api_clients_activestatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'archived'::text]))` |
| `ck_identity_api_clients_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_api_clients_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_api_clients_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_api_clients_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_api_clients` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_api_clients_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_identity_api_clients` | `CREATE UNIQUE INDEX pk_identity_api_clients ON identity.api_clients USING btree (internal_id)` |
| `uq_identity_api_clients_id` | `CREATE UNIQUE INDEX uq_identity_api_clients_id ON identity.api_clients USING btree (id)` |
| `uq_identity_api_clients_key_active` | `CREATE UNIQUE INDEX uq_identity_api_clients_key_active ON identity.api_clients USING btree (client_key) WHERE is_deleted = false` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.api_clients FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.api_clients FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.api_clients FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
