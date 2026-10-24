# `catalog.commerce_classes`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds commerce classes records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 11 constraints, 3 indexes, 4 triggers; PK: `id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(1)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_commerce_classes_created_by_user_id_users) |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `display_name` | `character varying(150)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `requires_pharmacist_review` | `boolean` | No | — | Inferred: stores requires pharmacist review for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requires_prescription` | `boolean` | No | — | Inferred: stores requires prescription for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sort_order` | `integer` | No | `0` | Inferred: stores sort order for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_catalog_commerce_classes_updated_by_user_id_users) |

**Primary key columns (Confirmed):** `id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the commerce classes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.commerce_classes` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by_user_id` → `identity.users(id)` via `fk_catalog_commerce_classes_created_by_user_id_users`; `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by_user_id` → `identity.users(id)` via `fk_catalog_commerce_classes_updated_by_user_id_users`; `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 4 FK constraints** (sample): `catalog.products`, `commerce.order_items`, `catalog.product_classification_history`, `catalog.product_classification_history`.

## `catalog.commerce_classes` — exact structural contracts

**Identity:** `id` BIGINT.

**Counts:** 13 columns, 11 constraints, 3 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by_user_id` | `identity.users` | `fk_catalog_commerce_classes_created_by_user_id_users` |
| `updated_by_user_id` | `identity.users` | `fk_catalog_commerce_classes_updated_by_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_commerce_classes_approved_classes` | CHECK | `CHECK (code::text = ANY (ARRAY['P'::text, 'M'::text, 'O'::text]))` |
| `ck_catalog_commerce_classes_approved_semantics` | CHECK | `CHECK (requires_prescription = (code::text = 'P'::text) AND requires_pharmacist_review = (code::text = 'P'::text))` |
| `ck_catalog_commerce_classes_canonical_code` | CHECK | `CHECK (code::text ~ '^[A-Z][A-Z0-9_]{0,63}$'::text)` |
| `ck_catalog_commerce_classes_display_name_nonblank` | CHECK | `CHECK (length(btrim(display_name::text)) > 0)` |
| `ck_catalog_commerce_classes_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_commerce_classes_sort_order_nonnegative` | CHECK | `CHECK (sort_order >= 0)` |
| `fk_catalog_commerce_classes_created_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_commerce_classes_updated_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_commerce_classes` | PRIMARY KEY | `PRIMARY KEY (id)` |
| `uq_catalog_commerce_classes_code` | UNIQUE | `UNIQUE (code)` |
| `uq_catalog_commerce_classes_id_code` | UNIQUE | `UNIQUE (id, code)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_catalog_commerce_classes` | `CREATE UNIQUE INDEX pk_catalog_commerce_classes ON catalog.commerce_classes USING btree (id)` |
| `uq_catalog_commerce_classes_code` | `CREATE UNIQUE INDEX uq_catalog_commerce_classes_code ON catalog.commerce_classes USING btree (code)` |
| `uq_catalog_commerce_classes_id_code` | `CREATE UNIQUE INDEX uq_catalog_commerce_classes_id_code ON catalog.commerce_classes USING btree (id, code)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |
| `master_guard` | `CREATE TRIGGER master_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.guard_master()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
