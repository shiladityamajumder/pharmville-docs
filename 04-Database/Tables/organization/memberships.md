# organization.memberships

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds memberships records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 19 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_memberships_created_by_users) |
| `department_id` | `uuid` | Yes | — | Reference linking this record to departments | Ensures related business data can be joined and validated | FK → `organization.departments` (fk_organization_memberships_department_id_departments) |
| `department_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.departments` (fk_organization_memberships_department_id_departments_numeric); Numeric/public-key pair verification required |
| `designation` | `character varying(128)` | Yes | — | Inferred: stores designation for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `employee_code` | `character varying(64)` | Yes | — | Code for employee | Link to controlled business classification or an external reference | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `joined_at` | `date` | Yes | — | Time of joined | Support chronology, deadlines or audit evidence | See exact constraints |
| `left_at` | `date` | Yes | — | Time of left | Support chronology, deadlines or audit evidence | See exact constraints |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_organization_memberships_location_id_locations) |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_organization_memberships_location_id_locations_numeric); Numeric/public-key pair verification required |
| `manager_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_memberships_manager_user_id_users) |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_organization_memberships_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_organization_memberships_organization_id_organizatio_2172); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_memberships_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_memberships_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the memberships business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.memberships` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_organization_memberships_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE
- `manager_user_id` → `identity.users(id)` via `fk_organization_memberships_manager_user_id_users`; FOREIGN KEY (manager_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `created_by` → `identity.users(id)` via `fk_organization_memberships_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_organization_memberships_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `organization_id` → `organization.organizations(id)` via `fk_organization_memberships_organization_id_organizations`; FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE
- `department_id` → `organization.departments(id)` via `fk_organization_memberships_department_id_departments`; FOREIGN KEY (department_id) REFERENCES organization.departments(id) ON DELETE SET NULL
- `location_id` → `organization.locations(id)` via `fk_organization_memberships_location_id_locations`; FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL
- `department_id_internal_id` → `organization.departments(internal_id)` via `fk_organization_memberships_department_id_departments_numeric`; FOREIGN KEY (department_id_internal_id) REFERENCES organization.departments(internal_id) ON DELETE SET NULL
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_organization_memberships_location_id_locations_numeric`; FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_organization_memberships_organization_id_organizatio_2172`; FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE

## organization.memberships — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 20 columns, 19 constraints, 6 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_organization_memberships_user_id_users` |
| `manager_user_id` | `identity.users` | `fk_organization_memberships_manager_user_id_users` |
| `created_by` | `identity.users` | `fk_organization_memberships_created_by_users` |
| `updated_by` | `identity.users` | `fk_organization_memberships_updated_by_users` |
| `organization_id` | `organization.organizations` | `fk_organization_memberships_organization_id_organizations` |
| `department_id` | `organization.departments` | `fk_organization_memberships_department_id_departments` |
| `location_id` | `organization.locations` | `fk_organization_memberships_location_id_locations` |
| `department_id_internal_id` | `organization.departments` | `fk_organization_memberships_department_id_departments_numeric` |
| `location_id_internal_id` | `organization.locations` | `fk_organization_memberships_location_id_locations_numeric` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_memberships_organization_id_organizatio_2172` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_organization_memberships_manager_user_id` | `CREATE INDEX ix_organization_memberships_manager_user_id ON organization.memberships USING btree (manager_user_id)` |
| `ix_organization_memberships_organization_id` | `CREATE INDEX ix_organization_memberships_organization_id ON organization.memberships USING btree (organization_id)` |
| `ix_organization_memberships_user_id` | `CREATE INDEX ix_organization_memberships_user_id ON organization.memberships USING btree (user_id)` |
| `organization_user_membership` | `CREATE UNIQUE INDEX organization_user_membership ON organization.memberships USING btree (organization_id, user_id)` |
| `pk_organization_memberships` | `CREATE UNIQUE INDEX pk_organization_memberships ON organization.memberships USING btree (internal_id)` |
| `uq_organization_memberships_id` | `CREATE UNIQUE INDEX uq_organization_memberships_id ON organization.memberships USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.memberships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["department_id","department_id_internal_id","organization","departments"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.memberships FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.memberships FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["department_id","department_id_internal_id","organization","departments"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
