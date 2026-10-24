# `procurement.purchase_return_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds purchase return items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.purchase_return_items |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 13 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_return_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` via `fk_procurement_purchase_return_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` via `fk_procurement_purchase_return_items_lot_id_inventory_l_349a` |
| `purchase_return_id` | `uuid` | No | — | Reference linking this record to purchase returns | Ensures related business data can be joined and validated | FK → `procurement.purchase_returns` via `fk_procurement_purchase_return_items_purchase_return_id_e7fa` |
| `purchase_return_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_returns` via `fk_procurement_purchase_return_items_purchase_return_id_8f72` |
| `quantity` | `numeric(16,3)` | No | — | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `reason_code` | `character varying(64)` | No | — | Code for reason | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_return_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the purchase return items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_return_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_purchase_return_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_return_items_lot_id_inventory_l_349a | `lot_id_internal_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_return_items_lot_id_inventory_lots | `lot_id` | [`warehouse.inventory_lots`](../../Tables/warehouse/inventory_lots.md) | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_return_items_purchase_return_id_8f72 | `purchase_return_id_internal_id` | [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | `FOREIGN KEY (purchase_return_id_internal_id) REFERENCES procurement.purchase_returns(internal_id) ON DELETE CASCADE` |
| fk_procurement_purchase_return_items_purchase_return_id_e7fa | `purchase_return_id` | [`procurement.purchase_returns`](../../Tables/procurement/purchase_returns.md) | `FOREIGN KEY (purchase_return_id) REFERENCES procurement.purchase_returns(id) ON DELETE CASCADE` |
| fk_procurement_purchase_return_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `procurement.purchase_return_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_return_items_created_by_users` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_procurement_purchase_return_items_lot_id_inventory_l_349a` |
| `lot_id` | `warehouse.inventory_lots` | `fk_procurement_purchase_return_items_lot_id_inventory_lots` |
| `purchase_return_id_internal_id` | `procurement.purchase_returns` | `fk_procurement_purchase_return_items_purchase_return_id_8f72` |
| `purchase_return_id` | `procurement.purchase_returns` | `fk_procurement_purchase_return_items_purchase_return_id_e7fa` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_return_items_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_return_items_finite_numeric_values` | CHECK | `CHECK (quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_procurement_purchase_return_items_numeric_pair_lot_id` | CHECK | `CHECK ((lot_id IS NULL) = (lot_id_internal_id IS NULL))` |
| `ck_procurement_purchase_return_items_numeric_pair_purch_80a6` | CHECK | `CHECK ((purchase_return_id IS NULL) = (purchase_return_id_internal_id IS NULL))` |
| `ck_procurement_purchase_return_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_procurement_purchase_return_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_purchase_return_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_return_items_lot_id_inventory_l_349a` | FOREIGN KEY | `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_return_items_lot_id_inventory_lots` | FOREIGN KEY | `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_return_items_purchase_return_id_8f72` | FOREIGN KEY | `FOREIGN KEY (purchase_return_id_internal_id) REFERENCES procurement.purchase_returns(internal_id) ON DELETE CASCADE` |
| `fk_procurement_purchase_return_items_purchase_return_id_e7fa` | FOREIGN KEY | `FOREIGN KEY (purchase_return_id) REFERENCES procurement.purchase_returns(id) ON DELETE CASCADE` |
| `fk_procurement_purchase_return_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_return_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_purchase_return_items_id` | UNIQUE | `UNIQUE (id)` |
| `purchase_return_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `purchase_return_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `purchase_return_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `purchase_return_items_lot_id_internal_id_not_null` | NOT NULL | `NOT NULL lot_id_internal_id` |
| `purchase_return_items_lot_id_not_null` | NOT NULL | `NOT NULL lot_id` |
| `purchase_return_items_purchase_return_id_internal_id_not_null` | NOT NULL | `NOT NULL purchase_return_id_internal_id` |
| `purchase_return_items_purchase_return_id_not_null` | NOT NULL | `NOT NULL purchase_return_id` |
| `purchase_return_items_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `purchase_return_items_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `purchase_return_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `purchase_return_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_purchase_return_items_lot` | btree | `(lot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_return_items_lot ON procurement.purchase_return_items USING btree (lot_id)` |
| `ix_procurement_purchase_return_items_return` | btree | `(purchase_return_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_purchase_return_items_return ON procurement.purchase_return_items USING btree (purchase_return_id)` |
| `pk_procurement_purchase_return_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_purchase_return_items ON procurement.purchase_return_items USING btree (internal_id)` |
| `uq_procurement_purchase_return_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_purchase_return_items_id ON procurement.purchase_return_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["purchase_return_id","purchase_return_id_internal_id","procurement","purchase_returns"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["purchase_return_id","purchase_return_id_internal_id","procurement","purchase_returns"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
