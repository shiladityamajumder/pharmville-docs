# `clinical.observations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds observations records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.observations |
| Classification | Transactional |
| Proposed business write owner | Future clinical-care owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | Yes | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `code_system` | `character varying(64)` | Yes | — | Inferred: stores code system for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `consultation_id` | `uuid` | Yes | — | Reference linking this record to consultations | Ensures related business data can be joined and validated | FK → `clinical.consultations` via `fk_clinical_observations_consultation_id_consultations` |
| `consultation_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.consultations` via `fk_clinical_observations_consultation_id_consultations_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_observations_created_by_users` |
| `display` | `character varying(255)` | No | — | Inferred: stores display for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `observed_at` | `timestamp with time zone` | No | — | Time of observed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_clinical_observations_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_clinical_observations_patient_profile_id_patient_pro_995e` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_observations_updated_by_users` |
| `value_json` | `jsonb` | Yes | — | Structured value json information | Retain a versioned payload or relevant details | Exact constraints below |
| `value_quantity` | `numeric(18,6)` | Yes | — | Value quantity value | Track resource or item amounts accurately | Exact constraints below |
| `value_text` | `text` | Yes | — | Inferred: stores value text for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `value_unit` | `character varying(32)` | Yes | — | Inferred: stores value unit for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the observations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.observations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_observations_consultation_id_consultations | `consultation_id` | [`clinical.consultations`](../../Tables/clinical/consultations.md) | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL` |
| fk_clinical_observations_consultation_id_consultations_numeric | `consultation_id_internal_id` | [`clinical.consultations`](../../Tables/clinical/consultations.md) | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL` |
| fk_clinical_observations_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_observations_patient_profile_id_patient_pro_995e | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_clinical_observations_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_clinical_observations_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `clinical.observations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `consultation_id` | `clinical.consultations` | `fk_clinical_observations_consultation_id_consultations` |
| `consultation_id_internal_id` | `clinical.consultations` | `fk_clinical_observations_consultation_id_consultations_numeric` |
| `created_by` | `identity.users` | `fk_clinical_observations_created_by_users` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_clinical_observations_patient_profile_id_patient_pro_995e` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_clinical_observations_patient_profile_id_patient_profiles` |
| `updated_by` | `identity.users` | `fk_clinical_observations_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_observations_finite_numeric_values` | CHECK | `CHECK (value_quantity IS NULL OR (value_quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_clinical_observations_numeric_pair_consultation_id` | CHECK | `CHECK ((consultation_id IS NULL) = (consultation_id_internal_id IS NULL))` |
| `ck_clinical_observations_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_clinical_observations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_observations_consultation_id_consultations` | FOREIGN KEY | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE SET NULL` |
| `fk_clinical_observations_consultation_id_consultations_numeric` | FOREIGN KEY | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE SET NULL` |
| `fk_clinical_observations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_observations_patient_profile_id_patient_pro_995e` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_observations_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_clinical_observations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_observations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_observations_id` | UNIQUE | `UNIQUE (id)` |
| `observations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `observations_display_not_null` | NOT NULL | `NOT NULL display` |
| `observations_id_not_null` | NOT NULL | `NOT NULL id` |
| `observations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `observations_observed_at_not_null` | NOT NULL | `NOT NULL observed_at` |
| `observations_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `observations_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `observations_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `observations_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_observations_code` | btree | `(code_system, code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_observations_code ON clinical.observations USING btree (code_system, code)` |
| `ix_clinical_observations_patient_time` | btree | `(patient_profile_id, observed_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_observations_patient_time ON clinical.observations USING btree (patient_profile_id, observed_at)` |
| `pk_clinical_observations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_observations ON clinical.observations USING btree (internal_id)` |
| `uq_clinical_observations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_observations_id ON clinical.observations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.observations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.observations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.observations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"],["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
