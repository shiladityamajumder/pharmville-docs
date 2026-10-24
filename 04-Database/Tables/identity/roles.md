# `identity.roles`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds roles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 7 constraints, 3 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_roles_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_roles_deleted_by_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `is_system` | `boolean` | No | `false` | Yes/no flag for is system | Control conditional business behavior | See exact constraints |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_identity_roles_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the roles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.roles` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_identity_roles_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_identity_roles_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_identity_roles_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 4 FK constraints** (sample): `identity.user_roles`, `identity.role_permissions`, `identity.role_permissions`, `identity.user_roles`.

## `identity.roles` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 7 constraints, 3 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_identity_roles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_identity_roles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_identity_roles_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_identity_roles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_identity_roles_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_identity_roles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_roles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_identity_roles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_identity_roles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_identity_roles_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_identity_roles` | `CREATE UNIQUE INDEX pk_identity_roles ON identity.roles USING btree (internal_id)` |
| `uq_identity_roles_code_active` | `CREATE UNIQUE INDEX uq_identity_roles_code_active ON identity.roles USING btree (code) WHERE is_deleted = false` |
| `uq_identity_roles_id` | `CREATE UNIQUE INDEX uq_identity_roles_id ON identity.roles USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `identity.roles` |
| Category | Master / Reference — Business role identities, separate from PostgreSQL runtime roles |
| Proposed owner / maintenance role | Authentication_Access / Security administrator |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `identity.role_permissions`, `identity.user_roles` |
| Features | `ACC-02`, `ACC-03`, `ACC-04`, `ACC-05`, `ACC-06`, `ACC-07`, `ADM-01`, `ADM-02`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `AUD-01`, `AUD-02`, `AUTH-01`, `AUTH-02`, `AUTH-04`, `CHK-01`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `DLV-05`, `FIN-01`, `FIN-02`, `FIN-03`, `FIN-05`, `FIN-06`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-07`, `RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-06`, `RX-01`, `RX-04`, `RX-05`, `STO-01`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-003](../../../05-APIs/Customer_Accounts.md), [API-004](../../../05-APIs/Customer_Accounts.md), [API-005](../../../05-APIs/Customer_Accounts.md), [API-006](../../../05-APIs/Customer_Accounts.md), [API-007](../../../05-APIs/Customer_Accounts.md), [API-008](../../../05-APIs/Customer_Accounts.md), [API-009](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-005](../../../05-APIs/Customer_Accounts.md), [API-015](../../../05-APIs/Product_Catalog.md), [API-016](../../../05-APIs/Product_Catalog.md), [API-017](../../../05-APIs/Product_Catalog.md), [API-018](../../../05-APIs/Cart_Checkout.md), [API-019](../../../05-APIs/Cart_Checkout.md), [API-020](../../../05-APIs/Cart_Checkout.md), [API-021](../../../05-APIs/Cart_Checkout.md), [API-022](../../../05-APIs/Prescription_Upload.md), [API-023](../../../05-APIs/Prescription_Upload.md), [API-024](../../../05-APIs/Prescription_Upload.md), [API-025](../../../05-APIs/Customer_Orders.md), [API-026](../../../05-APIs/Customer_Orders.md), [API-027](../../../05-APIs/Customer_Orders.md), [API-028](../../../05-APIs/Customer_Orders.md), [API-029](../../../05-APIs/Customer_Orders.md), [API-030](../../../05-APIs/Customer_Orders.md), [API-031](../../../05-APIs/Customer_Orders.md), [API-032](../../../05-APIs/Admin_CMS.md), [API-033](../../../05-APIs/Admin_CMS.md), [API-034](../../../05-APIs/Admin_CMS.md), [API-035](../../../05-APIs/Admin_CMS.md), [API-036](../../../05-APIs/Admin_CMS.md), [API-037](../../../05-APIs/Admin_CMS.md), [API-038](../../../05-APIs/Admin_CMS.md), [API-039](../../../05-APIs/Order_Operations.md), [API-040](../../../05-APIs/Order_Operations.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-043](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-048](../../../05-APIs/Store_Operations.md), [API-049](../../../05-APIs/Store_Operations.md), [API-050](../../../05-APIs/Inventory.md), [API-051](../../../05-APIs/Inventory.md), [API-052](../../../05-APIs/Inventory.md), [API-053](../../../05-APIs/Inventory.md), [API-054](../../../05-APIs/Inventory.md), [API-055](../../../05-APIs/Inventory.md), [API-056](../../../05-APIs/Warehouse.md), [API-057](../../../05-APIs/Warehouse.md), [API-058](../../../05-APIs/Warehouse.md), [API-059](../../../05-APIs/Warehouse.md), [API-060](../../../05-APIs/Pharmacist_Review.md), [API-061](../../../05-APIs/Pharmacist_Review.md), [API-062](../../../05-APIs/Pharmacist_Review.md), [API-063](../../../05-APIs/Pharmacist_Review.md), [API-064](../../../05-APIs/Delivery_Operations.md), [API-065](../../../05-APIs/Delivery_Operations.md), [API-066](../../../05-APIs/Delivery_Operations.md), [API-067](../../../05-APIs/Delivery_Operations.md), [API-068](../../../05-APIs/Delivery_Operations.md), [API-069](../../../05-APIs/Rider_App.md), [API-070](../../../05-APIs/Rider_App.md), [API-071](../../../05-APIs/Rider_App.md), [API-072](../../../05-APIs/Rider_App.md), [API-073](../../../05-APIs/Rider_App.md), [API-074](../../../05-APIs/Rider_App.md), [API-075](../../../05-APIs/Finance_Payments.md), [API-077](../../../05-APIs/Finance_Payments.md), [API-078](../../../05-APIs/Finance_Payments.md), [API-079](../../../05-APIs/Finance_Payments.md), [API-080](../../../05-APIs/Finance_Payments.md), [API-081](../../../05-APIs/Finance_Payments.md), [API-082](../../../05-APIs/Reporting.md), [API-083](../../../05-APIs/Reporting.md), [API-084](../../../05-APIs/Reporting.md), [API-085](../../../05-APIs/Reporting.md), [API-086](../../../05-APIs/Reporting.md), [API-087](../../../05-APIs/Audit.md), [API-088](../../../05-APIs/Audit.md), [API-089](../../../05-APIs/Authentication_Access.md), [API-090](../../../05-APIs/Authentication_Access.md), [API-091](../../../05-APIs/Authentication_Access.md), [API-092](../../../05-APIs/Authentication_Access.md), [API-093](../../../05-APIs/Authentication_Access.md), [API-094](../../../05-APIs/Notifications.md), [API-095](../../../05-APIs/Notifications.md), [API-096](../../../05-APIs/Notifications.md), [API-097](../../../05-APIs/Notifications.md), [ACC-ROUTE-001](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-002](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-007](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-006](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-003](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-004](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-008](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-009](../../../05-APIs/Customer_Accounts.md), [ACC-ROUTE-010](../../../05-APIs/Customer_Accounts.md) |

### Expected initial records

| Code | Name | Description | Status | Source | Additional schema attributes |
| --- | --- | --- | --- | --- | --- |
| customer | Customer | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| super_admin | Super Admin | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| central_admin | Central Admin | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| cms_manager | CMS Manager | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| catalog_manager | Catalog Manager | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| ops_manager | Ops Manager | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| store_manager | Store Manager | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| store_staff | Store Staff | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| warehouse_manager | Warehouse Manager | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| warehouse_staff | Warehouse Staff | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| inventory_controller | Inventory Controller | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| licensed_pharmacist | Licensed Pharmacist | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| delivery_rider | Delivery Rider | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| finance_manager | Finance Manager | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| finance_executive | Finance Executive | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |
| auditor | Auditor | Business role named in module LLDs. Proposed code/grants; not an observed seeded role. | Proposed | User-Roles.md and module LLD Actors; AUTH-01 / ADM-03 | is_system=true proposed; no grants implied. Exactly 16 suggested roles matches draft count, requires D-003 approval. |

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deployment reference seed after approval, followed by controlled administration. |
| Create/update permissions | Security administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_identity_roles_code_active ON identity.roles USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_identity_roles_id ON identity.roles USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Explicit rows above are Confirmed domain values or Proposed initial records, never observed production/seed data. No live row existence or seed execution was verified. |
| Pending decisions | D-024 ownership/lifecycle approval; D-003 exact role/grant and identity lifecycle approval. |
