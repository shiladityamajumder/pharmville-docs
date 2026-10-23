# identity.sessions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds sessions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 8 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_sessions_created_by_users) |
| `device_id` | `character varying(255)` | Yes | — | Identifier associated with device | Link the event or entity to its subject; verify constraints | See exact constraints |
| `device_type` | `character varying(32)` | Yes | — | Inferred: stores device type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `last_seen_at` | `timestamp with time zone` | Yes | — | Time of last seen | Support chronology, deadlines or audit evidence | See exact constraints |
| `refresh_token_hash` | `character varying(255)` | No | — | Inferred: stores refresh token hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `revoke_reason` | `character varying(255)` | Yes | — | Inferred: stores revoke reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `revoked_at` | `timestamp with time zone` | Yes | — | Time of revoked | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `token_family_id` | `uuid` | No | — | Identifier associated with token family | Link the event or entity to its subject; verify constraints | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_sessions_updated_by_users) |
| `user_agent` | `text` | Yes | — | Inferred: stores user agent for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_sessions_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the sessions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.sessions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_identity_sessions_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_identity_sessions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_identity_sessions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## identity.sessions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 18 columns, 8 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_identity_sessions_user_id_users` |
| `created_by` | `identity.users` | `fk_identity_sessions_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_sessions_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_sessions_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_identity_sessions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_sessions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_sessions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_sessions_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_sessions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `sessions_refresh_token_hash` | UNIQUE | `UNIQUE (refresh_token_hash)` |
| `uq_identity_sessions_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_sessions_device_id` | `CREATE INDEX ix_identity_sessions_device_id ON identity.sessions USING btree (device_id)` |
| `ix_identity_sessions_expires_at` | `CREATE INDEX ix_identity_sessions_expires_at ON identity.sessions USING btree (expires_at)` |
| `ix_identity_sessions_user_id` | `CREATE INDEX ix_identity_sessions_user_id ON identity.sessions USING btree (user_id)` |
| `pk_identity_sessions` | `CREATE UNIQUE INDEX pk_identity_sessions ON identity.sessions USING btree (internal_id)` |
| `sessions_refresh_token_hash` | `CREATE UNIQUE INDEX sessions_refresh_token_hash ON identity.sessions USING btree (refresh_token_hash)` |
| `uq_identity_sessions_id` | `CREATE UNIQUE INDEX uq_identity_sessions_id ON identity.sessions USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.sessions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
