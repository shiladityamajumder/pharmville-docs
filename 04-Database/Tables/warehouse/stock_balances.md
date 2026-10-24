# `warehouse.stock_balances`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds stock balances records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.stock_balances |
| Classification | Derived / Operational |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 20 columns; 23 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_id` | `uuid` | No | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` via `fk_warehouse_stock_balances_bin_id_bins` |
| `bin_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` via `fk_warehouse_stock_balances_bin_id_bins_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_balances_created_by_users` |
| `damaged_qty` | `numeric(16,3)` | No | `0` | Damaged qty value | Track resource or item amounts accurately | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `inventory_observed_at` | `timestamp with time zone` | Yes | — | Time of inventory observed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `inventory_observed_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_balances_inventory_observed_by_user_id_users` |
| `inventory_source` | `character varying(64)` | Yes | — | Inferred: stores inventory source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_balances_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_balances_lot_id_inventory_lots_numeric` |
| `on_hand_qty` | `numeric(16,3)` | No | `0` | On hand qty value | Track resource or item amounts accurately | Exact constraints below |
| `quarantined_qty` | `numeric(16,3)` | No | `0` | Quarantined qty value | Track resource or item amounts accurately | Exact constraints below |
| `reserved_qty` | `numeric(16,3)` | No | `0` | Reserved qty value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_balances_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_stock_balances_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_stock_balances_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the stock balances business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_balances` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_stock_balances_bin_id_bins | `bin_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_bin_id_bins_numeric | `bin_id_internal_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_inventory_observed_by_user_id_users | `inventory_observed_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (inventory_observed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_balances_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `warehouse.stock_balances` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `bin_id` | `warehouse.bins` | `fk_warehouse_stock_balances_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_stock_balances_bin_id_bins_numeric` |
| `created_by` | `identity.users` | `fk_warehouse_stock_balances_created_by_users` |
| `inventory_observed_by_user_id` | `identity.users` | `fk_warehouse_stock_balances_inventory_observed_by_user_id_users` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_balances_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_balances_lot_id_inventory_lots_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_balances_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_balances_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_balances_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_balances_allocated_within_on_hand` | CHECK | `CHECK ((reserved_qty + damaged_qty + quarantined_qty) <= on_hand_qty)` |
| `ck_warehouse_stock_balances_damaged_nonnegative` | CHECK | `CHECK (damaged_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_finite_numeric_values` | CHECK | `CHECK ((on_hand_qty IS NULL OR (on_hand_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (reserved_qty IS NULL OR (reserved_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (damaged_qty IS NULL OR (damaged_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (quarantined_qty IS NULL OR (quarantined_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_warehouse_stock_balances_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_stock_balances_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_stock_balances_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_balances_observation_evidence` | CHECK | `CHECK (inventory_observed_at IS NULL OR inventory_source IS NOT NULL AND length(btrim(inventory_source::text)) > 0 AND inventory_observed_by_user_id IS NOT NULL)` |
| `ck_warehouse_stock_balances_on_hand_nonnegative` | CHECK | `CHECK (on_hand_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_quarantined_nonnegative` | CHECK | `CHECK (quarantined_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_reserved_nonnegative` | CHECK | `CHECK (reserved_qty >= 0::numeric)` |
| `ck_warehouse_stock_balances_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_balances_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_inventory_observed_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (inventory_observed_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_balances_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_balances` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `stock_balance` | UNIQUE | `UNIQUE (warehouse_id, bin_id, lot_id)` |
| `uq_warehouse_stock_balances_id` | UNIQUE | `UNIQUE (id)` |
| `stock_balances_bin_id_internal_id_not_null` | NOT NULL | `NOT NULL bin_id_internal_id` |
| `stock_balances_bin_id_not_null` | NOT NULL | `NOT NULL bin_id` |
| `stock_balances_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `stock_balances_damaged_qty_not_null` | NOT NULL | `NOT NULL damaged_qty` |
| `stock_balances_id_not_null` | NOT NULL | `NOT NULL id` |
| `stock_balances_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `stock_balances_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `stock_balances_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `stock_balances_on_hand_qty_not_null` | NOT NULL | `NOT NULL on_hand_qty` |
| `stock_balances_quarantined_qty_not_null` | NOT NULL | `NOT NULL quarantined_qty` |
| `stock_balances_reserved_qty_not_null` | NOT NULL | `NOT NULL reserved_qty` |
| `stock_balances_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `stock_balances_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `stock_balances_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `stock_balances_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_stock_balances_bin` | btree | `(bin_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_balances_bin ON warehouse.stock_balances USING btree (bin_id)` |
| `ix_warehouse_stock_balances_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_balances_lot ON warehouse.stock_balances USING btree (lot_id)` |
| `ix_warehouse_stock_balances_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_balances_warehouse ON warehouse.stock_balances USING btree (warehouse_id)` |
| `pk_warehouse_stock_balances` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_stock_balances ON warehouse.stock_balances USING btree (internal_id)` |
| `stock_balance` | btree | `(warehouse_id, bin_id, lot_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX stock_balance ON warehouse.stock_balances USING btree (warehouse_id, bin_id, lot_id)` |
| `uq_warehouse_stock_balances_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_balances_id ON warehouse.stock_balances USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `inventory_observation_guard` | `CREATE TRIGGER inventory_observation_guard BEFORE INSERT OR UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION warehouse.guard_inventory_observation()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_balances FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
