# `organization.departments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds departments records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | organization.departments |
| Classification | Master / Reference |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_departments_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_departments_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_organization_departments_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_organization_departments_organization_id_organizatio_fb8c` |
| `parent_id` | `uuid` | Yes | — | Reference linking this record to departments | Ensures related business data can be joined and validated | FK → `organization.departments` via `fk_organization_departments_parent_id_departments` |
| `parent_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.departments` via `fk_organization_departments_parent_id_departments_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_departments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the departments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.departments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_organization_departments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_departments_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_departments_organization_id_organizatio_fb8c | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_organization_departments_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_organization_departments_parent_id_departments | `parent_id` | [`organization.departments`](../../Tables/organization/departments.md) | `FOREIGN KEY (parent_id) REFERENCES organization.departments(id) ON DELETE SET NULL` |
| fk_organization_departments_parent_id_departments_numeric | `parent_id_internal_id` | [`organization.departments`](../../Tables/organization/departments.md) | `FOREIGN KEY (parent_id_internal_id) REFERENCES organization.departments(internal_id) ON DELETE SET NULL` |
| fk_organization_departments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_parent_id_departments | `parent_id` | `id` |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_parent_id_departments_numeric | `parent_id_internal_id` | `internal_id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_department_id_departments | `department_id` | `id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_department_id_departments_numeric | `department_id_internal_id` | `internal_id` |

## `organization.departments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_departments_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_departments_deleted_by_users` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_departments_organization_id_organizatio_fb8c` |
| `organization_id` | `organization.organizations` | `fk_organization_departments_organization_id_organizations` |
| `parent_id` | `organization.departments` | `fk_organization_departments_parent_id_departments` |
| `parent_id_internal_id` | `organization.departments` | `fk_organization_departments_parent_id_departments_numeric` |
| `updated_by` | `identity.users` | `fk_organization_departments_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_departments_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_organization_departments_numeric_pair_parent_id` | CHECK | `CHECK ((parent_id IS NULL) = (parent_id_internal_id IS NULL))` |
| `ck_organization_departments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_organization_departments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_departments_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_departments_organization_id_organizatio_fb8c` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_organization_departments_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_organization_departments_parent_id_departments` | FOREIGN KEY | `FOREIGN KEY (parent_id) REFERENCES organization.departments(id) ON DELETE SET NULL` |
| `fk_organization_departments_parent_id_departments_numeric` | FOREIGN KEY | `FOREIGN KEY (parent_id_internal_id) REFERENCES organization.departments(internal_id) ON DELETE SET NULL` |
| `fk_organization_departments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `organization_department_code` | UNIQUE | `UNIQUE (organization_id, code)` |
| `pk_organization_departments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_departments_id` | UNIQUE | `UNIQUE (id)` |
| `departments_code_not_null` | NOT NULL | `NOT NULL code` |
| `departments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `departments_id_not_null` | NOT NULL | `NOT NULL id` |
| `departments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `departments_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `departments_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `departments_name_not_null` | NOT NULL | `NOT NULL name` |
| `departments_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `departments_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `departments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `departments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_organization_departments_organization_id` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_departments_organization_id ON organization.departments USING btree (organization_id)` |
| `organization_department_code` | btree | `(organization_id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX organization_department_code ON organization.departments USING btree (organization_id, code)` |
| `pk_organization_departments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_organization_departments ON organization.departments USING btree (internal_id)` |
| `uq_organization_departments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_departments_id ON organization.departments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.departments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"],["parent_id","parent_id_internal_id","organization","departments"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.departments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.departments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"],["parent_id","parent_id_internal_id","organization","departments"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `organization.departments` |
| Category | Master / Reference — Organization-scoped department hierarchy |
| Proposed owner / maintenance role | Admin_CMS / Organization administrator |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `organization.departments`, `organization.memberships` |
| Features | `ADM-02`, `DLV-01`, `DLV-02`, `DLV-04`, `DLV-05`, `OMS-01`, `PHM-01`, `REP-07`, `STO-01` |
| API consumers | [API-033](../../../03-Modules/Admin_CMS/APIs.md), [API-034](../../../03-Modules/Admin_CMS/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-044](../../../03-Modules/Store_Operations/APIs.md), [API-060](../../../03-Modules/Pharmacist_Review/APIs.md), [API-064](../../../03-Modules/Delivery_Operations/APIs.md), [API-065](../../../03-Modules/Delivery_Operations/APIs.md), [API-067](../../../03-Modules/Delivery_Operations/APIs.md), [API-068](../../../03-Modules/Delivery_Operations/APIs.md), [API-086](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `name`, `organization_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Organization administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (organization_id, code); UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX organization_department_code ON organization.departments USING btree (organization_id, code); CREATE UNIQUE INDEX uq_organization_departments_id ON organization.departments USING btree (id) |
| Foreign-key dependencies | `organization.departments`, `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
