# `clinical.practitioner_organizations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds practitioner organizations records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.practitioner_organizations |
| Classification | Mapping / Junction |
| Proposed business write owner | Future clinical-care owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consultation_modes` | `jsonb` | No | `'[]'::jsonb` | Structured consultation modes information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_practitioner_organizations_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_clinical_practitioner_organizations_location_id_locations` |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_clinical_practitioner_organizations_location_id_loca_a76c` |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_clinical_practitioner_organizations_organization_id__a525` |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_clinical_practitioner_organizations_organization_id__4223` |
| `practitioner_profile_id` | `uuid` | No | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` via `fk_clinical_practitioner_organizations_practitioner_pro_46c4` |
| `practitioner_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` via `fk_clinical_practitioner_organizations_practitioner_pro_6ec9` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_practitioner_organizations_updated_by_users` |

## Record lifecycle and users

- **Created:** when the practitioner organizations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.practitioner_organizations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_practitioner_organizations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_practitioner_organizations_location_id_loca_a76c | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL` |
| fk_clinical_practitioner_organizations_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL` |
| fk_clinical_practitioner_organizations_organization_id__4223 | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_clinical_practitioner_organizations_organization_id__a525 | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_clinical_practitioner_organizations_practitioner_pro_46c4 | `practitioner_profile_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE CASCADE` |
| fk_clinical_practitioner_organizations_practitioner_pro_6ec9 | `practitioner_profile_id_internal_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE CASCADE` |
| fk_clinical_practitioner_organizations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `clinical.practitioner_organizations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_practitioner_organizations_created_by_users` |
| `location_id_internal_id` | `organization.locations` | `fk_clinical_practitioner_organizations_location_id_loca_a76c` |
| `location_id` | `organization.locations` | `fk_clinical_practitioner_organizations_location_id_locations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_clinical_practitioner_organizations_organization_id__4223` |
| `organization_id` | `organization.organizations` | `fk_clinical_practitioner_organizations_organization_id__a525` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_clinical_practitioner_organizations_practitioner_pro_46c4` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_clinical_practitioner_organizations_practitioner_pro_6ec9` |
| `updated_by` | `identity.users` | `fk_clinical_practitioner_organizations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_practitioner_organizations_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_clinical_practitioner_organizations_numeric_pair_org_3c9a` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_clinical_practitioner_organizations_numeric_pair_pra_f9ec` | CHECK | `CHECK ((practitioner_profile_id IS NULL) = (practitioner_profile_id_internal_id IS NULL))` |
| `ck_clinical_practitioner_organizations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_practitioner_organizations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_organizations_location_id_loca_a76c` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL` |
| `fk_clinical_practitioner_organizations_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL` |
| `fk_clinical_practitioner_organizations_organization_id__4223` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_clinical_practitioner_organizations_organization_id__a525` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_clinical_practitioner_organizations_practitioner_pro_46c4` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE CASCADE` |
| `fk_clinical_practitioner_organizations_practitioner_pro_6ec9` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE CASCADE` |
| `fk_clinical_practitioner_organizations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_practitioner_organizations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `practitioner_org_location` | UNIQUE | `UNIQUE (practitioner_profile_id, organization_id, location_id)` |
| `uq_clinical_practitioner_organizations_id` | UNIQUE | `UNIQUE (id)` |
| `practitioner_organizations_consultation_modes_not_null` | NOT NULL | `NOT NULL consultation_modes` |
| `practitioner_organizations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `practitioner_organizations_id_not_null` | NOT NULL | `NOT NULL id` |
| `practitioner_organizations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `practitioner_organizations_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `practitioner_organizations_organization_id_internal_id_not_null` | NOT NULL | `NOT NULL organization_id_internal_id` |
| `practitioner_organizations_organization_id_not_null` | NOT NULL | `NOT NULL organization_id` |
| `practitioner_organizations_practitioner_profile_id_int_not_null` | NOT NULL | `NOT NULL practitioner_profile_id_internal_id` |
| `practitioner_organizations_practitioner_profile_id_not_null` | NOT NULL | `NOT NULL practitioner_profile_id` |
| `practitioner_organizations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `practitioner_organizations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_practitioner_orgs_practitioner` | btree | `(practitioner_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_practitioner_orgs_practitioner ON clinical.practitioner_organizations USING btree (practitioner_profile_id)` |
| `pk_clinical_practitioner_organizations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_practitioner_organizations ON clinical.practitioner_organizations USING btree (internal_id)` |
| `practitioner_org_location` | btree | `(practitioner_profile_id, organization_id, location_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX practitioner_org_location ON clinical.practitioner_organizations USING btree (practitioner_profile_id, organization_id, location_id)` |
| `uq_clinical_practitioner_organizations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_practitioner_organizations_id ON clinical.practitioner_organizations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.practitioner_organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
