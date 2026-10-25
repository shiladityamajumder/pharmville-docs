# `catalog.salts`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds salts records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.salts |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_salts_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_salts_deleted_by_users` |
| `description` | `text` | Yes | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `normalized_name` | `character varying(255)` | No | — | Inferred: stores normalized name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `standard_code` | `character varying(64)` | Yes | — | Code for standard | Link to controlled business classification or an external reference | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_salts_updated_by_users` |

## Record lifecycle and users

- **Created:** when the salts business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.salts` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_salts_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_salts_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_salts_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.product_salts`](../../Tables/catalog/product_salts.md) | fk_catalog_product_salts_salt_id_salts | `salt_id` | `id` |
| [`catalog.product_salts`](../../Tables/catalog/product_salts.md) | fk_catalog_product_salts_salt_id_salts_numeric | `salt_id_internal_id` | `internal_id` |

## `catalog.salts` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_salts_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_salts_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_catalog_salts_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_salts_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_catalog_salts_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(normalized_name::text)) > 0 AND normalized_name::text = btrim(normalized_name::text))` |
| `fk_catalog_salts_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_salts_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_salts_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_salts` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_salts_id` | UNIQUE | `UNIQUE (id)` |
| `salts_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `salts_id_not_null` | NOT NULL | `NOT NULL id` |
| `salts_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `salts_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `salts_name_not_null` | NOT NULL | `NOT NULL name` |
| `salts_normalized_name_not_null` | NOT NULL | `NOT NULL normalized_name` |
| `salts_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `salts_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_salts_name` | btree | `(name)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_salts_name ON catalog.salts USING btree (name)` |
| `pk_catalog_salts` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_salts ON catalog.salts USING btree (internal_id)` |
| `uq_catalog_salts_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_salts_id ON catalog.salts USING btree (id)` |
| `uq_catalog_salts_normalized_active` | btree | `(normalized_name)` | is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_salts_normalized_active ON catalog.salts USING btree (normalized_name) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON catalog.salts FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('normalized_name', '[]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.salts FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.salts` |
| Category | Master / Reference — Approved medicine composition reference |
| Proposed owner / maintenance role | Product_Catalog / Pharmacy-approved Catalog steward |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `catalog.product_salts` |
| Features | `CAT-02`, `CAT-03` |
| API consumers | [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-013](../../../03-Modules/Product_Catalog/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Pharmacy must supply name, normalized_name and standard_code from an approved composition source. No substances or codes are fabricated. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `name`, `normalized_name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Pharmacy-approved Catalog steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_salts_id ON catalog.salts USING btree (id); CREATE UNIQUE INDEX uq_catalog_salts_normalized_active ON catalog.salts USING btree (normalized_name) WHERE is_deleted = false |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
