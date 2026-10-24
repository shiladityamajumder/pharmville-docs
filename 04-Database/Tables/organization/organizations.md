# `organization.organizations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds organizations records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 7 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_organizations_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_organizations_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `legal_name` | `character varying(255)` | No | — | Inferred: stores legal name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `organization_type` | `character varying(32)` | No | — | Inferred: stores organization type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `registration_number` | `character varying(128)` | Yes | — | Inferred: stores registration number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(16)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tax_id` | `character varying(64)` | Yes | — | Identifier associated with tax | Link the event or entity to its subject; verify constraints | See exact constraints |
| `trade_name` | `character varying(255)` | Yes | — | Inferred: stores trade name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_organizations_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the organizations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.organizations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_organization_organizations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_organization_organizations_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_organization_organizations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 32 FK constraints** (sample): `appointment.practitioner_services`, `catalog.brands`, `catalog.manufacturers`, `clinical.practitioner_organizations`, `compliance.regulatory_registrations`, `diagnostics.lab_providers`, `insurance.insurers`, `insurance.tpas`, `marketplace.sellers`, `organization.locations`, `organization.departments`, `organization.memberships`.

## `organization.organizations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 7 constraints, 5 indexes, 3 triggers.

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_organization_organizations_status` | `CREATE INDEX ix_organization_organizations_status ON organization.organizations USING btree (status)` |
| `ix_organization_organizations_tax_id` | `CREATE INDEX ix_organization_organizations_tax_id ON organization.organizations USING btree (tax_id)` |
| `pk_organization_organizations` | `CREATE UNIQUE INDEX pk_organization_organizations ON organization.organizations USING btree (internal_id)` |
| `uq_organization_organizations_id` | `CREATE UNIQUE INDEX uq_organization_organizations_id ON organization.organizations USING btree (id)` |
| `uq_organization_registration_active` | `CREATE UNIQUE INDEX uq_organization_registration_active ON organization.organizations USING btree (registration_number) WHERE registration_number IS NOT NULL AND is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

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
| API consumers | [API-011](../../../05-APIs/Product_Catalog.md), [API-012](../../../05-APIs/Product_Catalog.md), [API-013](../../../05-APIs/Product_Catalog.md), [API-014](../../../05-APIs/Product_Catalog.md), [API-016](../../../05-APIs/Product_Catalog.md), [API-017](../../../05-APIs/Product_Catalog.md), [API-033](../../../05-APIs/Admin_CMS.md), [API-034](../../../05-APIs/Admin_CMS.md), [API-038](../../../05-APIs/Admin_CMS.md), [API-039](../../../05-APIs/Order_Operations.md), [API-040](../../../05-APIs/Order_Operations.md), [API-041](../../../05-APIs/Order_Operations.md), [API-042](../../../05-APIs/Order_Operations.md), [API-044](../../../05-APIs/Store_Operations.md), [API-045](../../../05-APIs/Store_Operations.md), [API-046](../../../05-APIs/Store_Operations.md), [API-047](../../../05-APIs/Store_Operations.md), [API-048](../../../05-APIs/Store_Operations.md), [API-050](../../../05-APIs/Inventory.md), [API-051](../../../05-APIs/Inventory.md), [API-052](../../../05-APIs/Inventory.md), [API-056](../../../05-APIs/Warehouse.md), [API-057](../../../05-APIs/Warehouse.md), [API-058](../../../05-APIs/Warehouse.md), [API-059](../../../05-APIs/Warehouse.md), [API-060](../../../05-APIs/Pharmacist_Review.md), [API-064](../../../05-APIs/Delivery_Operations.md), [API-065](../../../05-APIs/Delivery_Operations.md), [API-067](../../../05-APIs/Delivery_Operations.md), [API-068](../../../05-APIs/Delivery_Operations.md), [API-071](../../../05-APIs/Rider_App.md), [API-084](../../../05-APIs/Reporting.md), [API-086](../../../05-APIs/Reporting.md) |

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
