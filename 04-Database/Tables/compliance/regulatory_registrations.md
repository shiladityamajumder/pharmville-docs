# `compliance.regulatory_registrations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds regulatory registrations records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 23 columns, 21 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `authority_id` | `uuid` | No | — | Reference linking this record to regulatory authorities | Ensures related business data can be joined and validated | FK → `compliance.regulatory_authorities` (fk_compliance_regulatory_registrations_authority_id_reg_d5f2) |
| `authority_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `compliance.regulatory_authorities` (fk_compliance_regulatory_registrations_authority_id_reg_698b); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_regulatory_registrations_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_regulatory_registrations_deleted_by_users) |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_compliance_regulatory_registrations_document_file_id_e38a) |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_compliance_regulatory_registrations_document_file_id_1e84); Numeric/public-key pair verification required |
| `expires_at` | `date` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `issued_at` | `date` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | See exact constraints |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_compliance_regulatory_registrations_location_id_locations) |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_compliance_regulatory_registrations_location_id_loca_65e3); Numeric/public-key pair verification required |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_compliance_regulatory_registrations_organization_id__7f52) |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_compliance_regulatory_registrations_organization_id__c7e2); Numeric/public-key pair verification required |
| `registration_number` | `character varying(128)` | No | — | Inferred: stores registration number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `registration_type` | `character varying(64)` | No | — | Inferred: stores registration type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_regulatory_registrations_updated_by_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the regulatory registrations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.regulatory_registrations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_compliance_regulatory_registrations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_compliance_regulatory_registrations_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_compliance_regulatory_registrations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `document_file_id` → `platform.file_objects(id)` via `fk_compliance_regulatory_registrations_document_file_id_e38a`; `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `authority_id` → `compliance.regulatory_authorities(id)` via `fk_compliance_regulatory_registrations_authority_id_reg_d5f2`; `FOREIGN KEY (authority_id) REFERENCES compliance.regulatory_authorities(id) ON DELETE RESTRICT`
- `organization_id` → `organization.organizations(id)` via `fk_compliance_regulatory_registrations_organization_id__7f52`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE`
- `location_id` → `organization.locations(id)` via `fk_compliance_regulatory_registrations_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE CASCADE`
- `authority_id_internal_id` → `compliance.regulatory_authorities(internal_id)` via `fk_compliance_regulatory_registrations_authority_id_reg_698b`; `FOREIGN KEY (authority_id_internal_id) REFERENCES compliance.regulatory_authorities(internal_id) ON DELETE RESTRICT`
- `document_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_compliance_regulatory_registrations_document_file_id_1e84`; `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_compliance_regulatory_registrations_location_id_loca_65e3`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE CASCADE`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_compliance_regulatory_registrations_organization_id__c7e2`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE`

## `compliance.regulatory_registrations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 23 columns, 21 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_regulatory_registrations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_compliance_regulatory_registrations_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_regulatory_registrations_updated_by_users` |
| `document_file_id` | `platform.file_objects` | `fk_compliance_regulatory_registrations_document_file_id_e38a` |
| `authority_id` | `compliance.regulatory_authorities` | `fk_compliance_regulatory_registrations_authority_id_reg_d5f2` |
| `organization_id` | `organization.organizations` | `fk_compliance_regulatory_registrations_organization_id__7f52` |
| `location_id` | `organization.locations` | `fk_compliance_regulatory_registrations_location_id_locations` |
| `authority_id_internal_id` | `compliance.regulatory_authorities` | `fk_compliance_regulatory_registrations_authority_id_reg_698b` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_compliance_regulatory_registrations_document_file_id_1e84` |
| `location_id_internal_id` | `organization.locations` | `fk_compliance_regulatory_registrations_location_id_loca_65e3` |
| `organization_id_internal_id` | `organization.organizations` | `fk_compliance_regulatory_registrations_organization_id__c7e2` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_regulatory_registrations_numeric_pair_aut_80d0` | CHECK | `CHECK ((authority_id IS NULL) = (authority_id_internal_id IS NULL))` |
| `ck_compliance_regulatory_registrations_numeric_pair_doc_c05d` | CHECK | `CHECK ((document_file_id IS NULL) = (document_file_id_internal_id IS NULL))` |
| `ck_compliance_regulatory_registrations_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_compliance_regulatory_registrations_numeric_pair_org_5160` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_compliance_regulatory_registrations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_compliance_regulatory_registrations_valid_dates` | CHECK | `CHECK (expires_at IS NULL OR issued_at IS NULL OR expires_at >= issued_at)` |
| `ck_compliance_regulatory_registrations_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_compliance_regulatory_registrations_authority_id_reg_698b` | FOREIGN KEY | `FOREIGN KEY (authority_id_internal_id) REFERENCES compliance.regulatory_authorities(internal_id) ON DELETE RESTRICT` |
| `fk_compliance_regulatory_registrations_authority_id_reg_d5f2` | FOREIGN KEY | `FOREIGN KEY (authority_id) REFERENCES compliance.regulatory_authorities(id) ON DELETE RESTRICT` |
| `fk_compliance_regulatory_registrations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_regulatory_registrations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_regulatory_registrations_document_file_id_1e84` | FOREIGN KEY | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_compliance_regulatory_registrations_document_file_id_e38a` | FOREIGN KEY | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_compliance_regulatory_registrations_location_id_loca_65e3` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE CASCADE` |
| `fk_compliance_regulatory_registrations_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE CASCADE` |
| `fk_compliance_regulatory_registrations_organization_id__7f52` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_compliance_regulatory_registrations_organization_id__c7e2` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_compliance_regulatory_registrations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_regulatory_registrations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `regulatory_registration` | UNIQUE | `UNIQUE (authority_id, registration_type, registration_number)` |
| `uq_compliance_regulatory_registrations_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_compliance_registrations_expiry` | `CREATE INDEX ix_compliance_registrations_expiry ON compliance.regulatory_registrations USING btree (expires_at)` |
| `ix_compliance_registrations_organization` | `CREATE INDEX ix_compliance_registrations_organization ON compliance.regulatory_registrations USING btree (organization_id)` |
| `pk_compliance_regulatory_registrations` | `CREATE UNIQUE INDEX pk_compliance_regulatory_registrations ON compliance.regulatory_registrations USING btree (internal_id)` |
| `regulatory_registration` | `CREATE UNIQUE INDEX regulatory_registration ON compliance.regulatory_registrations USING btree (authority_id, registration_type, registration_number)` |
| `uq_compliance_regulatory_registrations_id` | `CREATE UNIQUE INDEX uq_compliance_regulatory_registrations_id ON compliance.regulatory_registrations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.regulatory_registrations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["document_file_id","document_file_id_internal_id","platform","file_objects"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.regulatory_registrations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.regulatory_registrations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["document_file_id","document_file_id_internal_id","platform","file_objects"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
