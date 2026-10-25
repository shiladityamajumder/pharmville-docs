# `catalog.product_variants`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product variants records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.product_variants |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_variants_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_variants_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_default` | `boolean` | No | `false` | Yes/no flag for is default | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `pack_quantity` | `numeric(12,3)` | No | — | Pack quantity value | Track resource or item amounts accurately | Exact constraints below |
| `pack_uom_id` | `uuid` | Yes | — | Reference linking this record to units of measure | Ensures related business data can be joined and validated | FK → `catalog.units_of_measure` via `fk_catalog_product_variants_pack_uom_id_units_of_measure` |
| `pack_uom_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.units_of_measure` via `fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35` |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_variants_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_variants_product_id_products_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | `'draft'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `strength_display` | `character varying(128)` | Yes | — | Inferred: stores strength display for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_variants_updated_by_users` |
| `variant_sku` | `character varying(64)` | No | — | Inferred: stores variant sku for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the product variants business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_variants` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_product_variants_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_variants_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35 | `pack_uom_id_internal_id` | [`catalog.units_of_measure`](../../Tables/catalog/units_of_measure.md) | `FOREIGN KEY (pack_uom_id_internal_id) REFERENCES catalog.units_of_measure(internal_id) ON DELETE SET NULL` |
| fk_catalog_product_variants_pack_uom_id_units_of_measure | `pack_uom_id` | [`catalog.units_of_measure`](../../Tables/catalog/units_of_measure.md) | `FOREIGN KEY (pack_uom_id) REFERENCES catalog.units_of_measure(id) ON DELETE SET NULL` |
| fk_catalog_product_variants_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| fk_catalog_product_variants_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| fk_catalog_product_variants_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.product_identifiers`](../../Tables/catalog/product_identifiers.md) | fk_catalog_product_identifiers_variant_id_product_varia_946b | `variant_id_internal_id` | `internal_id` |
| [`catalog.product_identifiers`](../../Tables/catalog/product_identifiers.md) | fk_catalog_product_identifiers_variant_id_product_variants | `variant_id` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_variant_id_product_variants | `variant_id` | `id` |
| [`catalog.product_media`](../../Tables/catalog/product_media.md) | fk_catalog_product_media_variant_id_product_variants_numeric | `variant_id_internal_id` | `internal_id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_variant_id_product_variants | `variant_id` | `id` |
| [`commerce.cart_items`](../../Tables/commerce/cart_items.md) | fk_commerce_cart_items_variant_id_product_variants_numeric | `variant_id_internal_id` | `internal_id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_variant_id_product_variants | `variant_id` | `id` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_variant_id_product_variants_numeric | `variant_id_internal_id` | `internal_id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_variant_id_produ_4a78 | `variant_id` | `id` |
| [`marketplace.seller_product_listings`](../../Tables/marketplace/seller_product_listings.md) | fk_marketplace_seller_product_listings_variant_id_produ_69a3 | `variant_id_internal_id` | `internal_id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_variant_id_product_variants | `variant_id` | `id` |
| [`pricing.product_prices`](../../Tables/pricing/product_prices.md) | fk_pricing_product_prices_variant_id_product_variants_numeric | `variant_id_internal_id` | `internal_id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_variant_id_product__7c24 | `variant_id_internal_id` | `internal_id` |
| [`procurement.purchase_order_items`](../../Tables/procurement/purchase_order_items.md) | fk_procurement_purchase_order_items_variant_id_product_variants | `variant_id` | `id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_variant_id_pr_3f8f | `variant_id` | `id` |
| [`procurement.purchase_requisition_items`](../../Tables/procurement/purchase_requisition_items.md) | fk_procurement_purchase_requisition_items_variant_id_pr_f93f | `variant_id_internal_id` | `internal_id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_variant_id_product_var_def8 | `variant_id_internal_id` | `internal_id` |
| [`procurement.supplier_products`](../../Tables/procurement/supplier_products.md) | fk_procurement_supplier_products_variant_id_product_variants | `variant_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_variant_id_product_variants | `variant_id` | `id` |
| [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | fk_warehouse_inventory_lots_variant_id_product_variants_numeric | `variant_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_variant_id_product_var_2345 | `variant_id_internal_id` | `internal_id` |
| [`warehouse.replenishment_rules`](../../Tables/warehouse/replenishment_rules.md) | fk_warehouse_replenishment_rules_variant_id_product_variants | `variant_id` | `id` |

## `catalog.product_variants` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_product_variants_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_product_variants_deleted_by_users` |
| `pack_uom_id_internal_id` | `catalog.units_of_measure` | `fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35` |
| `pack_uom_id` | `catalog.units_of_measure` | `fk_catalog_product_variants_pack_uom_id_units_of_measure` |
| `product_id` | `catalog.products` | `fk_catalog_product_variants_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_variants_product_id_products_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_product_variants_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_variants_finite_numeric_values` | CHECK | `CHECK (pack_quantity IS NULL OR (pack_quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_catalog_product_variants_numeric_pair_pack_uom_id` | CHECK | `CHECK ((pack_uom_id IS NULL) = (pack_uom_id_internal_id IS NULL))` |
| `ck_catalog_product_variants_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_variants_pack_quantity_positive` | CHECK | `CHECK (pack_quantity > 0::numeric)` |
| `ck_catalog_product_variants_productstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['draft'::text, 'review'::text, 'active'::text, 'inactive'::text, 'discontinued'::text, 'recalled'::text]))` |
| `ck_catalog_product_variants_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_product_variants_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_variants_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_variants_pack_uom_id_units_of_measur_5b35` | FOREIGN KEY | `FOREIGN KEY (pack_uom_id_internal_id) REFERENCES catalog.units_of_measure(internal_id) ON DELETE SET NULL` |
| `fk_catalog_product_variants_pack_uom_id_units_of_measure` | FOREIGN KEY | `FOREIGN KEY (pack_uom_id) REFERENCES catalog.units_of_measure(id) ON DELETE SET NULL` |
| `fk_catalog_product_variants_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE CASCADE` |
| `fk_catalog_product_variants_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE CASCADE` |
| `fk_catalog_product_variants_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_product_variants` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_product_variants_id` | UNIQUE | `UNIQUE (id)` |
| `product_variants_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_variants_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_variants_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_variants_is_default_not_null` | NOT NULL | `NOT NULL is_default` |
| `product_variants_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `product_variants_name_not_null` | NOT NULL | `NOT NULL name` |
| `product_variants_pack_quantity_not_null` | NOT NULL | `NOT NULL pack_quantity` |
| `product_variants_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_variants_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_variants_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `product_variants_status_not_null` | NOT NULL | `NOT NULL status` |
| `product_variants_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `product_variants_variant_sku_not_null` | NOT NULL | `NOT NULL variant_sku` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_product_variants_product_id` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_product_variants_product_id ON catalog.product_variants USING btree (product_id)` |
| `pk_catalog_product_variants` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_product_variants ON catalog.product_variants USING btree (internal_id)` |
| `uq_catalog_product_variants_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_variants_id ON catalog.product_variants USING btree (id)` |
| `uq_catalog_variant_sku_active` | btree | `(variant_sku)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_variant_sku_active ON catalog.product_variants USING btree (variant_sku) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["pack_uom_id","pack_uom_id_internal_id","catalog","units_of_measure"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.product_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_variants FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["pack_uom_id","pack_uom_id_internal_id","catalog","units_of_measure"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.product_variants` |
| Category | Master / Reference — Distinct sellable pack/variant identities |
| Proposed owner / maintenance role | Product_Catalog / Catalog Manager |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.product_identifiers`, `catalog.product_media`, `commerce.cart_items`, `commerce.order_items`, `marketplace.seller_product_listings`, `pricing.product_prices`, `procurement.purchase_order_items`, `procurement.purchase_requisition_items`, `procurement.supplier_products`, `warehouse.inventory_lots`, `warehouse.replenishment_rules` |
| Features | `ADM-06`, `ADM-07`, `CAT-02`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-04`, `ORD-05`, `PHM-03`, `PHM-05`, `REP-03`, `RX-04`, `RX-05`, `STO-02`, `STO-03`, `STO-04`, `WH-01`, `WH-02` |
| API consumers | [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-015](../../../03-Modules/Product_Catalog/APIs.md), [API-017](../../../03-Modules/Product_Catalog/APIs.md), [API-018](../../../03-Modules/Cart_Checkout/APIs.md), [API-019](../../../03-Modules/Cart_Checkout/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-024](../../../03-Modules/Prescription_Upload/APIs.md), [API-026](../../../03-Modules/Customer_Orders/APIs.md), [API-027](../../../03-Modules/Customer_Orders/APIs.md), [API-028](../../../03-Modules/Customer_Orders/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-049](../../../03-Modules/Store_Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-062](../../../03-Modules/Pharmacist_Review/APIs.md), [API-063](../../../03-Modules/Pharmacist_Review/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `name`, `pack_quantity`, `product_id`, `variant_sku`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Catalog Manager through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_product_variants_id ON catalog.product_variants USING btree (id); CREATE UNIQUE INDEX uq_catalog_variant_sku_active ON catalog.product_variants USING btree (variant_sku) WHERE is_deleted = false |
| Foreign-key dependencies | `catalog.products`, `catalog.units_of_measure` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
