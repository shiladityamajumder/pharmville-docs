# `warehouse.warehouses`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds warehouses records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.warehouses |
| Classification | Master / Reference |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 17 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_warehouses_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_warehouses_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `location_id` | `uuid` | No | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_warehouse_warehouses_location_id_locations` |
| `location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_warehouse_warehouses_location_id_locations_numeric` |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `operating_hours` | `jsonb` | No | `'{}'::jsonb` | Structured operating hours information | Retain a versioned payload or relevant details | Exact constraints below |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_warehouse_warehouses_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_warehouse_warehouses_organization_id_organizations_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `supports_cold_chain` | `boolean` | No | `false` | Inferred: stores supports cold chain for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `supports_controlled_drugs` | `boolean` | No | `false` | Inferred: stores supports controlled drugs for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_warehouses_updated_by_users` |
| `warehouse_type` | `character varying(32)` | No | — | Inferred: stores warehouse type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the warehouses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.warehouses` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_warehouses_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_warehouses_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_warehouses_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| fk_warehouse_warehouses_location_id_locations_numeric | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_warehouses_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| fk_warehouse_warehouses_organization_id_organizations_numeric | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_warehouses_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | fk_commerce_order_groups_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861 | `warehouse_id_internal_id` | `internal_id` |
| [`fulfillment.fulfillment_orders`](../../Tables/fulfillment/fulfillment_orders.md) | fk_fulfillment_fulfillment_orders_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | fk_fulfillment_picking_waves_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | fk_fulfillment_picking_waves_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | fk_logistics_delivery_routes_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`logistics.delivery_routes`](../../Tables/logistics/delivery_routes.md) | fk_logistics_delivery_routes_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | fk_logistics_delivery_slots_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`logistics.delivery_slots`](../../Tables/logistics/delivery_slots.md) | fk_logistics_delivery_slots_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_pricing_price_books_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`pricing.price_books`](../../Tables/pricing/price_books.md) | fk_pricing_price_books_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`procurement.goods_receipts`](../../Tables/procurement/goods_receipts.md) | fk_procurement_goods_receipts_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`procurement.purchase_orders`](../../Tables/procurement/purchase_orders.md) | fk_procurement_purchase_orders_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | fk_procurement_purchase_requisitions_warehouse_id_wareh_cf7d | `warehouse_id_internal_id` | `internal_id` |
| [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | fk_procurement_purchase_requisitions_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | fk_procurement_purchase_returns_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | fk_procurement_purchase_returns_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | fk_warehouse_aisles_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.aisles`](../../Tables/warehouse/aisles.md) | fk_warehouse_aisles_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.bins`](../../Tables/warehouse/bins.md) | fk_warehouse_bins_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_warehouse_id_warehou_bdcd | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | fk_warehouse_inventory_adjustments_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.racks`](../../Tables/warehouse/racks.md) | fk_warehouse_racks_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.racks`](../../Tables/warehouse/racks.md) | fk_warehouse_racks_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_warehouse_id_warehouse_f9b5 | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac | `destination_warehouse_id` | `id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92 | `destination_warehouse_id_internal_id` | `internal_id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1 | `source_warehouse_id_internal_id` | `internal_id` |
| [`warehouse.stock_transfers`](../../Tables/warehouse/stock_transfers.md) | fk_warehouse_stock_transfers_source_warehouse_id_warehouses | `source_warehouse_id` | `id` |
| [`warehouse.zones`](../../Tables/warehouse/zones.md) | fk_warehouse_zones_warehouse_id_warehouses | `warehouse_id` | `id` |
| [`warehouse.zones`](../../Tables/warehouse/zones.md) | fk_warehouse_zones_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | `internal_id` |

## `warehouse.warehouses` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_warehouses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_warehouses_deleted_by_users` |
| `location_id` | `organization.locations` | `fk_warehouse_warehouses_location_id_locations` |
| `location_id_internal_id` | `organization.locations` | `fk_warehouse_warehouses_location_id_locations_numeric` |
| `organization_id` | `organization.organizations` | `fk_warehouse_warehouses_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_warehouse_warehouses_organization_id_organizations_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_warehouses_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_warehouses_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_warehouse_warehouses_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_warehouse_warehouses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_warehouses_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_warehouse_warehouses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_warehouses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_warehouses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_warehouses_id` | UNIQUE | `UNIQUE (id)` |
| `warehouses_code_not_null` | NOT NULL | `NOT NULL code` |
| `warehouses_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `warehouses_id_not_null` | NOT NULL | `NOT NULL id` |
| `warehouses_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `warehouses_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `warehouses_location_id_internal_id_not_null` | NOT NULL | `NOT NULL location_id_internal_id` |
| `warehouses_location_id_not_null` | NOT NULL | `NOT NULL location_id` |
| `warehouses_name_not_null` | NOT NULL | `NOT NULL name` |
| `warehouses_operating_hours_not_null` | NOT NULL | `NOT NULL operating_hours` |
| `warehouses_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `warehouses_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `warehouses_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `warehouses_status_not_null` | NOT NULL | `NOT NULL status` |
| `warehouses_supports_cold_chain_not_null` | NOT NULL | `NOT NULL supports_cold_chain` |
| `warehouses_supports_controlled_drugs_not_null` | NOT NULL | `NOT NULL supports_controlled_drugs` |
| `warehouses_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `warehouses_warehouse_type_not_null` | NOT NULL | `NOT NULL warehouse_type` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_warehouses_location` | btree | `(location_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_warehouses_location ON warehouse.warehouses USING btree (location_id)` |
| `ix_warehouse_warehouses_organization` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_warehouses_organization ON warehouse.warehouses USING btree (organization_id)` |
| `ix_warehouse_warehouses_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_warehouses_status ON warehouse.warehouses USING btree (status)` |
| `pk_warehouse_warehouses` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_warehouses ON warehouse.warehouses USING btree (internal_id)` |
| `uq_warehouse_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_code_active ON warehouse.warehouses USING btree (code) WHERE is_deleted = false` |
| `uq_warehouse_warehouses_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_warehouses_id ON warehouse.warehouses USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.warehouses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `warehouse.warehouses` |
| Category | Master / Reference — Stock-holding site identities linked to organization locations |
| Proposed owner / maintenance role | Warehouse / Organization / Warehouse administrator |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `commerce.order_allocations`, `commerce.order_groups`, `fulfillment.fulfillment_orders`, `fulfillment.picking_waves`, `logistics.delivery_routes`, `logistics.delivery_slots`, `marketplace.seller_locations`, `pricing.price_books`, `procurement.goods_receipts`, `procurement.purchase_orders`, `procurement.purchase_requisitions`, `procurement.purchase_returns`, `warehouse.aisles`, `warehouse.bins`, `warehouse.cycle_counts`, `warehouse.inventory_adjustments`, `warehouse.inventory_lots`, `warehouse.racks`, `warehouse.replenishment_rules`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`, `warehouse.stock_reservations`, `warehouse.stock_transfers`, `warehouse.zones` |
| Features | `ADM-01`, `CAT-02`, `CAT-04`, `CHK-02`, `CHK-03`, `CHK-05`, `CHK-06`, `CHK-08`, `FIN-01`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `ORD-04`, `REP-03`, `REP-04`, `RID-02`, `STO-01`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-027](../../../03-Modules/Customer_Orders/APIs.md), [API-032](../../../03-Modules/Admin_CMS/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-044](../../../03-Modules/Store_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-049](../../../03-Modules/Store_Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-053](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-075](../../../03-Modules/Finance_Payments/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md), [API-085](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Create one stock-holding warehouse record per approved eligible location mapping; the 1+33 operating model does not by itself establish exact warehouse records/code/location_id values. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `location_id`, `name`, `organization_id`, `warehouse_type`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Organization / Warehouse administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_warehouse_code_active ON warehouse.warehouses USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_warehouse_warehouses_id ON warehouse.warehouses USING btree (id) |
| Foreign-key dependencies | `organization.locations`, `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
