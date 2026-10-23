# organization.locations

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds locations records within the organization domain (operating companies, sites and licenses). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 11 constraints, 5 indexes, 4 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `address_json` | `jsonb` | No | — | Structured address json information | Retain a versioned payload or relevant details | See exact constraints |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_locations_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_locations_deleted_by_users) |
| `geo_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured geo metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `hfr_id` | `character varying(128)` | Yes | — | Identifier associated with hfr | Link the event or entity to its subject; verify constraints | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `location_type` | `character varying(32)` | No | — | Inferred: stores location type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `name` | `character varying(150)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `organization_id` | `uuid` | No | — | Reference linking this record to organizations | Ensures related business data can be joined and validated | FK → `organization.organizations` (fk_organization_locations_organization_id_organizations) |
| `organization_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.organizations` (fk_organization_locations_organization_id_organizations_numeric); Numeric/public-key pair verification required |
| `postal_code` | `character varying(16)` | Yes | — | Code for postal | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `timezone` | `character varying(64)` | No | `'Asia/Kolkata'::character varying` | Inferred: stores timezone for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_organization_locations_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the locations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Admin_CMS, Order_Operations, Delivery_Operations, Authentication_Access. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `organization.locations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_organization_locations_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_organization_locations_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_organization_locations_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `organization_id` → `organization.organizations(id)` via `fk_organization_locations_organization_id_organizations`; FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE
- `organization_id_internal_id` → `organization.organizations(internal_id)` via `fk_organization_locations_organization_id_organizations_numeric`; FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE

**Referenced by 16 FK constraints** (sample): `appointment.practitioner_services`, `clinical.practitioner_organizations`, `compliance.regulatory_registrations`, `diagnostics.lab_locations`, `marketplace.seller_locations`, `organization.memberships`, `organization.licenses`, `warehouse.warehouses`, `appointment.practitioner_services`, `clinical.practitioner_organizations`, `compliance.regulatory_registrations`, `diagnostics.lab_locations`.

## organization.locations — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 11 constraints, 5 indexes, 4 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_organization_locations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_organization_locations_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_organization_locations_updated_by_users` |
| `organization_id` | `organization.organizations` | `fk_organization_locations_organization_id_organizations` |
| `organization_id_internal_id` | `organization.organizations` | `fk_organization_locations_organization_id_organizations_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_organization_locations_numeric_pair_organization_id` | CHECK | `CHECK ((organization_id IS NULL) = (organization_id_internal_id IS NULL))` |
| `ck_organization_locations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_organization_locations_stable_code_nonblank_trimmed` | CHECK | `CHECK (length(btrim(code::text)) > 0 AND code::text = btrim(code::text))` |
| `fk_organization_locations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_locations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_organization_locations_organization_id_organizations` | FOREIGN KEY | `FOREIGN KEY (organization_id) REFERENCES organization.organizations(id) ON DELETE CASCADE` |
| `fk_organization_locations_organization_id_organizations_numeric` | FOREIGN KEY | `FOREIGN KEY (organization_id_internal_id) REFERENCES organization.organizations(internal_id) ON DELETE CASCADE` |
| `fk_organization_locations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `organization_location_code` | UNIQUE | `UNIQUE (organization_id, code)` |
| `pk_organization_locations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_organization_locations_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_organization_locations_organization_id` | `CREATE INDEX ix_organization_locations_organization_id ON organization.locations USING btree (organization_id)` |
| `ix_organization_locations_postal_code` | `CREATE INDEX ix_organization_locations_postal_code ON organization.locations USING btree (postal_code)` |
| `organization_location_code` | `CREATE UNIQUE INDEX organization_location_code ON organization.locations USING btree (organization_id, code)` |
| `pk_organization_locations` | `CREATE UNIQUE INDEX pk_organization_locations ON organization.locations USING btree (internal_id)` |
| `uq_organization_locations_id` | `CREATE UNIQUE INDEX uq_organization_locations_id ON organization.locations USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |
| `stable_code_guard` | `CREATE TRIGGER stable_code_guard BEFORE INSERT OR DELETE OR UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.guard_stable_code('code', '["organization_id"]')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON organization.locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["organization_id","organization_id_internal_id","organization","organizations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
