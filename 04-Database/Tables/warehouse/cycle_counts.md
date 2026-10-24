# `warehouse.cycle_counts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds cycle counts records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.cycle_counts |
| Classification | Transactional |
| Proposed business write owner | Inventory |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_cycle_counts_assigned_to_user_id_users` |
| `bin_id` | `uuid` | Yes | — | Reference linking this record to bins | Ensures related business data can be joined and validated | FK → `warehouse.bins` via `fk_warehouse_cycle_counts_bin_id_bins` |
| `bin_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.bins` via `fk_warehouse_cycle_counts_bin_id_bins_numeric` |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `count_mode` | `character varying(32)` | No | `'blind'::character varying` | Inferred: stores count mode for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_cycle_counts_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scheduled_at` | `timestamp with time zone` | No | — | Time of scheduled | Support chronology, deadlines or audit evidence | Exact constraints below |
| `started_at` | `timestamp with time zone` | Yes | — | Time of started | Support chronology, deadlines or audit evidence | Exact constraints below |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_cycle_counts_updated_by_users` |
| `warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_cycle_counts_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric` |

## Record lifecycle and users

- **Created:** when the cycle counts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.cycle_counts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_cycle_counts_assigned_to_user_id_users | `assigned_to_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_counts_bin_id_bins | `bin_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_counts_bin_id_bins_numeric | `bin_id_internal_id` | [`warehouse.bins`](../../Tables/warehouse/bins.md) | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_counts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_counts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_counts_warehouse_id_warehouses | `warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric | `warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_cycle_count_id_cycle_cou_69b6 | `cycle_count_id_internal_id` | `internal_id` |
| [`warehouse.cycle_count_items`](../../Tables/warehouse/cycle_count_items.md) | fk_warehouse_cycle_count_items_cycle_count_id_cycle_counts | `cycle_count_id` | `id` |

## `warehouse.cycle_counts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `assigned_to_user_id` | `identity.users` | `fk_warehouse_cycle_counts_assigned_to_user_id_users` |
| `bin_id` | `warehouse.bins` | `fk_warehouse_cycle_counts_bin_id_bins` |
| `bin_id_internal_id` | `warehouse.bins` | `fk_warehouse_cycle_counts_bin_id_bins_numeric` |
| `created_by` | `identity.users` | `fk_warehouse_cycle_counts_created_by_users` |
| `updated_by` | `identity.users` | `fk_warehouse_cycle_counts_updated_by_users` |
| `warehouse_id` | `warehouse.warehouses` | `fk_warehouse_cycle_counts_warehouse_id_warehouses` |
| `warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_cycle_counts_numeric_pair_bin_id` | CHECK | `CHECK ((bin_id IS NULL) = (bin_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_counts_numeric_pair_warehouse_id` | CHECK | `CHECK ((warehouse_id IS NULL) = (warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_cycle_counts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_cycle_counts_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_bin_id_bins` | FOREIGN KEY | `FOREIGN KEY (bin_id) REFERENCES warehouse.bins(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_bin_id_bins_numeric` | FOREIGN KEY | `FOREIGN KEY (bin_id_internal_id) REFERENCES warehouse.bins(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_cycle_counts_warehouse_id_warehouses_numeric` | FOREIGN KEY | `FOREIGN KEY (warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `pk_warehouse_cycle_counts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_warehouse_cycle_counts_id` | UNIQUE | `UNIQUE (id)` |
| `cycle_counts_count_mode_not_null` | NOT NULL | `NOT NULL count_mode` |
| `cycle_counts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `cycle_counts_id_not_null` | NOT NULL | `NOT NULL id` |
| `cycle_counts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `cycle_counts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `cycle_counts_scheduled_at_not_null` | NOT NULL | `NOT NULL scheduled_at` |
| `cycle_counts_status_not_null` | NOT NULL | `NOT NULL status` |
| `cycle_counts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `cycle_counts_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL warehouse_id_internal_id` |
| `cycle_counts_warehouse_id_not_null` | NOT NULL | `NOT NULL warehouse_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_cycle_counts_bin` | btree | `(bin_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_cycle_counts_bin ON warehouse.cycle_counts USING btree (bin_id)` |
| `ix_warehouse_cycle_counts_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_cycle_counts_status ON warehouse.cycle_counts USING btree (status)` |
| `ix_warehouse_cycle_counts_warehouse` | btree | `(warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_cycle_counts_warehouse ON warehouse.cycle_counts USING btree (warehouse_id)` |
| `pk_warehouse_cycle_counts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_cycle_counts ON warehouse.cycle_counts USING btree (internal_id)` |
| `uq_warehouse_cycle_counts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_cycle_counts_id ON warehouse.cycle_counts USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_counts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.cycle_counts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.cycle_counts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["bin_id","bin_id_internal_id","warehouse","bins"],["warehouse_id","warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
