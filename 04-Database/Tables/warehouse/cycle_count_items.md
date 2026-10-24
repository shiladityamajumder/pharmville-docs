# `warehouse.cycle_count_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cycle count items records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.cycle_count_items |
| Classification | Transactional |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 18 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_id` | `uuid` | No | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` via `fk_warehouse_cycle_count_items_bin_id_bins` |
| `bin_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` via `fk_warehouse_cycle_count_items_bin_id_bins_numeric` |
| `counted_qty` | `numeric(16,3)` | Yes | — | Counted qty value | Track resource or item amounts accurately | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_cycle_count_items_created_by_users` |
| `cycle_count_id` | `uuid` | No | — | Reference linking this record to cycle counts | Ensures related business data can be joined and validated | FK → `warehouse.cycle_counts` via `fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts` |
| `cycle_count_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.cycle_counts` via `fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_warehouse_cycle_count_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric` |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` via `fk_warehouse_cycle_count_items_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` via `fk_warehouse_cycle_count_items_controlled_reason` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `system_qty` | `numeric(16,3)` | No | — | System qty value | Track resource or item amounts accurately | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_cycle_count_items_updated_by_users` |
| `variance_qty` | `numeric(16,3)` | Yes | — | Variance qty value | Track resource or item amounts accurately | Exact constraints below |

## Record lifecycle and users

- **Created:** when the cycle count items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.cycle_count_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_cycle_count_items_bin_id_bins | `bin_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_count_items_bin_id_bins_numeric | `bin_id_internal_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_count_items_controlled_reason | `reason_code_id, reason_code` | [`warehouse.stock_movement_reason_codes`](../../Tables/warehouse/stock_movement_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_warehouse_cycle_count_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6 | `cycle_count_id_internal_id` | [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | `FOREIGN KEY (cycle_count_id_internal_id) REFERENCES warehouse.cycle_counts(internal_id) ON DELETE CASCADE` |
| fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts | `cycle_count_id` | [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | `FOREIGN KEY (cycle_count_id) REFERENCES warehouse.cycle_counts(id) ON DELETE CASCADE` |
| fk_warehouse_cycle_count_items_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_count_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `warehouse.cycle_count_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `bin_id` | `warehouse.bins` | `fk_warehouse_cycle_count_items_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_cycle_count_items_bin_id_bins_numeric` |
| `reason_code_id, reason_code` | `warehouse.stock_movement_reason_codes` | `fk_warehouse_cycle_count_items_controlled_reason` |
| `created_by` | `identity.users` | `fk_warehouse_cycle_count_items_created_by_users` |
| `cycle_count_id_internal_id` | `warehouse.cycle_counts` | `fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6` |
| `cycle_count_id` | `warehouse.cycle_counts` | `fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_cycle_count_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_cycle_count_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_cycle_count_items_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_warehouse_cycle_count_items_finite_numeric_values` | CHECK | `CHECK ((system_qty IS NULL OR (system_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (counted_qty IS NULL OR (counted_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (variance_qty IS NULL OR (variance_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_cycle_count_items_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_count_items_numeric_pair_cycle_count_id` | CHECK | `CHECK ((cycle_count_id IS NULL) = (cycle_count_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_count_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_count_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_cycle_count_items_system_qty_nonnegative` | CHECK | `CHECK (system_qty >= 0::numeric)` |
| `fk_warehouse_cycle_count_items_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6` | FOREIGN KEY | `FOREIGN KEY (cycle_count_id_internal_id) REFERENCES warehouse.cycle_counts(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts` | FOREIGN KEY | `FOREIGN KEY (cycle_count_id) REFERENCES warehouse.cycle_counts(id) ON DELETE CASCADE` |
| `fk_warehouse_cycle_count_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_count_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_cycle_count_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_cycle_count_items_id` | UNIQUE | `UNIQUE (id)` |
| `cycle_count_items_bin_id_internal_id_not_null` | NOT NULL | `NOT NULL bin_id_internal_id` |
| `cycle_count_items_bin_id_not_null` | NOT NULL | `NOT NULL bin_id` |
| `cycle_count_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cycle_count_items_cycle_count_id_internal_id_not_null` | NOT NULL | `NOT NULL cycle_count_id_internal_id` |
| `cycle_count_items_cycle_count_id_not_null` | NOT NULL | `NOT NULL cycle_count_id` |
| `cycle_count_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `cycle_count_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cycle_count_items_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `cycle_count_items_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `cycle_count_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cycle_count_items_system_qty_not_null` | NOT NULL | `NOT NULL system_qty` |
| `cycle_count_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_cycle_count_items_count` | btree | `(cycle_count_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_cycle_count_items_count ON warehouse.cycle_count_items USING btree (cycle_count_id)` |
| `ix_warehouse_cycle_count_items_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_cycle_count_items_lot ON warehouse.cycle_count_items USING btree (lot_id)` |
| `pk_warehouse_cycle_count_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_cycle_count_items ON warehouse.cycle_count_items USING btree (internal_id)` |
| `uq_warehouse_cycle_count_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_cycle_count_items_id ON warehouse.cycle_count_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["cycle_count_id","cycle_count_id_internal_id","warehouse","cycle_counts"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('warehouse.stock_movement_reason_codes')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_count_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["cycle_count_id","cycle_count_id_internal_id","warehouse","cycle_counts"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
