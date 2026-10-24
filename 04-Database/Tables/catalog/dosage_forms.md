# `catalog.dosage_forms`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds dosage forms records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.dosage_forms |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_dosage_forms_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_dosage_forms_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `route_of_administration` | `character varying(64)` | Yes | — | Inferred: stores route of administration for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_dosage_forms_updated_by_users` |

## Record lifecycle and users

- **Created:** when the dosage forms business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.dosage_forms` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_dosage_forms_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_dosage_forms_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_dosage_forms_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_dosage_form_id_dosage_forms | `dosage_form_id` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_dosage_form_id_dosage_forms_numeric | `dosage_form_id_internal_id` | `internal_id` |
| [`catalog.substitution_groups`](../../Tables/catalog/substitution_groups.md) | fk_catalog_substitution_groups_dosage_form_id_dosage_fo_76c1 | `dosage_form_id_internal_id` | `internal_id` |
| [`catalog.substitution_groups`](../../Tables/catalog/substitution_groups.md) | fk_catalog_substitution_groups_dosage_form_id_dosage_forms | `dosage_form_id` | `id` |

## `catalog.dosage_forms` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_dosage_forms_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_dosage_forms_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_dosage_forms_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_dosage_forms_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_dosage_forms_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_catalog_dosage_forms_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_dosage_forms_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_dosage_forms_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_dosage_forms` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_dosage_forms_id` | UNIQUE | `UNIQUE (id)` |
| `dosage_forms_code_not_null` | NOT NULL | `NOT NULL code` |
| `dosage_forms_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `dosage_forms_id_not_null` | NOT NULL | `NOT NULL id` |
| `dosage_forms_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `dosage_forms_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `dosage_forms_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `dosage_forms_name_not_null` | NOT NULL | `NOT NULL name` |
| `dosage_forms_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `dosage_forms_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_catalog_dosage_forms` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_dosage_forms ON catalog.dosage_forms USING btree (internal_id)` |
| `uq_catalog_dosage_forms_code_active` | btree | `(code)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_dosage_forms_code_active ON catalog.dosage_forms USING btree (code) WHERE is_deleted = false` |
| `uq_catalog_dosage_forms_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_dosage_forms_id ON catalog.dosage_forms USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.dosage_forms FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.dosage_forms` |
| Category | Master / Reference — Approved medicine dosage-form reference |
| Proposed owner / maintenance role | Product_Catalog / Pharmacy-approved Catalog steward |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.products`, `catalog.substitution_groups` |
| Features | `ACC-07`, `ADM-06`, `ADM-07`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `OMS-05`, `STO-03` |
| API consumers | [API-011](../../../03-Modules/Product-Catalog/APIs.md), [API-012](../../../03-Modules/Product-Catalog/APIs.md), [API-013](../../../03-Modules/Product-Catalog/APIs.md), [API-014](../../../03-Modules/Product-Catalog/APIs.md), [API-015](../../../03-Modules/Product-Catalog/APIs.md), [API-016](../../../03-Modules/Product-Catalog/APIs.md), [API-017](../../../03-Modules/Product-Catalog/APIs.md), [API-018](../../../03-Modules/Cart-Checkout/APIs.md), [API-019](../../../03-Modules/Cart-Checkout/APIs.md), [API-020](../../../03-Modules/Cart-Checkout/APIs.md), [API-021](../../../03-Modules/Cart-Checkout/APIs.md), [API-043](../../../03-Modules/Order-Management/APIs.md), [API-048](../../../03-Modules/Store-Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer-Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer-Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Pharmacy must supply dosage codes, names and route_of_administration from an approved medicine reference. No clinical vocabulary or routes are invented. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Pharmacy-approved Catalog steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_dosage_forms_code_active ON catalog.dosage_forms USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_catalog_dosage_forms_id ON catalog.dosage_forms USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
