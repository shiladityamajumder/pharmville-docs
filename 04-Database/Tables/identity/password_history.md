# identity.password_history

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds password history records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 5 columns, 3 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `password_hash` | `character varying(255)` | No | — | Inferred: stores password hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_password_history_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the password history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.password_history` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_identity_password_history_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE

## identity.password_history — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 5 columns, 3 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_identity_password_history_user_id_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `fk_identity_password_history_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_password_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_password_history_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_password_history_user_id_created_at` | `CREATE INDEX ix_identity_password_history_user_id_created_at ON identity.password_history USING btree (user_id, created_at)` |
| `pk_identity_password_history` | `CREATE UNIQUE INDEX pk_identity_password_history ON identity.password_history USING btree (internal_id)` |
| `uq_identity_password_history_id` | `CREATE UNIQUE INDEX uq_identity_password_history_id ON identity.password_history USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.password_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON identity.password_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.password_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
