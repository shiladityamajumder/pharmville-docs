# `compliance.adverse_event_reports`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds adverse event reports records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 16 constraints, 6 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_adverse_event_reports_created_by_users) |
| `event_description_encrypted` | `bytea` | No | — | Inferred: stores event description encrypted for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `occurred_at` | `timestamp with time zone` | Yes | — | Time of occurred | Support chronology, deadlines or audit evidence | See exact constraints |
| `outcome` | `character varying(64)` | Yes | — | Inferred: stores outcome for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `patient_profile_id` | `uuid` | Yes | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_compliance_adverse_event_reports_patient_profile_id__4b0b) |
| `patient_profile_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_compliance_adverse_event_reports_patient_profile_id__6d1c); Numeric/public-key pair verification required |
| `prescription_id` | `uuid` | Yes | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` (fk_compliance_adverse_event_reports_prescription_id_pre_e002) |
| `prescription_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` (fk_compliance_adverse_event_reports_prescription_id_pre_401a); Numeric/public-key pair verification required |
| `product_id` | `uuid` | Yes | — | Reference linking this record to products | Ensures related business data can be joined and validated | FK → `catalog.products` (fk_compliance_adverse_event_reports_product_id_products) |
| `product_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `catalog.products` (fk_compliance_adverse_event_reports_product_id_products_numeric); Numeric/public-key pair verification required |
| `report_number` | `character varying(64)` | No | — | Inferred: stores report number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reported_at` | `timestamp with time zone` | No | `now()` | Time of reported | Support chronology, deadlines or audit evidence | See exact constraints |
| `reported_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_adverse_event_reports_reported_by_user_id_users) |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seriousness` | `character varying(32)` | No | — | Inferred: stores seriousness for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(32)` | No | `'submitted'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_adverse_event_reports_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the adverse event reports business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.adverse_event_reports` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_compliance_adverse_event_reports_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_compliance_adverse_event_reports_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `reported_by_user_id` → `identity.users(id)` via `fk_compliance_adverse_event_reports_reported_by_user_id_users`; `FOREIGN KEY (reported_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `prescription_id` → `clinical.prescriptions(id)` via `fk_compliance_adverse_event_reports_prescription_id_pre_e002`; `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE SET NULL`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_compliance_adverse_event_reports_patient_profile_id__4b0b`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE SET NULL`
- `product_id` → `catalog.products(id)` via `fk_compliance_adverse_event_reports_product_id_products`; `FOREIGN KEY (product_id) REFERENCES catalog.products(id) ON DELETE SET NULL`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_compliance_adverse_event_reports_patient_profile_id__6d1c`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE SET NULL`
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_compliance_adverse_event_reports_prescription_id_pre_401a`; `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE SET NULL`
- `product_id_internal_id` → `catalog.products(internal_id)` via `fk_compliance_adverse_event_reports_product_id_products_numeric`; `FOREIGN KEY (product_id_internal_id) REFERENCES catalog.products(internal_id) ON DELETE SET NULL`

## `compliance.adverse_event_reports` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 16 constraints, 6 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_adverse_event_reports_created_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_adverse_event_reports_updated_by_users` |
| `reported_by_user_id` | `identity.users` | `fk_compliance_adverse_event_reports_reported_by_user_id_users` |
| `prescription_id` | `clinical.prescriptions` | `fk_compliance_adverse_event_reports_prescription_id_pre_e002` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_compliance_adverse_event_reports_patient_profile_id__4b0b` |
| `product_id` | `catalog.products` | `fk_compliance_adverse_event_reports_product_id_products` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_compliance_adverse_event_reports_patient_profile_id__6d1c` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_compliance_adverse_event_reports_prescription_id_pre_401a` |
| `product_id_internal_id` | `catalog.products` | `fk_compliance_adverse_event_reports_product_id_products_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `adverse_event_report_number` | `CREATE UNIQUE INDEX adverse_event_report_number ON compliance.adverse_event_reports USING btree (report_number)` |
| `ix_compliance_adverse_events_patient` | `CREATE INDEX ix_compliance_adverse_events_patient ON compliance.adverse_event_reports USING btree (patient_profile_id)` |
| `ix_compliance_adverse_events_product` | `CREATE INDEX ix_compliance_adverse_events_product ON compliance.adverse_event_reports USING btree (product_id)` |
| `ix_compliance_adverse_events_status` | `CREATE INDEX ix_compliance_adverse_events_status ON compliance.adverse_event_reports USING btree (status)` |
| `pk_compliance_adverse_event_reports` | `CREATE UNIQUE INDEX pk_compliance_adverse_event_reports ON compliance.adverse_event_reports USING btree (internal_id)` |
| `uq_compliance_adverse_event_reports_id` | `CREATE UNIQUE INDEX uq_compliance_adverse_event_reports_id ON compliance.adverse_event_reports USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.adverse_event_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.adverse_event_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.adverse_event_reports FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"],["product_id","product_id_internal_id","catalog","products"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
