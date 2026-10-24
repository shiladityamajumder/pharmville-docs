# `fulfillment.fulfillment_orders`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds fulfillment orders records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | fulfillment.fulfillment_orders |
| Classification | Transactional |
| Proposed business write owner | Store_Operations |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 25 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_fulfillment_orders_created_by_users` |
| `due_at` | `timestamp with time zone` | Yes | — | Time of due | Support chronology, deadlines or audit evidence | Exact constraints below |
| `fulfillment_number` | `character varying(64)` | No | — | Inferred: stores fulfillment number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` via `fk_fulfillment_fulfillment_orders_order_group_id_order_groups` |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` via `fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb` |
| `order_id` | `uuid` | No | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_fulfillment_fulfillment_orders_order_id_orders`; FK → `commerce.order_revisions` via `fk_fulfillment_fulfillment_orders_revision_scope` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_fulfillment_fulfillment_orders_order_id_orders_numeric`; FK → `commerce.order_revisions` via `fk_fulfillment_fulfillment_orders_revision_scope_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_fulfillment_fulfillment_orders_revision_scope` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_fulfillment_fulfillment_orders_revision_scope_numeric` |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_fulfillment_fulfillment_orders_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric` |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_fulfillment_fulfillment_orders_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `fulfillment.picking_waves` via `fk_domain_fulfillment_fulfillment_orders_wave_id`; FK → `warehouse.warehouses` via `fk_fulfillment_fulfillment_orders_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.picking_waves` via `fk_domain_fulfillment_fulfillment_orders_wave_id_numeric`; FK → `warehouse.warehouses` via `fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861` |
| `wave_id` | `uuid` | Yes | — | Reference linking this record to picking waves | Ensures related business data can be joined and validated | FK → `fulfillment.picking_waves` via `fk_domain_fulfillment_fulfillment_orders_wave_id` |
| `wave_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.picking_waves` via `fk_domain_fulfillment_fulfillment_orders_wave_id_numeric` |

## Record lifecycle and users

- **Created:** when the fulfillment orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.fulfillment_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_domain_fulfillment_fulfillment_orders_wave_id | `wave_id, warehouse_id` | [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | `FOREIGN KEY (wave_id, warehouse_id) REFERENCES fulfillment.picking_waves(id, warehouse_id) ON DELETE RESTRICT` |
| fk_domain_fulfillment_fulfillment_orders_wave_id_numeric | `wave_id_internal_id, warehouse_id_internal_id` | [`fulfillment.picking_waves`](../../Tables/fulfillment/picking_waves.md) | `FOREIGN KEY (wave_id_internal_id, warehouse_id_internal_id) REFERENCES fulfillment.picking_waves(internal_id, warehouse_id_internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb | `order_group_id_internal_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| fk_fulfillment_fulfillment_orders_order_group_id_order_groups | `order_group_id` | [`commerce.order_groups`](../../Tables/commerce/order_groups.md) | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| fk_fulfillment_fulfillment_orders_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_revision_scope | `order_revision_id, order_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| fk_fulfillment_fulfillment_orders_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861 | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| fk_fulfillment_fulfillment_orders_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`fulfillment.fulfillment_events`](../../Tables/fulfillment/fulfillment_events.md) | fk_fulfillment_fulfillment_events_fulfillment_order_id__2c47 | `fulfillment_order_id_internal_id` | `internal_id` |
| [`fulfillment.fulfillment_events`](../../Tables/fulfillment/fulfillment_events.md) | fk_fulfillment_fulfillment_events_fulfillment_order_id__da3e | `fulfillment_order_id` | `id` |
| [`fulfillment.fulfillment_order_items`](../../Tables/fulfillment/fulfillment_order_items.md) | fk_fulfillment_fulfillment_order_items_fulfillment_orde_9a2d | `fulfillment_order_id` | `id` |
| [`fulfillment.fulfillment_order_items`](../../Tables/fulfillment/fulfillment_order_items.md) | fk_fulfillment_fulfillment_order_items_fulfillment_orde_ba7f | `fulfillment_order_id_internal_id` | `internal_id` |
| [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_046e | `fulfillment_order_id_internal_id` | `internal_id` |
| [`fulfillment.pack_tasks`](../../Tables/fulfillment/pack_tasks.md) | fk_fulfillment_pack_tasks_fulfillment_order_id_fulfillm_f6c1 | `fulfillment_order_id` | `id` |
| [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | fk_fulfillment_packages_fulfillment_order_id_fulfillmen_deb3 | `fulfillment_order_id_internal_id` | `internal_id` |
| [`fulfillment.packages`](../../Tables/fulfillment/packages.md) | fk_fulfillment_packages_fulfillment_order_id_fulfillment_orders | `fulfillment_order_id` | `id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_fulfillment_order_id_fulfillm_095b | `fulfillment_order_id_internal_id` | `internal_id` |
| [`fulfillment.pick_tasks`](../../Tables/fulfillment/pick_tasks.md) | fk_fulfillment_pick_tasks_fulfillment_order_id_fulfillm_101f | `fulfillment_order_id` | `id` |
| [`fulfillment.picking_wave_orders`](../../Tables/fulfillment/picking_wave_orders.md) | fk_fulfillment_picking_wave_orders_fulfillment_order_id_499e | `fulfillment_order_id_internal_id` | `internal_id` |
| [`fulfillment.picking_wave_orders`](../../Tables/fulfillment/picking_wave_orders.md) | fk_fulfillment_picking_wave_orders_fulfillment_order_id_b656 | `fulfillment_order_id` | `id` |

## `fulfillment.fulfillment_orders` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `wave_id, warehouse_id` | `fulfillment.picking_waves` | `fk_domain_fulfillment_fulfillment_orders_wave_id` |
| `wave_id_internal_id, warehouse_id_internal_id` | `fulfillment.picking_waves` | `fk_domain_fulfillment_fulfillment_orders_wave_id_numeric` |
| `created_by` | `identity.users` | `fk_fulfillment_fulfillment_orders_created_by_users` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb` |
| `order_group_id` | `commerce.order_groups` | `fk_fulfillment_fulfillment_orders_order_group_id_order_groups` |
| `order_id` | `commerce.orders` | `fk_fulfillment_fulfillment_orders_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_fulfillment_fulfillment_orders_order_id_orders_numeric` |
| `order_revision_id, order_id` | `commerce.order_revisions` | `fk_fulfillment_fulfillment_orders_revision_scope` |
| `order_revision_id_internal_id, order_id_internal_id` | `commerce.order_revisions` | `fk_fulfillment_fulfillment_orders_revision_scope_numeric` |
| `seller_id` | `marketplace.sellers` | `fk_fulfillment_fulfillment_orders_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_fulfillment_fulfillment_orders_updated_by_users` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861` |
| `warehouse_id` | `warehouse.warehouses` | `fk_fulfillment_fulfillment_orders_warehouse_id_warehouses` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_fulfillment_orders_fulfillmentstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['created'::text, 'allocated'::text, 'picking'::text, 'picked'::text, 'packing'::text, 'packed'::text, 'handed_over'::text, 'cancelled'::text]))` |
| `ck_fulfillment_fulfillment_orders_numeric_pair_order_group_id` | CHECK | `CHECK ((order_group_id IS NULL) = (order_group_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_orders_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_orders_numeric_pair_order_re_0d95` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_orders_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_orders_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_orders_numeric_pair_wave_id` | CHECK | `CHECK ((wave_id IS NULL) = (wave_id_internal_id IS NULL))` |
| `ck_fulfillment_fulfillment_orders_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_domain_fulfillment_fulfillment_orders_wave_id` | FOREIGN KEY | `FOREIGN KEY (wave_id, warehouse_id) REFERENCES fulfillment.picking_waves(id, warehouse_id) ON DELETE RESTRICT` |
| `fk_domain_fulfillment_fulfillment_orders_wave_id_numeric` | FOREIGN KEY | `FOREIGN KEY (wave_id_internal_id, warehouse_id_internal_id) REFERENCES fulfillment.picking_waves(internal_id, warehouse_id_internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb` | FOREIGN KEY | `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL` |
| `fk_fulfillment_fulfillment_orders_order_group_id_order_groups` | FOREIGN KEY | `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL` |
| `fk_fulfillment_fulfillment_orders_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_revision_scope` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL` |
| `fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL` |
| `fk_fulfillment_fulfillment_orders_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_fulfillment_orders_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fulfillment_number` | UNIQUE | `UNIQUE (fulfillment_number)` |
| `pk_fulfillment_fulfillment_orders` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_fulfillment_orders_id` | UNIQUE | `UNIQUE (id)` |
| `fulfillment_orders_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `fulfillment_orders_fulfillment_number_not_null` | NOT NULL | `NOT NULL fulfillment_number` |
| `fulfillment_orders_id_not_null` | NOT NULL | `NOT NULL id` |
| `fulfillment_orders_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `fulfillment_orders_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `fulfillment_orders_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `fulfillment_orders_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `fulfillment_orders_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `fulfillment_orders_status_not_null` | NOT NULL | `NOT NULL status` |
| `fulfillment_orders_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `fulfillment_orders_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `fulfillment_orders_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `fulfillment_number` | btree | `(fulfillment_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX fulfillment_number ON fulfillment.fulfillment_orders USING btree (fulfillment_number)` |
| `ix_fulfillment_orders_group` | btree | `(order_group_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_orders_group ON fulfillment.fulfillment_orders USING btree (order_group_id)` |
| `ix_fulfillment_orders_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_orders_order ON fulfillment.fulfillment_orders USING btree (order_id)` |
| `ix_fulfillment_orders_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_orders_status ON fulfillment.fulfillment_orders USING btree (status)` |
| `ix_fulfillment_orders_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_fulfillment_orders_warehouse ON fulfillment.fulfillment_orders USING btree (warehouse_id)` |
| `pk_fulfillment_fulfillment_orders` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_fulfillment_fulfillment_orders ON fulfillment.fulfillment_orders USING btree (internal_id)` |
| `uq_fulfillment_fulfillment_orders_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_fulfillment_fulfillment_orders_id ON fulfillment.fulfillment_orders USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` | O |
| `ab_authorized_fulfillment` | `CREATE TRIGGER ab_authorized_fulfillment BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_authorized_fulfillment()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
