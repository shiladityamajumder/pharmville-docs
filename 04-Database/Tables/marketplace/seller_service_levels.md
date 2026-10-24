# `marketplace.seller_service_levels`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds seller service levels records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.seller_service_levels |
| Classification | Configuration |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cancellation_rate` | `numeric(7,4)` | No | `0` | Inferred: stores cancellation rate for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_service_levels_created_by_users` |
| `fill_rate` | `numeric(7,4)` | No | — | Inferred: stores fill rate for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metric_date` | `timestamp with time zone` | No | — | Inferred: stores metric date for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `on_time_rate` | `numeric(7,4)` | No | — | Inferred: stores on time rate for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `quality_score` | `numeric(7,4)` | Yes | — | Inferred: stores quality score for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_marketplace_seller_service_levels_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_marketplace_seller_service_levels_seller_id_sellers_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_service_levels_updated_by_users` |

## Record lifecycle and users

- **Created:** when the seller service levels business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_service_levels` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_marketplace_seller_service_levels_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_service_levels_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| fk_marketplace_seller_service_levels_seller_id_sellers_numeric | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| fk_marketplace_seller_service_levels_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `marketplace.seller_service_levels` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_seller_service_levels_created_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_service_levels_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_service_levels_seller_id_sellers_numeric` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_service_levels_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_seller_service_levels_fill_rate_range` | CHECK | `CHECK (fill_rate >= 0::numeric AND fill_rate <= 100::numeric)` |
| `ck_marketplace_seller_service_levels_finite_numeric_values` | CHECK | `CHECK ((fill_rate IS NULL OR (fill_rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (on_time_rate IS NULL OR (on_time_rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (cancellation_rate IS NULL OR (cancellation_rate <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (quality_score IS NULL OR (quality_score <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_marketplace_seller_service_levels_numeric_pair_seller_id` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_marketplace_seller_service_levels_on_time_rate_range` | CHECK | `CHECK (on_time_rate >= 0::numeric AND on_time_rate <= 100::numeric)` |
| `ck_marketplace_seller_service_levels_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_marketplace_seller_service_levels_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_service_levels_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| `fk_marketplace_seller_service_levels_seller_id_sellers_numeric` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| `fk_marketplace_seller_service_levels_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_seller_service_levels` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `seller_metric_date` | UNIQUE | `UNIQUE (seller_id, metric_date)` |
| `uq_marketplace_seller_service_levels_id` | UNIQUE | `UNIQUE (id)` |
| `seller_service_levels_cancellation_rate_not_null` | NOT NULL | `NOT NULL cancellation_rate` |
| `seller_service_levels_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `seller_service_levels_fill_rate_not_null` | NOT NULL | `NOT NULL fill_rate` |
| `seller_service_levels_id_not_null` | NOT NULL | `NOT NULL id` |
| `seller_service_levels_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `seller_service_levels_metric_date_not_null` | NOT NULL | `NOT NULL metric_date` |
| `seller_service_levels_on_time_rate_not_null` | NOT NULL | `NOT NULL on_time_rate` |
| `seller_service_levels_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `seller_service_levels_seller_id_internal_id_not_null` | NOT NULL | `NOT NULL seller_id_internal_id` |
| `seller_service_levels_seller_id_not_null` | NOT NULL | `NOT NULL seller_id` |
| `seller_service_levels_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_marketplace_seller_service_levels` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_seller_service_levels ON marketplace.seller_service_levels USING btree (internal_id)` |
| `seller_metric_date` | btree | `(seller_id, metric_date)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX seller_metric_date ON marketplace.seller_service_levels USING btree (seller_id, metric_date)` |
| `uq_marketplace_seller_service_levels_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_seller_service_levels_id ON marketplace.seller_service_levels USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_service_levels FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_service_levels FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_service_levels FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
