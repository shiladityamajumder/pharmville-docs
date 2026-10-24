# `identity.role_permissions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds role permissions records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.role_permissions |
| Classification | Mapping / Junction |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_role_permissions_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `permission_id` | `uuid` | No | — | Reference linking this record to permissions | Ensures related business data can be joined and validated | FK → `identity.permissions` via `fk_identity_role_permissions_permission_id_permissions` |
| `permission_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.permissions` via `fk_identity_role_permissions_permission_id_permissions_numeric` |
| `role_id` | `uuid` | No | — | Reference linking this record to roles | Ensures related business data can be joined and validated | FK → `identity.roles` via `fk_identity_role_permissions_role_id_roles` |
| `role_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `identity.roles` via `fk_identity_role_permissions_role_id_roles_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_role_permissions_updated_by_users` |

## Record lifecycle and users

- **Created:** when the role permissions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.role_permissions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_role_permissions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_role_permissions_permission_id_permissions | `permission_id` | [`identity.permissions`](../../Tables/identity/permissions.md) | `FOREIGN KEY (permission_id) REFERENCES identity.permissions(id) ON DELETE CASCADE` |
| fk_identity_role_permissions_permission_id_permissions_numeric | `permission_id_internal_id` | [`identity.permissions`](../../Tables/identity/permissions.md) | `FOREIGN KEY (permission_id_internal_id) REFERENCES identity.permissions(internal_id) ON DELETE CASCADE` |
| fk_identity_role_permissions_role_id_roles | `role_id` | [`identity.roles`](../../Tables/identity/roles.md) | `FOREIGN KEY (role_id) REFERENCES identity.roles(id) ON DELETE CASCADE` |
| fk_identity_role_permissions_role_id_roles_numeric | `role_id_internal_id` | [`identity.roles`](../../Tables/identity/roles.md) | `FOREIGN KEY (role_id_internal_id) REFERENCES identity.roles(internal_id) ON DELETE CASCADE` |
| fk_identity_role_permissions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `identity.role_permissions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_role_permissions_created_by_users` |
| `permission_id` | `identity.permissions` | `fk_identity_role_permissions_permission_id_permissions` |
| `permission_id_internal_id` | `identity.permissions` | `fk_identity_role_permissions_permission_id_permissions_numeric` |
| `role_id` | `identity.roles` | `fk_identity_role_permissions_role_id_roles` |
| `role_id_internal_id` | `identity.roles` | `fk_identity_role_permissions_role_id_roles_numeric` |
| `updated_by` | `identity.users` | `fk_identity_role_permissions_updated_by_users` |

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
| `role_permissions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `role_permissions_id_not_null` | NOT NULL | `NOT NULL id` |
| `role_permissions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `role_permissions_permission_id_internal_id_not_null` | NOT NULL | `NOT NULL permission_id_internal_id` |
| `role_permissions_permission_id_not_null` | NOT NULL | `NOT NULL permission_id` |
| `role_permissions_role_id_internal_id_not_null` | NOT NULL | `NOT NULL role_id_internal_id` |
| `role_permissions_role_id_not_null` | NOT NULL | `NOT NULL role_id` |
| `role_permissions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `role_permissions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_identity_role_permissions_role_id` | btree | `(role_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_identity_role_permissions_role_id ON identity.role_permissions USING btree (role_id)` |
| `pk_identity_role_permissions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_role_permissions ON identity.role_permissions USING btree (internal_id)` |
| `role_permission` | btree | `(role_id, permission_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX role_permission ON identity.role_permissions USING btree (role_id, permission_id)` |
| `uq_identity_role_permissions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_role_permissions_id ON identity.role_permissions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.role_permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["permission_id","permission_id_internal_id","identity","permissions"],["role_id","role_id_internal_id","identity","roles"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.role_permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.role_permissions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["permission_id","permission_id_internal_id","identity","permissions"],["role_id","role_id_internal_id","identity","roles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
