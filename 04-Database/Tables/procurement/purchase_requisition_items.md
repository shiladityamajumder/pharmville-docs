# `procurement.purchase_requisition_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds purchase requisition items records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.purchase_requisition_items |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 17 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_qty` | `numeric(16,3)` | Yes | — | Approved qty value | Track resource or item amounts accurately | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_requisition_items_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_procurement_purchase_requisition_items_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_procurement_purchase_requisition_items_product_id_pr_cb94` |
| `reason` | `character varying(255)` | Yes | — | Inferred: stores reason for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `requested_qty` | `numeric(16,3)` | No | — | Requested qty value | Track resource or item amounts accurately | Exact constraints below |
| `requisition_id` | `uuid` | No | — | Reference linking this record to purchase requisitions | Ensures related business data can be joined and validated | FK → `procurement.purchase_requisitions` via `fk_procurement_purchase_requisition_items_requisition_i_527b` |
| `requisition_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.purchase_requisitions` via `fk_procurement_purchase_requisition_items_requisition_i_84f9` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_purchase_requisition_items_updated_by_users` |
| `variant_id` | `uuid` | Yes | — | Reference linking this record to product variants | Ensures related business data can be joined and validated | FK → `catalog.product_variants` via `fk_procurement_purchase_requisition_items_variant_id_pr_3f8f` |
| `variant_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.product_variants` via `fk_procurement_purchase_requisition_items_variant_id_pr_f93f` |

## Record lifecycle and users

- **Created:** when the purchase requisition items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.purchase_requisition_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_purchase_requisition_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisition_items_product_id_pr_cb94 | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisition_items_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisition_items_requisition_i_527b | `requisition_id` | [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | `FOREIGN KEY (requisition_id) REFERENCES procurement.purchase_requisitions(id) ON DELETE CASCADE` |
| fk_procurement_purchase_requisition_items_requisition_i_84f9 | `requisition_id_internal_id` | [`procurement.purchase_requisitions`](../../Tables/procurement/purchase_requisitions.md) | `FOREIGN KEY (requisition_id_internal_id) REFERENCES procurement.purchase_requisitions(internal_id) ON DELETE CASCADE` |
| fk_procurement_purchase_requisition_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisition_items_variant_id_pr_3f8f | `variant_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id) REFERENCES catalog.product_variants(id) ON DELETE RESTRICT` |
| fk_procurement_purchase_requisition_items_variant_id_pr_f93f | `variant_id_internal_id` | [`catalog.product_variants`](../../Tables/catalog/product_variants.md) | `FOREIGN KEY (variant_id_internal_id) REFERENCES catalog.product_variants(internal_id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `procurement.purchase_requisition_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_purchase_requisition_items_created_by_users` |
| `product_id_internal_id` | `catalog.products` | `fk_procurement_purchase_requisition_items_product_id_pr_cb94` |
| `product_id` | `catalog.products` | `fk_procurement_purchase_requisition_items_product_id_products` |
| `requisition_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_requisition_items_requisition_i_527b` |
| `requisition_id_internal_id` | `procurement.purchase_requisitions` | `fk_procurement_purchase_requisition_items_requisition_i_84f9` |
| `updated_by` | `identity.users` | `fk_procurement_purchase_requisition_items_updated_by_users` |
| `variant_id` | `catalog.product_variants` | `fk_procurement_purchase_requisition_items_variant_id_pr_3f8f` |
| `variant_id_internal_id` | `catalog.product_variants` | `fk_procurement_purchase_requisition_items_variant_id_pr_f93f` |

### Existing constraints

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
| `purchase_requisition_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `purchase_requisition_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `purchase_requisition_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `purchase_requisition_items_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `purchase_requisition_items_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `purchase_requisition_items_requested_qty_not_null` | NOT NULL | `NOT NULL requested_qty` |
| `purchase_requisition_items_requisition_id_internal_id_not_null` | NOT NULL | `NOT NULL requisition_id_internal_id` |
| `purchase_requisition_items_requisition_id_not_null` | NOT NULL | `NOT NULL requisition_id` |
| `purchase_requisition_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `purchase_requisition_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_procurement_purchase_requisition_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_purchase_requisition_items ON procurement.purchase_requisition_items USING btree (internal_id)` |
| `requisition_product` | btree | `(requisition_id, product_id, variant_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX requisition_product ON procurement.purchase_requisition_items USING btree (requisition_id, product_id, variant_id) NULLS NOT DISTINCT` |
| `uq_procurement_purchase_requisition_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_purchase_requisition_items_id ON procurement.purchase_requisition_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_requisition_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.purchase_requisition_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.purchase_requisition_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"],["requisition_id","requisition_id_internal_id","procurement","purchase_requisitions"],["variant_id","variant_id_internal_id","catalog","product_variants"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
