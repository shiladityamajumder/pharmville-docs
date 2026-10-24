# `warehouse.stock_ledger`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds stock ledger records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.stock_ledger |
| Classification | Audit / History |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_ledger_actor_user_id_users` |
| `bin_id` | `uuid` | Yes | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` via `fk_warehouse_stock_ledger_bin_id_bins` |
| `bin_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` via `fk_warehouse_stock_ledger_bin_id_bins_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_ledger_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_warehouse_stock_ledger_lot_id_inventory_lots_numeric` |
| `movement_type` | `character varying(32)` | No | — | Inferred: stores movement type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | Exact constraints below |
| `quantity` | `numeric(16,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `reason_code` | `character varying(64)` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` via `fk_warehouse_stock_ledger_controlled_reason`; Collation: default |
| `reason_code_id` | `bigint` | Yes | — | Reference linking this record to stock movement reason codes | Ensures related business data can be joined and validated | FK → `warehouse.stock_movement_reason_codes` via `fk_warehouse_stock_ledger_controlled_reason` |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(64)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_stock_ledger_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_stock_ledger_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the stock ledger business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_ledger` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_stock_ledger_actor_user_id_users | `actor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_bin_id_bins | `bin_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_bin_id_bins_numeric | `bin_id_internal_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_controlled_reason | `reason_code_id, reason_code` | [`warehouse.stock_movement_reason_codes`](../../Tables/warehouse/stock_movement_reason_codes.md) | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_lot_id_inventory_lots_numeric | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_ledger_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `warehouse.stock_ledger` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_warehouse_stock_ledger_actor_user_id_users` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_stock_ledger_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_stock_ledger_bin_id_bins_numeric` |
| `reason_code_id, reason_code` | `warehouse.stock_movement_reason_codes` | `fk_warehouse_stock_ledger_controlled_reason` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_ledger_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_stock_ledger_lot_id_inventory_lots_numeric` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_ledger_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_ledger_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_ledger_controlled_reason_pair` | CHECK | `CHECK (reason_code_id IS NULL OR reason_code IS NOT NULL)` |
| `ck_warehouse_stock_ledger_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_warehouse_stock_ledger_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_stock_ledger_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_warehouse_stock_ledger_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_ledger_quantity_nonzero` | CHECK | `CHECK (quantity <> 0::numeric)` |
| `fk_warehouse_stock_ledger_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_controlled_reason` | FOREIGN KEY | `FOREIGN KEY (reason_code_id, reason_code) REFERENCES warehouse.stock_movement_reason_codes(id, code) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_lot_id_inventory_lots_numeric` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_ledger_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_ledger` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `stock_ledger_idempotency` | UNIQUE | `UNIQUE (idempotency_key)` |
| `uq_warehouse_stock_ledger_id` | UNIQUE | `UNIQUE (id)` |
| `stock_ledger_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `stock_ledger_id_not_null` | NOT NULL | `NOT NULL id` |
| `stock_ledger_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `stock_ledger_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `stock_ledger_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `stock_ledger_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `stock_ledger_movement_type_not_null` | NOT NULL | `NOT NULL movement_type` |
| `stock_ledger_occurred_at_not_null` | NOT NULL | `NOT NULL occurred_at` |
| `stock_ledger_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `stock_ledger_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `stock_ledger_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |
| `stock_ledger_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `stock_ledger_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_stock_ledger_bin` | btree | `(bin_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_ledger_bin ON warehouse.stock_ledger USING btree (bin_id)` |
| `ix_warehouse_stock_ledger_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_ledger_lot ON warehouse.stock_ledger USING btree (lot_id)` |
| `ix_warehouse_stock_ledger_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_ledger_reference ON warehouse.stock_ledger USING btree (reference_type, reference_id)` |
| `ix_warehouse_stock_ledger_warehouse_time` | btree | `(warehouse_id, occurred_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_ledger_warehouse_time ON warehouse.stock_ledger USING btree (warehouse_id, occurred_at)` |
| `pk_warehouse_stock_ledger` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_stock_ledger ON warehouse.stock_ledger USING btree (internal_id)` |
| `stock_ledger_idempotency` | btree | `(idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX stock_ledger_idempotency ON warehouse.stock_ledger USING btree (idempotency_key)` |
| `uq_warehouse_stock_ledger_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_ledger_id ON warehouse.stock_ledger USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_ledger FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `controlled_reason` | `CREATE TRIGGER controlled_reason BEFORE INSERT OR UPDATE ON warehouse.stock_ledger FOR EACH ROW EXECUTE FUNCTION platform.normalize_reason('warehouse.stock_movement_reason_codes')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON warehouse.stock_ledger FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_ledger FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
