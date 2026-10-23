# procurement.purchase_requisition_items

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds purchase requisition items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 16 columns, 17 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_qty` | `numeric(16,3)` | Yes | — | Approved qty value | Track resource or item amounts accurately | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_requisition_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_procurement_purchase_requisition_items_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_procurement_purchase_requisition_items_product_id_pr_cb94); Numeric/public-key pair verification required |
| `reason` | `character varying(255)` | Yes | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requested_qty` | `numeric(16,3)` | No | — | Requested qty value | Track resource or item amounts accurately | See exact constraints |
| `requisition_id` | `uuid` | No | — | Reference linking this record to purchase requisitions | Ensures related business data can be joined and validated | FK → `procurement.purchase_requisitions` (fk_procurement_purchase_requisition_items_requisition_i_527b) |
| `requisition_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_requisitions` (fk_procurement_purchase_requisition_items_requisition_i_84f9); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_purchase_requisition_items_updated_by_users) |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` (fk_procurement_purchase_requisition_items_variant_id_pr_3f8f) |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` (fk_procurement_purchase_requisition_items_variant_id_pr_f93f); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the purchase requisition items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_requisition_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_purchase_requisition_items_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_purchase_requisition_items_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `product_id` → `catalog.products(id)` via `fk_procurement_purchase_requisition_items_product_id_products`; FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT
- `requisition_id` → `procurement.purchase_requisitions(id)` via `fk_procurement_purchase_requisition_items_requisition_i_527b`; FOREIGN KEY (requisition_id) REFERENCES procurement.purchase_requisitions(id) ON DELETE CASCADE
- `variant_id` → `catalog.product_variants(id)` via `fk_procurement_purchase_requisition_items_variant_id_pr_3f8f`; FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_procurement_purchase_requisition_items_product_id_pr_cb94`; FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT
- `requisition_id_internal_id` → `procurement.purchase_requisitions(internal_id)` via `fk_procurement_purchase_requisition_items_requisition_i_84f9`; FOREIGN KEY (requisition_id_internal_id) REFERENCES procurement.purchase_requisitions(internal_id) ON DELETE CASCADE
- `variant_id_internal_id` → `catalog.product_variants(internal_id)` via `fk_procurement_purchase_requisition_items_variant_id_pr_f93f`; FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT

## procurement.purchase_requisition_items — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 16 columns, 17 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_requisition_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_requisition_items_updated_by_users` |
| `product_id` | `catalog.products` | `fk_procurement_purchase_requisition_items_product_id_products` |
| `requisition_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_requisition_items_requisition_i_527b` |
| `variant_id` | `catalog.product_variants` | `fk_procurement_purchase_requisition_items_variant_id_pr_3f8f` |
| `product_id_internal_id` | `catalog.products` | `fk_procurement_purchase_requisition_items_product_id_pr_cb94` |
| `requisition_id_internal_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_requisition_items_requisition_i_84f9` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_procurement_purchase_requisition_items_variant_id_pr_f93f` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_purchase_requisition_items_finite_numeric_values` | CHECK | `CHECK ((requested_qty IS NULL OR (requested_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (approved_qty IS NULL OR (approved_qty <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_procurement_purchase_requisition_items_numeric_pair__56fd` | CHECK | `CHECK ((requisition_id IS NULL) = (requisition_id_internal_id IS NULL))` |
| `ck_procurement_purchase_requisition_items_numeric_pair__6abf` | CHECK | `CHECK ((variant_id IS NULL) = (variant_id_internal_id IS NULL))` |
| `ck_procurement_purchase_requisition_items_numeric_pair__7242` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_procurement_purchase_requisition_items_requested_qty_4fb7` | CHECK | `CHECK (requested_qty > 0::numeric)` |
| `ck_procurement_purchase_requisition_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_purchase_requisition_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisition_items_product_id_pr_cb94` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisition_items_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisition_items_requisition_i_527b` | FOREIGN KEY | `FOREIGN KEY (requisition_id) REFERENCES procurement.purchase_requisitions(id) ON DELETE CASCADE` |
| `fk_procurement_purchase_requisition_items_requisition_i_84f9` | FOREIGN KEY | `FOREIGN KEY (requisition_id_internal_id) REFERENCES procurement.purchase_requisitions(internal_id) ON DELETE CASCADE` |
| `fk_procurement_purchase_requisition_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisition_items_variant_id_pr_3f8f` | FOREIGN KEY | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| `fk_procurement_purchase_requisition_items_variant_id_pr_f93f` | FOREIGN KEY | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |
| `pk_procurement_purchase_requisition_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `requisition_product` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (requisition_id, product_id, variant_id)` |
| `uq_procurement_purchase_requisition_items_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_procurement_purchase_requisition_items` | `CREATE UNIQUE INDEX pk_procurement_purchase_requisition_items ON procurement.purchase_requisition_items USING btree (internal_id)` |
| `requisition_product` | `CREATE UNIQUE INDEX requisition_product ON procurement.purchase_requisition_items USING btree (requisition_id, product_id, variant_id) NULLS NOT DISTINCT` |
| `uq_procurement_purchase_requisition_items_id` | `CREATE UNIQUE INDEX uq_procurement_purchase_requisition_items_id ON procurement.purchase_requisition_items USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_requisition_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_requisition_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_requisition_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
