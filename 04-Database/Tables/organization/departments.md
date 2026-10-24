# `organization.departments`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds departments records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_departments_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_departments_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_organization_departments_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_organization_departments_organization_id_organizatio_fb8c); Numeric/public-key pair verification required |
| `parent_id` | `uuid` | Yes | — | Reference linking this record to departments | Ensures related business data can be joined and validated | FK → `organization.departments` (fk_organization_departments_parent_id_departments) |
| `parent_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.departments` (fk_organization_departments_parent_id_departments_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_departments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the departments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.departments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_organization_departments_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_organization_departments_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_organization_departments_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `parent_id` → `organization.departments(id)` via `fk_organization_departments_parent_id_departments`; `FOREIGN KEY (parent_id) REFERENCES organization.departments(id) ON DELETE SET NULL`
- `organization_id` → `organization.organizations(id)` via `fk_organization_departments_organization_id_organizations`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_organization_departments_organization_id_organizatio_fb8c`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE`
- `parent_id_internal_id` → `organization.departments(internal_id)` via `fk_organization_departments_parent_id_departments_numeric`; `FOREIGN KEY (parent_id_internal_id) REFERENCES organization.departments(internal_id) ON DELETE SET NULL`

**Referenced by 4 FK constraints** (sample): `organization.departments`, `organization.memberships`, `organization.departments`, `organization.memberships`.

## `organization.departments` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 13 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_departments_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_departments_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_organization_departments_updated_by_users` |
| `parent_id` | `organization.departments` | `fk_organization_departments_parent_id_departments` |
| `organization_id` | `organization.organizations` | `fk_organization_departments_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_departments_organization_id_organizatio_fb8c` |
| `parent_id_internal_id` | `organization.departments` | `fk_organization_departments_parent_id_departments_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_organization_departments_organization_id` | `CREATE INDEX ix_organization_departments_organization_id ON organization.departments USING btree (organization_id)` |
| `organization_department_code` | `CREATE UNIQUE INDEX organization_department_code ON organization.departments USING btree (organization_id, code)` |
| `pk_organization_departments` | `CREATE UNIQUE INDEX pk_organization_departments ON organization.departments USING btree (internal_id)` |
| `uq_organization_departments_id` | `CREATE UNIQUE INDEX uq_organization_departments_id ON organization.departments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.departments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"],["parent_id","parent_id_internal_id","organization","departments"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.departments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.departments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"],["parent_id","parent_id_internal_id","organization","departments"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

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
| API consumers | [API-033](../../../05-APIs/Admin_CMS.md), [API-034](../../../05-APIs/Admin_CMS.md), [API-039](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-060](../../../05-APIs/Pharmacist_Review.md), [API-064](../../../05-APIs/Delivery_Operations.md), [API-065](../../../05-APIs/Delivery_Operations.md), [API-067](../../../05-APIs/Delivery_Operations.md), [API-068](../../../05-APIs/Delivery_Operations.md), [API-086](../../../05-APIs/Reporting.md) |

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
