# `identity.users`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds users records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 9 constraints, 5 indexes, 1 triggers; PK: `id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `account_closed_at` | `timestamp with time zone` | Yes | — | Time of account closed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_users_created_by_users) |
| `email` | `character varying(320)` | Yes | — | Inferred: stores email for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `email_normalized` | `character varying(320)` | Yes | — | Inferred: stores email normalized for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `email_verified_at` | `timestamp with time zone` | Yes | — | Time of email verified | Support chronology, deadlines or audit evidence | See exact constraints |
| `failed_login_count` | `integer` | No | `0` | Inferred: stores failed login count for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `last_login_at` | `timestamp with time zone` | Yes | — | Time of last login | Support chronology, deadlines or audit evidence | See exact constraints |
| `locked_until` | `timestamp with time zone` | Yes | — | Inferred: stores locked until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `password_hash` | `character varying(255)` | Yes | — | Inferred: stores password hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `phone_country_code` | `character varying(8)` | Yes | — | Code for phone country | Link to controlled business classification or an external reference | See exact constraints |
| `phone_number` | `character varying(32)` | Yes | — | Inferred: stores phone number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `phone_verified_at` | `timestamp with time zone` | Yes | — | Time of phone verified | Support chronology, deadlines or audit evidence | See exact constraints |
| `preferred_locale` | `character varying(16)` | No | `'en-IN'::character varying` | Inferred: stores preferred locale for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `privacy_version` | `character varying(32)` | Yes | — | Inferred: stores privacy version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `terms_version` | `character varying(32)` | Yes | — | Inferred: stores terms version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_users_updated_by_users) |

**Primary key columns (Confirmed):** `id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the users business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.users` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_users_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_users_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 634 FK constraints** (sample): `identity.user_roles`, `identity.sessions`, `identity.mfa_factors`, `identity.trusted_devices`, `identity.login_attempts`, `identity.password_history`, `identity.user_profiles`, `organization.memberships`, `organization.memberships`, `customer.family_members`, `customer.family_members`, `customer.family_members`.

## `identity.users` — exact structural contracts

**Identity:** `id` UUID.

**Counts:** 22 columns, 9 constraints, 5 indexes, 1 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_users_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_users_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_users_contact_required` | CHECK | `CHECK (email_normalized IS NOT NULL OR phone_number IS NOT NULL)` |
| `ck_identity_users_failed_login_nonnegative` | CHECK | `CHECK (failed_login_count >= 0)` |
| `ck_identity_users_phone_pair_complete` | CHECK | `CHECK (phone_country_code IS NULL AND phone_number IS NULL OR phone_country_code IS NOT NULL AND phone_number IS NOT NULL)` |
| `ck_identity_users_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_identity_users_userstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'active'::text, 'locked'::text, 'suspended'::text, 'closed'::text]))` |
| `fk_identity_users_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_users_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_users` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `users_email_normalized` | UNIQUE | `UNIQUE (email_normalized)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_users_last_login_at` | `CREATE INDEX ix_identity_users_last_login_at ON identity.users USING btree (last_login_at)` |
| `ix_identity_users_status` | `CREATE INDEX ix_identity_users_status ON identity.users USING btree (status)` |
| `pk_identity_users` | `CREATE UNIQUE INDEX pk_identity_users ON identity.users USING btree (id)` |
| `uq_identity_users_phone_present` | `CREATE UNIQUE INDEX uq_identity_users_phone_present ON identity.users USING btree (phone_country_code, phone_number) WHERE phone_country_code IS NOT NULL AND phone_number IS NOT NULL` |
| `users_email_normalized` | `CREATE UNIQUE INDEX users_email_normalized ON identity.users USING btree (email_normalized)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.users FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
