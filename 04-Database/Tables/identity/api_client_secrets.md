# identity.api_client_secrets

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds api client secrets records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `api_client_id` | `uuid` | No | — | Reference linking this record to api clients | Ensures related business data can be joined and validated | FK → `identity.api_clients` (fk_identity_api_client_secrets_api_client_id_api_clients) |
| `api_client_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.api_clients` (fk_identity_api_client_secrets_api_client_id_api_client_3b2b); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_api_client_secrets_created_by_users) |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `revoked_at` | `timestamp with time zone` | Yes | — | Time of revoked | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `secret_hash` | `character varying(255)` | No | — | Inferred: stores secret hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_api_client_secrets_updated_by_users) |
| `valid_from` | `timestamp with time zone` | No | `now()` | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the api client secrets business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.api_client_secrets` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_api_client_secrets_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_identity_api_client_secrets_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `api_client_id` → `identity.api_clients(id)` via `fk_identity_api_client_secrets_api_client_id_api_clients`; FOREIGN KEY (api_client_id) REFERENCES identity.api_clients(id) ON DELETE CASCADE
- `api_client_id_internal_id` → `identity.api_clients(internal_id)` via `fk_identity_api_client_secrets_api_client_id_api_client_3b2b`; FOREIGN KEY (api_client_id_internal_id) REFERENCES identity.api_clients(internal_id) ON DELETE CASCADE

## identity.api_client_secrets — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 9 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_api_client_secrets_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_api_client_secrets_updated_by_users` |
| `api_client_id` | `identity.api_clients` | `fk_identity_api_client_secrets_api_client_id_api_clients` |
| `api_client_id_internal_id` | `identity.api_clients` | `fk_identity_api_client_secrets_api_client_id_api_client_3b2b` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_api_client_secrets_expiry_after_created` | CHECK | `CHECK (expires_at IS NULL OR expires_at > created_at)` |
| `ck_identity_api_client_secrets_numeric_pair_api_client_id` | CHECK | `CHECK ((api_client_id IS NULL) = (api_client_id_internal_id IS NULL))` |
| `ck_identity_api_client_secrets_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_api_client_secrets_api_client_id_api_client_3b2b` | FOREIGN KEY | `FOREIGN KEY (api_client_id_internal_id) REFERENCES identity.api_clients(internal_id) ON DELETE CASCADE` |
| `fk_identity_api_client_secrets_api_client_id_api_clients` | FOREIGN KEY | `FOREIGN KEY (api_client_id) REFERENCES identity.api_clients(id) ON DELETE CASCADE` |
| `fk_identity_api_client_secrets_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_api_client_secrets_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_api_client_secrets` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_api_client_secrets_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_api_client_secrets_client_id` | `CREATE INDEX ix_identity_api_client_secrets_client_id ON identity.api_client_secrets USING btree (api_client_id)` |
| `pk_identity_api_client_secrets` | `CREATE UNIQUE INDEX pk_identity_api_client_secrets ON identity.api_client_secrets USING btree (internal_id)` |
| `uq_identity_api_client_secrets_id` | `CREATE UNIQUE INDEX uq_identity_api_client_secrets_id ON identity.api_client_secrets USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.api_client_secrets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["api_client_id","api_client_id_internal_id","identity","api_clients"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.api_client_secrets FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.api_client_secrets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["api_client_id","api_client_id_internal_id","identity","api_clients"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
