# `compliance.regulatory_registrations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds regulatory registrations records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | compliance.regulatory_registrations |
| Classification | Transactional |
| Proposed business write owner | Pharmacist_Review via Compliance owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 23 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `authority_id` | `uuid` | No | — | Reference linking this record to regulatory authorities | Ensures related business data can be joined and validated | FK → `compliance.regulatory_authorities` via `fk_compliance_regulatory_registrations_authority_id_reg_d5f2` |
| `authority_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `compliance.regulatory_authorities` via `fk_compliance_regulatory_registrations_authority_id_reg_698b` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_regulatory_registrations_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_regulatory_registrations_deleted_by_users` |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_compliance_regulatory_registrations_document_file_id_e38a` |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_compliance_regulatory_registrations_document_file_id_1e84` |
| `expires_at` | `date` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `issued_at` | `date` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | Exact constraints below |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` via `fk_compliance_regulatory_registrations_location_id_locations` |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` via `fk_compliance_regulatory_registrations_location_id_loca_65e3` |
| `organization_id` | `uuid` | Yes | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` via `fk_compliance_regulatory_registrations_organization_id__7f52` |
| `organization_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` via `fk_compliance_regulatory_registrations_organization_id__c7e2` |
| `registration_number` | `character varying(128)` | No | — | Inferred: stores registration number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `registration_type` | `character varying(64)` | No | — | Inferred: stores registration type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_regulatory_registrations_updated_by_users` |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the regulatory registrations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.regulatory_registrations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_compliance_regulatory_registrations_authority_id_reg_698b | `authority_id_internal_id` | [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | `FOREIGN KEY (authority_id_internal_id) REFERENCES compliance.regulatory_authorities(internal_id) ON DELETE RESTRICT` |
| fk_compliance_regulatory_registrations_authority_id_reg_d5f2 | `authority_id` | [`compliance.regulatory_authorities`](../../Tables/compliance/regulatory_authorities.md) | `FOREIGN KEY (authority_id) REFERENCES compliance.regulatory_authorities(id) ON DELETE RESTRICT` |
| fk_compliance_regulatory_registrations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_regulatory_registrations_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_regulatory_registrations_document_file_id_1e84 | `document_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_compliance_regulatory_registrations_document_file_id_e38a | `document_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_compliance_regulatory_registrations_location_id_loca_65e3 | `location_id_internal_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE CASCADE` |
| fk_compliance_regulatory_registrations_location_id_locations | `location_id` | [`organization.locations`](../../Tables/organization/locations.md) | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE CASCADE` |
| fk_compliance_regulatory_registrations_organization_id__7f52 | `organization_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| fk_compliance_regulatory_registrations_organization_id__c7e2 | `organization_id_internal_id` | [`organization.organizations`](../../Tables/organization/organizations.md) | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| fk_compliance_regulatory_registrations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `compliance.regulatory_registrations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `authority_id_internal_id` | `compliance.regulatory_authorities` | `fk_compliance_regulatory_registrations_authority_id_reg_698b` |
| `authority_id` | `compliance.regulatory_authorities` | `fk_compliance_regulatory_registrations_authority_id_reg_d5f2` |
| `created_by` | `identity.users` | `fk_compliance_regulatory_registrations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_compliance_regulatory_registrations_deleted_by_users` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_compliance_regulatory_registrations_document_file_id_1e84` |
| `document_file_id` | `platform.file_objects` | `fk_compliance_regulatory_registrations_document_file_id_e38a` |
| `location_id_internal_id` | `organization.locations` | `fk_compliance_regulatory_registrations_location_id_loca_65e3` |
| `location_id` | `organization.locations` | `fk_compliance_regulatory_registrations_location_id_locations` |
| `organization_id` | `organization.organizations` | `fk_compliance_regulatory_registrations_organization_id__7f52` |
| `organization_id_internal_id` | `organization.organizations` | `fk_compliance_regulatory_registrations_organization_id__c7e2` |
| `updated_by` | `identity.users` | `fk_compliance_regulatory_registrations_updated_by_users` |

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
| `regulatory_registrations_authority_id_internal_id_not_null` | NOT NULL | `NOT NULL authority_id_internal_id` |
| `regulatory_registrations_authority_id_not_null` | NOT NULL | `NOT NULL authority_id` |
| `regulatory_registrations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `regulatory_registrations_id_not_null` | NOT NULL | `NOT NULL id` |
| `regulatory_registrations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `regulatory_registrations_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `regulatory_registrations_registration_number_not_null` | NOT NULL | `NOT NULL registration_number` |
| `regulatory_registrations_registration_type_not_null` | NOT NULL | `NOT NULL registration_type` |
| `regulatory_registrations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `regulatory_registrations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `regulatory_registrations_verification_status_not_null` | NOT NULL | `NOT NULL verification_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_compliance_registrations_expiry` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_registrations_expiry ON compliance.regulatory_registrations USING btree (expires_at)` |
| `ix_compliance_registrations_organization` | btree | `(organization_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_registrations_organization ON compliance.regulatory_registrations USING btree (organization_id)` |
| `pk_compliance_regulatory_registrations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_compliance_regulatory_registrations ON compliance.regulatory_registrations USING btree (internal_id)` |
| `regulatory_registration` | btree | `(authority_id, registration_type, registration_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX regulatory_registration ON compliance.regulatory_registrations USING btree (authority_id, registration_type, registration_number)` |
| `uq_compliance_regulatory_registrations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_regulatory_registrations_id ON compliance.regulatory_registrations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.regulatory_registrations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["document_file_id","document_file_id_internal_id","platform","file_objects"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.regulatory_registrations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.regulatory_registrations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["authority_id","authority_id_internal_id","compliance","regulatory_authorities"],["document_file_id","document_file_id_internal_id","platform","file_objects"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
