# `identity.otp_challenges`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds otp challenges records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.otp_challenges |
| Classification | Transactional |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `attempts` | `integer` | No | `0` | Inferred: stores attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `blocked_at` | `timestamp with time zone` | Yes | — | Time of blocked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `channel` | `character varying(16)` | No | — | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `consumed_at` | `timestamp with time zone` | Yes | — | Time of consumed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_otp_challenges_created_by_users` |
| `destination_hash` | `character varying(255)` | No | — | Inferred: stores destination hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `max_attempts` | `integer` | No | `5` | Inferred: stores max attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `otp_hash` | `character varying(255)` | No | — | Inferred: stores otp hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `purpose` | `character varying(32)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_otp_challenges_updated_by_users` |

## Record lifecycle and users

- **Created:** when the otp challenges business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.otp_challenges` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_otp_challenges_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_otp_challenges_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `identity.otp_challenges` — exact structural contracts

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
| `otp_challenges_attempts_not_null` | NOT NULL | `NOT NULL attempts` |
| `otp_challenges_channel_not_null` | NOT NULL | `NOT NULL channel` |
| `otp_challenges_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `otp_challenges_destination_hash_not_null` | NOT NULL | `NOT NULL destination_hash` |
| `otp_challenges_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `otp_challenges_id_not_null` | NOT NULL | `NOT NULL id` |
| `otp_challenges_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `otp_challenges_max_attempts_not_null` | NOT NULL | `NOT NULL max_attempts` |
| `otp_challenges_otp_hash_not_null` | NOT NULL | `NOT NULL otp_hash` |
| `otp_challenges_purpose_not_null` | NOT NULL | `NOT NULL purpose` |
| `otp_challenges_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `otp_challenges_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_otp_challenges_destination` | btree | `(destination_hash, purpose)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_otp_challenges_destination ON identity.otp_challenges USING btree (destination_hash, purpose)` |
| `ix_identity_otp_challenges_expires_at` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_otp_challenges_expires_at ON identity.otp_challenges USING btree (expires_at)` |
| `pk_identity_otp_challenges` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_otp_challenges ON identity.otp_challenges USING btree (internal_id)` |
| `uq_identity_otp_challenges_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_otp_challenges_id ON identity.otp_challenges USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.otp_challenges FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
