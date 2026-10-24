# `diagnostics.lab_locations`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds lab locations records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 13 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `collection_supported` | `boolean` | No | `true` | Inferred: stores collection supported for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_locations_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_locations_deleted_by_users) |
| `home_collection_supported` | `boolean` | No | `false` | Inferred: stores home collection supported for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `lab_provider_id` | `uuid` | No | — | Reference linking this record to lab providers | Ensures related business data can be joined and validated | FK → `diagnostics.lab_providers` (fk_diagnostics_lab_locations_lab_provider_id_lab_providers) |
| `lab_provider_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_providers` (fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7); Numeric/public-key pair verification required |
| `location_id` | `uuid` | No | — | Reference linking this record to locations | Ensures related business data can be joined and validated | FK → `organization.locations` (fk_diagnostics_lab_locations_location_id_locations) |
| `location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `organization.locations` (fk_diagnostics_lab_locations_location_id_locations_numeric); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_locations_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the lab locations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.lab_locations` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_lab_locations_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_diagnostics_lab_locations_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_diagnostics_lab_locations_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `location_id` → `organization.locations(id)` via `fk_diagnostics_lab_locations_location_id_locations`; `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT`
- `lab_provider_id` → `diagnostics.lab_providers(id)` via `fk_diagnostics_lab_locations_lab_provider_id_lab_providers`; `FOREIGN KEY (lab_provider_id) REFERENCES diagnostics.lab_providers(id) ON DELETE CASCADE`
- `lab_provider_id_internal_id` → `diagnostics.lab_providers(internal_id)` via `fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7`; `FOREIGN KEY (lab_provider_id_internal_id) REFERENCES diagnostics.lab_providers(internal_id) ON DELETE CASCADE`
- `location_id_internal_id` → `organization.locations(internal_id)` via `fk_diagnostics_lab_locations_location_id_locations_numeric`; `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT`

**Referenced by 4 FK constraints** (sample): `diagnostics.lab_offerings`, `diagnostics.diagnostic_orders`, `diagnostics.diagnostic_orders`, `diagnostics.lab_offerings`.

## `diagnostics.lab_locations` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 13 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_lab_locations_created_by_users` |
| `deleted_by` | `identity.users` | `fk_diagnostics_lab_locations_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_lab_locations_updated_by_users` |
| `location_id` | `organization.locations` | `fk_diagnostics_lab_locations_location_id_locations` |
| `lab_provider_id` | `diagnostics.lab_providers` | `fk_diagnostics_lab_locations_lab_provider_id_lab_providers` |
| `lab_provider_id_internal_id` | `diagnostics.lab_providers` | `fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7` |
| `location_id_internal_id` | `organization.locations` | `fk_diagnostics_lab_locations_location_id_locations_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_lab_locations_numeric_pair_lab_provider_id` | CHECK | `CHECK ((lab_provider_id IS NULL) = (lab_provider_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_locations_numeric_pair_location_id` | CHECK | `CHECK ((location_id IS NULL) = (location_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_locations_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_lab_locations_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_lab_provider_id_lab_provid_d7d7` | FOREIGN KEY | `FOREIGN KEY (lab_provider_id_internal_id) REFERENCES diagnostics.lab_providers(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_lab_locations_lab_provider_id_lab_providers` | FOREIGN KEY | `FOREIGN KEY (lab_provider_id) REFERENCES diagnostics.lab_providers(id) ON DELETE CASCADE` |
| `fk_diagnostics_lab_locations_location_id_locations` | FOREIGN KEY | `FOREIGN KEY (location_id) REFERENCES organization.locations(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_location_id_locations_numeric` | FOREIGN KEY | `FOREIGN KEY (location_id_internal_id) REFERENCES organization.locations(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_locations_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `lab_provider_location` | UNIQUE | `UNIQUE (lab_provider_id, location_id)` |
| `pk_diagnostics_lab_locations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_lab_locations_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_lab_locations_provider` | `CREATE INDEX ix_diagnostics_lab_locations_provider ON diagnostics.lab_locations USING btree (lab_provider_id)` |
| `lab_provider_location` | `CREATE UNIQUE INDEX lab_provider_location ON diagnostics.lab_locations USING btree (lab_provider_id, location_id)` |
| `pk_diagnostics_lab_locations` | `CREATE UNIQUE INDEX pk_diagnostics_lab_locations ON diagnostics.lab_locations USING btree (internal_id)` |
| `uq_diagnostics_lab_locations_id` | `CREATE UNIQUE INDEX uq_diagnostics_lab_locations_id ON diagnostics.lab_locations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_provider_id","lab_provider_id_internal_id","diagnostics","lab_providers"],["location_id","location_id_internal_id","organization","locations"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.lab_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_locations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_provider_id","lab_provider_id_internal_id","diagnostics","lab_providers"],["location_id","location_id_internal_id","organization","locations"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
