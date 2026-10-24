# `pricing.tax_rules`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds tax rules records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.tax_rules |
| Classification | Configuration |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 18 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `country_code` | `character varying(2)` | No | `'IN'::character varying` | Code for country | Link to controlled business classification or an external reference | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_tax_rules_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_tax_rules_deleted_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `rate` | `numeric(7,4)` | No | — | Inferred: stores rate for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `reverse_charge` | `boolean` | No | `false` | Inferred: stores reverse charge for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `state_code` | `character varying(8)` | Yes | — | Code for state | Link to controlled business classification or an external reference | Collation: default |
| `tax_code` | `character varying(64)` | No | — | Code for tax | Link to controlled business classification or an external reference | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_tax_rules_updated_by_users` |
| `valid_from` | `date` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `date` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the tax rules business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.tax_rules` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_pricing_tax_rules_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_tax_rules_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_tax_rules_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `pricing.tax_rules` — exact structural contracts

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
| `tax_rules_country_code_not_null` | NOT NULL | `NOT NULL country_code` |
| `tax_rules_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `tax_rules_id_not_null` | NOT NULL | `NOT NULL id` |
| `tax_rules_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `tax_rules_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `tax_rules_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `tax_rules_rate_not_null` | NOT NULL | `NOT NULL rate` |
| `tax_rules_reverse_charge_not_null` | NOT NULL | `NOT NULL reverse_charge` |
| `tax_rules_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `tax_rules_tax_code_not_null` | NOT NULL | `NOT NULL tax_code` |
| `tax_rules_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `tax_rules_valid_from_not_null` | NOT NULL | `NOT NULL valid_from` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_tax_rules_code_region` | btree | `(tax_code, country_code, state_code)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_tax_rules_code_region ON pricing.tax_rules USING btree (tax_code, country_code, state_code)` |
| `pk_pricing_tax_rules` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_tax_rules ON pricing.tax_rules USING btree (internal_id)` |
| `uq_pricing_tax_rules_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_tax_rules_id ON pricing.tax_rules USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.tax_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.tax_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.tax_rules FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
