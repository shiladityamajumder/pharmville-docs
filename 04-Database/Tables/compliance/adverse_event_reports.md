# `compliance.adverse_event_reports`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds adverse event reports records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | compliance.adverse_event_reports |
| Classification | Transactional |
| Proposed business write owner | Pharmacist_Review via Compliance owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 6 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_adverse_event_reports_created_by_users` |
| `event_description_encrypted` | `bytea` | No | — | Inferred: stores event description encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `occurred_at` | `timestamp with time zone` | Yes | — | Time of occurred | Support chronology, deadlines or audit evidence | Exact constraints below |
| `outcome` | `character varying(64)` | Yes | — | Inferred: stores outcome for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `patient_profile_id` | `uuid` | Yes | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_compliance_adverse_event_reports_patient_profile_id__4b0b` |
| `patient_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_compliance_adverse_event_reports_patient_profile_id__6d1c` |
| `prescription_id` | `uuid` | Yes | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` via `fk_compliance_adverse_event_reports_prescription_id_pre_e002` |
| `prescription_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` via `fk_compliance_adverse_event_reports_prescription_id_pre_401a` |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` via `fk_compliance_adverse_event_reports_product_id_products` |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` via `fk_compliance_adverse_event_reports_product_id_products_numeric` |
| `report_number` | `character varying(64)` | No | — | Inferred: stores report number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `reported_at` | `timestamp with time zone` | No | `now()` | Time of reported | Support chronology, deadlines or audit evidence | Exact constraints below |
| `reported_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_adverse_event_reports_reported_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seriousness` | `character varying(32)` | No | — | Inferred: stores seriousness for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(32)` | No | `'submitted'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_adverse_event_reports_updated_by_users` |

## Record lifecycle and users

- **Created:** when the adverse event reports business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.adverse_event_reports` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_compliance_adverse_event_reports_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_adverse_event_reports_patient_profile_id__4b0b | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE SET NULL` |
| fk_compliance_adverse_event_reports_patient_profile_id__6d1c | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE SET NULL` |
| fk_compliance_adverse_event_reports_prescription_id_pre_401a | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL` |
| fk_compliance_adverse_event_reports_prescription_id_pre_e002 | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL` |
| fk_compliance_adverse_event_reports_product_id_products | `product_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL` |
| fk_compliance_adverse_event_reports_product_id_products_numeric | `product_id_internal_id` | [`catalog.products`](../../Tables/catalog/products.md) | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL` |
| fk_compliance_adverse_event_reports_reported_by_user_id_users | `reported_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (reported_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_adverse_event_reports_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `compliance.adverse_event_reports` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_adverse_event_reports_created_by_users` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_compliance_adverse_event_reports_patient_profile_id__4b0b` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_compliance_adverse_event_reports_patient_profile_id__6d1c` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_compliance_adverse_event_reports_prescription_id_pre_401a` |
| `prescription_id` | `clinical.prescriptions` | `fk_compliance_adverse_event_reports_prescription_id_pre_e002` |
| `product_id` | `catalog.products` | `fk_compliance_adverse_event_reports_product_id_products` |
| `product_id_internal_id` | `catalog.products` | `fk_compliance_adverse_event_reports_product_id_products_numeric` |
| `reported_by_user_id` | `identity.users` | `fk_compliance_adverse_event_reports_reported_by_user_id_users` |
| `updated_by` | `identity.users` | `fk_compliance_adverse_event_reports_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `adverse_event_report_number` | UNIQUE | `UNIQUE (report_number)` |
| `ck_compliance_adverse_event_reports_numeric_pair_patien_1b26` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_compliance_adverse_event_reports_numeric_pair_prescr_be1f` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_compliance_adverse_event_reports_numeric_pair_product_id` | CHECK | `CHECK ((product_id IS NULL) = (product_id_internal_id IS NULL))` |
| `ck_compliance_adverse_event_reports_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_compliance_adverse_event_reports_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_adverse_event_reports_patient_profile_id__4b0b` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE SET NULL` |
| `fk_compliance_adverse_event_reports_patient_profile_id__6d1c` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE SET NULL` |
| `fk_compliance_adverse_event_reports_prescription_id_pre_401a` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL` |
| `fk_compliance_adverse_event_reports_prescription_id_pre_e002` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL` |
| `fk_compliance_adverse_event_reports_product_id_products` | FOREIGN KEY | `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL` |
| `fk_compliance_adverse_event_reports_product_id_products_numeric` | FOREIGN KEY | `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL` |
| `fk_compliance_adverse_event_reports_reported_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (reported_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_adverse_event_reports_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_adverse_event_reports` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_compliance_adverse_event_reports_id` | UNIQUE | `UNIQUE (id)` |
| `adverse_event_reports_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `adverse_event_reports_event_description_encrypted_not_null` | NOT NULL | `NOT NULL event_description_encrypted` |
| `adverse_event_reports_id_not_null` | NOT NULL | `NOT NULL id` |
| `adverse_event_reports_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `adverse_event_reports_report_number_not_null` | NOT NULL | `NOT NULL report_number` |
| `adverse_event_reports_reported_at_not_null` | NOT NULL | `NOT NULL reported_at` |
| `adverse_event_reports_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `adverse_event_reports_seriousness_not_null` | NOT NULL | `NOT NULL seriousness` |
| `adverse_event_reports_status_not_null` | NOT NULL | `NOT NULL status` |
| `adverse_event_reports_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `adverse_event_report_number` | btree | `(report_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX adverse_event_report_number ON compliance.adverse_event_reports USING btree (report_number)` |
| `ix_compliance_adverse_events_patient` | btree | `(patient_profile_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_adverse_events_patient ON compliance.adverse_event_reports USING btree (patient_profile_id)` |
| `ix_compliance_adverse_events_product` | btree | `(product_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_adverse_events_product ON compliance.adverse_event_reports USING btree (product_id)` |
| `ix_compliance_adverse_events_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_adverse_events_status ON compliance.adverse_event_reports USING btree (status)` |
| `pk_compliance_adverse_event_reports` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_compliance_adverse_event_reports ON compliance.adverse_event_reports USING btree (internal_id)` |
| `uq_compliance_adverse_event_reports_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_adverse_event_reports_id ON compliance.adverse_event_reports USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.adverse_event_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.adverse_event_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.adverse_event_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
