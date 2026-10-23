# clinical.prescription_documents

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds prescription documents records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 16 constraints, 8 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescription_documents_created_by_users) |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_clinical_prescription_documents_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_clinical_prescription_documents_file_object_id_file__7c34); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` (fk_clinical_prescription_documents_prescription_id_pres_4ec8) |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` (fk_clinical_prescription_documents_prescription_id_pres_6c80); Numeric/public-key pair verification required |
| `redaction_status` | `character varying(32)` | No | `'not_required'::character varying` | Inferred: stores redaction status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescription_documents_updated_by_users) |
| `version_number` | `integer` | No | — | Inferred: stores version number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the prescription documents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescription_documents` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_clinical_prescription_documents_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_clinical_prescription_documents_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `prescription_id` → `clinical.prescriptions(id)` via `fk_clinical_prescription_documents_prescription_id_pres_4ec8`; FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE
- `file_object_id` → `platform.file_objects(id)` via `fk_clinical_prescription_documents_file_object_id_file_objects`; FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_clinical_prescription_documents_file_object_id_file__7c34`; FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_clinical_prescription_documents_prescription_id_pres_6c80`; FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE

**Referenced by 4 FK constraints** (sample): `clinical.order_reviews`, `clinical.order_reviews`, `clinical.order_reviews`, `clinical.order_reviews`.

## clinical.prescription_documents — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 16 constraints, 8 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_prescription_documents_created_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_prescription_documents_updated_by_users` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_prescription_documents_prescription_id_pres_4ec8` |
| `file_object_id` | `platform.file_objects` | `fk_clinical_prescription_documents_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_clinical_prescription_documents_file_object_id_file__7c34` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_prescription_documents_prescription_id_pres_6c80` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_prescription_documents_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_clinical_prescription_documents_numeric_pair_prescription_id` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `ck_clinical_prescription_documents_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_clinical_prescription_documents_version_positive` | CHECK | `CHECK (version_number > 0)` |
| `fk_clinical_prescription_documents_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_prescription_documents_file_object_id_file__7c34` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_clinical_prescription_documents_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_clinical_prescription_documents_prescription_id_pres_4ec8` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |
| `fk_clinical_prescription_documents_prescription_id_pres_6c80` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| `fk_clinical_prescription_documents_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_clinical_prescription_documents` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `prescription_document_file` | UNIQUE | `UNIQUE (file_object_id)` |
| `uq_clinical_prescription_documents_id` | UNIQUE | `UNIQUE (id)` |
| `uq_clinical_prescription_documents_id_prescription` | UNIQUE | `UNIQUE (id, prescription_id)` |
| `uq_clinical_prescription_documents_version` | UNIQUE | `UNIQUE (prescription_id, version_number)` |
| `uq_numeric_clinical_prescription_documents_internal_id__d990` | UNIQUE | `UNIQUE (internal_id, prescription_id_internal_id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_prescription_documents_file_object_id` | `CREATE INDEX ix_clinical_prescription_documents_file_object_id ON clinical.prescription_documents USING btree (file_object_id)` |
| `ix_clinical_prescription_documents_prescription` | `CREATE INDEX ix_clinical_prescription_documents_prescription ON clinical.prescription_documents USING btree (prescription_id)` |
| `pk_clinical_prescription_documents` | `CREATE UNIQUE INDEX pk_clinical_prescription_documents ON clinical.prescription_documents USING btree (internal_id)` |
| `prescription_document_file` | `CREATE UNIQUE INDEX prescription_document_file ON clinical.prescription_documents USING btree (file_object_id)` |
| `uq_clinical_prescription_documents_id` | `CREATE UNIQUE INDEX uq_clinical_prescription_documents_id ON clinical.prescription_documents USING btree (id)` |
| `uq_clinical_prescription_documents_id_prescription` | `CREATE UNIQUE INDEX uq_clinical_prescription_documents_id_prescription ON clinical.prescription_documents USING btree (id, prescription_id)` |
| `uq_clinical_prescription_documents_version` | `CREATE UNIQUE INDEX uq_clinical_prescription_documents_version ON clinical.prescription_documents USING btree (prescription_id, version_number)` |
| `uq_numeric_clinical_prescription_documents_internal_id__d990` | `CREATE UNIQUE INDEX uq_numeric_clinical_prescription_documents_internal_id__d990 ON clinical.prescription_documents USING btree (internal_id, prescription_id_internal_id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` |
| `prescription_document_guard` | `CREATE TRIGGER prescription_document_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION clinical.guard_document()` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
