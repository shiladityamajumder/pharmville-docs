# diagnostics.lab_offerings

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds lab offerings records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 19 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_offerings_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_offerings_deleted_by_users) |
| `home_collection_fee` | `numeric(14,2)` | No | `0` | Value of home collection fee | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `lab_location_id` | `uuid` | No | — | Reference linking this record to lab locations | Ensures related business data can be joined and validated | FK → `diagnostics.lab_locations` (fk_diagnostics_lab_offerings_lab_location_id_lab_locations) |
| `lab_location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_locations` (fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16); Numeric/public-key pair verification required |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `provider_code` | `character varying(128)` | Yes | — | Code for provider | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `selling_price` | `numeric(14,2)` | No | — | Value of selling price | Enable pricing, reconciliation or reporting | See exact constraints |
| `test_definition_id` | `uuid` | Yes | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` (fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e) |
| `test_definition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` (fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde); Numeric/public-key pair verification required |
| `test_package_id` | `uuid` | Yes | — | Reference linking this record to test packages | Ensures related business data can be joined and validated | FK → `diagnostics.test_packages` (fk_diagnostics_lab_offerings_test_package_id_test_packages) |
| `test_package_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_packages` (fk_diagnostics_lab_offerings_test_package_id_test_packa_6522); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_lab_offerings_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the lab offerings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.lab_offerings` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_lab_offerings_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_diagnostics_lab_offerings_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_diagnostics_lab_offerings_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `lab_location_id` → `diagnostics.lab_locations(id)` via `fk_diagnostics_lab_offerings_lab_location_id_lab_locations`; FOREIGN KEY (lab_location_id) REFERENCES diagnostics.lab_locations(id) ON DELETE CASCADE
- `test_package_id` → `diagnostics.test_packages(id)` via `fk_diagnostics_lab_offerings_test_package_id_test_packages`; FOREIGN KEY (test_package_id) REFERENCES diagnostics.test_packages(id) ON DELETE RESTRICT
- `test_definition_id` → `diagnostics.test_definitions(id)` via `fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e`; FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT
- `lab_location_id_internal_id` → `diagnostics.lab_locations(internal_id)` via `fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16`; FOREIGN KEY (lab_location_id_internal_id) REFERENCES diagnostics.lab_locations(internal_id) ON DELETE CASCADE
- `test_definition_id_internal_id` → `diagnostics.test_definitions(internal_id)` via `fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde`; FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT
- `test_package_id_internal_id` → `diagnostics.test_packages(internal_id)` via `fk_diagnostics_lab_offerings_test_package_id_test_packa_6522`; FOREIGN KEY (test_package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE RESTRICT

**Referenced by 2 FK constraints** (sample): `diagnostics.diagnostic_order_items`, `diagnostics.diagnostic_order_items`.

## diagnostics.lab_offerings — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 21 columns, 19 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_lab_offerings_created_by_users` |
| `deleted_by` | `identity.users` | `fk_diagnostics_lab_offerings_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_lab_offerings_updated_by_users` |
| `lab_location_id` | `diagnostics.lab_locations` | `fk_diagnostics_lab_offerings_lab_location_id_lab_locations` |
| `test_package_id` | `diagnostics.test_packages` | `fk_diagnostics_lab_offerings_test_package_id_test_packages` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e` |
| `lab_location_id_internal_id` | `diagnostics.lab_locations` | `fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde` |
| `test_package_id_internal_id` | `diagnostics.test_packages` | `fk_diagnostics_lab_offerings_test_package_id_test_packa_6522` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_lab_offerings_finite_numeric_values` | CHECK | `CHECK ((mrp IS NULL OR (mrp <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (selling_price IS NULL OR (selling_price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (home_collection_fee IS NULL OR (home_collection_fee <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_diagnostics_lab_offerings_numeric_pair_lab_location_id` | CHECK | `CHECK ((lab_location_id IS NULL) = (lab_location_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_offerings_numeric_pair_test_definition_id` | CHECK | `CHECK ((test_definition_id IS NULL) = (test_definition_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_offerings_numeric_pair_test_package_id` | CHECK | `CHECK ((test_package_id IS NULL) = (test_package_id_internal_id IS NULL))` |
| `ck_diagnostics_lab_offerings_one_offering_type` | CHECK | `CHECK (num_nonnulls(test_definition_id, test_package_id) = 1)` |
| `ck_diagnostics_lab_offerings_prices_nonnegative` | CHECK | `CHECK (mrp >= 0::numeric AND selling_price >= 0::numeric)` |
| `ck_diagnostics_lab_offerings_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_lab_offerings_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_offerings_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16` | FOREIGN KEY | `FOREIGN KEY (lab_location_id_internal_id) REFERENCES diagnostics.lab_locations(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_lab_offerings_lab_location_id_lab_locations` | FOREIGN KEY | `FOREIGN KEY (lab_location_id) REFERENCES diagnostics.lab_locations(id) ON DELETE CASCADE` |
| `fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e` | FOREIGN KEY | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde` | FOREIGN KEY | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_offerings_test_package_id_test_packa_6522` | FOREIGN KEY | `FOREIGN KEY (test_package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_offerings_test_package_id_test_packages` | FOREIGN KEY | `FOREIGN KEY (test_package_id) REFERENCES diagnostics.test_packages(id) ON DELETE RESTRICT` |
| `fk_diagnostics_lab_offerings_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `lab_test_or_package` | UNIQUE | `UNIQUE NULLS NOT DISTINCT (lab_location_id, test_definition_id, test_package_id)` |
| `pk_diagnostics_lab_offerings` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_lab_offerings_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_lab_offerings_location` | `CREATE INDEX ix_diagnostics_lab_offerings_location ON diagnostics.lab_offerings USING btree (lab_location_id)` |
| `lab_test_or_package` | `CREATE UNIQUE INDEX lab_test_or_package ON diagnostics.lab_offerings USING btree (lab_location_id, test_definition_id, test_package_id) NULLS NOT DISTINCT` |
| `pk_diagnostics_lab_offerings` | `CREATE UNIQUE INDEX pk_diagnostics_lab_offerings ON diagnostics.lab_offerings USING btree (internal_id)` |
| `uq_diagnostics_lab_offerings_id` | `CREATE UNIQUE INDEX uq_diagnostics_lab_offerings_id ON diagnostics.lab_offerings USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_offerings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.lab_offerings FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_offerings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
