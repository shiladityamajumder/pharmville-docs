# `identity.role_permissions`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds role permissions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_role_permissions_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `permission_id` | `uuid` | No | — | Reference linking this record to permissions | Ensures related business data can be joined and validated | FK → `identity.permissions` (fk_identity_role_permissions_permission_id_permissions) |
| `permission_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.permissions` (fk_identity_role_permissions_permission_id_permissions_numeric); Numeric/public-key pair verification required |
| `role_id` | `uuid` | No | — | Reference linking this record to roles | Ensures related business data can be joined and validated | FK → `identity.roles` (fk_identity_role_permissions_role_id_roles) |
| `role_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.roles` (fk_identity_role_permissions_role_id_roles_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_role_permissions_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the role permissions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.role_permissions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_role_permissions_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_role_permissions_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `permission_id` → `identity.permissions(id)` via `fk_identity_role_permissions_permission_id_permissions`; `FOREIGN KEY (permission_id) REFERENCES identity.permissions(id) ON DELETE CASCADE`
- `role_id` → `identity.roles(id)` via `fk_identity_role_permissions_role_id_roles`; `FOREIGN KEY (role_id) REFERENCES identity.roles(id) ON DELETE CASCADE`
- `permission_id_internal_id` → `identity.permissions(internal_id)` via `fk_identity_role_permissions_permission_id_permissions_numeric`; `FOREIGN KEY (permission_id_internal_id) REFERENCES identity.permissions(internal_id) ON DELETE CASCADE`
- `role_id_internal_id` → `identity.roles(internal_id)` via `fk_identity_role_permissions_role_id_roles_numeric`; `FOREIGN KEY (role_id_internal_id) REFERENCES identity.roles(internal_id) ON DELETE CASCADE`

## `identity.role_permissions` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 12 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_role_permissions_created_by_users` |
| `updated_by` | `identity.users` | `fk_identity_role_permissions_updated_by_users` |
| `permission_id` | `identity.permissions` | `fk_identity_role_permissions_permission_id_permissions` |
| `role_id` | `identity.roles` | `fk_identity_role_permissions_role_id_roles` |
| `permission_id_internal_id` | `identity.permissions` | `fk_identity_role_permissions_permission_id_permissions_numeric` |
| `role_id_internal_id` | `identity.roles` | `fk_identity_role_permissions_role_id_roles_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_role_permissions_numeric_pair_permission_id` | CHECK | `CHECK ((permission_id IS NULL) = (permission_id_internal_id IS NULL))` |
| `ck_identity_role_permissions_numeric_pair_role_id` | CHECK | `CHECK ((role_id IS NULL) = (role_id_internal_id IS NULL))` |
| `ck_identity_role_permissions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_identity_role_permissions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_role_permissions_permission_id_permissions` | FOREIGN KEY | `FOREIGN KEY (permission_id) REFERENCES identity.permissions(id) ON DELETE CASCADE` |
| `fk_identity_role_permissions_permission_id_permissions_numeric` | FOREIGN KEY | `FOREIGN KEY (permission_id_internal_id) REFERENCES identity.permissions(internal_id) ON DELETE CASCADE` |
| `fk_identity_role_permissions_role_id_roles` | FOREIGN KEY | `FOREIGN KEY (role_id) REFERENCES identity.roles(id) ON DELETE CASCADE` |
| `fk_identity_role_permissions_role_id_roles_numeric` | FOREIGN KEY | `FOREIGN KEY (role_id_internal_id) REFERENCES identity.roles(internal_id) ON DELETE CASCADE` |
| `fk_identity_role_permissions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_role_permissions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `role_permission` | UNIQUE | `UNIQUE (role_id, permission_id)` |
| `uq_identity_role_permissions_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_identity_role_permissions_role_id` | `CREATE INDEX ix_identity_role_permissions_role_id ON identity.role_permissions USING btree (role_id)` |
| `pk_identity_role_permissions` | `CREATE UNIQUE INDEX pk_identity_role_permissions ON identity.role_permissions USING btree (internal_id)` |
| `role_permission` | `CREATE UNIQUE INDEX role_permission ON identity.role_permissions USING btree (role_id, permission_id)` |
| `uq_identity_role_permissions_id` | `CREATE UNIQUE INDEX uq_identity_role_permissions_id ON identity.role_permissions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.role_permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["permission_id","permission_id_internal_id","identity","permissions"],["role_id","role_id_internal_id","identity","roles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.role_permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.role_permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["permission_id","permission_id_internal_id","identity","permissions"],["role_id","role_id_internal_id","identity","roles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
