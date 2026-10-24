# `procurement.suppliers`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds suppliers records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.suppliers |
| Classification | Master / Reference |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `contact_json` | `jsonb` | No | `'{}'::jsonb` | Structured contact json information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_suppliers_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_suppliers_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_procurement_suppliers_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_procurement_suppliers_organization_id_organizations_numeric` |
| `payment_terms_days` | `integer` | No | `0` | Inferred: stores payment terms days for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `risk_rating` | `character varying(32)` | Yes | — | Inferred: stores risk rating for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `supplier_code` | `character varying(64)` | No | — | Code for supplier | Link to controlled business classification or an external reference | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_suppliers_updated_by_users` |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the suppliers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.suppliers` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_suppliers_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_suppliers_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_suppliers_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| fk_procurement_suppliers_organization_id_organizations_numeric | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| fk_procurement_suppliers_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_supplier_id_suppliers | `supplier_id` | `id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_supplier_id_suppliers_numeric | `supplier_id_internal_id` | `internal_id` |
| [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | fk_procurement_purchase_returns_supplier_id_suppliers | `supplier_id` | `id` |
| [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | fk_procurement_purchase_returns_supplier_id_suppliers_numeric | `supplier_id_internal_id` | `internal_id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_supplier_id_suppliers | `supplier_id` | `id` |
| [`procurement.supplier_invoices`](../../Tables/procurement/supplier_invoices.md) | fk_procurement_supplier_invoices_supplier_id_suppliers_numeric | `supplier_id_internal_id` | `internal_id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_supplier_id_suppliers | `supplier_id` | `id` |
| [`procurement.supplier_licenses`](../../Tables/procurement/supplier_licenses.md) | fk_procurement_supplier_licenses_supplier_id_suppliers_numeric | `supplier_id_internal_id` | `internal_id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_supplier_id_suppliers | `supplier_id` | `id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_supplier_id_suppliers_numeric | `supplier_id_internal_id` | `internal_id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_supplier_id_suppliers | `supplier_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_supplier_id_suppliers_numeric | `supplier_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_preferred_supplier_id__4425 | `preferred_supplier_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_preferred_supplier_id__5314 | `preferred_supplier_id` | `id` |

## `procurement.suppliers` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_suppliers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_procurement_suppliers_deleted_by_users` |
| `organization_id` | `organization.organizations` | `fk_procurement_suppliers_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_procurement_suppliers_organization_id_organizations_numeric` |
| `updated_by` | `identity.users` | `fk_procurement_suppliers_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_suppliers_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_procurement_suppliers_payment_terms_nonnegative` | CHECK | `CHECK (payment_terms_days >= 0)` |
| `ck_procurement_suppliers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_procurement_suppliers_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(supplier_code::text)) > 0 AND supplier_code::text = btrim(supplier_code::text))` |
| `ck_procurement_suppliers_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_procurement_suppliers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_suppliers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_suppliers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_suppliers_id` | UNIQUE | `UNIQUE (id)` |
| `suppliers_contact_json_not_null` | NOT NULL | `NOT NULL contact_json` |
| `suppliers_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `suppliers_id_not_null` | NOT NULL | `NOT NULL id` |
| `suppliers_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `suppliers_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `suppliers_name_not_null` | NOT NULL | `NOT NULL name` |
| `suppliers_payment_terms_days_not_null` | NOT NULL | `NOT NULL payment_terms_days` |
| `suppliers_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `suppliers_status_not_null` | NOT NULL | `NOT NULL status` |
| `suppliers_supplier_code_not_null` | NOT NULL | `NOT NULL supplier_code` |
| `suppliers_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `suppliers_verification_status_not_null` | NOT NULL | `NOT NULL verification_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_suppliers_organization` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_suppliers_organization ON procurement.suppliers USING btree (organization_id)` |
| `ix_procurement_suppliers_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_suppliers_status ON procurement.suppliers USING btree (status)` |
| `pk_procurement_suppliers` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_suppliers ON procurement.suppliers USING btree (internal_id)` |
| `uq_procurement_supplier_code_active` | btree | `(supplier_code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_supplier_code_active ON procurement.suppliers USING btree (supplier_code) WHERE is_deleted = false` |
| `uq_procurement_suppliers_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_suppliers_id ON procurement.suppliers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('supplier_code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.suppliers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `procurement.suppliers` |
| Category | Master / Reference — Verified procurement supplier parties |
| Proposed owner / maintenance role | Warehouse / Procurement steward |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `procurement.purchase_orders`, `procurement.purchase_returns`, `procurement.supplier_invoices`, `procurement.supplier_licenses`, `procurement.supplier_products`, `warehouse.inventory_lots`, `warehouse.replenishment_rules` |
| Features | `CAT-04`, `CHK-08`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `OMS-03`, `OMS-04`, `REP-03`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02` |
| API consumers | [API-014](../../../03-Modules/Product-Catalog/APIs.md), [API-041](../../../03-Modules/Order-Management/APIs.md), [API-042](../../../03-Modules/Order-Management/APIs.md), [API-046](../../../03-Modules/Store-Operations/APIs.md), [API-048](../../../03-Modules/Store-Operations/APIs.md), [API-049](../../../03-Modules/Store-Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `name`, `supplier_code`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Procurement steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_procurement_supplier_code_active ON procurement.suppliers USING btree (supplier_code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_procurement_suppliers_id ON procurement.suppliers USING btree (id) |
| Foreign-key dependencies | `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
