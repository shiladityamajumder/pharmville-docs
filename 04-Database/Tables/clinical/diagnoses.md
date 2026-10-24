# `clinical.diagnoses`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds diagnoses records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.diagnoses |
| Classification | Transactional |
| Proposed business write owner | Future clinical-care owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | Yes | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `code_system` | `character varying(64)` | Yes | — | Inferred: stores code system for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `consultation_id` | `uuid` | No | — | Reference linking this record to consultations | Ensures related business data can be joined and validated | FK → `clinical.consultations` via `fk_clinical_diagnoses_consultation_id_consultations` |
| `consultation_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.consultations` via `fk_clinical_diagnoses_consultation_id_consultations_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_diagnoses_created_by_users` |
| `diagnosis_type` | `character varying(32)` | No | `'primary'::character varying` | Inferred: stores diagnosis type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `display` | `character varying(255)` | No | — | Inferred: stores display for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `notes` | `text` | Yes | — | Inferred: stores notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_diagnoses_updated_by_users` |

## Record lifecycle and users

- **Created:** when the diagnoses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.diagnoses` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_diagnoses_consultation_id_consultations | `consultation_id` | [`clinical.consultations`](../../Tables/clinical/consultations.md) | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE CASCADE` |
| fk_clinical_diagnoses_consultation_id_consultations_numeric | `consultation_id_internal_id` | [`clinical.consultations`](../../Tables/clinical/consultations.md) | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE CASCADE` |
| fk_clinical_diagnoses_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_diagnoses_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `clinical.diagnoses` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `consultation_id` | `clinical.consultations` | `fk_clinical_diagnoses_consultation_id_consultations` |
| `consultation_id_internal_id` | `clinical.consultations` | `fk_clinical_diagnoses_consultation_id_consultations_numeric` |
| `created_by` | `identity.users` | `fk_clinical_diagnoses_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_diagnoses_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_diagnoses_numeric_pair_consultation_id` | CHECK | `CHECK ((consultation_id IS NULL) = (consultation_id_internal_id IS NULL))` |
| `ck_clinical_diagnoses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_clinical_diagnoses_consultation_id_consultations` | FOREIGN KEY | `FOREIGN KEY (consultation_id) REFERENCES clinical.consultations(id) ON DELETE CASCADE` |
| `fk_clinical_diagnoses_consultation_id_consultations_numeric` | FOREIGN KEY | `FOREIGN KEY (consultation_id_internal_id) REFERENCES clinical.consultations(internal_id) ON DELETE CASCADE` |
| `fk_clinical_diagnoses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_diagnoses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_diagnoses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_diagnoses_id` | UNIQUE | `UNIQUE (id)` |
| `diagnoses_consultation_id_internal_id_not_null` | NOT NULL | `NOT NULL consultation_id_internal_id` |
| `diagnoses_consultation_id_not_null` | NOT NULL | `NOT NULL consultation_id` |
| `diagnoses_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `diagnoses_diagnosis_type_not_null` | NOT NULL | `NOT NULL diagnosis_type` |
| `diagnoses_display_not_null` | NOT NULL | `NOT NULL display` |
| `diagnoses_id_not_null` | NOT NULL | `NOT NULL id` |
| `diagnoses_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `diagnoses_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `diagnoses_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_diagnoses_code` | btree | `(code_system, code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_diagnoses_code ON clinical.diagnoses USING btree (code_system, code)` |
| `ix_clinical_diagnoses_consultation` | btree | `(consultation_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_diagnoses_consultation ON clinical.diagnoses USING btree (consultation_id)` |
| `pk_clinical_diagnoses` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_diagnoses ON clinical.diagnoses USING btree (internal_id)` |
| `uq_clinical_diagnoses_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_diagnoses_id ON clinical.diagnoses USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.diagnoses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.diagnoses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.diagnoses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["consultation_id","consultation_id_internal_id","clinical","consultations"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
