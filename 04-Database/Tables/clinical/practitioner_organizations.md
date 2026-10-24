# `clinical.practitioner_organizations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds practitioner organizations records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 15 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consultation_modes` | `jsonb` | No | `'[]'::jsonb` | Structured consultation modes information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_practitioner_organizations_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_clinical_practitioner_organizations_location_id_locations) |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_clinical_practitioner_organizations_location_id_loca_a76c); Numeric/public-key pair verification required |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_clinical_practitioner_organizations_organization_id__a525) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_clinical_practitioner_organizations_organization_id__4223); Numeric/public-key pair verification required |
| `practitioner_profile_id` | `uuid` | No | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` (fk_clinical_practitioner_organizations_practitioner_pro_46c4) |
| `practitioner_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` (fk_clinical_practitioner_organizations_practitioner_pro_6ec9); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_practitioner_organizations_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the practitioner organizations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.practitioner_organizations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_clinical_practitioner_organizations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_practitioner_organizations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `location_id` → `organization.locations(id)` via `fk_clinical_practitioner_organizations_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL`
- `organization_id` → `organization.organizations(id)` via `fk_clinical_practitioner_organizations_organization_id__a525`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE`
- `practitioner_profile_id` → `clinical.practitioner_profiles(id)` via `fk_clinical_practitioner_organizations_practitioner_pro_46c4`; `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE CASCADE`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_clinical_practitioner_organizations_location_id_loca_a76c`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_clinical_practitioner_organizations_organization_id__4223`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE`
- `practitioner_profile_id_internal_id` → `clinical.practitioner_profiles(internal_id)` via `fk_clinical_practitioner_organizations_practitioner_pro_6ec9`; `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE CASCADE`

## `clinical.practitioner_organizations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 15 columns, 15 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_practitioner_organizations_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_practitioner_organizations_updated_by_users` |
| `location_id` | `organization.locations` | `fk_clinical_practitioner_organizations_location_id_locations` |
| `organization_id` | `organization.organizations` | `fk_clinical_practitioner_organizations_organization_id__a525` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_clinical_practitioner_organizations_practitioner_pro_46c4` |
| `location_id_internal_id` | `organization.locations` | `fk_clinical_practitioner_organizations_location_id_loca_a76c` |
| `organization_id_internal_id` | `organization.organizations` | `fk_clinical_practitioner_organizations_organization_id__4223` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_clinical_practitioner_organizations_practitioner_pro_6ec9` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_practitioner_orgs_practitioner` | `CREATE INDEX ix_clinical_practitioner_orgs_practitioner ON clinical.practitioner_organizations USING btree (practitioner_profile_id)` |
| `pk_clinical_practitioner_organizations` | `CREATE UNIQUE INDEX pk_clinical_practitioner_organizations ON clinical.practitioner_organizations USING btree (internal_id)` |
| `practitioner_org_location` | `CREATE UNIQUE INDEX practitioner_org_location ON clinical.practitioner_organizations USING btree (practitioner_profile_id, organization_id, location_id)` |
| `uq_clinical_practitioner_organizations_id` | `CREATE UNIQUE INDEX uq_clinical_practitioner_organizations_id ON clinical.practitioner_organizations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.practitioner_organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_organizations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
