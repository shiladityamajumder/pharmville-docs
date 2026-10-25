# `identity.roles`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds roles records within the identity domain (accounts, sessions, and role permissions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | identity.roles |
| Classification | Master / Reference |
| Proposed business write owner | Authentication_Access |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_roles_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_roles_deleted_by_users` |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `is_system` | `boolean` | No | `false` | Yes/no flag for is system | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_identity_roles_updated_by_users` |

## Record lifecycle and users

- **Created:** when the roles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Admin_CMS, Rider_App, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `identity.roles` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_identity_roles_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_roles_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_identity_roles_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`identity.role_permissions`](../../Tables/identity/role_permissions.md) | fk_identity_role_permissions_role_id_roles | `role_id` | `id` |
| [`identity.role_permissions`](../../Tables/identity/role_permissions.md) | fk_identity_role_permissions_role_id_roles_numeric | `role_id_internal_id` | `internal_id` |
| [`identity.user_roles`](../../Tables/identity/user_roles.md) | fk_identity_user_roles_role_id_roles | `role_id` | `id` |
| [`identity.user_roles`](../../Tables/identity/user_roles.md) | fk_identity_user_roles_role_id_roles_numeric | `role_id_internal_id` | `internal_id` |

## `identity.roles` — exact structural contracts

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
| `roles_code_not_null` | NOT NULL | `NOT NULL code` |
| `roles_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `roles_id_not_null` | NOT NULL | `NOT NULL id` |
| `roles_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `roles_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `roles_is_system_not_null` | NOT NULL | `NOT NULL is_system` |
| `roles_name_not_null` | NOT NULL | `NOT NULL name` |
| `roles_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `roles_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_identity_roles` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_identity_roles ON identity.roles USING btree (internal_id)` |
| `uq_identity_roles_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_roles_code_active ON identity.roles USING btree (code) WHERE is_deleted = false` |
| `uq_identity_roles_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_identity_roles_id ON identity.roles USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON identity.roles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

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
| API consumers | [API-003](../../../03-Modules/Customer_Accounts/APIs.md), [API-004](../../../03-Modules/Customer_Accounts/APIs.md), [API-005](../../../03-Modules/Customer_Accounts/APIs.md), [API-006](../../../03-Modules/Customer_Accounts/APIs.md), [API-007](../../../03-Modules/Customer_Accounts/APIs.md), [API-008](../../../03-Modules/Customer_Accounts/APIs.md), [API-009](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-005](../../../03-Modules/Customer_Accounts/APIs.md), [API-015](../../../03-Modules/Product_Catalog/APIs.md), [API-016](../../../03-Modules/Product_Catalog/APIs.md), [API-017](../../../03-Modules/Product_Catalog/APIs.md), [API-018](../../../03-Modules/Cart_Checkout/APIs.md), [API-019](../../../03-Modules/Cart_Checkout/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-022](../../../03-Modules/Prescription_Upload/APIs.md), [API-023](../../../03-Modules/Prescription_Upload/APIs.md), [API-024](../../../03-Modules/Prescription_Upload/APIs.md), [API-025](../../../03-Modules/Customer_Orders/APIs.md), [API-026](../../../03-Modules/Customer_Orders/APIs.md), [API-027](../../../03-Modules/Customer_Orders/APIs.md), [API-028](../../../03-Modules/Customer_Orders/APIs.md), [API-029](../../../03-Modules/Customer_Orders/APIs.md), [API-030](../../../03-Modules/Customer_Orders/APIs.md), [API-031](../../../03-Modules/Customer_Orders/APIs.md), [API-032](../../../03-Modules/Admin_CMS/APIs.md), [API-033](../../../03-Modules/Admin_CMS/APIs.md), [API-034](../../../03-Modules/Admin_CMS/APIs.md), [API-035](../../../03-Modules/Admin_CMS/APIs.md), [API-036](../../../03-Modules/Admin_CMS/APIs.md), [API-037](../../../03-Modules/Admin_CMS/APIs.md), [API-038](../../../03-Modules/Admin_CMS/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-044](../../../03-Modules/Store_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-049](../../../03-Modules/Store_Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-053](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-060](../../../03-Modules/Pharmacist_Review/APIs.md), [API-061](../../../03-Modules/Pharmacist_Review/APIs.md), [API-062](../../../03-Modules/Pharmacist_Review/APIs.md), [API-063](../../../03-Modules/Pharmacist_Review/APIs.md), [API-064](../../../03-Modules/Delivery_Operations/APIs.md), [API-065](../../../03-Modules/Delivery_Operations/APIs.md), [API-066](../../../03-Modules/Delivery_Operations/APIs.md), [API-067](../../../03-Modules/Delivery_Operations/APIs.md), [API-068](../../../03-Modules/Delivery_Operations/APIs.md), [API-069](../../../03-Modules/Rider_App/APIs.md), [API-070](../../../03-Modules/Rider_App/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-072](../../../03-Modules/Rider_App/APIs.md), [API-073](../../../03-Modules/Rider_App/APIs.md), [API-074](../../../03-Modules/Rider_App/APIs.md), [API-075](../../../03-Modules/Finance_Payments/APIs.md), [API-077](../../../03-Modules/Finance_Payments/APIs.md), [API-078](../../../03-Modules/Finance_Payments/APIs.md), [API-079](../../../03-Modules/Finance_Payments/APIs.md), [API-080](../../../03-Modules/Finance_Payments/APIs.md), [API-081](../../../03-Modules/Finance_Payments/APIs.md), [API-082](../../../03-Modules/Reporting/APIs.md), [API-083](../../../03-Modules/Reporting/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md), [API-085](../../../03-Modules/Reporting/APIs.md), [API-086](../../../03-Modules/Reporting/APIs.md), [API-087](../../../03-Modules/Audit/APIs.md), [API-088](../../../03-Modules/Audit/APIs.md), [API-089](../../../03-Modules/Authentication_Access/APIs.md), [API-090](../../../03-Modules/Authentication_Access/APIs.md), [API-091](../../../03-Modules/Authentication_Access/APIs.md), [API-092](../../../03-Modules/Authentication_Access/APIs.md), [API-093](../../../03-Modules/Authentication_Access/APIs.md), [API-094](../../../03-Modules/Notifications/APIs.md), [API-095](../../../03-Modules/Notifications/APIs.md), [API-096](../../../03-Modules/Notifications/APIs.md), [API-097](../../../03-Modules/Notifications/APIs.md), [ACC-ROUTE-001](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-002](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-007](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-006](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-003](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-004](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-010](../../../03-Modules/Customer_Accounts/APIs.md) |

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


### Additional candidate requiring separate approval

The inherited 16 role codes above remain unchanged. support_agent (Support) is an additional **Proposed** candidate, not an existing/approved seed record; D-020/D-027 must approve support scope and D-003 its login policy before any assignment. Ops Manager delivery-dispatch, Receiving Staff, Report Viewer and notification-template maintenance are scoped capabilities/aliases, not invented role records. [Canonical matrix](../../../01-Project/User-Roles.md).


| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| support_agent | Support | Additional scoped support candidate; no clinical, financial or evidence mutation grant. | Proposed | D-020/D-027; unified role/workspace policy; separate approval required |
