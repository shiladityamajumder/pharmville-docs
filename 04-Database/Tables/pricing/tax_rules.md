# `pricing.tax_rules`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds tax rules records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 18 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `country_code` | `character varying(2)` | No | `'IN'::character varying` | Code for country | Link to controlled business classification or an external reference | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_tax_rules_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_tax_rules_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `rate` | `numeric(7,4)` | No | — | Inferred: stores rate for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reverse_charge` | `boolean` | No | `false` | Inferred: stores reverse charge for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `state_code` | `character varying(8)` | Yes | — | Code for state | Link to controlled business classification or an external reference | See exact constraints |
| `tax_code` | `character varying(64)` | No | — | Code for tax | Link to controlled business classification or an external reference | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_tax_rules_updated_by_users) |
| `valid_from` | `date` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `date` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the tax rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.tax_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_pricing_tax_rules_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_pricing_tax_rules_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_pricing_tax_rules_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

## `pricing.tax_rules` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 18 columns, 9 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_tax_rules_created_by_users` |
| `deleted_by` | `identity.users` | `fk_pricing_tax_rules_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_tax_rules_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_tax_rules_finite_numeric_values` | CHECK | `CHECK (rate IS NULL OR (rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_pricing_tax_rules_rate_range` | CHECK | `CHECK (rate >= 0::numeric AND rate <= 100::numeric)` |
| `ck_pricing_tax_rules_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_pricing_tax_rules_valid_window` | CHECK | `CHECK (valid_until IS NULL OR valid_until >= valid_from)` |
| `fk_pricing_tax_rules_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_tax_rules_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_tax_rules_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_pricing_tax_rules` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_pricing_tax_rules_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_pricing_tax_rules_code_region` | `CREATE INDEX ix_pricing_tax_rules_code_region ON pricing.tax_rules USING btree (tax_code, country_code, state_code)` |
| `pk_pricing_tax_rules` | `CREATE UNIQUE INDEX pk_pricing_tax_rules ON pricing.tax_rules USING btree (internal_id)` |
| `uq_pricing_tax_rules_id` | `CREATE UNIQUE INDEX uq_pricing_tax_rules_id ON pricing.tax_rules USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.tax_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.tax_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.tax_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
