# `warehouse.inventory_adjustment_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds inventory adjustment items records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.inventory_adjustment_items |
| Classification | Transactional |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `adjustment_id` | `uuid` | No | — | Reference linking this record to inventory adjustments | Ensures related business data can be joined and validated | FK → `warehouse.inventory_adjustments` via `fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf` |
| `adjustment_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_adjustments` via `fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31` |
| `bin_id` | `uuid` | No | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` via `fk_warehouse_inventory_adjustment_items_bin_id_bins` |
| `bin_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` via `fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_adjustment_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018` |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `quantity_delta` | `numeric(16,3)` | No | — | Quantity delta value | Track resource or item amounts accurately | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_inventory_adjustment_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the inventory adjustment items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.inventory_adjustment_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31 | `adjustment_id_internal_id` | [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | `FOREIGN KEY (adjustment_id_internal_id) REFERENCES warehouse.inventory_adjustments(internal_id) ON DELETE CASCADE` |
| fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf | `adjustment_id` | [`warehouse.inventory_adjustments`](../../Tables/warehouse/inventory_adjustments.md) | `FOREIGN KEY (adjustment_id) REFERENCES warehouse.inventory_adjustments(id) ON DELETE CASCADE` |
| fk_warehouse_inventory_adjustment_items_bin_id_bins | `bin_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric | `bin_id_internal_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustment_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018 | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_warehouse_inventory_adjustment_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `warehouse.inventory_adjustment_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `adjustment_id_internal_id` | `warehouse.inventory_adjustments` | `fk_warehouse_inventory_adjustment_items_adjustment_id_i_ba31` |
| `adjustment_id` | `warehouse.inventory_adjustments` | `fk_warehouse_inventory_adjustment_items_adjustment_id_i_bfdf` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_inventory_adjustment_items_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric` |
| `created_by` | `identity.users` | `fk_warehouse_inventory_adjustment_items_created_by_users` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_warehouse_inventory_adjustment_items_lot_id_inventor_a018` |
| `lot_id` | `warehouse.inventory_lots` | `fk_warehouse_inventory_adjustment_items_lot_id_inventory_lots` |
| `updated_by` | `identity.users` | `fk_warehouse_inventory_adjustment_items_updated_by_users` |

### Existing constraints

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
| `inventory_adjustment_items_adjustment_id_internal_id_not_null` | NOT NULL | `NOT NULL adjustment_id_internal_id` |
| `inventory_adjustment_items_adjustment_id_not_null` | NOT NULL | `NOT NULL adjustment_id` |
| `inventory_adjustment_items_bin_id_internal_id_not_null` | NOT NULL | `NOT NULL bin_id_internal_id` |
| `inventory_adjustment_items_bin_id_not_null` | NOT NULL | `NOT NULL bin_id` |
| `inventory_adjustment_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `inventory_adjustment_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `inventory_adjustment_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `inventory_adjustment_items_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `inventory_adjustment_items_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `inventory_adjustment_items_quantity_delta_not_null` | NOT NULL | `NOT NULL quantity_delta` |
| `inventory_adjustment_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `inventory_adjustment_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_adjustment_items_adjustment` | btree | `(adjustment_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_adjustment_items_adjustment ON warehouse.inventory_adjustment_items USING btree (adjustment_id)` |
| `pk_warehouse_inventory_adjustment_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_inventory_adjustment_items ON warehouse.inventory_adjustment_items USING btree (internal_id)` |
| `uq_warehouse_inventory_adjustment_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_inventory_adjustment_items_id ON warehouse.inventory_adjustment_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["adjustment_id","adjustment_id_internal_id","warehouse","inventory_adjustments"],["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["adjustment_id","adjustment_id_internal_id","warehouse","inventory_adjustments"],["bin_id","bin_id_internal_id","warehouse","bins"],["lot_id","lot_id_internal_id","warehouse","inventory_lots"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
