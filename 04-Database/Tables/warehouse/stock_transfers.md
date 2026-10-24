# `warehouse.stock_transfers`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds stock transfers records within the warehouse domain (stock balances, lots and transfers). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | warehouse.stock_transfers |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_transfers_approved_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_transfers_created_by_users` |
| `destination_warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac` |
| `destination_warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92` |
| `dispatched_at` | `timestamp with time zone` | Yes | — | Time of dispatched | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `received_at` | `timestamp with time zone` | Yes | — | Time of received | Support chronology, deadlines or audit evidence | Exact constraints below |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_transfers_requested_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `source_warehouse_id` | `uuid` | No | — | Reference linking this record to warehouses | Ensures related business data can be joined and validated | FK → `warehouse.warehouses` via `fk_warehouse_stock_transfers_source_warehouse_id_warehouses` |
| `source_warehouse_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.warehouses` via `fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1` |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `transfer_number` | `character varying(64)` | No | — | Inferred: stores transfer number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_warehouse_stock_transfers_updated_by_users` |

## Record lifecycle and users

- **Created:** when the stock transfers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Order_Operations, Store_Operations, Inventory, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `warehouse.stock_transfers` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_warehouse_stock_transfers_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac | `destination_warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (destination_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92 | `destination_warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (destination_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1 | `source_warehouse_id_internal_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (source_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_source_warehouse_id_warehouses | `source_warehouse_id` | [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | `FOREIGN KEY (source_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| fk_warehouse_stock_transfers_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`warehouse.stock_transfer_items`](../../Tables/warehouse/stock_transfer_items.md) | fk_warehouse_stock_transfer_items_transfer_id_stock_tra_9270 | `transfer_id_internal_id` | `internal_id` |
| [`warehouse.stock_transfer_items`](../../Tables/warehouse/stock_transfer_items.md) | fk_warehouse_stock_transfer_items_transfer_id_stock_transfers | `transfer_id` | `id` |

## `warehouse.stock_transfers` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_warehouse_stock_transfers_approved_by_user_id_users` |
| `created_by` | `identity.users` | `fk_warehouse_stock_transfers_created_by_users` |
| `destination_warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac` |
| `destination_warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92` |
| `requested_by_user_id` | `identity.users` | `fk_warehouse_stock_transfers_requested_by_user_id_users` |
| `source_warehouse_id_internal_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1` |
| `source_warehouse_id` | `warehouse.warehouses` | `fk_warehouse_stock_transfers_source_warehouse_id_warehouses` |
| `updated_by` | `identity.users` | `fk_warehouse_stock_transfers_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_warehouse_stock_transfers_different_warehouses` | CHECK | `CHECK (source_warehouse_id <> destination_warehouse_id)` |
| `ck_warehouse_stock_transfers_numeric_pair_destination_w_9cf7` | CHECK | `CHECK ((destination_warehouse_id IS NULL) = (destination_warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_transfers_numeric_pair_source_warehouse_id` | CHECK | `CHECK ((source_warehouse_id IS NULL) = (source_warehouse_id_internal_id IS NULL))` |
| `ck_warehouse_stock_transfers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_warehouse_stock_transfers_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_destination_warehouse_id_w_01ac` | FOREIGN KEY | `FOREIGN KEY (destination_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_destination_warehouse_id_w_8b92` | FOREIGN KEY | `FOREIGN KEY (destination_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_source_warehouse_id_wareho_d0e1` | FOREIGN KEY | `FOREIGN KEY (source_warehouse_id_internal_id) REFERENCES warehouse.warehouses(internal_id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_source_warehouse_id_warehouses` | FOREIGN KEY | `FOREIGN KEY (source_warehouse_id) REFERENCES warehouse.warehouses(id) ON DELETE RESTRICT` |
| `fk_warehouse_stock_transfers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_warehouse_stock_transfers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `transfer_number` | UNIQUE | `UNIQUE (transfer_number)` |
| `uq_warehouse_stock_transfers_id` | UNIQUE | `UNIQUE (id)` |
| `stock_transfers_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `stock_transfers_destination_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL destination_warehouse_id_internal_id` |
| `stock_transfers_destination_warehouse_id_not_null` | NOT NULL | `NOT NULL destination_warehouse_id` |
| `stock_transfers_id_not_null` | NOT NULL | `NOT NULL id` |
| `stock_transfers_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `stock_transfers_requested_by_user_id_not_null` | NOT NULL | `NOT NULL requested_by_user_id` |
| `stock_transfers_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `stock_transfers_source_warehouse_id_internal_id_not_null` | NOT NULL | `NOT NULL source_warehouse_id_internal_id` |
| `stock_transfers_source_warehouse_id_not_null` | NOT NULL | `NOT NULL source_warehouse_id` |
| `stock_transfers_status_not_null` | NOT NULL | `NOT NULL status` |
| `stock_transfers_transfer_number_not_null` | NOT NULL | `NOT NULL transfer_number` |
| `stock_transfers_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_warehouse_stock_transfers_destination` | btree | `(destination_warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_transfers_destination ON warehouse.stock_transfers USING btree (destination_warehouse_id)` |
| `ix_warehouse_stock_transfers_source` | btree | `(source_warehouse_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_transfers_source ON warehouse.stock_transfers USING btree (source_warehouse_id)` |
| `ix_warehouse_stock_transfers_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_warehouse_stock_transfers_status ON warehouse.stock_transfers USING btree (status)` |
| `pk_warehouse_stock_transfers` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_warehouse_stock_transfers ON warehouse.stock_transfers USING btree (internal_id)` |
| `transfer_number` | btree | `(transfer_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX transfer_number ON warehouse.stock_transfers USING btree (transfer_number)` |
| `uq_warehouse_stock_transfers_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_warehouse_stock_transfers_id ON warehouse.stock_transfers USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["destination_warehouse_id","destination_warehouse_id_internal_id","warehouse","warehouses"],["source_warehouse_id","source_warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON warehouse.stock_transfers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON warehouse.stock_transfers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["destination_warehouse_id","destination_warehouse_id_internal_id","warehouse","warehouses"],["source_warehouse_id","source_warehouse_id_internal_id","warehouse","warehouses"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
