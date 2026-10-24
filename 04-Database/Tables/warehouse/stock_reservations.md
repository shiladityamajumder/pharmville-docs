# `warehouse.stock_reservations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds stock reservations records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.stock_reservations |
| Classification | Transactional |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 25 columns; 28 PK/FK/UQ/CHECK/exclusion constraints; 17 named PostgreSQL 18 NOT NULL constraints; 9 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_id` | `uuid` | Yes | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` via `fk_warehouse_stock_reservations_bin_id_bins` |
| `bin_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` via `fk_warehouse_stock_reservations_bin_id_bins_numeric` |
| `committed_at` | `timestamp with time zone` | Yes | — | Time of committed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_reservations_created_by_users` |
| `expires_at` | `timestamp with time zone` | No | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_reservations_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric` |
| `order_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_warehouse_stock_reservations_item_order`; FK → `commerce.order_revisions` via `fk_warehouse_stock_reservations_revision_scope` |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_warehouse_stock_reservations_item_order_numeric`; FK → `commerce.order_revisions` via `fk_warehouse_stock_reservations_revision_scope_numeric` |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` via `fk_warehouse_stock_reservations_item_order` |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` via `fk_warehouse_stock_reservations_item_order_numeric` |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` via `fk_warehouse_stock_reservations_revision_scope` |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` via `fk_warehouse_stock_reservations_revision_scope_numeric` |
| `quantity` | `numeric(16,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `released_at` | `timestamp with time zone` | Yes | — | Time of released | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reservation_number` | `character varying(64)` | No | — | Inferred: stores reservation number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_reservations_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_stock_reservations_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the stock reservations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_reservations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_stock_reservations_bin_id_bins | `bin_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_bin_id_bins_numeric | `bin_id_internal_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_item_order | `order_item_id, order_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_item_order_numeric | `order_item_id_internal_id, order_id_internal_id` | [`commerce.order_items`](../../Tables/commerce/order_items.md) | `FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_revision_scope | `order_revision_id, order_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_revision_scope_numeric | `order_revision_id_internal_id, order_id_internal_id` | [`commerce.order_revisions`](../../Tables/commerce/order_revisions.md) | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_reservation_id_stock_rese_0af9 | `reservation_id_internal_id` | `internal_id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_reservation_id_stock_reservations | `reservation_id` | `id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_reservation_item | `reservation_id, order_item_id` | `id, order_item_id` |
| [`commerce.order_allocations`](../../Tables/commerce/order_allocations.md) | fk_commerce_order_allocations_reservation_item_numeric | `reservation_id_internal_id, order_item_id_internal_id` | `internal_id, order_item_id_internal_id` |

## `warehouse.stock_reservations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `bin_id` | `warehouse.bins` | `fk_warehouse_stock_reservations_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_stock_reservations_bin_id_bins_numeric` |
| `created_by` | `identity.users` | `fk_warehouse_stock_reservations_created_by_users` |
| `order_item_id, order_id` | `commerce.order_items` | `fk_warehouse_stock_reservations_item_order` |
| `order_item_id_internal_id, order_id_internal_id` | `commerce.order_items` | `fk_warehouse_stock_reservations_item_order_numeric` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_reservations_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric` |
| `order_revision_id, order_id` | `commerce.order_revisions` | `fk_warehouse_stock_reservations_revision_scope` |
| `order_revision_id_internal_id, order_id_internal_id` | `commerce.order_revisions` | `fk_warehouse_stock_reservations_revision_scope_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_reservations_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_reservations_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_reservations_expires_after_created` | CHECK | `CHECK (expires_at > created_at)` |
| `ck_warehouse_stock_reservations_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_warehouse_stock_reservations_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_order_revision_id` | CHECK | `CHECK ((order_revision_id IS NULL) = (order_revision_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_reservations_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_warehouse_stock_reservations_reservationstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'committed'::text, 'released'::text, 'expired'::text, 'cancelled'::text]))` |
| `ck_warehouse_stock_reservations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_reservations_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_item_order` | FOREIGN KEY | `FOREIGN KEY (order_item_id, order_id) REFERENCES commerce.order_items(id, order_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_item_order_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id, order_id_internal_id) REFERENCES commerce.order_items(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_revision_scope` | FOREIGN KEY | `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_revision_scope_numeric` | FOREIGN KEY | `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_reservations_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_reservations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `reservation_number` | UNIQUE | `UNIQUE (reservation_number)` |
| `uq_numeric_warehouse_stock_reservations_internal_id_ord_362d` | UNIQUE | `UNIQUE (internal_id, order_item_id_internal_id)` |
| `uq_warehouse_stock_reservations_id` | UNIQUE | `UNIQUE (id)` |
| `uq_warehouse_stock_reservations_id_item` | UNIQUE | `UNIQUE (id, order_item_id)` |
| `stock_reservations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `stock_reservations_expires_at_not_null` | NOT NULL | `NOT NULL expires_at` |
| `stock_reservations_id_not_null` | NOT NULL | `NOT NULL id` |
| `stock_reservations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `stock_reservations_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `stock_reservations_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `stock_reservations_order_id_internal_id_not_null` | NOT NULL | `NOT NULL order_id_internal_id` |
| `stock_reservations_order_id_not_null` | NOT NULL | `NOT NULL order_id` |
| `stock_reservations_order_item_id_internal_id_not_null` | NOT NULL | `NOT NULL order_item_id_internal_id` |
| `stock_reservations_order_item_id_not_null` | NOT NULL | `NOT NULL order_item_id` |
| `stock_reservations_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `stock_reservations_reservation_number_not_null` | NOT NULL | `NOT NULL reservation_number` |
| `stock_reservations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `stock_reservations_status_not_null` | NOT NULL | `NOT NULL status` |
| `stock_reservations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `stock_reservations_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `stock_reservations_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_stock_reservations_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_reservations_lot ON warehouse.stock_reservations USING btree (lot_id)` |
| `ix_warehouse_stock_reservations_order` | btree | `(order_id, order_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_reservations_order ON warehouse.stock_reservations USING btree (order_id, order_item_id)` |
| `ix_warehouse_stock_reservations_status_expiry` | btree | `(status, expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_reservations_status_expiry ON warehouse.stock_reservations USING btree (status, expires_at)` |
| `ix_warehouse_stock_reservations_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_reservations_warehouse ON warehouse.stock_reservations USING btree (warehouse_id)` |
| `pk_warehouse_stock_reservations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_stock_reservations ON warehouse.stock_reservations USING btree (internal_id)` |
| `reservation_number` | btree | `(reservation_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX reservation_number ON warehouse.stock_reservations USING btree (reservation_number)` |
| `uq_numeric_warehouse_stock_reservations_internal_id_ord_362d` | btree | `(internal_id, order_item_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_warehouse_stock_reservations_internal_id_ord_362d ON warehouse.stock_reservations USING btree (internal_id, order_item_id_internal_id)` |
| `uq_warehouse_stock_reservations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_reservations_id ON warehouse.stock_reservations USING btree (id)` |
| `uq_warehouse_stock_reservations_id_item` | btree | `(id, order_item_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_reservations_id_item ON warehouse.stock_reservations USING btree (id, order_item_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `ab_fulfillment_reservation` | `CREATE TRIGGER ab_fulfillment_reservation BEFORE INSERT OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION warehouse.guard_fulfillment_reservation()` | O |
| `reservation_guard` | `CREATE TRIGGER reservation_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION warehouse.guard_reservation()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_reservations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_id","order_id_internal_id","commerce","orders"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
