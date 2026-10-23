# warehouse.inventory_adjustment_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds inventory adjustment items records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 16 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustment_id` | `uuid` | No | — | Reference linking this record to inventory adjustments | Ensures related business data can be joined and validated | FK → `warehouse.inventory_adjustments` (fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf) |
| `adjustment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_adjustments` (fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31); Numeric/public-key pair verification required |
| `bin_id` | `uuid` | No | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` (fk_warehouse_inventory_adjustment_items_bin_id_bins) |
| `bin_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` (fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_adjustment_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018); Numeric/public-key pair verification required |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `quantity_delta` | `numeric(16,3)` | No | — | Quantity delta value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_warehouse_inventory_adjustment_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the inventory adjustment items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.inventory_adjustment_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_warehouse_inventory_adjustment_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_warehouse_inventory_adjustment_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots`; FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT
- `bin_id` → `warehouse.bins(id)` via `fk_warehouse_inventory_adjustment_items_bin_id_bins`; FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT
- `adjustment_id` → `warehouse.inventory_adjustments(id)` via `fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf`; FOREIGN KEY (adjustment_id) REFERENCES warehouse.inventory_adjustments(id) ON DELETE CASCADE
- `adjustment_id_internal_id` → `warehouse.inventory_adjustments(internal_id)` via `fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31`; FOREIGN KEY (adjustment_id_internal_id) REFERENCES warehouse.inventory_adjustments(internal_id) ON DELETE CASCADE
- `bin_id_internal_id` → `warehouse.bins(internal_id)` via `fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric`; FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018`; FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT

## warehouse.inventory_adjustment_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 16 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_inventory_adjustment_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_inventory_adjustment_items_updated_by_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_inventory_adjustment_items_bin_id_bins` |
| `adjustment_id` | `warehouse.inventory_adjustments` | `fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf` |
| `adjustment_id_internal_id` | `warehouse.inventory_adjustments` | `fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_inventory_adjustment_items_finite_numeric_values` | CHECK | `CHECK (quantity_delta IS NULL OR (quantity_delta <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_warehouse_inventory_adjustment_items_numeric_pair_ad_6146` | CHECK | `CHECK ((adjustment_id IS NULL) = (adjustment_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_adjustment_items_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_adjustment_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_inventory_adjustment_items_quantity_delta_nonzero` | CHECK | `CHECK (quantity_delta <> 0::numeric)` |
| `ck_warehouse_inventory_adjustment_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31` | FOREIGN KEY | `FOREIGN KEY (adjustment_id_internal_id) REFERENCES warehouse.inventory_adjustments(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf` | FOREIGN KEY | `FOREIGN KEY (adjustment_id) REFERENCES warehouse.inventory_adjustments(id) ON DELETE CASCADE` |
| `fk_warehouse_inventory_adjustment_items_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustment_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_inventory_adjustment_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_inventory_adjustment_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_inventory_adjustment_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_warehouse_adjustment_items_adjustment` | `CREATE INDEX ix_warehouse_adjustment_items_adjustment ON warehouse.inventory_adjustment_items USING btree (adjustment_id)` |
| `pk_warehouse_inventory_adjustment_items` | `CREATE UNIQUE INDEX pk_warehouse_inventory_adjustment_items ON warehouse.inventory_adjustment_items USING btree (internal_id)` |
| `uq_warehouse_inventory_adjustment_items_id` | `CREATE UNIQUE INDEX uq_warehouse_inventory_adjustment_items_id ON warehouse.inventory_adjustment_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["adjustment_id","adjustment_id_internal_id","warehouse","inventory_adjustments"],["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["adjustment_id","adjustment_id_internal_id","warehouse","inventory_adjustments"],["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
