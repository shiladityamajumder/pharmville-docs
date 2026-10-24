# `diagnostics.diagnostic_order_items`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds diagnostic order items records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 20 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_diagnostic_order_items_created_by_users) |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` (fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4) |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` (fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff); Numeric/public-key pair verification required |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `item_snapshot` | `jsonb` | No | — | Structured item snapshot information | Retain a versioned payload or relevant details | See exact constraints |
| `line_total` | `numeric(16,2)` | No | — | Value of line total | Enable pricing, reconciliation or reporting | See exact constraints |
| `offering_id` | `uuid` | Yes | — | Reference linking this record to lab offerings | Ensures related business data can be joined and validated | FK → `diagnostics.lab_offerings` (fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings) |
| `offering_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_offerings` (fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0); Numeric/public-key pair verification required |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `tax_amount` | `numeric(14,2)` | No | `0` | Value of tax amount | Enable pricing, reconciliation or reporting | See exact constraints |
| `test_definition_id` | `uuid` | Yes | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` (fk_diagnostics_diagnostic_order_items_test_definition_i_2bac) |
| `test_definition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` (fk_diagnostics_diagnostic_order_items_test_definition_i_f14c); Numeric/public-key pair verification required |
| `test_package_id` | `uuid` | Yes | — | Reference linking this record to test packages | Ensures related business data can be joined and validated | FK → `diagnostics.test_packages` (fk_diagnostics_diagnostic_order_items_test_package_id_t_979e) |
| `test_package_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_packages` (fk_diagnostics_diagnostic_order_items_test_package_id_t_5554); Numeric/public-key pair verification required |
| `unit_price` | `numeric(14,2)` | No | — | Value of unit price | Enable pricing, reconciliation or reporting | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_diagnostics_diagnostic_order_items_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the diagnostic order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.diagnostic_order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_diagnostics_diagnostic_order_items_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_diagnostics_diagnostic_order_items_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `test_definition_id` → `diagnostics.test_definitions(id)` via `fk_diagnostics_diagnostic_order_items_test_definition_i_2bac`; `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT`
- `test_package_id` → `diagnostics.test_packages(id)` via `fk_diagnostics_diagnostic_order_items_test_package_id_t_979e`; `FOREIGN KEY (test_package_id) REFERENCES diagnostics.test_packages(id) ON DELETE RESTRICT`
- `offering_id` → `diagnostics.lab_offerings(id)` via `fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings`; `FOREIGN KEY (offering_id) REFERENCES diagnostics.lab_offerings(id) ON DELETE SET NULL`
- `diagnostic_order_id` → `diagnostics.diagnostic_orders(id)` via `fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4`; `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE`
- `diagnostic_order_id_internal_id` → `diagnostics.diagnostic_orders(internal_id)` via `fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff`; `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE`
- `offering_id_internal_id` → `diagnostics.lab_offerings(internal_id)` via `fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0`; `FOREIGN KEY (offering_id_internal_id) REFERENCES diagnostics.lab_offerings(internal_id) ON DELETE SET NULL`
- `test_definition_id_internal_id` → `diagnostics.test_definitions(internal_id)` via `fk_diagnostics_diagnostic_order_items_test_definition_i_f14c`; `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT`
- `test_package_id_internal_id` → `diagnostics.test_packages(internal_id)` via `fk_diagnostics_diagnostic_order_items_test_package_id_t_5554`; `FOREIGN KEY (test_package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE RESTRICT`

## `diagnostics.diagnostic_order_items` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 20 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_diagnostic_order_items_created_by_users` |
| `updated_by` | `identity.users` | `fk_diagnostics_diagnostic_order_items_updated_by_users` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_diagnostic_order_items_test_definition_i_2bac` |
| `test_package_id` | `diagnostics.test_packages` | `fk_diagnostics_diagnostic_order_items_test_package_id_t_979e` |
| `offering_id` | `diagnostics.lab_offerings` | `fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff` |
| `offering_id_internal_id` | `diagnostics.lab_offerings` | `fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_diagnostic_order_items_test_definition_i_f14c` |
| `test_package_id_internal_id` | `diagnostics.test_packages` | `fk_diagnostics_diagnostic_order_items_test_package_id_t_5554` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_diagnostics_diagnostic_order_items_finite_numeric_values` | CHECK | `CHECK ((unit_price IS NULL OR (unit_price <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (discount_amount IS NULL OR (discount_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (tax_amount IS NULL OR (tax_amount <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (line_total IS NULL OR (line_total <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_diagnostics_diagnostic_order_items_numeric_pair_diag_dcfc` | CHECK | `CHECK ((diagnostic_order_id IS NULL) = (diagnostic_order_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_order_items_numeric_pair_offering_id` | CHECK | `CHECK ((offering_id IS NULL) = (offering_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_order_items_numeric_pair_test_e14d` | CHECK | `CHECK ((test_package_id IS NULL) = (test_package_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_order_items_numeric_pair_test_e68f` | CHECK | `CHECK ((test_definition_id IS NULL) = (test_definition_id_internal_id IS NULL))` |
| `ck_diagnostics_diagnostic_order_items_one_item_type` | CHECK | `CHECK (num_nonnulls(test_definition_id, test_package_id) = 1)` |
| `ck_diagnostics_diagnostic_order_items_prices_nonnegative` | CHECK | `CHECK (unit_price >= 0::numeric AND line_total >= 0::numeric)` |
| `ck_diagnostics_diagnostic_order_items_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_diagnostics_diagnostic_order_items_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| `fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| `fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0` | FOREIGN KEY | `FOREIGN KEY (offering_id_internal_id) REFERENCES diagnostics.lab_offerings(internal_id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings` | FOREIGN KEY | `FOREIGN KEY (offering_id) REFERENCES diagnostics.lab_offerings(id) ON DELETE SET NULL` |
| `fk_diagnostics_diagnostic_order_items_test_definition_i_2bac` | FOREIGN KEY | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_order_items_test_definition_i_f14c` | FOREIGN KEY | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_order_items_test_package_id_t_5554` | FOREIGN KEY | `FOREIGN KEY (test_package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_order_items_test_package_id_t_979e` | FOREIGN KEY | `FOREIGN KEY (test_package_id) REFERENCES diagnostics.test_packages(id) ON DELETE RESTRICT` |
| `fk_diagnostics_diagnostic_order_items_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_diagnostics_diagnostic_order_items` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_diagnostics_diagnostic_order_items_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_diagnostics_order_items_order` | `CREATE INDEX ix_diagnostics_order_items_order ON diagnostics.diagnostic_order_items USING btree (diagnostic_order_id)` |
| `pk_diagnostics_diagnostic_order_items` | `CREATE UNIQUE INDEX pk_diagnostics_diagnostic_order_items ON diagnostics.diagnostic_order_items USING btree (internal_id)` |
| `uq_diagnostics_diagnostic_order_items_id` | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_order_items_id ON diagnostics.diagnostic_order_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["offering_id","offering_id_internal_id","diagnostics","lab_offerings"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.diagnostic_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["offering_id","offering_id_internal_id","diagnostics","lab_offerings"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
