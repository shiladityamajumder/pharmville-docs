# `procurement.purchase_return_items`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds purchase return items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_return_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `lot_id` | `uuid` | No | — | Reference linking this record to inventory lots | Ensures related business data can be joined and validated | FK → `warehouse.inventory_lots` (fk_procurement_purchase_return_items_lot_id_inventory_lots) |
| `lot_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `warehouse.inventory_lots` (fk_procurement_purchase_return_items_lot_id_inventory_l_349a); Numeric/public-key pair verification required |
| `purchase_return_id` | `uuid` | No | — | Reference linking this record to purchase returns | Ensures related business data can be joined and validated | FK → `procurement.purchase_returns` (fk_procurement_purchase_return_items_purchase_return_id_e7fa) |
| `purchase_return_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_returns` (fk_procurement_purchase_return_items_purchase_return_id_8f72); Numeric/public-key pair verification required |
| `quantity` | `numeric(16,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `reason_code` | `character varying(64)` | No | — | Code for reason | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_return_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the purchase return items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_return_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_purchase_return_items_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_procurement_purchase_return_items_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `purchase_return_id` → `procurement.purchase_returns(id)` via `fk_procurement_purchase_return_items_purchase_return_id_e7fa`; `FOREIGN KEY (purchase_return_id) REFERENCES procurement.purchase_returns(id) ON DELETE CASCADE`
- `lot_id` → `warehouse.inventory_lots(id)` via `fk_procurement_purchase_return_items_lot_id_inventory_lots`; `FOREIGN KEY (lot_id) REFERENCES warehouse.inventory_lots(id) ON DELETE RESTRICT`
- `lot_id_internal_id` → `warehouse.inventory_lots(internal_id)` via `fk_procurement_purchase_return_items_lot_id_inventory_l_349a`; `FOREIGN KEY (lot_id_internal_id) REFERENCES warehouse.inventory_lots(internal_id) ON DELETE RESTRICT`
- `purchase_return_id_internal_id` → `procurement.purchase_returns(internal_id)` via `fk_procurement_purchase_return_items_purchase_return_id_8f72`; `FOREIGN KEY (purchase_return_id_internal_id) REFERENCES procurement.purchase_returns(internal_id) ON DELETE CASCADE`

## `procurement.purchase_return_items` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 13 columns, 13 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_return_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_return_items_updated_by_users` |
| `purchase_return_id` | `procurement.purchase_returns` | `fk_procurement_purchase_return_items_purchase_return_id_e7fa` |
| `lot_id` | `warehouse.inventory_lots` | `fk_procurement_purchase_return_items_lot_id_inventory_lots` |
| `lot_id_internal_id` | `warehouse.inventory_lots` | `fk_procurement_purchase_return_items_lot_id_inventory_l_349a` |
| `purchase_return_id_internal_id` | `procurement.purchase_returns` | `fk_procurement_purchase_return_items_purchase_return_id_8f72` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_purchase_return_items_lot` | `CREATE INDEX ix_procurement_purchase_return_items_lot ON procurement.purchase_return_items USING btree (lot_id)` |
| `ix_procurement_purchase_return_items_return` | `CREATE INDEX ix_procurement_purchase_return_items_return ON procurement.purchase_return_items USING btree (purchase_return_id)` |
| `pk_procurement_purchase_return_items` | `CREATE UNIQUE INDEX pk_procurement_purchase_return_items ON procurement.purchase_return_items USING btree (internal_id)` |
| `uq_procurement_purchase_return_items_id` | `CREATE UNIQUE INDEX uq_procurement_purchase_return_items_id ON procurement.purchase_return_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["purchase_return_id","purchase_return_id_internal_id","procurement","purchase_returns"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lot_id","lot_id_internal_id","warehouse","inventory_lots"],["purchase_return_id","purchase_return_id_internal_id","procurement","purchase_returns"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
