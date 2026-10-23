# commerce.return_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds return items records within the commerce domain (shopping cart, checkout, order and returns). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 15 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_qty` | `numeric(12,3)` | Yes | — | Approved qty value | Track resource or item amounts accurately | See exact constraints |
| `condition` | `character varying(32)` | Yes | — | Inferred: stores condition for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_return_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `inspection_notes` | `text` | Yes | — | Inferred: stores inspection notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `order_item_id` | `uuid` | No | — | Reference linking this record to order items | Ensures related business data can be joined and validated | FK → `commerce.order_items` (fk_commerce_return_items_order_item_id_order_items) |
| `order_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.order_items` (fk_commerce_return_items_order_item_id_order_items_numeric); Numeric/public-key pair verification required |
| `quantity` | `numeric(12,3)` | No | — | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `resolution` | `character varying(32)` | No | — | Inferred: stores resolution for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `return_id` | `uuid` | No | — | Reference linking this record to returns | Ensures related business data can be joined and validated | FK → `commerce.returns` (fk_commerce_return_items_return_id_returns) |
| `return_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.returns` (fk_commerce_return_items_return_id_returns_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_commerce_return_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the return items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Cart_Checkout, Customer_Orders, Order_Operations, Pharmacist_Review, Finance_Payments, Reporting. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `commerce.return_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_commerce_return_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_commerce_return_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `order_item_id` → `commerce.order_items(id)` via `fk_commerce_return_items_order_item_id_order_items`; FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT
- `return_id` → `commerce.returns(id)` via `fk_commerce_return_items_return_id_returns`; FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE CASCADE
- `order_item_id_internal_id` → `commerce.order_items(internal_id)` via `fk_commerce_return_items_order_item_id_order_items_numeric`; FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT
- `return_id_internal_id` → `commerce.returns(internal_id)` via `fk_commerce_return_items_return_id_returns_numeric`; FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE CASCADE

## commerce.return_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 15 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_commerce_return_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_commerce_return_items_updated_by_users` |
| `order_item_id` | `commerce.order_items` | `fk_commerce_return_items_order_item_id_order_items` |
| `return_id` | `commerce.returns` | `fk_commerce_return_items_return_id_returns` |
| `order_item_id_internal_id` | `commerce.order_items` | `fk_commerce_return_items_order_item_id_order_items_numeric` |
| `return_id_internal_id` | `commerce.returns` | `fk_commerce_return_items_return_id_returns_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_commerce_return_items_approved_qty_range` | CHECK | `CHECK (approved_qty IS NULL OR approved_qty >= 0::numeric AND approved_qty <= quantity)` |
| `ck_commerce_return_items_finite_numeric_values` | CHECK | `CHECK ((quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (approved_qty IS NULL OR (approved_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_commerce_return_items_numeric_pair_order_item_id` | CHECK | `CHECK ((order_item_id IS NULL) = (order_item_id_internal_id IS NULL))` |
| `ck_commerce_return_items_numeric_pair_return_id` | CHECK | `CHECK ((return_id IS NULL) = (return_id_internal_id IS NULL))` |
| `ck_commerce_return_items_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `ck_commerce_return_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_commerce_return_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_commerce_return_items_order_item_id_order_items` | FOREIGN KEY | `FOREIGN KEY (order_item_id) REFERENCES commerce.order_items(id) ON DELETE RESTRICT` |
| `fk_commerce_return_items_order_item_id_order_items_numeric` | FOREIGN KEY | `FOREIGN KEY (order_item_id_internal_id) REFERENCES commerce.order_items(internal_id) ON DELETE RESTRICT` |
| `fk_commerce_return_items_return_id_returns` | FOREIGN KEY | `FOREIGN KEY (return_id) REFERENCES commerce.returns(id) ON DELETE CASCADE` |
| `fk_commerce_return_items_return_id_returns_numeric` | FOREIGN KEY | `FOREIGN KEY (return_id_internal_id) REFERENCES commerce.returns(internal_id) ON DELETE CASCADE` |
| `fk_commerce_return_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_commerce_return_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `return_order_item` | UNIQUE | `UNIQUE (return_id, order_item_id)` |
| `uq_commerce_return_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_commerce_return_items_return` | `CREATE INDEX ix_commerce_return_items_return ON commerce.return_items USING btree (return_id)` |
| `pk_commerce_return_items` | `CREATE UNIQUE INDEX pk_commerce_return_items ON commerce.return_items USING btree (internal_id)` |
| `return_order_item` | `CREATE UNIQUE INDEX return_order_item ON commerce.return_items USING btree (return_id, order_item_id)` |
| `uq_commerce_return_items_id` | `CREATE UNIQUE INDEX uq_commerce_return_items_id ON commerce.return_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON commerce.return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON commerce.return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON commerce.return_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["order_item_id","order_item_id_internal_id","commerce","order_items"],["return_id","return_id_internal_id","commerce","returns"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
