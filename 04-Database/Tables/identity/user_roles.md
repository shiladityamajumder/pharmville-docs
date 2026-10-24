# `identity.user_roles`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds user roles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 11 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_roles_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `role_id` | `uuid` | No | — | Reference linking this record to roles | Ensures related business data can be joined and validated | FK → `identity.roles` (fk_identity_user_roles_role_id_roles) |
| `role_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.roles` (fk_identity_user_roles_role_id_roles_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scope_id` | `uuid` | Yes | — | Identifier associated with scope | Link the event or entity to its subject; verify constraints | See exact constraints |
| `scope_type` | `character varying(32)` | Yes | — | Inferred: stores scope type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_roles_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_user_roles_user_id_users) |
| `valid_from` | `timestamp with time zone` | Yes | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the user roles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.user_roles` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_identity_user_roles_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_identity_user_roles_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_user_roles_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `role_id` → `identity.roles(id)` via `fk_identity_user_roles_role_id_roles`; `FOREIGN KEY (role_id) REFERENCES identity.roles(id) ON DELETE CASCADE`
- `role_id_internal_id` → `identity.roles(internal_id)` via `fk_identity_user_roles_role_id_roles_numeric`; `FOREIGN KEY (role_id_internal_id) REFERENCES identity.roles(internal_id) ON DELETE CASCADE`

## `identity.user_roles` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 11 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_identity_user_roles_user_id_users` |
| `created_by` | `identity.users` | `fk_identity_user_roles_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_user_roles_updated_by_users` |
| `role_id` | `identity.roles` | `fk_identity_user_roles_role_id_roles` |
| `role_id_internal_id` | `identity.roles` | `fk_identity_user_roles_role_id_roles_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_user_roles_numeric_pair_role_id` | CHECK | `CHECK ((role_id IS NULL) = (role_id_internal_id IS NULL))` |
| `ck_identity_user_roles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_identity_user_roles_valid_window` | CHECK | `CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until > valid_from)` |
| `fk_identity_user_roles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_roles_role_id_roles` | FOREIGN KEY | `FOREIGN KEY (role_id) REFERENCES identity.roles(id) ON DELETE CASCADE` |
| `fk_identity_user_roles_role_id_roles_numeric` | FOREIGN KEY | `FOREIGN KEY (role_id_internal_id) REFERENCES identity.roles(internal_id) ON DELETE CASCADE` |
| `fk_identity_user_roles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_user_roles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_identity_user_roles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_user_roles_id` | UNIQUE | `UNIQUE (id)` |
| `user_role_scope` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (user_id, role_id, scope_type, scope_id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_user_roles_role_id` | `CREATE INDEX ix_identity_user_roles_role_id ON identity.user_roles USING btree (role_id)` |
| `ix_identity_user_roles_scope` | `CREATE INDEX ix_identity_user_roles_scope ON identity.user_roles USING btree (scope_type, scope_id)` |
| `ix_identity_user_roles_user_id` | `CREATE INDEX ix_identity_user_roles_user_id ON identity.user_roles USING btree (user_id)` |
| `pk_identity_user_roles` | `CREATE UNIQUE INDEX pk_identity_user_roles ON identity.user_roles USING btree (internal_id)` |
| `uq_identity_user_roles_id` | `CREATE UNIQUE INDEX uq_identity_user_roles_id ON identity.user_roles USING btree (id)` |
| `user_role_scope` | `CREATE UNIQUE INDEX user_role_scope ON identity.user_roles USING btree (user_id, role_id, scope_type, scope_id) NULLS NOT DISTINCT` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.user_roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["role_id","role_id_internal_id","identity","roles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.user_roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.user_roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["role_id","role_id_internal_id","identity","roles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
