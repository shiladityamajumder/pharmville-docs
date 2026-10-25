# `marketplace.sellers`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds sellers records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.sellers |
| Classification | Master / Reference |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `commission_plan_id` | `uuid` | Yes | — | Reference linking this record to commission plans | Ensures related business data can be joined and validated | FK → `marketplace.commission_plans` via `fk_domain_marketplace_sellers_commission_plan_id` |
| `commission_plan_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.commission_plans` via `fk_domain_marketplace_sellers_commission_plan_id_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_sellers_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_sellers_deleted_by_users` |
| `display_name` | `character varying(255)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_marketplace_sellers_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_marketplace_sellers_organization_id_organizations_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_code` | `character varying(64)` | No | — | Code for seller | Link to controlled business classification or an external reference | Collation: default |
| `seller_type` | `character varying(32)` | No | — | Inferred: stores seller type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `settlement_cycle` | `character varying(32)` | No | `'weekly'::character varying` | Inferred: stores settlement cycle for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(32)` | No | `'onboarding'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_sellers_updated_by_users` |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the sellers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.sellers` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_domain_marketplace_sellers_commission_plan_id | `commission_plan_id` | [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | `FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT` |
| fk_domain_marketplace_sellers_commission_plan_id_numeric | `commission_plan_id_internal_id` | [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | `FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT` |
| fk_marketplace_sellers_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_sellers_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_sellers_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| fk_marketplace_sellers_organization_id_organizations_numeric | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| fk_marketplace_sellers_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_seller_id_sellers | `seller_id` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_seller_id_sellers | `seller_id` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_seller_id_sellers | `seller_id` | `id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_seller_id_sellers | `seller_id` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_seller_id_sellers | `seller_id` | `id` |
| [`finance.invoices`](../../Tables/finance/invoices.md) | fk_finance_invoices_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`finance.settlement_runs`](../../Tables/finance/settlement_runs.md) | fk_finance_settlement_runs_seller_id_sellers | `seller_id` | `id` |
| [`finance.settlement_runs`](../../Tables/finance/settlement_runs.md) | fk_finance_settlement_runs_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_seller_id_sellers | `seller_id` | `id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`marketplace.seller_commission_assignments`](../../Tables/marketplace/seller_commission_assignments.md) | fk_marketplace_seller_commission_assignments_seller_id__c576 | `seller_id_internal_id` | `internal_id` |
| [`marketplace.seller_commission_assignments`](../../Tables/marketplace/seller_commission_assignments.md) | fk_marketplace_seller_commission_assignments_seller_id_sellers | `seller_id` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_seller_id_sellers | `seller_id` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_seller_id_seller_b68d | `seller_id_internal_id` | `internal_id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_seller_id_sellers | `seller_id` | `id` |
| [`marketplace.seller_ratings`](../../Tables/marketplace/seller_ratings.md) | fk_marketplace_seller_ratings_seller_id_sellers | `seller_id` | `id` |
| [`marketplace.seller_ratings`](../../Tables/marketplace/seller_ratings.md) | fk_marketplace_seller_ratings_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`marketplace.seller_service_levels`](../../Tables/marketplace/seller_service_levels.md) | fk_marketplace_seller_service_levels_seller_id_sellers | `seller_id` | `id` |
| [`marketplace.seller_service_levels`](../../Tables/marketplace/seller_service_levels.md) | fk_marketplace_seller_service_levels_seller_id_sellers_numeric | `seller_id_internal_id` | `internal_id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_domain_pricing_price_books_seller_id | `seller_id` | `id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_domain_pricing_price_books_seller_id_numeric | `seller_id_internal_id` | `internal_id` |

## `marketplace.sellers` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `commission_plan_id` | `marketplace.commission_plans` | `fk_domain_marketplace_sellers_commission_plan_id` |
| `commission_plan_id_internal_id` | `marketplace.commission_plans` | `fk_domain_marketplace_sellers_commission_plan_id_numeric` |
| `created_by` | `identity.users` | `fk_marketplace_sellers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_marketplace_sellers_deleted_by_users` |
| `organization_id` | `organization.organizations` | `fk_marketplace_sellers_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_marketplace_sellers_organization_id_organizations_numeric` |
| `updated_by` | `identity.users` | `fk_marketplace_sellers_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_sellers_numeric_pair_commission_plan_id` | CHECK | `CHECK ((commission_plan_id IS NULL) = (commission_plan_id_internal_id IS NULL))` |
| `ck_marketplace_sellers_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_marketplace_sellers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_marketplace_sellers_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_domain_marketplace_sellers_commission_plan_id` | FOREIGN KEY | `FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT` |
| `fk_domain_marketplace_sellers_commission_plan_id_numeric` | FOREIGN KEY | `FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_sellers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_sellers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_marketplace_sellers_id` | UNIQUE | `UNIQUE (id)` |
| `sellers_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `sellers_display_name_not_null` | NOT NULL | `NOT NULL display_name` |
| `sellers_id_not_null` | NOT NULL | `NOT NULL id` |
| `sellers_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `sellers_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `sellers_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `sellers_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `sellers_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `sellers_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `sellers_seller_code_not_null` | NOT NULL | `NOT NULL seller_code` |
| `sellers_seller_type_not_null` | NOT NULL | `NOT NULL seller_type` |
| `sellers_settlement_cycle_not_null` | NOT NULL | `NOT NULL settlement_cycle` |
| `sellers_status_not_null` | NOT NULL | `NOT NULL status` |
| `sellers_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `sellers_verification_status_not_null` | NOT NULL | `NOT NULL verification_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_marketplace_sellers_organization` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_sellers_organization ON marketplace.sellers USING btree (organization_id)` |
| `ix_marketplace_sellers_status` | btree | `(verification_status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_sellers_status ON marketplace.sellers USING btree (verification_status)` |
| `pk_marketplace_sellers` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_sellers ON marketplace.sellers USING btree (internal_id)` |
| `uq_marketplace_sellers_code_active` | btree | `(seller_code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_sellers_code_active ON marketplace.sellers USING btree (seller_code) WHERE is_deleted = false` |
| `uq_marketplace_sellers_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_sellers_id ON marketplace.sellers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.sellers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.sellers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.sellers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `marketplace.sellers` |
| Category | Master / Reference — Verified seller parties |
| Proposed owner / maintenance role | Future marketplace / Marketplace onboarding owner |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `commerce.cart_items`, `commerce.order_allocations`, `commerce.order_groups`, `commerce.order_items`, `finance.invoices`, `finance.settlement_runs`, `fulfillment.fulfillment_orders`, `marketplace.seller_commission_assignments`, `marketplace.seller_locations`, `marketplace.seller_product_listings`, `marketplace.seller_ratings`, `marketplace.seller_service_levels`, `pricing.price_books` |
| Features | `CAT-02`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `FIN-02`, `INV-01`, `INV-03`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `PHM-03`, `PHM-05`, `REP-01`, `REP-02`, `REP-04`, `RID-02`, `RX-04`, `RX-05`, `STO-01`, `STO-02`, `WH-04` |
| API consumers | [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-018](../../../03-Modules/Cart_Checkout/APIs.md), [API-019](../../../03-Modules/Cart_Checkout/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-024](../../../03-Modules/Prescription_Upload/APIs.md), [API-026](../../../03-Modules/Customer_Orders/APIs.md), [API-027](../../../03-Modules/Customer_Orders/APIs.md), [API-028](../../../03-Modules/Customer_Orders/APIs.md), [API-029](../../../03-Modules/Customer_Orders/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-044](../../../03-Modules/Store_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-062](../../../03-Modules/Pharmacist_Review/APIs.md), [API-063](../../../03-Modules/Pharmacist_Review/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-081](../../../03-Modules/Finance_Payments/APIs.md), [API-082](../../../03-Modules/Reporting/APIs.md), [API-083](../../../03-Modules/Reporting/APIs.md), [API-085](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `display_name`, `organization_id`, `seller_code`, `seller_type`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deferred future module: no launch seed or API scope is implied. |
| Create/update permissions | Marketplace onboarding owner through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_marketplace_sellers_code_active ON marketplace.sellers USING btree (seller_code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_marketplace_sellers_id ON marketplace.sellers USING btree (id) |
| Foreign-key dependencies | `marketplace.commission_plans`, `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
