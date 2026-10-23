# fulfillment.package_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds package items records within the fulfillment domain (picking, packing, and shipment preparation). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 16 constraints, 5 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_package_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_fulfillment_package_items_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_fulfillment_package_items_lot_id_inventory_lots_numeric); Numeric/public-key pair verification required |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_fulfillment_package_items_order_item_id_order_items) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_fulfillment_package_items_order_item_id_order_items_numeric); Numeric/public-key pair verification required |
| `package_id` | `uuid` | No | — | Reference linking this record to packages | Ensures related business data can be joined and validated | FK → `fulfillment.packages` (fk_fulfillment_package_items_package_id_packages) |
| `package_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `fulfillment.packages` (fk_fulfillment_package_items_package_id_packages_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_fulfillment_package_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the package items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Orders, Order_Operations, Store_Operations, Warehouse, Delivery_Operations. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `fulfillment.package_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_fulfillment_package_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_fulfillment_package_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_fulfillment_package_items_lot_id_inventory_lots`; FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT
- `order_item_id` → `commerce.order_items(id)` via `fk_fulfillment_package_items_order_item_id_order_items`; FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT
- `package_id` → `fulfillment.packages(id)` via `fk_fulfillment_package_items_package_id_packages`; FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE CASCADE
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_fulfillment_package_items_lot_id_inventory_lots_numeric`; FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_fulfillment_package_items_order_item_id_order_items_numeric`; FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT
- `package_id_internal_id` → `fulfillment.packages(internal_id)` via `fk_fulfillment_package_items_package_id_packages_numeric`; FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE CASCADE

## fulfillment.package_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 16 constraints, 5 indexes, 5 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_fulfillment_package_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_fulfillment_package_items_updated_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_fulfillment_package_items_lot_id_inventory_lots` |
| `order_item_id` | `commerce.order_items` | `fk_fulfillment_package_items_order_item_id_order_items` |
| `package_id` | `fulfillment.packages` | `fk_fulfillment_package_items_package_id_packages` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_fulfillment_package_items_lot_id_inventory_lots_numeric` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_fulfillment_package_items_order_item_id_order_items_numeric` |
| `package_id_internal_id` | `fulfillment.packages` | `fk_fulfillment_package_items_package_id_packages_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_fulfillment_package_items_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_fulfillment_package_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_fulfillment_package_items_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_fulfillment_package_items_numeric_pair_package_id` | CHECK | `CHECK ((package_id IS NULL) = (package_id_internal_id IS NULL))` |
| `ck_fulfillment_package_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_fulfillment_package_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_fulfillment_package_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_fulfillment_package_items_package_id_packages` | FOREIGN KEY | `FOREIGN KEY (package_id) REFERENCES fulfillment.packages(id) ON DELETE CASCADE` |
| `fk_fulfillment_package_items_package_id_packages_numeric` | FOREIGN KEY | `FOREIGN KEY (package_id_internal_id) REFERENCES fulfillment.packages(internal_id) ON DELETE CASCADE` |
| `fk_fulfillment_package_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_fulfillment_package_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_fulfillment_package_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_fulfillment_package_items_lot` | `CREATE INDEX ix_fulfillment_package_items_lot ON fulfillment.package_items USING btree (lot_id)` |
| `ix_fulfillment_package_items_order_item` | `CREATE INDEX ix_fulfillment_package_items_order_item ON fulfillment.package_items USING btree (order_item_id)` |
| `ix_fulfillment_package_items_package` | `CREATE INDEX ix_fulfillment_package_items_package ON fulfillment.package_items USING btree (package_id)` |
| `pk_fulfillment_package_items` | `CREATE UNIQUE INDEX pk_fulfillment_package_items ON fulfillment.package_items USING btree (internal_id)` |
| `uq_fulfillment_package_items_id` | `CREATE UNIQUE INDEX uq_fulfillment_package_items_id ON fulfillment.package_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["package_id","package_id_internal_id","fulfillment","packages"]]', 'internal_id', 'id')` |
| `ab_authorized_package_site` | `CREATE TRIGGER ab_authorized_package_site BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_package_site()` |
| `package_item_guard` | `CREATE TRIGGER package_item_guard BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION fulfillment.guard_package_item()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON fulfillment.package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["order_item_id","order_item_id_internal_id","commerce","order_items"],["package_id","package_id_internal_id","fulfillment","packages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
