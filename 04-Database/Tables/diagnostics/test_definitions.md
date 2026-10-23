# diagnostics.test_definitions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds test definitions records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 19 columns, 6 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_test_definitions_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_test_definitions_deleted_by_users) |
| `fasting_required` | `boolean` | No | `false` | Inferred: stores fasting required for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(255)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `preparation_instructions` | `text` | Yes | — | Inferred: stores preparation instructions for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `report_schema` | `jsonb` | No | `'{}'::jsonb` | Structured report schema information | Retain a versioned payload or relevant details | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `sample_type` | `character varying(64)` | Yes | — | Inferred: stores sample type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `test_type` | `character varying(32)` | No | — | Inferred: stores test type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `turnaround_minutes` | `integer` | Yes | — | Inferred: stores turnaround minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_test_definitions_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the test definitions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.test_definitions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_test_definitions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `deleted_by` → `identity.users(id)` via `fk_diagnostics_test_definitions_deleted_by_users`; FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_diagnostics_test_definitions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

**Referenced by 8 FK constraints** (sample): `diagnostics.test_package_items`, `diagnostics.lab_offerings`, `diagnostics.diagnostic_order_items`, `diagnostics.diagnostic_result_values`, `diagnostics.diagnostic_order_items`, `diagnostics.diagnostic_result_values`, `diagnostics.lab_offerings`, `diagnostics.test_package_items`.

## diagnostics.test_definitions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 19 columns, 6 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_test_definitions_created_by_users` |
| `deleted_by` | `identity.users` | `fk_diagnostics_test_definitions_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_test_definitions_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_test_definitions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_test_definitions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_definitions_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_definitions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_test_definitions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_test_definitions_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_tests_name` | `CREATE INDEX ix_diagnostics_tests_name ON diagnostics.test_definitions USING btree (name)` |
| `pk_diagnostics_test_definitions` | `CREATE UNIQUE INDEX pk_diagnostics_test_definitions ON diagnostics.test_definitions USING btree (internal_id)` |
| `uq_diagnostics_test_code_active` | `CREATE UNIQUE INDEX uq_diagnostics_test_code_active ON diagnostics.test_definitions USING btree (code) WHERE is_deleted = false` |
| `uq_diagnostics_test_definitions_id` | `CREATE UNIQUE INDEX uq_diagnostics_test_definitions_id ON diagnostics.test_definitions USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.test_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.test_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.test_definitions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
