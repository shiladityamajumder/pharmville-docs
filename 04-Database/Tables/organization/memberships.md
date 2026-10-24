# `organization.memberships`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds memberships records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | organization.memberships |
| Classification | Mapping / Junction |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 19 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_memberships_created_by_users` |
| `department_id` | `uuid` | Yes | — | Reference linking this record to departments | Ensures related business data can be joined and validated | FK → `organization.departments` via `fk_organization_memberships_department_id_departments` |
| `department_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.departments` via `fk_organization_memberships_department_id_departments_numeric` |
| `designation` | `character varying(128)` | Yes | — | Inferred: stores designation for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `employee_code` | `character varying(64)` | Yes | — | Code for employee | Link to controlled business classification or an external reference | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `joined_at` | `date` | Yes | — | Time of joined | Support chronology, deadlines or audit evidence | Exact constraints below |
| `left_at` | `date` | Yes | — | Time of left | Support chronology, deadlines or audit evidence | Exact constraints below |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_organization_memberships_location_id_locations` |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_organization_memberships_location_id_locations_numeric` |
| `manager_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_memberships_manager_user_id_users` |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_organization_memberships_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_organization_memberships_organization_id_organizatio_2172` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_memberships_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_memberships_user_id_users` |

## Record lifecycle and users

- **Created:** when the memberships business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.memberships` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_organization_memberships_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_memberships_department_id_departments | `department_id` | [`organization.departments`](../../Tables/organization/departments.md) | `FOREIGN KEY (department_id) REFERENCES organization.departments(id) ON DELETE SET NULL` |
| fk_organization_memberships_department_id_departments_numeric | `department_id_internal_id` | [`organization.departments`](../../Tables/organization/departments.md) | `FOREIGN KEY (department_id_internal_id) REFERENCES organization.departments(internal_id) ON DELETE SET NULL` |
| fk_organization_memberships_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL` |
| fk_organization_memberships_location_id_locations_numeric | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL` |
| fk_organization_memberships_manager_user_id_users | `manager_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (manager_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_organization_memberships_organization_id_organizatio_2172 | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_organization_memberships_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_organization_memberships_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_memberships_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `organization.memberships` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_memberships_created_by_users` |
| `department_id` | `organization.departments` | `fk_organization_memberships_department_id_departments` |
| `department_id_internal_id` | `organization.departments` | `fk_organization_memberships_department_id_departments_numeric` |
| `location_id` | `organization.locations` | `fk_organization_memberships_location_id_locations` |
| `location_id_internal_id` | `organization.locations` | `fk_organization_memberships_location_id_locations_numeric` |
| `manager_user_id` | `identity.users` | `fk_organization_memberships_manager_user_id_users` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_memberships_organization_id_organizatio_2172` |
| `organization_id` | `organization.organizations` | `fk_organization_memberships_organization_id_organizations` |
| `updated_by` | `identity.users` | `fk_organization_memberships_updated_by_users` |
| `user_id` | `identity.users` | `fk_organization_memberships_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_memberships_activestatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'archived'::text]))` |
| `ck_organization_memberships_employment_dates` | CHECK | `CHECK (left_at IS NULL OR joined_at IS NULL OR left_at >= joined_at)` |
| `ck_organization_memberships_numeric_pair_department_id` | CHECK | `CHECK ((department_id IS NULL) = (department_id_internal_id IS NULL))` |
| `ck_organization_memberships_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_organization_memberships_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_organization_memberships_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_organization_memberships_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_memberships_department_id_departments` | FOREIGN KEY | `FOREIGN KEY (department_id) REFERENCES organization.departments(id) ON DELETE SET NULL` |
| `fk_organization_memberships_department_id_departments_numeric` | FOREIGN KEY | `FOREIGN KEY (department_id_internal_id) REFERENCES organization.departments(internal_id) ON DELETE SET NULL` |
| `fk_organization_memberships_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL` |
| `fk_organization_memberships_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL` |
| `fk_organization_memberships_manager_user_id_users` | FOREIGN KEY | `FOREIGN KEY (manager_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_organization_memberships_organization_id_organizatio_2172` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_organization_memberships_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_organization_memberships_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_memberships_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `organization_user_membership` | UNIQUE | `UNIQUE (organization_id, user_id)` |
| `pk_organization_memberships` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_memberships_id` | UNIQUE | `UNIQUE (id)` |
| `memberships_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `memberships_id_not_null` | NOT NULL | `NOT NULL id` |
| `memberships_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `memberships_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `memberships_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `memberships_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `memberships_status_not_null` | NOT NULL | `NOT NULL status` |
| `memberships_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `memberships_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_organization_memberships_manager_user_id` | btree | `(manager_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_memberships_manager_user_id ON organization.memberships USING btree (manager_user_id)` |
| `ix_organization_memberships_organization_id` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_memberships_organization_id ON organization.memberships USING btree (organization_id)` |
| `ix_organization_memberships_user_id` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_memberships_user_id ON organization.memberships USING btree (user_id)` |
| `organization_user_membership` | btree | `(organization_id, user_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX organization_user_membership ON organization.memberships USING btree (organization_id, user_id)` |
| `pk_organization_memberships` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_organization_memberships ON organization.memberships USING btree (internal_id)` |
| `uq_organization_memberships_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_memberships_id ON organization.memberships USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.memberships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["department_id","department_id_internal_id","organization","departments"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.memberships FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.memberships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["department_id","department_id_internal_id","organization","departments"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
