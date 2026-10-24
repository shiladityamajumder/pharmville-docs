# `clinical.prescription_documents`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds prescription documents records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.prescription_documents |
| Classification | Mapping / Junction |
| Proposed business write owner | Prescription_Upload |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 16 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 8 indexes; 4 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescription_documents_created_by_users` |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_clinical_prescription_documents_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_clinical_prescription_documents_file_object_id_file__7c34` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` via `fk_clinical_prescription_documents_prescription_id_pres_4ec8` |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` via `fk_clinical_prescription_documents_prescription_id_pres_6c80` |
| `redaction_status` | `character varying(32)` | No | `'not_required'::character varying` | Inferred: stores redaction status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescription_documents_updated_by_users` |
| `version_number` | `integer` | No | — | Inferred: stores version number for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the prescription documents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescription_documents` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_prescription_documents_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_clinical_prescription_documents_file_object_id_file__7c34 | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| fk_clinical_prescription_documents_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| fk_clinical_prescription_documents_prescription_id_pres_4ec8 | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |
| fk_clinical_prescription_documents_prescription_id_pres_6c80 | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| fk_clinical_prescription_documents_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_document_rx | `prescription_document_id, prescription_id` | `id, prescription_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_document_rx_numeric | `prescription_document_id_internal_id, prescription_id_internal_id` | `internal_id, prescription_id_internal_id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_prescription_document_id_pres_1fab | `prescription_document_id` | `id` |
| [`clinical.order_reviews`](../../Tables/clinical/order_reviews.md) | fk_clinical_order_reviews_prescription_document_id_pres_f5a7 | `prescription_document_id_internal_id` | `internal_id` |

## `clinical.prescription_documents` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_clinical_prescription_documents_created_by_users` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_clinical_prescription_documents_file_object_id_file__7c34` |
| `file_object_id` | `platform.file_objects` | `fk_clinical_prescription_documents_file_object_id_file_objects` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_prescription_documents_prescription_id_pres_4ec8` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_prescription_documents_prescription_id_pres_6c80` |
| `updated_by` | `identity.users` | `fk_clinical_prescription_documents_updated_by_users` |

### Existing constraints

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
| `prescription_documents_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `prescription_documents_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `prescription_documents_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `prescription_documents_id_not_null` | NOT NULL | `NOT NULL id` |
| `prescription_documents_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `prescription_documents_prescription_id_internal_id_not_null` | NOT NULL | `NOT NULL prescription_id_internal_id` |
| `prescription_documents_prescription_id_not_null` | NOT NULL | `NOT NULL prescription_id` |
| `prescription_documents_redaction_status_not_null` | NOT NULL | `NOT NULL redaction_status` |
| `prescription_documents_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `prescription_documents_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `prescription_documents_version_number_not_null` | NOT NULL | `NOT NULL version_number` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_prescription_documents_file_object_id` | btree | `(file_object_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescription_documents_file_object_id ON clinical.prescription_documents USING btree (file_object_id)` |
| `ix_clinical_prescription_documents_prescription` | btree | `(prescription_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_prescription_documents_prescription ON clinical.prescription_documents USING btree (prescription_id)` |
| `pk_clinical_prescription_documents` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_prescription_documents ON clinical.prescription_documents USING btree (internal_id)` |
| `prescription_document_file` | btree | `(file_object_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX prescription_document_file ON clinical.prescription_documents USING btree (file_object_id)` |
| `uq_clinical_prescription_documents_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescription_documents_id ON clinical.prescription_documents USING btree (id)` |
| `uq_clinical_prescription_documents_id_prescription` | btree | `(id, prescription_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescription_documents_id_prescription ON clinical.prescription_documents USING btree (id, prescription_id)` |
| `uq_clinical_prescription_documents_version` | btree | `(prescription_id, version_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescription_documents_version ON clinical.prescription_documents USING btree (prescription_id, version_number)` |
| `uq_numeric_clinical_prescription_documents_internal_id__d990` | btree | `(internal_id, prescription_id_internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_numeric_clinical_prescription_documents_internal_id__d990 ON clinical.prescription_documents USING btree (internal_id, prescription_id_internal_id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` | O |
| `prescription_document_guard` | `CREATE TRIGGER prescription_document_guard BEFORE INSERT OR DELETE OR UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION clinical.guard_document()` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"],["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
