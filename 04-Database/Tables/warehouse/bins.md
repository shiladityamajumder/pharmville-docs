# `warehouse.bins`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds bins records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.bins |
| Classification | Master / Reference |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 14 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `bin_type` | `character varying(32)` | No | — | Inferred: stores bin type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `capacity_json` | `jsonb` | No | `'{}'::jsonb` | Structured capacity json information | Retain a versioned payload or relevant details | Exact constraints below |
| `code` | `character varying(128)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_bins_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_bins_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `pick_sequence` | `integer` | Yes | — | Inferred: stores pick sequence for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `rack_id` | `uuid` | Yes | — | Reference linking this record to racks | Ensures related business data can be joined and validated | FK → `warehouse.racks` via `fk_warehouse_bins_rack_id_racks` |
| `rack_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.racks` via `fk_warehouse_bins_rack_id_racks_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_bins_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_bins_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_bins_warehouse_id_warehouses_numeric` |
| `zone_id` | `uuid` | No | — | Reference linking this record to zones | Ensures related business data can be joined and validated | FK → `warehouse.zones` via `fk_warehouse_bins_zone_id_zones` |
| `zone_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.zones` via `fk_warehouse_bins_zone_id_zones_numeric` |

## Record lifecycle and users

- **Created:** when the bins business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.bins` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_bins_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_bins_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_bins_rack_id_racks | `rack_id` | [`warehouse.racks`](../../Tables/warehouse/racks.md) | `FOREIGN KEY (rack_id) REFERENCES warehouse.racks(id) ON DELETE SET NULL` |
| fk_warehouse_bins_rack_id_racks_numeric | `rack_id_internal_id` | [`warehouse.racks`](../../Tables/warehouse/racks.md) | `FOREIGN KEY (rack_id_internal_id) REFERENCES warehouse.racks(internal_id) ON DELETE SET NULL` |
| fk_warehouse_bins_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_bins_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| fk_warehouse_bins_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| fk_warehouse_bins_zone_id_zones | `zone_id` | [`warehouse.zones`](../../Tables/warehouse/zones.md) | `FOREIGN KEY (zone_id) REFERENCES warehouse.zones(id) ON DELETE CASCADE` |
| fk_warehouse_bins_zone_id_zones_numeric | `zone_id_internal_id` | [`warehouse.zones`](../../Tables/warehouse/zones.md) | `FOREIGN KEY (zone_id_internal_id) REFERENCES warehouse.zones(internal_id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_bin_id_bins | `bin_id` | `id` |
| [`fulfillment.pick_task_items`](../../Tables/fulfillment/pick_task_items.md) | fk_fulfillment_pick_task_items_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_bin_id_bins | `bin_id` | `id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_bin_id_bins | `bin_id` | `id` |
| [`warehouse.cycle_counts`](../../Tables/warehouse/cycle_counts.md) | fk_warehouse_cycle_counts_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_bin_id_bins | `bin_id` | `id` |
| [`warehouse.inventory_adjustment_items`](../../Tables/warehouse/inventory_adjustment_items.md) | fk_warehouse_inventory_adjustment_items_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_bin_id_bins | `bin_id` | `id` |
| [`warehouse.stock_balances`](../../Tables/warehouse/stock_balances.md) | fk_warehouse_stock_balances_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_bin_id_bins | `bin_id` | `id` |
| [`warehouse.stock_holds`](../../Tables/warehouse/stock_holds.md) | fk_warehouse_stock_holds_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_bin_id_bins | `bin_id` | `id` |
| [`warehouse.stock_ledger`](../../Tables/warehouse/stock_ledger.md) | fk_warehouse_stock_ledger_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_bin_id_bins | `bin_id` | `id` |
| [`warehouse.stock_reservations`](../../Tables/warehouse/stock_reservations.md) | fk_warehouse_stock_reservations_bin_id_bins_numeric | `bin_id_internal_id` | `internal_id` |

## `warehouse.bins` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_warehouse_bins_created_by_users` |
| `deleted_by` | `identity.users` | `fk_warehouse_bins_deleted_by_users` |
| `rack_id` | `warehouse.racks` | `fk_warehouse_bins_rack_id_racks` |
| `rack_id_internal_id` | `warehouse.racks` | `fk_warehouse_bins_rack_id_racks_numeric` |
| `updated_by` | `identity.users` | `fk_warehouse_bins_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_bins_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_bins_warehouse_id_warehouses_numeric` |
| `zone_id` | `warehouse.zones` | `fk_warehouse_bins_zone_id_zones` |
| `zone_id_internal_id` | `warehouse.zones` | `fk_warehouse_bins_zone_id_zones_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_bins_numeric_pair_rack_id` | CHECK | `CHECK ((rack_id IS NULL) = (rack_id_internal_id IS NULL))` |
| `ck_warehouse_bins_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_bins_numeric_pair_zone_id` | CHECK | `CHECK ((zone_id IS NULL) = (zone_id_internal_id IS NULL))` |
| `ck_warehouse_bins_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_warehouse_bins_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_warehouse_bins_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_bins_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_bins_rack_id_racks` | FOREIGN KEY | `FOREIGN KEY (rack_id) REFERENCES warehouse.racks(id) ON DELETE SET NULL` |
| `fk_warehouse_bins_rack_id_racks_numeric` | FOREIGN KEY | `FOREIGN KEY (rack_id_internal_id) REFERENCES warehouse.racks(internal_id) ON DELETE SET NULL` |
| `fk_warehouse_bins_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_bins_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE CASCADE` |
| `fk_warehouse_bins_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE CASCADE` |
| `fk_warehouse_bins_zone_id_zones` | FOREIGN KEY | `FOREIGN KEY (zone_id) REFERENCES warehouse.zones(id) ON DELETE CASCADE` |
| `fk_warehouse_bins_zone_id_zones_numeric` | FOREIGN KEY | `FOREIGN KEY (zone_id_internal_id) REFERENCES warehouse.zones(internal_id) ON DELETE CASCADE` |
| `pk_warehouse_bins` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_bins_id` | UNIQUE | `UNIQUE (id)` |
| `warehouse_bin` | UNIQUE | `UNIQUE (warehouse_id, code)` |
| `bins_bin_type_not_null` | NOT NULL | `NOT NULL bin_type` |
| `bins_capacity_json_not_null` | NOT NULL | `NOT NULL capacity_json` |
| `bins_code_not_null` | NOT NULL | `NOT NULL code` |
| `bins_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `bins_id_not_null` | NOT NULL | `NOT NULL id` |
| `bins_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `bins_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `bins_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `bins_status_not_null` | NOT NULL | `NOT NULL status` |
| `bins_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `bins_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `bins_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |
| `bins_zone_id_internal_id_not_null` | NOT NULL | `NOT NULL zone_id_internal_id` |
| `bins_zone_id_not_null` | NOT NULL | `NOT NULL zone_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_bins_rack` | btree | `(rack_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_bins_rack ON warehouse.bins USING btree (rack_id)` |
| `ix_warehouse_bins_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_bins_status ON warehouse.bins USING btree (status)` |
| `ix_warehouse_bins_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_bins_warehouse ON warehouse.bins USING btree (warehouse_id)` |
| `ix_warehouse_bins_zone` | btree | `(zone_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_bins_zone ON warehouse.bins USING btree (zone_id)` |
| `pk_warehouse_bins` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_bins ON warehouse.bins USING btree (internal_id)` |
| `uq_warehouse_bins_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_bins_id ON warehouse.bins USING btree (id)` |
| `warehouse_bin` | btree | `(warehouse_id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX warehouse_bin ON warehouse.bins USING btree (warehouse_id, code)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["rack_id","rack_id_internal_id","warehouse","racks"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["zone_id","zone_id_internal_id","warehouse","zones"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["warehouse_id"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.bins FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["rack_id","rack_id_internal_id","warehouse","racks"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"],["zone_id","zone_id_internal_id","warehouse","zones"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `warehouse.bins` |
| Category | Master / Reference — Persistent bin locations for exact stock/picking |
| Proposed owner / maintenance role | Warehouse / Warehouse supervisor |
| Scope | Warehouse-specific via warehouse_id. |
| Referencing tables | `fulfillment.pick_task_items`, `warehouse.cycle_count_items`, `warehouse.cycle_counts`, `warehouse.inventory_adjustment_items`, `warehouse.stock_balances`, `warehouse.stock_holds`, `warehouse.stock_ledger`, `warehouse.stock_reservations` |
| Features | `ADM-01`, `CAT-04`, `CHK-03`, `CHK-08`, `FIN-01`, `INV-01`, `INV-03`, `INV-04`, `INV-05`, `INV-07`, `OMS-03`, `OMS-04`, `REP-03`, `RID-02`, `STO-02`, `WH-02` |
| API consumers | [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-032](../../../03-Modules/Admin_CMS/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-053](../../../03-Modules/Inventory/APIs.md), [API-054](../../../03-Modules/Inventory/APIs.md), [API-055](../../../03-Modules/Inventory/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-075](../../../03-Modules/Finance_Payments/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `bin_type`, `code`, `warehouse_id`, `zone_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Warehouse supervisor through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); UNIQUE: UNIQUE (warehouse_id, code); CREATE UNIQUE INDEX uq_warehouse_bins_id ON warehouse.bins USING btree (id); CREATE UNIQUE INDEX warehouse_bin ON warehouse.bins USING btree (warehouse_id, code) |
| Foreign-key dependencies | `warehouse.racks`, `warehouse.warehouses`, `warehouse.zones` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
