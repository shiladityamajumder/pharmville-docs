# `diagnostics.diagnostic_order_items`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds diagnostic order items records within the diagnostics domain (tests and laboratory services). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | diagnostics.diagnostic_order_items |
| Classification | Transactional |
| Proposed business write owner | Future diagnostics owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 21 columns; 20 PK/FK/UQ/CHECK/exclusion constraints; 13 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_order_items_created_by_users` |
| `diagnostic_order_id` | `uuid` | No | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4` |
| `diagnostic_order_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` via `fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff` |
| `discount_amount` | `numeric(14,2)` | No | `0` | Value of discount amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `item_snapshot` | `jsonb` | No | — | Structured item snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `line_total` | `numeric(16,2)` | No | — | Value of line total | Enable pricing, reconciliation or reporting | Exact constraints below |
| `offering_id` | `uuid` | Yes | — | Reference linking this record to lab offerings | Ensures related business data can be joined and validated | FK → `diagnostics.lab_offerings` via `fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings` |
| `offering_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.lab_offerings` via `fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'created'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `tax_amount` | `numeric(14,2)` | No | `0` | Value of tax amount | Enable pricing, reconciliation or reporting | Exact constraints below |
| `test_definition_id` | `uuid` | Yes | — | Reference linking this record to test definitions | Ensures related business data can be joined and validated | FK → `diagnostics.test_definitions` via `fk_diagnostics_diagnostic_order_items_test_definition_i_2bac` |
| `test_definition_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_definitions` via `fk_diagnostics_diagnostic_order_items_test_definition_i_f14c` |
| `test_package_id` | `uuid` | Yes | — | Reference linking this record to test packages | Ensures related business data can be joined and validated | FK → `diagnostics.test_packages` via `fk_diagnostics_diagnostic_order_items_test_package_id_t_979e` |
| `test_package_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.test_packages` via `fk_diagnostics_diagnostic_order_items_test_package_id_t_5554` |
| `unit_price` | `numeric(14,2)` | No | — | Value of unit price | Enable pricing, reconciliation or reporting | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_diagnostics_diagnostic_order_items_updated_by_users` |

## Record lifecycle and users

- **Created:** when the diagnostic order items business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `diagnostics.diagnostic_order_items` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_diagnostics_diagnostic_order_items_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4 | `diagnostic_order_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE CASCADE` |
| fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff | `diagnostic_order_id_internal_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE CASCADE` |
| fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0 | `offering_id_internal_id` | [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | `FOREIGN KEY (offering_id_internal_id) REFERENCES diagnostics.lab_offerings(internal_id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings | `offering_id` | [`diagnostics.lab_offerings`](../../Tables/diagnostics/lab_offerings.md) | `FOREIGN KEY (offering_id) REFERENCES diagnostics.lab_offerings(id) ON DELETE SET NULL` |
| fk_diagnostics_diagnostic_order_items_test_definition_i_2bac | `test_definition_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id) REFERENCES diagnostics.test_definitions(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_order_items_test_definition_i_f14c | `test_definition_id_internal_id` | [`diagnostics.test_definitions`](../../Tables/diagnostics/test_definitions.md) | `FOREIGN KEY (test_definition_id_internal_id) REFERENCES diagnostics.test_definitions(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_order_items_test_package_id_t_5554 | `test_package_id_internal_id` | [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | `FOREIGN KEY (test_package_id_internal_id) REFERENCES diagnostics.test_packages(internal_id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_order_items_test_package_id_t_979e | `test_package_id` | [`diagnostics.test_packages`](../../Tables/diagnostics/test_packages.md) | `FOREIGN KEY (test_package_id) REFERENCES diagnostics.test_packages(id) ON DELETE RESTRICT` |
| fk_diagnostics_diagnostic_order_items_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `diagnostics.diagnostic_order_items` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_diagnostics_diagnostic_order_items_created_by_users` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_diagnostic_order_items_diagnostic_order__0be4` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_diagnostics_diagnostic_order_items_diagnostic_order__67ff` |
| `offering_id_internal_id` | `diagnostics.lab_offerings` | `fk_diagnostics_diagnostic_order_items_offering_id_lab_o_52c0` |
| `offering_id` | `diagnostics.lab_offerings` | `fk_diagnostics_diagnostic_order_items_offering_id_lab_offerings` |
| `test_definition_id` | `diagnostics.test_definitions` | `fk_diagnostics_diagnostic_order_items_test_definition_i_2bac` |
| `test_definition_id_internal_id` | `diagnostics.test_definitions` | `fk_diagnostics_diagnostic_order_items_test_definition_i_f14c` |
| `test_package_id_internal_id` | `diagnostics.test_packages` | `fk_diagnostics_diagnostic_order_items_test_package_id_t_5554` |
| `test_package_id` | `diagnostics.test_packages` | `fk_diagnostics_diagnostic_order_items_test_package_id_t_979e` |
| `updated_by` | `identity.users` | `fk_diagnostics_diagnostic_order_items_updated_by_users` |

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
| `diagnostic_order_items_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `diagnostic_order_items_diagnostic_order_id_internal_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id_internal_id` |
| `diagnostic_order_items_diagnostic_order_id_not_null` | NOT NULL | `NOT NULL diagnostic_order_id` |
| `diagnostic_order_items_discount_amount_not_null` | NOT NULL | `NOT NULL discount_amount` |
| `diagnostic_order_items_id_not_null` | NOT NULL | `NOT NULL id` |
| `diagnostic_order_items_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `diagnostic_order_items_item_snapshot_not_null` | NOT NULL | `NOT NULL item_snapshot` |
| `diagnostic_order_items_line_total_not_null` | NOT NULL | `NOT NULL line_total` |
| `diagnostic_order_items_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `diagnostic_order_items_status_not_null` | NOT NULL | `NOT NULL status` |
| `diagnostic_order_items_tax_amount_not_null` | NOT NULL | `NOT NULL tax_amount` |
| `diagnostic_order_items_unit_price_not_null` | NOT NULL | `NOT NULL unit_price` |
| `diagnostic_order_items_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_diagnostics_order_items_order` | btree | `(diagnostic_order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_diagnostics_order_items_order ON diagnostics.diagnostic_order_items USING btree (diagnostic_order_id)` |
| `pk_diagnostics_diagnostic_order_items` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_diagnostics_diagnostic_order_items ON diagnostics.diagnostic_order_items USING btree (internal_id)` |
| `uq_diagnostics_diagnostic_order_items_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_diagnostics_diagnostic_order_items_id ON diagnostics.diagnostic_order_items USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["offering_id","offering_id_internal_id","diagnostics","lab_offerings"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON diagnostics.diagnostic_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON diagnostics.diagnostic_order_items FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["offering_id","offering_id_internal_id","diagnostics","lab_offerings"],["test_definition_id","test_definition_id_internal_id","diagnostics","test_definitions"],["test_package_id","test_package_id_internal_id","diagnostics","test_packages"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
