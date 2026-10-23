# procurement.supplier_licenses

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds supplier licenses records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 15 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_licenses_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_licenses_deleted_by_users) |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_procurement_supplier_licenses_document_file_id_file_objects) |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_procurement_supplier_licenses_document_file_id_file__c5bf); Numeric/public-key pair verification required |
| `expires_at` | `date` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `issued_at` | `date` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | See exact constraints |
| `license_number` | `character varying(128)` | No | — | Inferred: stores license number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `license_type` | `character varying(64)` | No | — | Inferred: stores license type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `supplier_id` | `uuid` | No | — | Reference linking this record to suppliers | Ensures related business data can be joined and validated | FK → `procurement.suppliers` (fk_procurement_supplier_licenses_supplier_id_suppliers) |
| `supplier_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.suppliers` (fk_procurement_supplier_licenses_supplier_id_suppliers_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_supplier_licenses_updated_by_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the supplier licenses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.supplier_licenses` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_procurement_supplier_licenses_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_procurement_supplier_licenses_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_supplier_licenses_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `supplier_id` → `procurement.suppliers(id)` via `fk_procurement_supplier_licenses_supplier_id_suppliers`; FOREIGN KEY (supplier_id) REFERENCES procurement.suppliers(id) ON DELETE CASCADE
- `document_file_id` → `platform.file_objects(id)` via `fk_procurement_supplier_licenses_document_file_id_file_objects`; FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL
- `document_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_procurement_supplier_licenses_document_file_id_file__c5bf`; FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL
- `supplier_id_internal_id` → `procurement.suppliers(internal_id)` via `fk_procurement_supplier_licenses_supplier_id_suppliers_numeric`; FOREIGN KEY (supplier_id_internal_id) REFERENCES procurement.suppliers(internal_id) ON DELETE CASCADE

## procurement.supplier_licenses — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 15 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_procurement_supplier_licenses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_procurement_supplier_licenses_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_supplier_licenses_updated_by_users` |
| `supplier_id` | `procurement.suppliers` | `fk_procurement_supplier_licenses_supplier_id_suppliers` |
| `document_file_id` | `platform.file_objects` | `fk_procurement_supplier_licenses_document_file_id_file_objects` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_procurement_supplier_licenses_document_file_id_file__c5bf` |
| `supplier_id_internal_id` | `procurement.suppliers` | `fk_procurement_supplier_licenses_supplier_id_suppliers_numeric` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_supplier_licenses_expiry` | `CREATE INDEX ix_procurement_supplier_licenses_expiry ON procurement.supplier_licenses USING btree (expires_at)` |
| `ix_procurement_supplier_licenses_supplier` | `CREATE INDEX ix_procurement_supplier_licenses_supplier ON procurement.supplier_licenses USING btree (supplier_id)` |
| `pk_procurement_supplier_licenses` | `CREATE UNIQUE INDEX pk_procurement_supplier_licenses ON procurement.supplier_licenses USING btree (internal_id)` |
| `supplier_license` | `CREATE UNIQUE INDEX supplier_license ON procurement.supplier_licenses USING btree (supplier_id, license_type, license_number)` |
| `uq_procurement_supplier_licenses_id` | `CREATE UNIQUE INDEX uq_procurement_supplier_licenses_id ON procurement.supplier_licenses USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.supplier_licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.supplier_licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["supplier_id","supplier_id_internal_id","procurement","suppliers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
