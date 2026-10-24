# `identity.trusted_devices`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds trusted devices records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.trusted_devices |
| Classification | Configuration |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_trusted_devices_created_by_users` |
| `device_fingerprint_hash` | `character varying(128)` | No | — | Inferred: stores device fingerprint hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `device_name` | `character varying(128)` | Yes | — | Inferred: stores device name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `last_seen_at` | `timestamp with time zone` | Yes | — | Time of last seen | Support chronology, deadlines or audit evidence | Exact constraints below |
| `revoked_at` | `timestamp with time zone` | Yes | — | Time of revoked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `trusted_until` | `timestamp with time zone` | Yes | — | Inferred: stores trusted until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_trusted_devices_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_trusted_devices_user_id_users` |

## Record lifecycle and users

- **Created:** when the trusted devices business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.trusted_devices` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_trusted_devices_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_trusted_devices_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_trusted_devices_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `identity.trusted_devices` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_trusted_devices_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_trusted_devices_updated_by_users` |
| `user_id` | `identity.users` | `fk_identity_trusted_devices_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_trusted_devices_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_trusted_devices_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_trusted_devices_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_trusted_devices_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_trusted_devices` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_trusted_devices_id` | UNIQUE | `UNIQUE (id)` |
| `user_trusted_device` | UNIQUE | `UNIQUE (user_id, device_fingerprint_hash)` |
| `trusted_devices_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `trusted_devices_device_fingerprint_hash_not_null` | NOT NULL | `NOT NULL device_fingerprint_hash` |
| `trusted_devices_id_not_null` | NOT NULL | `NOT NULL id` |
| `trusted_devices_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `trusted_devices_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `trusted_devices_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `trusted_devices_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_trusted_devices_user_id` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_trusted_devices_user_id ON identity.trusted_devices USING btree (user_id)` |
| `pk_identity_trusted_devices` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_trusted_devices ON identity.trusted_devices USING btree (internal_id)` |
| `uq_identity_trusted_devices_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_trusted_devices_id ON identity.trusted_devices USING btree (id)` |
| `user_trusted_device` | btree | `(user_id, device_fingerprint_hash)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX user_trusted_device ON identity.trusted_devices USING btree (user_id, device_fingerprint_hash)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.trusted_devices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.trusted_devices FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.trusted_devices FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
