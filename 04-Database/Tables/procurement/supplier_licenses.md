# `procurement.supplier_licenses`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds supplier licenses records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.supplier_licenses |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 19 columns; 15 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_licenses_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_licenses_deleted_by_users` |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_procurement_supplier_licenses_document_file_id_file_objects` |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_procurement_supplier_licenses_document_file_id_file__c5bf` |
| `expires_at` | `date` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `issued_at` | `date` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | Exact constraints below |
| `license_number` | `character varying(128)` | No | — | Inferred: stores license number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `license_type` | `character varying(64)` | No | — | Inferred: stores license type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` via `fk_procurement_supplier_licenses_supplier_id_suppliers` |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` via `fk_procurement_supplier_licenses_supplier_id_suppliers_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_supplier_licenses_updated_by_users` |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the supplier licenses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.supplier_licenses` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_supplier_licenses_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_licenses_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_supplier_licenses_document_file_id_file__c5bf | `document_file_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| fk_procurement_supplier_licenses_document_file_id_file_objects | `document_file_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| fk_procurement_supplier_licenses_supplier_id_suppliers | `supplier_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE CASCADE` |
| fk_procurement_supplier_licenses_supplier_id_suppliers_numeric | `supplier_id_internal_id` | [`procurement.suppliers`](../../Tables/procurement/suppliers.md) | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE CASCADE` |
| fk_procurement_supplier_licenses_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `procurement.supplier_licenses` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_supplier_licenses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_procurement_supplier_licenses_deleted_by_users` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_procurement_supplier_licenses_document_file_id_file__c5bf` |
| `document_file_id` | `platform.file_objects` | `fk_procurement_supplier_licenses_document_file_id_file_objects` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_supplier_licenses_supplier_id_suppliers` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_supplier_licenses_supplier_id_suppliers_numeric` |
| `updated_by` | `identity.users` | `fk_procurement_supplier_licenses_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_supplier_licenses_numeric_pair_document_file_id` | CHECK | `CHECK ((document_file_id IS NULL) = (document_file_id_internal_id IS NULL))` |
| `ck_procurement_supplier_licenses_numeric_pair_supplier_id` | CHECK | `CHECK ((supplier_id IS NULL) = (supplier_id_internal_id IS NULL))` |
| `ck_procurement_supplier_licenses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_procurement_supplier_licenses_valid_dates` | CHECK | `CHECK (expires_at IS NULL OR issued_at IS NULL OR expires_at >= issued_at)` |
| `ck_procurement_supplier_licenses_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_procurement_supplier_licenses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_licenses_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_supplier_licenses_document_file_id_file__c5bf` | FOREIGN KEY | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_procurement_supplier_licenses_document_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_procurement_supplier_licenses_supplier_id_suppliers` | FOREIGN KEY | `FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE CASCADE` |
| `fk_procurement_supplier_licenses_supplier_id_suppliers_numeric` | FOREIGN KEY | `FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE CASCADE` |
| `fk_procurement_supplier_licenses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_supplier_licenses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `supplier_license` | UNIQUE | `UNIQUE (supplier_id, license_type, license_number)` |
| `uq_procurement_supplier_licenses_id` | UNIQUE | `UNIQUE (id)` |
| `supplier_licenses_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `supplier_licenses_id_not_null` | NOT NULL | `NOT NULL id` |
| `supplier_licenses_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `supplier_licenses_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `supplier_licenses_license_number_not_null` | NOT NULL | `NOT NULL license_number` |
| `supplier_licenses_license_type_not_null` | NOT NULL | `NOT NULL license_type` |
| `supplier_licenses_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `supplier_licenses_supplier_id_internal_id_not_null` | NOT NULL | `NOT NULL supplier_id_internal_id` |
| `supplier_licenses_supplier_id_not_null` | NOT NULL | `NOT NULL supplier_id` |
| `supplier_licenses_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `supplier_licenses_verification_status_not_null` | NOT NULL | `NOT NULL verification_status` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_supplier_licenses_expiry` | btree | `(expires_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_supplier_licenses_expiry ON procurement.supplier_licenses USING btree (expires_at)` |
| `ix_procurement_supplier_licenses_supplier` | btree | `(supplier_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_supplier_licenses_supplier ON procurement.supplier_licenses USING btree (supplier_id)` |
| `pk_procurement_supplier_licenses` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_supplier_licenses ON procurement.supplier_licenses USING btree (internal_id)` |
| `supplier_license` | btree | `(supplier_id, license_type, license_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX supplier_license ON procurement.supplier_licenses USING btree (supplier_id, license_type, license_number)` |
| `uq_procurement_supplier_licenses_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_supplier_licenses_id ON procurement.supplier_licenses USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.supplier_licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
