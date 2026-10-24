# `fulfillment.fulfillment_orders`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds fulfillment orders records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 25 constraints, 7 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_fulfillment_orders_created_by_users) |
| `due_at` | `timestamp with time zone` | Yes | — | Time of due | Support chronology, deadlines or audit evidence | See exact constraints |
| `fulfillment_number` | `character varying(64)` | No | — | Inferred: stores fulfillment number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_group_id` | `uuid` | Yes | — | Reference linking this record to order groups | Ensures related business data can be joined and validated | FK → `commerce.order_groups` (fk_fulfillment_fulfillment_orders_order_group_id_order_groups) |
| `order_group_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_groups` (fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb); Numeric/public-key pair verification required |
| `order_id` | `uuid` | No | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_fulfillment_fulfillment_orders_revision_scope); FK → `commerce.orders` (fk_fulfillment_fulfillment_orders_order_id_orders) |
| `order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` (fk_fulfillment_fulfillment_orders_order_id_orders_numeric); FK → `commerce.order_revisions` (fk_fulfillment_fulfillment_orders_revision_scope_numeric); Numeric/public-key pair verification required |
| `order_revision_id` | `uuid` | Yes | — | Reference linking this record to order revisions | Ensures related business data can be joined and validated | FK → `commerce.order_revisions` (fk_fulfillment_fulfillment_orders_revision_scope) |
| `order_revision_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_revisions` (fk_fulfillment_fulfillment_orders_revision_scope_numeric); Numeric/public-key pair verification required |
| `priority` | `integer` | No | `0` | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | Yes | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_fulfillment_fulfillment_orders_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_fulfillment_orders_updated_by_users) |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` (fk_fulfillment_fulfillment_orders_warehouse_id_warehouses); FK → `fulfillment.picking_waves` (fk_domain_fulfillment_fulfillment_orders_wave_id) |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.picking_waves` (fk_domain_fulfillment_fulfillment_orders_wave_id_numeric); FK → `warehouse.warehouses` (fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861); Numeric/public-key pair verification required |
| `wave_id` | `uuid` | Yes | — | Reference linking this record to picking waves | Ensures related business data can be joined and validated | FK → `fulfillment.picking_waves` (fk_domain_fulfillment_fulfillment_orders_wave_id) |
| `wave_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.picking_waves` (fk_domain_fulfillment_fulfillment_orders_wave_id_numeric); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the fulfillment orders business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.fulfillment_orders` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_fulfillment_fulfillment_orders_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_fulfillment_fulfillment_orders_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `warehouse_id` → `warehouse.warehouses(id)` via `fk_fulfillment_fulfillment_orders_warehouse_id_warehouses`; `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT`
- `order_group_id` → `commerce.order_groups(id)` via `fk_fulfillment_fulfillment_orders_order_group_id_order_groups`; `FOREIGN KEY (order_group_id) REFERENCES commerce.order_groups(id) ON DELETE SET NULL`
- `order_revision_id, order_id` → `commerce.order_revisions(id, order_id)` via `fk_fulfillment_fulfillment_orders_revision_scope`; `FOREIGN KEY (order_revision_id, order_id) REFERENCES commerce.order_revisions(id, order_id) ON DELETE RESTRICT`
- `order_id` → `commerce.orders(id)` via `fk_fulfillment_fulfillment_orders_order_id_orders`; `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE RESTRICT`
- `seller_id` → `marketplace.sellers(id)` via `fk_fulfillment_fulfillment_orders_seller_id_sellers`; `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE SET NULL`
- `wave_id, warehouse_id` → `fulfillment.picking_waves(id, warehouse_id)` via `fk_domain_fulfillment_fulfillment_orders_wave_id`; `FOREIGN KEY (wave_id, warehouse_id) REFERENCES fulfillment.picking_waves(id, warehouse_id) ON DELETE RESTRICT`
- `wave_id_internal_id, warehouse_id_internal_id` → `fulfillment.picking_waves(internal_id, warehouse_id_internal_id)` via `fk_domain_fulfillment_fulfillment_orders_wave_id_numeric`; `FOREIGN KEY (wave_id_internal_id, warehouse_id_internal_id) REFERENCES fulfillment.picking_waves(internal_id, warehouse_id_internal_id) ON DELETE RESTRICT`
- `order_group_id_internal_id` → `commerce.order_groups(internal_id)` via `fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb`; `FOREIGN KEY (order_group_id_internal_id) REFERENCES commerce.order_groups(internal_id) ON DELETE SET NULL`
- `order_id_internal_id` → `commerce.orders(internal_id)` via `fk_fulfillment_fulfillment_orders_order_id_orders_numeric`; `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE RESTRICT`
- `order_revision_id_internal_id, order_id_internal_id` → `commerce.order_revisions(internal_id, order_id_internal_id)` via `fk_fulfillment_fulfillment_orders_revision_scope_numeric`; `FOREIGN KEY (order_revision_id_internal_id, order_id_internal_id) REFERENCES commerce.order_revisions(internal_id, order_id_internal_id) ON DELETE RESTRICT`
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric`; `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE SET NULL`
- `warehouse_id_internal_id` → `warehouse.warehouses(internal_id)` via `fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861`; `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT`

**Referenced by 12 FK constraints** (sample): `fulfillment.fulfillment_order_items`, `fulfillment.picking_wave_orders`, `fulfillment.pick_tasks`, `fulfillment.pack_tasks`, `fulfillment.packages`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.pack_tasks`, `fulfillment.packages`, `fulfillment.pick_tasks`, `fulfillment.picking_wave_orders`.

## `fulfillment.fulfillment_orders` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 23 columns, 25 constraints, 7 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_fulfillment_orders_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_fulfillment_orders_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_fulfillment_fulfillment_orders_warehouse_id_warehouses` |
| `order_group_id` | `commerce.order_groups` | `fk_fulfillment_fulfillment_orders_order_group_id_order_groups` |
| `order_revision_id`, `order_id` | `commerce.order_revisions` | `fk_fulfillment_fulfillment_orders_revision_scope` |
| `order_id` | `commerce.orders` | `fk_fulfillment_fulfillment_orders_order_id_orders` |
| `seller_id` | `marketplace.sellers` | `fk_fulfillment_fulfillment_orders_seller_id_sellers` |
| `wave_id`, `warehouse_id` | `fulfillment.picking_waves` | `fk_domain_fulfillment_fulfillment_orders_wave_id` |
| `wave_id_internal_id`, `warehouse_id_internal_id` | `fulfillment.picking_waves` | `fk_domain_fulfillment_fulfillment_orders_wave_id_numeric` |
| `order_group_id_internal_id` | `commerce.order_groups` | `fk_fulfillment_fulfillment_orders_order_group_id_order__b1eb` |
| `order_id_internal_id` | `commerce.orders` | `fk_fulfillment_fulfillment_orders_order_id_orders_numeric` |
| `order_revision_id_internal_id`, `order_id_internal_id` | `commerce.order_revisions` | `fk_fulfillment_fulfillment_orders_revision_scope_numeric` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_fulfillment_fulfillment_orders_seller_id_sellers_numeric` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_fulfillment_fulfillment_orders_warehouse_id_warehous_f861` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `fulfillment_number` | `CREATE UNIQUE INDEX fulfillment_number ON fulfillment.fulfillment_orders USING btree (fulfillment_number)` |
| `ix_fulfillment_orders_group` | `CREATE INDEX ix_fulfillment_orders_group ON fulfillment.fulfillment_orders USING btree (order_group_id)` |
| `ix_fulfillment_orders_order` | `CREATE INDEX ix_fulfillment_orders_order ON fulfillment.fulfillment_orders USING btree (order_id)` |
| `ix_fulfillment_orders_status` | `CREATE INDEX ix_fulfillment_orders_status ON fulfillment.fulfillment_orders USING btree (status)` |
| `ix_fulfillment_orders_warehouse` | `CREATE INDEX ix_fulfillment_orders_warehouse ON fulfillment.fulfillment_orders USING btree (warehouse_id)` |
| `pk_fulfillment_fulfillment_orders` | `CREATE UNIQUE INDEX pk_fulfillment_fulfillment_orders ON fulfillment.fulfillment_orders USING btree (internal_id)` |
| `uq_fulfillment_fulfillment_orders_id` | `CREATE UNIQUE INDEX uq_fulfillment_fulfillment_orders_id ON fulfillment.fulfillment_orders USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` |
| `ab_authorized_fulfillment` | `CREATE TRIGGER ab_authorized_fulfillment BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_authorized_fulfillment()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.fulfillment_orders FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_group_id","order_group_id_internal_id","commerce","order_groups"],["order_id","order_id_internal_id","commerce","orders"],["order_revision_id","order_revision_id_internal_id","commerce","order_revisions"],["seller_id","seller_id_internal_id","marketplace","sellers"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["wave_id","wave_id_internal_id","fulfillment","picking_waves"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
