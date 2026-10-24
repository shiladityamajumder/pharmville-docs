# `catalog.product_classification_history`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds product classification history records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 12 columns, 12 constraints, 5 indexes, 5 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `approved_at` | `timestamp with time zone` | No | `now()` | Time of approved | Support chronology, deadlines or audit evidence | See exact constraints |
| `approved_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_product_classification_history_approved_by_u_625c) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `decision_note` | `text` | Yes | — | Inferred: stores decision note for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `new_class` | `character varying(1)` | No | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` (fk_catalog_product_classification_history_new_class_com_d42d) |
| `old_class` | `character varying(1)` | Yes | — | Reference linking this record to commerce classes | Ensures related business data can be joined and validated | FK → `catalog.commerce_classes` (fk_catalog_product_classification_history_old_class_com_9876) |
| `product_id` | `uuid` | No | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_catalog_product_classification_history_product_id_products) |
| `product_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_catalog_product_classification_history_product_id_pr_6e05); Numeric/public-key pair verification required |
| `reason_code` | `character varying(64)` | No | — | Code for reason | Link to controlled business classification or an external reference | See exact constraints |
| `version` | `bigint` | No | — | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the product classification history business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.product_classification_history` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `approved_by_user_id` → `identity.users(id)` via `fk_catalog_product_classification_history_approved_by_u_625c`; `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `new_class` → `catalog.commerce_classes(code)` via `fk_catalog_product_classification_history_new_class_com_d42d`; `FOREIGN KEY (new_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT`
- `old_class` → `catalog.commerce_classes(code)` via `fk_catalog_product_classification_history_old_class_com_9876`; `FOREIGN KEY (old_class) REFERENCES catalog.commerce_classes(code) ON DELETE RESTRICT`
- `product_id` → `catalog.products(id)` via `fk_catalog_product_classification_history_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE RESTRICT`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_catalog_product_classification_history_product_id_pr_6e05`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE RESTRICT`

## `catalog.product_classification_history` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 12 columns, 12 constraints, 5 indexes, 5 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_catalog_product_classification_history_approved_by_u_625c` |
| `new_class` | `catalog.commerce_classes` | `fk_catalog_product_classification_history_new_class_com_d42d` |
| `old_class` | `catalog.commerce_classes` | `fk_catalog_product_classification_history_old_class_com_9876` |
| `product_id` | `catalog.products` | `fk_catalog_product_classification_history_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_catalog_product_classification_history_product_id_pr_6e05` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_catalog_classification_approver_time` | `CREATE INDEX ix_catalog_classification_approver_time ON catalog.product_classification_history USING btree (approved_by_user_id, approved_at DESC)` |
| `ix_catalog_classification_product_time` | `CREATE INDEX ix_catalog_classification_product_time ON catalog.product_classification_history USING btree (product_id, approved_at DESC)` |
| `pk_catalog_product_classification_history` | `CREATE UNIQUE INDEX pk_catalog_product_classification_history ON catalog.product_classification_history USING btree (internal_id)` |
| `uq_catalog_classification_product_version` | `CREATE UNIQUE INDEX uq_catalog_classification_product_version ON catalog.product_classification_history USING btree (product_id, version)` |
| `uq_catalog_product_classification_history_id` | `CREATE UNIQUE INDEX uq_catalog_product_classification_history_id ON catalog.product_classification_history USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `classification_append_only` | `CREATE TRIGGER classification_append_only BEFORE DELETE OR UPDATE ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `classification_apply` | `CREATE TRIGGER classification_apply AFTER INSERT ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION catalog.apply_classification()` |
| `classification_approval` | `CREATE TRIGGER classification_approval BEFORE INSERT ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION catalog.approve_classification()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.product_classification_history FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
