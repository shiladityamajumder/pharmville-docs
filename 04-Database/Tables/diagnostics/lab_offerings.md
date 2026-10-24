# `diagnostics.lab_offerings`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds lab offerings records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.lab_offerings |
| Classification | Mapping / Junction |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 19 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_lab_offerings_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_lab_offerings_deleted_by_users` |
| `home_collection_fee` | `numeric(14,2)` | No | `0` | Value of home collection fee | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | Exact constraints below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `lab_location_id` | `uuid` | No | — | Reference linking this record to lab locations | Ensures related business data can be joined and validated | FK → `diagnostics.lab_locations` via `fk_diagnostics_lab_offerings_lab_location_id_lab_locations` |
| `lab_location_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_locations` via `fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16` |
| `mrp` | `numeric(14,2)` | No | — | Inferred: stores mrp for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `provider_code` | `character varying(128)` | Yes | — | Code for provider | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `selling_price` | `numeric(14,2)` | No | — | Value of selling price | Enable pricing, reconciliation or reporting | Exact constraints below |
| `test_definition_id` | `uuid` | Yes | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` via `fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e` |
| `test_definition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` via `fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde` |
| `test_package_id` | `uuid` | Yes | — | Reference linking this record to test packages | Ensures related business data can be joined and validated | FK → `diagnostics.test_packages` via `fk_diagnostics_lab_offerings_test_package_id_test_packages` |
| `test_package_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_packages` via `fk_diagnostics_lab_offerings_test_package_id_test_packa_6522` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_lab_offerings_updated_by_users` |

## Record lifecycle and users

- **Created:** when the lab offerings business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.lab_offerings` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_lab_offerings_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_offerings_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16 | `lab_location_id_internal_id` | [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | `FOREIGN KEY (lab_location_id_internal_id) REFERENCES diagnostics.lab_locations(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_lab_offerings_lab_location_id_lab_locations | `lab_location_id` | [`diagnostics.lab_locations`](../../Tables/diagnostics/lab_locations.md) | `FOREIGN KEY (lab_location_id) REFERENCES diagnostics.lab_locations(id) ON DELETE CASCADE` |
| fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e | `test_definition_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde | `test_definition_id_internal_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_offerings_test_package_id_test_packa_6522 | `test_package_id_internal_id` | [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | `FOREIGN KEY (test_package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_offerings_test_package_id_test_packages | `test_package_id` | [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | `FOREIGN KEY (test_package_id) REFERENCES diagnostics.test_packages(id) ON DELETE RESTRICT` |
| fk_diagnostics_lab_offerings_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`diagnostics.diagnostic_order_items`](../../Tables/diagnostics/diagnostic_order_items.md) | fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0 | `offering_id_internal_id` | `internal_id` |
| [`diagnostics.diagnostic_order_items`](../../Tables/diagnostics/diagnostic_order_items.md) | fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings | `offering_id` | `id` |

## `diagnostics.lab_offerings` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_lab_offerings_created_by_users` |
| `deleted_by` | `identity.users` | `fk_diagnostics_lab_offerings_deleted_by_users` |
| `lab_location_id_internal_id` | `diagnostics.lab_locations` | `fk_diagnostics_lab_offerings_lab_location_id_lab_locati_de16` |
| `lab_location_id` | `diagnostics.lab_locations` | `fk_diagnostics_lab_offerings_lab_location_id_lab_locations` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_lab_offerings_test_definition_id_test_de_1d4e` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_lab_offerings_test_definition_id_test_de_dfde` |
| `test_package_id_internal_id` | `diagnostics.test_packages` | `fk_diagnostics_lab_offerings_test_package_id_test_packa_6522` |
| `test_package_id` | `diagnostics.test_packages` | `fk_diagnostics_lab_offerings_test_package_id_test_packages` |
| `updated_by` | `identity.users` | `fk_diagnostics_lab_offerings_updated_by_users` |

### Existing constraints

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
| `lab_offerings_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `lab_offerings_home_collection_fee_not_null` | NOT NULL | `NOT NULL home_collection_fee` |
| `lab_offerings_id_not_null` | NOT NULL | `NOT NULL id` |
| `lab_offerings_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `lab_offerings_is_active_not_null` | NOT NULL | `NOT NULL is_active` |
| `lab_offerings_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `lab_offerings_lab_location_id_internal_id_not_null` | NOT NULL | `NOT NULL lab_location_id_internal_id` |
| `lab_offerings_lab_location_id_not_null` | NOT NULL | `NOT NULL lab_location_id` |
| `lab_offerings_mrp_not_null` | NOT NULL | `NOT NULL mrp` |
| `lab_offerings_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `lab_offerings_selling_price_not_null` | NOT NULL | `NOT NULL selling_price` |
| `lab_offerings_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_lab_offerings_location` | btree | `(lab_location_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_lab_offerings_location ON diagnostics.lab_offerings USING btree (lab_location_id)` |
| `lab_test_or_package` | btree | `(lab_location_id, test_definition_id, test_package_id) NULLS NOT DISTINCT` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX lab_test_or_package ON diagnostics.lab_offerings USING btree (lab_location_id, test_definition_id, test_package_id) NULLS NOT DISTINCT` |
| `pk_diagnostics_lab_offerings` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_lab_offerings ON diagnostics.lab_offerings USING btree (internal_id)` |
| `uq_diagnostics_lab_offerings_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_lab_offerings_id ON diagnostics.lab_offerings USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_offerings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.lab_offerings FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.lab_offerings FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["lab_location_id","lab_location_id_internal_id","diagnostics","lab_locations"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
