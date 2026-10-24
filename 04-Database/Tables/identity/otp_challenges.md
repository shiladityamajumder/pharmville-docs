# `identity.otp_challenges`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds otp challenges records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 8 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempts` | `integer` | No | `0` | Inferred: stores attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `blocked_at` | `timestamp with time zone` | Yes | — | Time of blocked | Support chronology, deadlines or audit evidence | See exact constraints |
| `channel` | `character varying(16)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `consumed_at` | `timestamp with time zone` | Yes | — | Time of consumed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_otp_challenges_created_by_users) |
| `destination_hash` | `character varying(255)` | No | — | Inferred: stores destination hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `max_attempts` | `integer` | No | `5` | Inferred: stores max attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `otp_hash` | `character varying(255)` | No | — | Inferred: stores otp hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `purpose` | `character varying(32)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_otp_challenges_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the otp challenges business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.otp_challenges` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_otp_challenges_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_otp_challenges_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `identity.otp_challenges` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 16 columns, 8 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_otp_challenges_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_otp_challenges_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_otp_challenges_attempts_nonnegative` | CHECK | `CHECK (attempts >= 0)` |
| `ck_identity_otp_challenges_attempts_within_limit` | CHECK | `CHECK (attempts <= max_attempts)` |
| `ck_identity_otp_challenges_max_attempts_positive` | CHECK | `CHECK (max_attempts > 0)` |
| `ck_identity_otp_challenges_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_otp_challenges_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_otp_challenges_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_otp_challenges` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_otp_challenges_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_otp_challenges_destination` | `CREATE INDEX ix_identity_otp_challenges_destination ON identity.otp_challenges USING btree (destination_hash, purpose)` |
| `ix_identity_otp_challenges_expires_at` | `CREATE INDEX ix_identity_otp_challenges_expires_at ON identity.otp_challenges USING btree (expires_at)` |
| `pk_identity_otp_challenges` | `CREATE UNIQUE INDEX pk_identity_otp_challenges ON identity.otp_challenges USING btree (internal_id)` |
| `uq_identity_otp_challenges_id` | `CREATE UNIQUE INDEX uq_identity_otp_challenges_id ON identity.otp_challenges USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
