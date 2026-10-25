# `catalog.manufacturers`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds manufacturers records within the catalog domain (product, medicine, and classification masters). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | catalog.manufacturers |
| Classification | Master / Reference |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `country_code` | `character varying(2)` | No | `'IN'::character varying` | Code for country | Link to controlled business classification or an external reference | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_manufacturers_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_manufacturers_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `legal_name` | `character varying(255)` | Yes | — | Inferred: stores legal name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `license_number` | `character varying(128)` | Yes | — | Inferred: stores license number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_catalog_manufacturers_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_catalog_manufacturers_organization_id_organizations_numeric` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_catalog_manufacturers_updated_by_users` |

## Record lifecycle and users

- **Created:** when the manufacturers business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Admin_CMS, Inventory. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `catalog.manufacturers` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_catalog_manufacturers_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_manufacturers_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_catalog_manufacturers_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE SET NULL` |
| fk_catalog_manufacturers_organization_id_organizations_numeric | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE SET NULL` |
| fk_catalog_manufacturers_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_manufacturer_id_manufacturers | `manufacturer_id` | `id` |
| [`catalog.products`](../../Tables/catalog/products.md) | fk_catalog_products_manufacturer_id_manufacturers_numeric | `manufacturer_id_internal_id` | `internal_id` |

## `catalog.manufacturers` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_catalog_manufacturers_created_by_users` |
| `deleted_by` | `identity.users` | `fk_catalog_manufacturers_deleted_by_users` |
| `organization_id` | `organization.organizations` | `fk_catalog_manufacturers_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_catalog_manufacturers_organization_id_organizations_numeric` |
| `updated_by` | `identity.users` | `fk_catalog_manufacturers_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_catalog_manufacturers_name_nonblank` | CHECK | `CHECK (length(btrim(name::text)) > 0)` |
| `ck_catalog_manufacturers_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_catalog_manufacturers_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_catalog_manufacturers_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_manufacturers_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_catalog_manufacturers_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE SET NULL` |
| `fk_catalog_manufacturers_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE SET NULL` |
| `fk_catalog_manufacturers_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_catalog_manufacturers` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_catalog_manufacturers_id` | UNIQUE | `UNIQUE (id)` |
| `manufacturers_country_code_not_null` | NOT NULL | `NOT NULL country_code` |
| `manufacturers_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `manufacturers_id_not_null` | NOT NULL | `NOT NULL id` |
| `manufacturers_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `manufacturers_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `manufacturers_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `manufacturers_name_not_null` | NOT NULL | `NOT NULL name` |
| `manufacturers_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `manufacturers_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_catalog_manufacturers_name` | btree | `(name)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_catalog_manufacturers_name ON catalog.manufacturers USING btree (name)` |
| `pk_catalog_manufacturers` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_catalog_manufacturers ON catalog.manufacturers USING btree (internal_id)` |
| `uq_catalog_manufacturers_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_manufacturers_id ON catalog.manufacturers USING btree (id)` |
| `uq_catalog_manufacturers_license_active` | btree | `(license_number)` | license_number IS NOT NULL AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_catalog_manufacturers_license_active ON catalog.manufacturers USING btree (license_number) WHERE license_number IS NOT NULL AND is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON catalog.manufacturers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON catalog.manufacturers FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON catalog.manufacturers FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `catalog.manufacturers` |
| Category | Master / Reference — Verified manufacturing legal parties |
| Proposed owner / maintenance role | Product_Catalog / Catalog steward |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `catalog.products` |
| Features | `ACC-07`, `ADM-06`, `ADM-07`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-01`, `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`, `INV-01`, `INV-03`, `OMS-05`, `STO-03` |
| API consumers | [API-011](../../../03-Modules/Product_Catalog/APIs.md), [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-013](../../../03-Modules/Product_Catalog/APIs.md), [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-015](../../../03-Modules/Product_Catalog/APIs.md), [API-016](../../../03-Modules/Product_Catalog/APIs.md), [API-017](../../../03-Modules/Product_Catalog/APIs.md), [API-018](../../../03-Modules/Cart_Checkout/APIs.md), [API-019](../../../03-Modules/Cart_Checkout/APIs.md), [API-020](../../../03-Modules/Cart_Checkout/APIs.md), [API-021](../../../03-Modules/Cart_Checkout/APIs.md), [API-043](../../../03-Modules/Order_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [ACC-ROUTE-008](../../../03-Modules/Customer_Accounts/APIs.md), [ACC-ROUTE-009](../../../03-Modules/Customer_Accounts/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `name`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Catalog steward through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_catalog_manufacturers_id ON catalog.manufacturers USING btree (id); CREATE UNIQUE INDEX uq_catalog_manufacturers_license_active ON catalog.manufacturers USING btree (license_number) WHERE license_number IS NOT NULL AND is_deleted = false |
| Foreign-key dependencies | `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
