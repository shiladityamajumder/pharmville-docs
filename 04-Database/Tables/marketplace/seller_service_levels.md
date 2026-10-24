# `marketplace.seller_service_levels`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds seller service levels records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 12 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `cancellation_rate` | `numeric(7,4)` | No | `0` | Inferred: stores cancellation rate for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_service_levels_created_by_users) |
| `fill_rate` | `numeric(7,4)` | No | — | Inferred: stores fill rate for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metric_date` | `timestamp with time zone` | No | — | Inferred: stores metric date for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `on_time_rate` | `numeric(7,4)` | No | — | Inferred: stores on time rate for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `quality_score` | `numeric(7,4)` | Yes | — | Inferred: stores quality score for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_marketplace_seller_service_levels_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_marketplace_seller_service_levels_seller_id_sellers_numeric); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_service_levels_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the seller service levels business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_service_levels` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_marketplace_seller_service_levels_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_marketplace_seller_service_levels_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `seller_id` → `marketplace.sellers(id)` via `fk_marketplace_seller_service_levels_seller_id_sellers`; `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE`
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_marketplace_seller_service_levels_seller_id_sellers_numeric`; `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE`

## `marketplace.seller_service_levels` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 14 columns, 12 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_seller_service_levels_created_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_service_levels_updated_by_users` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_service_levels_seller_id_sellers` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_service_levels_seller_id_sellers_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_marketplace_seller_service_levels` | `CREATE UNIQUE INDEX pk_marketplace_seller_service_levels ON marketplace.seller_service_levels USING btree (internal_id)` |
| `seller_metric_date` | `CREATE UNIQUE INDEX seller_metric_date ON marketplace.seller_service_levels USING btree (seller_id, metric_date)` |
| `uq_marketplace_seller_service_levels_id` | `CREATE UNIQUE INDEX uq_marketplace_seller_service_levels_id ON marketplace.seller_service_levels USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_service_levels FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_service_levels FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_service_levels FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
