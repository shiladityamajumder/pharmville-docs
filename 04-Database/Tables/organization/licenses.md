# `organization.licenses`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds licenses records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 22 columns, 19 constraints, 6 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_licenses_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_licenses_deleted_by_users) |
| `document_file_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_organization_licenses_document_file_id_file_objects) |
| `document_file_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_organization_licenses_document_file_id_file_objects_numeric); Numeric/public-key pair verification required |
| `expires_at` | `date` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `issued_at` | `date` | Yes | — | Time of issued | Support chronology, deadlines or audit evidence | See exact constraints |
| `issued_by` | `character varying(255)` | Yes | — | Actor associated with issued | Record responsibility for the change | See exact constraints |
| `license_number` | `character varying(128)` | No | — | Inferred: stores license number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `license_type` | `character varying(64)` | No | — | Inferred: stores license type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `location_id` | `uuid` | Yes | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_organization_licenses_location_id_locations) |
| `location_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_organization_licenses_location_id_locations_numeric); Numeric/public-key pair verification required |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_organization_licenses_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_organization_licenses_organization_id_organizations_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_licenses_updated_by_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the licenses business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.licenses` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_organization_licenses_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_organization_licenses_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_organization_licenses_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `organization_id` → `organization.organizations(id)` via `fk_organization_licenses_organization_id_organizations`; `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE`
- `document_file_id` → `platform.file_objects(id)` via `fk_organization_licenses_document_file_id_file_objects`; `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL`
- `location_id` → `organization.locations(id)` via `fk_organization_licenses_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL`
- `document_file_id_internal_id` → `platform.file_objects(internal_id)` via `fk_organization_licenses_document_file_id_file_objects_numeric`; `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_organization_licenses_location_id_locations_numeric`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL`
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_organization_licenses_organization_id_organizations_numeric`; `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE`

**Referenced by 2 FK constraints** (sample): `marketplace.seller_locations`, `marketplace.seller_locations`.

## `organization.licenses` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 22 columns, 19 constraints, 6 indexes, 4 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_licenses_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_licenses_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_organization_licenses_updated_by_users` |
| `organization_id` | `organization.organizations` | `fk_organization_licenses_organization_id_organizations` |
| `document_file_id` | `platform.file_objects` | `fk_organization_licenses_document_file_id_file_objects` |
| `location_id` | `organization.locations` | `fk_organization_licenses_location_id_locations` |
| `document_file_id_internal_id` | `platform.file_objects` | `fk_organization_licenses_document_file_id_file_objects_numeric` |
| `location_id_internal_id` | `organization.locations` | `fk_organization_licenses_location_id_locations_numeric` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_licenses_organization_id_organizations_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_licenses_license_dates` | CHECK | `CHECK (expires_at IS NULL OR issued_at IS NULL OR expires_at >= issued_at)` |
| `ck_organization_licenses_numeric_pair_document_file_id` | CHECK | `CHECK ((document_file_id IS NULL) = (document_file_id_internal_id IS NULL))` |
| `ck_organization_licenses_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_organization_licenses_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_organization_licenses_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_organization_licenses_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(license_number::text)) > 0 AND license_number::text = btrim(license_number::text))` |
| `ck_organization_licenses_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_organization_licenses_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_licenses_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_licenses_document_file_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (document_file_id) REFERENCES platform.file_objects(id) ON DELETE SET NULL` |
| `fk_organization_licenses_document_file_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (document_file_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE SET NULL` |
| `fk_organization_licenses_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE SET NULL` |
| `fk_organization_licenses_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE SET NULL` |
| `fk_organization_licenses_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_organization_licenses_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_organization_licenses_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `license_type_number` | UNIQUE | `UNIQUE (license_type, license_number)` |
| `pk_organization_licenses` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_licenses_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_organization_licenses_expires_at` | `CREATE INDEX ix_organization_licenses_expires_at ON organization.licenses USING btree (expires_at)` |
| `ix_organization_licenses_location_id` | `CREATE INDEX ix_organization_licenses_location_id ON organization.licenses USING btree (location_id)` |
| `ix_organization_licenses_organization_id` | `CREATE INDEX ix_organization_licenses_organization_id ON organization.licenses USING btree (organization_id)` |
| `license_type_number` | `CREATE UNIQUE INDEX license_type_number ON organization.licenses USING btree (license_type, license_number)` |
| `pk_organization_licenses` | `CREATE UNIQUE INDEX pk_organization_licenses ON organization.licenses USING btree (internal_id)` |
| `uq_organization_licenses_id` | `CREATE UNIQUE INDEX uq_organization_licenses_id ON organization.licenses USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON organization.licenses FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('license_number', '["license_type"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.licenses FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["document_file_id","document_file_id_internal_id","platform","file_objects"],["location_id","location_id_internal_id","organization","locations"],["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
