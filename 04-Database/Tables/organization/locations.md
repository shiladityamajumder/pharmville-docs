# `organization.locations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds locations records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | organization.locations |
| Classification | Master / Reference |
| Proposed business write owner | Admin_CMS |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 15 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `address_json` | `jsonb` | No | — | Structured address json information | Retain a versioned payload or relevant details | Exact constraints below |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_locations_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_locations_deleted_by_users` |
| `geo_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured geo metadata information | Retain a versioned payload or relevant details | Exact constraints below |
| `hfr_id` | `character varying(128)` | Yes | — | Identifier associated with hfr | Link the event or entity to its subject; verify constraints | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `location_type` | `character varying(32)` | No | — | Inferred: stores location type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_organization_locations_organization_id_organizations` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_organization_locations_organization_id_organizations_numeric` |
| `postal_code` | `character varying(16)` | Yes | — | Code for postal | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_organization_locations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the locations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.locations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_organization_locations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_locations_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_organization_locations_organization_id_organizations | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_organization_locations_organization_id_organizations_numeric | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_organization_locations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_location_id_locati_e2b2 | `location_id_internal_id` | `internal_id` |
| [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | fk_appointment_practitioner_services_location_id_locations | `location_id` | `id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_location_id_loca_a76c | `location_id_internal_id` | `internal_id` |
| [`clinical.practitioner_organizations`](../../Tables/clinical/practitioner_organizations.md) | fk_clinical_practitioner_organizations_location_id_locations | `location_id` | `id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_location_id_loca_65e3 | `location_id_internal_id` | `internal_id` |
| [`compliance.regulatory_registrations`](../../Tables/compliance/regulatory_registrations.md) | fk_compliance_regulatory_registrations_location_id_locations | `location_id` | `id` |
| [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | fk_diagnostics_lab_locations_location_id_locations | `location_id` | `id` |
| [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | fk_diagnostics_lab_locations_location_id_locations_numeric | `location_id_internal_id` | `internal_id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_location_id_locations | `location_id` | `id` |
| [`marketplace.seller_locations`](../../Tables/marketplace/seller_locations.md) | fk_marketplace_seller_locations_location_id_locations_numeric | `location_id_internal_id` | `internal_id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_location_id_locations | `location_id` | `id` |
| [`organization.licenses`](../../Tables/organization/licenses.md) | fk_organization_licenses_location_id_locations_numeric | `location_id_internal_id` | `internal_id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_location_id_locations | `location_id` | `id` |
| [`organization.memberships`](../../Tables/organization/memberships.md) | fk_organization_memberships_location_id_locations_numeric | `location_id_internal_id` | `internal_id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_location_id_locations | `location_id` | `id` |
| [`warehouse.warehouses`](../../Tables/warehouse/warehouses.md) | fk_warehouse_warehouses_location_id_locations_numeric | `location_id_internal_id` | `internal_id` |

## `organization.locations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_locations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_locations_deleted_by_users` |
| `organization_id` | `organization.organizations` | `fk_organization_locations_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_locations_organization_id_organizations_numeric` |
| `updated_by` | `identity.users` | `fk_organization_locations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_locations_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_organization_locations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_organization_locations_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_organization_locations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_locations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_locations_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_organization_locations_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_organization_locations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `organization_location_code` | UNIQUE | `UNIQUE (organization_id, code)` |
| `pk_organization_locations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_locations_id` | UNIQUE | `UNIQUE (id)` |
| `locations_address_json_not_null` | NOT NULL | `NOT NULL address_json` |
| `locations_code_not_null` | NOT NULL | `NOT NULL code` |
| `locations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `locations_geo_metadata_not_null` | NOT NULL | `NOT NULL geo_metadata` |
| `locations_id_not_null` | NOT NULL | `NOT NULL id` |
| `locations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `locations_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `locations_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `locations_location_type_not_null` | NOT NULL | `NOT NULL location_type` |
| `locations_name_not_null` | NOT NULL | `NOT NULL name` |
| `locations_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `locations_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `locations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `locations_timezone_not_null` | NOT NULL | `NOT NULL timezone` |
| `locations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_organization_locations_organization_id` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_locations_organization_id ON organization.locations USING btree (organization_id)` |
| `ix_organization_locations_postal_code` | btree | `(postal_code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_organization_locations_postal_code ON organization.locations USING btree (postal_code)` |
| `organization_location_code` | btree | `(organization_id, code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX organization_location_code ON organization.locations USING btree (organization_id, code)` |
| `pk_organization_locations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_organization_locations ON organization.locations USING btree (internal_id)` |
| `uq_organization_locations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_organization_locations_id ON organization.locations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["organization_id"]')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `organization.locations` |
| Category | Master / Reference — Operating store/warehouse physical location identities |
| Proposed owner / maintenance role | Admin_CMS / Organization administrator |
| Scope | Organization-specific via organization_id. |
| Referencing tables | `appointment.practitioner_services`, `clinical.practitioner_organizations`, `compliance.regulatory_registrations`, `diagnostics.lab_locations`, `marketplace.seller_locations`, `organization.licenses`, `organization.memberships`, `warehouse.warehouses` |
| Features | `ADM-02`, `ADM-08`, `CAT-04`, `CHK-08`, `DLV-01`, `DLV-02`, `DLV-04`, `DLV-05`, `INV-01`, `INV-03`, `INV-07`, `OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `PHM-01`, `REP-03`, `REP-07`, `RID-02`, `STO-01`, `STO-02`, `STO-03`, `WH-01`, `WH-02`, `WH-04` |
| API consumers | [API-014](../../../03-Modules/Product_Catalog/APIs.md), [API-033](../../../03-Modules/Admin_CMS/APIs.md), [API-034](../../../03-Modules/Admin_CMS/APIs.md), [API-038](../../../03-Modules/Admin_CMS/APIs.md), [API-039](../../../03-Modules/Order_Operations/APIs.md), [API-040](../../../03-Modules/Order_Operations/APIs.md), [API-041](../../../03-Modules/Order_Operations/APIs.md), [API-042](../../../03-Modules/Order_Operations/APIs.md), [API-044](../../../03-Modules/Store_Operations/APIs.md), [API-045](../../../03-Modules/Store_Operations/APIs.md), [API-046](../../../03-Modules/Store_Operations/APIs.md), [API-047](../../../03-Modules/Store_Operations/APIs.md), [API-048](../../../03-Modules/Store_Operations/APIs.md), [API-050](../../../03-Modules/Inventory/APIs.md), [API-051](../../../03-Modules/Inventory/APIs.md), [API-052](../../../03-Modules/Inventory/APIs.md), [API-056](../../../03-Modules/Warehouse/APIs.md), [API-057](../../../03-Modules/Warehouse/APIs.md), [API-058](../../../03-Modules/Warehouse/APIs.md), [API-059](../../../03-Modules/Warehouse/APIs.md), [API-060](../../../03-Modules/Pharmacist_Review/APIs.md), [API-064](../../../03-Modules/Delivery_Operations/APIs.md), [API-065](../../../03-Modules/Delivery_Operations/APIs.md), [API-067](../../../03-Modules/Delivery_Operations/APIs.md), [API-068](../../../03-Modules/Delivery_Operations/APIs.md), [API-071](../../../03-Modules/Rider_App/APIs.md), [API-084](../../../03-Modules/Reporting/APIs.md), [API-086](../../../03-Modules/Reporting/APIs.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Business confirms one Noida warehouse and 33 stores; addresses, organization IDs, stable codes, hours and verified licenses are not supplied. These are counts, not 34 fabricated location rows. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `address_json`, `code`, `location_type`, `name`, `organization_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Organization administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (organization_id, code); UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX organization_location_code ON organization.locations USING btree (organization_id, code); CREATE UNIQUE INDEX uq_organization_locations_id ON organization.locations USING btree (id) |
| Foreign-key dependencies | `organization.organizations` |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
