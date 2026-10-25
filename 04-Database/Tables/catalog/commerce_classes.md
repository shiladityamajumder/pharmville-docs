# `catalog.commerce_classes`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds commerce classes records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.commerce_classes |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | id |
| Structural counts | 13 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(1)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_commerce_classes_created_by_user_id_users` |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `display_name` | `character varying(150)` | No | — | Inferred: stores display name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `bigint` | No | — | Internal numeric primary key | Uniquely identifies a master or newer table row | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `requires_pharmacist_review` | `boolean` | No | — | Inferred: stores requires pharmacist review for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `requires_prescription` | `boolean` | No | — | Inferred: stores requires prescription for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sort_order` | `integer` | No | `0` | Inferred: stores sort order for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_commerce_classes_updated_by_user_id_users` |

## Record lifecycle and users

- **Created:** when the commerce classes business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.commerce_classes` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_commerce_classes_created_by_user_id_users | `created_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_commerce_classes_updated_by_user_id_users | `updated_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.product_classification_history`](../../Tables/catalog/product_classification_history.md) | fk_catalog_product_classification_history_new_class_com_d42d | `new_class` | `code` |
| [`catalog.product_classification_history`](../../Tables/catalog/product_classification_history.md) | fk_catalog_product_classification_history_old_class_com_9876 | `old_class` | `code` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_commerce_class_commerce_classes | `commerce_class` | `code` |
| [`commerce.order_items`](../../Tables/commerce/order_items.md) | fk_commerce_order_items_commerce_class_snapshot_commerc_4b6d | `commerce_class_snapshot` | `code` |

## `catalog.commerce_classes` — exact structural contracts

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
| `commerce_classes_code_not_null` | NOT NULL | `NOT NULL code` |
| `commerce_classes_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `commerce_classes_display_name_not_null` | NOT NULL | `NOT NULL display_name` |
| `commerce_classes_id_not_null` | NOT NULL | `NOT NULL id` |
| `commerce_classes_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `commerce_classes_requires_pharmacist_review_not_null` | NOT NULL | `NOT NULL requires_pharmacist_review` |
| `commerce_classes_requires_prescription_not_null` | NOT NULL | `NOT NULL requires_prescription` |
| `commerce_classes_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `commerce_classes_sort_order_not_null` | NOT NULL | `NOT NULL sort_order` |
| `commerce_classes_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_catalog_commerce_classes` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_commerce_classes ON catalog.commerce_classes USING btree (id)` |
| `uq_catalog_commerce_classes_code` | btree | `(code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_commerce_classes_code ON catalog.commerce_classes USING btree (code)` |
| `uq_catalog_commerce_classes_id_code` | btree | `(id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_commerce_classes_id_code ON catalog.commerce_classes USING btree (id, code)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |
| `master_guard` | `CREATE TRIGGER master_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.guard_master()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.commerce_classes FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'id', '')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.commerce_classes` |
| Category | Master / Reference — Controlled P/M/O commerce eligibility |
| Proposed owner / maintenance role | Product_Catalog / Catalog classification approver with Pharmacy validation |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.product_classification_history`, `catalog.products`, `commerce.order_items` |
| Features | `ACC-07`, `ADM-06`, `ADM-07`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `ORD-02`, `ORD-04`, `ORD-05`, `PHM-03`, `PHM-05`, `RX-04`, `RX-05`, `STO-02`, `STO-03` |
| API consumers | [API-011](../../../03-Modules/Product_Catalog/APIs.md), [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-013](../../../03-Modules/Product_Catalog/APIs.md), [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-015](../../../03-Modules/Product_Catalog/APIs.md), [API-016](../../../03-Modules/Product_Catalog/APIs.md), [API-017](../../../03-Modules/Product_Catalog/APIs.md), [API-018](../../../03-Modules/Cart_Checkout/APIs.md), [API-019](../../../03-Modules/Cart_Checkout/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-024](../../../03-Modules/Prescription_Upload/APIs.md), [API-026](../../../03-Modules/Customer_Orders/APIs.md), [API-027](../../../03-Modules/Customer_Orders/APIs.md), [API-028](../../../03-Modules/Customer_Orders/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-062](../../../03-Modules/Pharmacist_Review/APIs.md), [API-063](../../../03-Modules/Pharmacist_Review/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer_Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source | Additional schema attributes |
| --- | --- | --- | --- | --- | --- |
| P | Prescription-required | P alone requires prescription and pharmacist review. | Confirmed (domain/check constraints; live/seed row presence unverified) | Requirements-and-Scope P/M/O invariant; commerce_classes CHECKs | requires_prescription=true; requires_pharmacist_review=true; proposed display_name=Prescription-required; proposed sort_order=0; is_active=true |
| M | Medicine without mandatory prescription review | P alone requires prescription and pharmacist review. | Confirmed (domain/check constraints; live/seed row presence unverified) | Requirements-and-Scope P/M/O invariant; commerce_classes CHECKs | requires_prescription=false; requires_pharmacist_review=false; proposed display_name=Medicine without mandatory prescription review; proposed sort_order=1; is_active=true |
| O | Other product | P alone requires prescription and pharmacist review. | Confirmed (domain/check constraints; live/seed row presence unverified) | Requirements-and-Scope P/M/O invariant; commerce_classes CHECKs | requires_prescription=false; requires_pharmacist_review=false; proposed display_name=Other product; proposed sort_order=2; is_active=true |

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deployment reference seed after approval, followed by controlled administration. |
| Create/update permissions | Catalog classification approver with Pharmacy validation through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (code); UNIQUE: UNIQUE (id, code); CREATE UNIQUE INDEX uq_catalog_commerce_classes_code ON catalog.commerce_classes USING btree (code); CREATE UNIQUE INDEX uq_catalog_commerce_classes_id_code ON catalog.commerce_classes USING btree (id, code) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Explicit rows above are Confirmed domain values or Proposed initial records, never observed production/seed data. No live row existence or seed execution was verified. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
