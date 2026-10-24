# `diagnostics.test_package_items`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds test package items records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 12 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_test_package_items_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `package_id` | `uuid` | No | — | Reference linking this record to test packages | Ensures related business data can be joined and validated | FK → `diagnostics.test_packages` (fk_diagnostics_test_package_items_package_id_test_packages) |
| `package_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_packages` (fk_diagnostics_test_package_items_package_id_test_packa_0d15); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `test_definition_id` | `uuid` | No | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` (fk_diagnostics_test_package_items_test_definition_id_te_2de4) |
| `test_definition_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` (fk_diagnostics_test_package_items_test_definition_id_te_c996); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_test_package_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the test package items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.test_package_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_test_package_items_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_diagnostics_test_package_items_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `package_id` → `diagnostics.test_packages(id)` via `fk_diagnostics_test_package_items_package_id_test_packages`; `FOREIGN KEY (package_id) REFERENCES diagnostics.test_packages(id) ON DELETE CASCADE`
- `test_definition_id` → `diagnostics.test_definitions(id)` via `fk_diagnostics_test_package_items_test_definition_id_te_2de4`; `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT`
- `package_id_internal_id` → `diagnostics.test_packages(internal_id)` via `fk_diagnostics_test_package_items_package_id_test_packa_0d15`; `FOREIGN KEY (package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE CASCADE`
- `test_definition_id_internal_id` → `diagnostics.test_definitions(internal_id)` via `fk_diagnostics_test_package_items_test_definition_id_te_c996`; `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT`

## `diagnostics.test_package_items` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 12 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_test_package_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_test_package_items_updated_by_users` |
| `package_id` | `diagnostics.test_packages` | `fk_diagnostics_test_package_items_package_id_test_packages` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_test_package_items_test_definition_id_te_2de4` |
| `package_id_internal_id` | `diagnostics.test_packages` | `fk_diagnostics_test_package_items_package_id_test_packa_0d15` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_test_package_items_test_definition_id_te_c996` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_test_package_items_numeric_pair_package_id` | CHECK | `CHECK ((package_id IS NULL) = (package_id_internal_id IS NULL))` |
| `ck_diagnostics_test_package_items_numeric_pair_test_def_f3d7` | CHECK | `CHECK ((test_definition_id IS NULL) = (test_definition_id_internal_id IS NULL))` |
| `ck_diagnostics_test_package_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_test_package_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_package_items_package_id_test_packa_0d15` | FOREIGN KEY | `FOREIGN KEY (package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_test_package_items_package_id_test_packages` | FOREIGN KEY | `FOREIGN KEY (package_id) REFERENCES diagnostics.test_packages(id) ON DELETE CASCADE` |
| `fk_diagnostics_test_package_items_test_definition_id_te_2de4` | FOREIGN KEY | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_package_items_test_definition_id_te_c996` | FOREIGN KEY | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_test_package_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `package_test` | UNIQUE | `UNIQUE (package_id, test_definition_id)` |
| `pk_diagnostics_test_package_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_test_package_items_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_package_items_package` | `CREATE INDEX ix_diagnostics_package_items_package ON diagnostics.test_package_items USING btree (package_id)` |
| `package_test` | `CREATE UNIQUE INDEX package_test ON diagnostics.test_package_items USING btree (package_id, test_definition_id)` |
| `pk_diagnostics_test_package_items` | `CREATE UNIQUE INDEX pk_diagnostics_test_package_items ON diagnostics.test_package_items USING btree (internal_id)` |
| `uq_diagnostics_test_package_items_id` | `CREATE UNIQUE INDEX uq_diagnostics_test_package_items_id ON diagnostics.test_package_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.test_package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["package_id","package_id_internal_id","diagnostics","test_packages"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.test_package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.test_package_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["package_id","package_id_internal_id","diagnostics","test_packages"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
