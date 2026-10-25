# `organization.organizations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds organizations records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | organization.organizations |
| Classification | Master / Reference |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_organizations_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_organizations_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `legal_name` | `character varying(255)` | No | — | Inferred: stores legal name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `organization_type` | `character varying(32)` | No | — | Inferred: stores organization type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `registration_number` | `character varying(128)` | Yes | — | Inferred: stores registration number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tax_id` | `character varying(64)` | Yes | — | Identifier associated with tax | Link the event or entity to its subject; verify constraints | Collation: default |
| `trade_name` | `character varying(255)` | Yes | — | Inferred: stores trade name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_organizations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the organizations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.organizations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_organization_organizations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_organizations_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_organizations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_organization_id_or_328c | `organization_id` | `id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_organization_id_or_7c6f | `organization_id_internal_id` | `internal_id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_owner_organization_id_organizations | `owner_organization_id` | `id` |
| [`catalog.brands`](../../Tables/catalog/brands.md) | fk_catalog_brands_owner_organization_id_organizations_numeric | `owner_organization_id_internal_id` | `internal_id` |
| [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | fk_catalog_manufacturers_organization_id_organizations | `organization_id` | `id` |
| [`catalog.manufacturers`](../../Tables/catalog/manufacturers.md) | fk_catalog_manufacturers_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_organization_id__4223 | `organization_id_internal_id` | `internal_id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_organization_id__a525 | `organization_id` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_organization_id__7f52 | `organization_id` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_organization_id__c7e2 | `organization_id_internal_id` | `internal_id` |
| [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | fk_diagnostics_lab_providers_organization_id_organizati_15a2 | `organization_id_internal_id` | `internal_id` |
| [`diagnostics.lab_providers`](../../Tables/diagnostics/lab_providers.md) | fk_diagnostics_lab_providers_organization_id_organizations | `organization_id` | `id` |
| [`insurance.insurers`](../../Tables/insurance/insurers.md) | fk_insurance_insurers_organization_id_organizations | `organization_id` | `id` |
| [`insurance.insurers`](../../Tables/insurance/insurers.md) | fk_insurance_insurers_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`insurance.tpas`](../../Tables/insurance/tpas.md) | fk_insurance_tpas_organization_id_organizations | `organization_id` | `id` |
| [`insurance.tpas`](../../Tables/insurance/tpas.md) | fk_insurance_tpas_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_marketplace_sellers_organization_id_organizations | `organization_id` | `id` |
| [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | fk_marketplace_sellers_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`organization.bank_accounts`](../../Tables/organization/bank_accounts.md) | fk_organization_bank_accounts_organization_id_organizat_e061 | `organization_id_internal_id` | `internal_id` |
| [`organization.bank_accounts`](../../Tables/organization/bank_accounts.md) | fk_organization_bank_accounts_organization_id_organizations | `organization_id` | `id` |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_organization_id_organizatio_fb8c | `organization_id_internal_id` | `internal_id` |
| [`organization.departments`](../../Tables/organization/departments.md) | fk_organization_departments_organization_id_organizations | `organization_id` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_organization_id_organizations | `organization_id` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`organization.locations`](../../Tables/organization/locations.md) | fk_organization_locations_organization_id_organizations | `organization_id` | `id` |
| [`organization.locations`](../../Tables/organization/locations.md) | fk_organization_locations_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_organization_id_organizatio_2172 | `organization_id_internal_id` | `internal_id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_organization_id_organizations | `organization_id` | `id` |
| [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | fk_procurement_suppliers_organization_id_organizations | `organization_id` | `id` |
| [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | fk_procurement_suppliers_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_organization_id_organizations | `organization_id` | `id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_organization_id_organizations_numeric | `organization_id_internal_id` | `internal_id` |

## `organization.organizations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_organizations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_organizations_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_organization_organizations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_organizations_activestatus` | CHECK | `CHECK (status::text = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'archived'::text]))` |
| `ck_organization_organizations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_organization_organizations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_organizations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_organizations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_organization_organizations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_organizations_id` | UNIQUE | `UNIQUE (id)` |
| `organizations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `organizations_id_not_null` | NOT NULL | `NOT NULL id` |
| `organizations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `organizations_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `organizations_legal_name_not_null` | NOT NULL | `NOT NULL legal_name` |
| `organizations_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `organizations_organization_type_not_null` | NOT NULL | `NOT NULL organization_type` |
| `organizations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `organizations_status_not_null` | NOT NULL | `NOT NULL status` |
| `organizations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_organization_organizations_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_organizations_status ON organization.organizations USING btree (status)` |
| `ix_organization_organizations_tax_id` | btree | `(tax_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_organizations_tax_id ON organization.organizations USING btree (tax_id)` |
| `pk_organization_organizations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_organization_organizations ON organization.organizations USING btree (internal_id)` |
| `uq_organization_organizations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_organizations_id ON organization.organizations USING btree (id)` |
| `uq_organization_registration_active` | btree | `(registration_number)` | registration_number IS NOT NULL AND is_deleted = false | Enforces primary/unique identity or a scoped uniqueness invariant; partial predicate limits indexed rows. Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_registration_active ON organization.organizations USING btree (registration_number) WHERE registration_number IS NOT NULL AND is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `organization.organizations` |
| Category | Master / Reference — Verified operating legal organizations |
| Proposed owner / maintenance role | Admin_CMS / Organization administrator |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `appointment.practitioner_services`, `catalog.brands`, `catalog.manufacturers`, `clinical.practitioner_organizations`, `compliance.regulatory_registrations`, `diagnostics.lab_providers`, `insurance.insurers`, `insurance.tpas`, `marketplace.sellers`, `organization.bank_accounts`, `organization.departments`, `organization.licenses`, `organization.locations`, `organization.memberships`, `procurement.suppliers`, `warehouse.warehouses` |
| Features | `ADM-02`, `ADM-06`, `ADM-08`, `CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CHK-08`, `DLV-01`, `DLV-02`, `DLV-04`, `DLV-05`, `INV-01`, `INV-03`, `INV-07`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `PHM-01`, `REP-03`, `REP-07`, `RID-02`, `STO-01`, `STO-02`, `STO-03`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-011](../../../03-Modules/Product_Catalog/APIs.md), [API-012](../../../03-Modules/Product_Catalog/APIs.md), [API-013](../../../03-Modules/Product_Catalog/APIs.md), [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-016](../../../03-Modules/Product_Catalog/APIs.md), [API-017](../../../03-Modules/Product_Catalog/APIs.md), [API-033](../../../03-Modules/Admin_CMS/APIs.md), [API-034](../../../03-Modules/Admin_CMS/APIs.md), [API-038](../../../03-Modules/Admin_CMS/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-044](../../../03-Modules/Store_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-060](../../../03-Modules/Pharmacist_Review/APIs.md), [API-064](../../../03-Modules/Delivery_Operations/APIs.md), [API-065](../../../03-Modules/Delivery_Operations/APIs.md), [API-067](../../../03-Modules/Delivery_Operations/APIs.md), [API-068](../../../03-Modules/Delivery_Operations/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md), [API-086](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `legal_name`, `organization_type`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Organization administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use approved inactive/closed status from the table CHECK/owner policy; do not invent unsupported status values. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_organization_organizations_id ON organization.organizations USING btree (id); CREATE UNIQUE INDEX uq_organization_registration_active ON organization.organizations USING btree (registration_number) WHERE registration_number IS NOT NULL AND is_deleted = false |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
