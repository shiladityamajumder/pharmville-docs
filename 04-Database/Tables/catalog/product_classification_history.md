# `catalog.product_classification_history`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds product classification history records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.product_classification_history |
| Classification | Audit / History |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 12 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 5 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_at` | `timestamp with time zone` | No | `now()` | Time of approved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `approved_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_product_classification_history_approved_by_u_625c` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `decision_note` | `text` | Yes | — | Inferred: stores decision note for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `new_class` | `character varying(1)` | No | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` via `fk_catalog_product_classification_history_new_class_com_d42d`; Collation: default |
| `old_class` | `character varying(1)` | Yes | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` via `fk_catalog_product_classification_history_old_class_com_9876`; Collation: default |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_catalog_product_classification_history_product_id_products` |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_catalog_product_classification_history_product_id_pr_6e05` |
| `reason_code` | `character varying(64)` | No | — | Code for reason | Link to controlled business classification or an external reference | Collation: default |
| `version` | `bigint` | No | — | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the product classification history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_classification_history` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_product_classification_history_approved_by_u_625c | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_product_classification_history_new_class_com_d42d | `new_class` | [`catalog.commerce_classes`](../../Tables/catalog/commerce_classes.md) | `FOREIGN KEY (new_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| fk_catalog_product_classification_history_old_class_com_9876 | `old_class` | [`catalog.commerce_classes`](../../Tables/catalog/commerce_classes.md) | `FOREIGN KEY (old_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| fk_catalog_product_classification_history_product_id_pr_6e05 | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| fk_catalog_product_classification_history_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `catalog.product_classification_history` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_catalog_product_classification_history_approved_by_u_625c` |
| `new_class` | `catalog.commerce_classes` | `fk_catalog_product_classification_history_new_class_com_d42d` |
| `old_class` | `catalog.commerce_classes` | `fk_catalog_product_classification_history_old_class_com_9876` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_classification_history_product_id_pr_6e05` |
| `product_id` | `catalog.products` | `fk_catalog_product_classification_history_product_id_products` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_product_classification_history_new_class` | CHECK | `CHECK (new_class::text = ANY (ARRAY['P'::text, 'M'::text, 'O'::text]))` |
| `ck_catalog_product_classification_history_numeric_pair__b004` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_catalog_product_classification_history_old_class` | CHECK | `CHECK (old_class IS NULL OR (old_class::text = ANY (ARRAY['P'::text, 'M'::text, 'O'::text])))` |
| `ck_catalog_product_classification_history_version_positive` | CHECK | `CHECK (version > 0)` |
| `fk_catalog_product_classification_history_approved_by_u_625c` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_product_classification_history_new_class_com_d42d` | FOREIGN KEY | `FOREIGN KEY (new_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| `fk_catalog_product_classification_history_old_class_com_9876` | FOREIGN KEY | `FOREIGN KEY (old_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT` |
| `fk_catalog_product_classification_history_product_id_pr_6e05` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT` |
| `fk_catalog_product_classification_history_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT` |
| `pk_catalog_product_classification_history` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_classification_product_version` | UNIQUE | `UNIQUE (product_id, version)` |
| `uq_catalog_product_classification_history_id` | UNIQUE | `UNIQUE (id)` |
| `product_classification_history_approved_at_not_null` | NOT NULL | `NOT NULL approved_at` |
| `product_classification_history_approved_by_user_id_not_null` | NOT NULL | `NOT NULL approved_by_user_id` |
| `product_classification_history_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `product_classification_history_id_not_null` | NOT NULL | `NOT NULL id` |
| `product_classification_history_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `product_classification_history_new_class_not_null` | NOT NULL | `NOT NULL new_class` |
| `product_classification_history_product_id_internal_id_not_null` | NOT NULL | `NOT NULL product_id_internal_id` |
| `product_classification_history_product_id_not_null` | NOT NULL | `NOT NULL product_id` |
| `product_classification_history_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `product_classification_history_version_not_null` | NOT NULL | `NOT NULL version` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_classification_approver_time` | btree | `(approved_by_user_id, approved_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_classification_approver_time ON catalog.product_classification_history USING btree (approved_by_user_id, approved_at DESC)` |
| `ix_catalog_classification_product_time` | btree | `(product_id, approved_at DESC)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_classification_product_time ON catalog.product_classification_history USING btree (product_id, approved_at DESC)` |
| `pk_catalog_product_classification_history` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_product_classification_history ON catalog.product_classification_history USING btree (internal_id)` |
| `uq_catalog_classification_product_version` | btree | `(product_id, version)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_classification_product_version ON catalog.product_classification_history USING btree (product_id, version)` |
| `uq_catalog_product_classification_history_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_product_classification_history_id ON catalog.product_classification_history USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `classification_append_only` | `CREATE TRIGGER classification_append_only BEFORE DELETE OR UPDATE ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `classification_apply` | `CREATE TRIGGER classification_apply AFTER INSERT ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION catalog.apply_classification()` | O |
| `classification_approval` | `CREATE TRIGGER classification_approval BEFORE INSERT ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION catalog.approve_classification()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
