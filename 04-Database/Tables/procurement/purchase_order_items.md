# `procurement.purchase_order_items`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds purchase order items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 20 columns, 21 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_order_items_created_by_users) |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `ordered_qty` | `numeric(16,3)` | No | — | Ordered qty value | Track resource or item amounts accurately | See exact constraints |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_procurement_purchase_order_items_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_procurement_purchase_order_items_product_id_products_numeric); Numeric/public-key pair verification required |
| `purchase_order_id` | `uuid` | No | — | Reference linking this record to purchase orders | Ensures related business data can be joined and validated | FK → `procurement.purchase_orders` (fk_procurement_purchase_order_items_purchase_order_id_p_bb14) |
| `purchase_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_orders` (fk_procurement_purchase_order_items_purchase_order_id_p_c99d); Numeric/public-key pair verification required |
| `received_qty` | `numeric(16,3)` | No | `0` | Received qty value | Track resource or item amounts accurately | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `supplier_product_id` | `uuid` | Yes | — | Reference linking this record to supplier products | Ensures related business data can be joined and validated | FK → `procurement.supplier_products` (fk_procurement_purchase_order_items_supplier_product_id_c908) |
| `supplier_product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.supplier_products` (fk_procurement_purchase_order_items_supplier_product_id_b5cc); Numeric/public-key pair verification required |
| `tax_rate` | `numeric(7,4)` | No | `0` | Inferred: stores tax rate for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `unit_cost` | `numeric(14,2)` | No | — | Inferred: stores unit cost for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_order_items_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_procurement_purchase_order_items_variant_id_product_variants) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_procurement_purchase_order_items_variant_id_product__7c24); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the purchase order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_purchase_order_items_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_procurement_purchase_order_items_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `purchase_order_id` → `procurement.purchase_orders(id)` via `fk_procurement_purchase_order_items_purchase_order_id_p_bb14`; `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE CASCADE`
- `supplier_product_id` → `procurement.supplier_products(id)` via `fk_procurement_purchase_order_items_supplier_product_id_c908`; `FOREIGN KEY (supplier_product_id) REFERENCES procurement.supplier_products(id) ON DELETE SET NULL`
- `variant_id` → `catalog.product_variants(id)` via `fk_procurement_purchase_order_items_variant_id_product_variants`; `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT`
- `product_id` → `catalog.products(id)` via `fk_procurement_purchase_order_items_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_procurement_purchase_order_items_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT`
- `purchase_order_id_internal_id` → `procurement.purchase_orders(internal_id)` via `fk_procurement_purchase_order_items_purchase_order_id_p_c99d`; `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE CASCADE`
- `supplier_product_id_internal_id` → `procurement.supplier_products(internal_id)` via `fk_procurement_purchase_order_items_supplier_product_id_b5cc`; `FOREIGN KEY (supplier_product_id_internal_id) REFERENCES procurement.supplier_products(internal_id) ON DELETE SET NULL`
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_procurement_purchase_order_items_variant_id_product__7c24`; `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `procurement.goods_receipt_items`, `procurement.goods_receipt_items`.

## `procurement.purchase_order_items` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 20 columns, 21 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_order_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_order_items_updated_by_users` |
| `purchase_order_id` | `procurement.purchase_orders` | `fk_procurement_purchase_order_items_purchase_order_id_p_bb14` |
| `supplier_product_id` | `procurement.supplier_products` | `fk_procurement_purchase_order_items_supplier_product_id_c908` |
| `variant_id` | `catalog.product_variants` | `fk_procurement_purchase_order_items_variant_id_product_variants` |
| `product_id` | `catalog.products` | `fk_procurement_purchase_order_items_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_procurement_purchase_order_items_product_id_products_numeric` |
| `purchase_order_id_internal_id` | `procurement.purchase_orders` | `fk_procurement_purchase_order_items_purchase_order_id_p_c99d` |
| `supplier_product_id_internal_id` | `procurement.supplier_products` | `fk_procurement_purchase_order_items_supplier_product_id_b5cc` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_procurement_purchase_order_items_variant_id_product__7c24` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_order_items_cost_tax_nonnegative` | CHECK | `CHECK (unit_cost >= 0::numeric AND tax_rate >= 0::numeric)` |
| `ck_procurement_purchase_order_items_finite_numeric_values` | CHECK | `CHECK ((ordered_qty IS NULL OR (ordered_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (received_qty IS NULL OR (received_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (unit_cost IS NULL OR (unit_cost <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_amount IS NULL OR (discount_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_rate IS NULL OR (tax_rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_procurement_purchase_order_items_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_numeric_pair_purcha_769d` | CHECK | `CHECK ((purchase_order_id IS NULL) = (purchase_order_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_numeric_pair_suppli_1f67` | CHECK | `CHECK ((supplier_product_id IS NULL) = (supplier_product_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_numeric_pair_variant_id` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_procurement_purchase_order_items_ordered_qty_positive` | CHECK | `CHECK (ordered_qty > 0::numeric)` |
| `ck_procurement_purchase_order_items_received_qty_range` | CHECK | `CHECK (received_qty >= 0::numeric AND received_qty <= ordered_qty)` |
| `ck_procurement_purchase_order_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_purchase_order_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_purchase_order_id_p_bb14` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id) REFERENCES procurement.purchase_orders(id) ON DELETE CASCADE` |
| `fk_procurement_purchase_order_items_purchase_order_id_p_c99d` | FOREIGN KEY | `FOREIGN KEY (purchase_order_id_internal_id) REFERENCES procurement.purchase_orders(internal_id) ON DELETE CASCADE` |
| `fk_procurement_purchase_order_items_supplier_product_id_b5cc` | FOREIGN KEY | `FOREIGN KEY (supplier_product_id_internal_id) REFERENCES procurement.supplier_products(internal_id) ON DELETE SET NULL` |
| `fk_procurement_purchase_order_items_supplier_product_id_c908` | FOREIGN KEY | `FOREIGN KEY (supplier_product_id) REFERENCES procurement.supplier_products(id) ON DELETE SET NULL` |
| `fk_procurement_purchase_order_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_variant_id_product__7c24` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_order_items_variant_id_product_variants` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_order_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_purchase_order_items_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_purchase_order_items_po` | `CREATE INDEX ix_procurement_purchase_order_items_po ON procurement.purchase_order_items USING btree (purchase_order_id)` |
| `ix_procurement_purchase_order_items_product` | `CREATE INDEX ix_procurement_purchase_order_items_product ON procurement.purchase_order_items USING btree (product_id)` |
| `pk_procurement_purchase_order_items` | `CREATE UNIQUE INDEX pk_procurement_purchase_order_items ON procurement.purchase_order_items USING btree (internal_id)` |
| `uq_procurement_purchase_order_items_id` | `CREATE UNIQUE INDEX uq_procurement_purchase_order_items_id ON procurement.purchase_order_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_product_id","supplier_product_id_internal_id","procurement","supplier_products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["purchase_order_id","purchase_order_id_internal_id","procurement","purchase_orders"],["supplier_product_id","supplier_product_id_internal_id","procurement","supplier_products"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
