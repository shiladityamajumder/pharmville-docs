# identity.mfa_factors

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds mfa factors records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 7 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_mfa_factors_created_by_users) |
| `destination_masked` | `character varying(255)` | Yes | — | Inferred: stores destination masked for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `disabled_at` | `timestamp with time zone` | Yes | — | Time of disabled | Support chronology, deadlines or audit evidence | See exact constraints |
| `factor_type` | `character varying(32)` | No | — | Inferred: stores factor type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `label` | `character varying(64)` | No | `'default'::character varying` | Inferred: stores label for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `secret_encrypted` | `bytea` | Yes | — | Inferred: stores secret encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_mfa_factors_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_mfa_factors_user_id_users) |
| `verified_at` | `timestamp with time zone` | Yes | — | Time of verified | Support chronology, deadlines or audit evidence | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the mfa factors business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.mfa_factors` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_identity_mfa_factors_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `created_by` → `identity.users(id)` via `fk_identity_mfa_factors_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_identity_mfa_factors_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## identity.mfa_factors — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 7 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_identity_mfa_factors_user_id_users` |
| `created_by` | `identity.users` | `fk_identity_mfa_factors_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_mfa_factors_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_mfa_factors_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_mfa_factors_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_mfa_factors_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_mfa_factors_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_mfa_factors` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_mfa_factors_id` | UNIQUE | `UNIQUE (id)` |
| `user_mfa_factor` | UNIQUE | `UNIQUE (user_id, factor_type, label)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_mfa_factors_user_id` | `CREATE INDEX ix_identity_mfa_factors_user_id ON identity.mfa_factors USING btree (user_id)` |
| `pk_identity_mfa_factors` | `CREATE UNIQUE INDEX pk_identity_mfa_factors ON identity.mfa_factors USING btree (internal_id)` |
| `uq_identity_mfa_factors_id` | `CREATE UNIQUE INDEX uq_identity_mfa_factors_id ON identity.mfa_factors USING btree (id)` |
| `user_mfa_factor` | `CREATE UNIQUE INDEX user_mfa_factor ON identity.mfa_factors USING btree (user_id, factor_type, label)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.mfa_factors FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.mfa_factors FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.mfa_factors FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
