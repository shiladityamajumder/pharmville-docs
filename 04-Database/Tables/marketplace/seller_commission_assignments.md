# marketplace.seller_commission_assignments

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds seller commission assignments records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 12 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `commission_plan_id` | `uuid` | No | — | Reference linking this record to commission plans | Ensures related business data can be joined and validated | FK → `marketplace.commission_plans` (fk_marketplace_seller_commission_assignments_commission_b453) |
| `commission_plan_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.commission_plans` (fk_marketplace_seller_commission_assignments_commission_de18); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_commission_assignments_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` (fk_marketplace_seller_commission_assignments_seller_id_sellers) |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` (fk_marketplace_seller_commission_assignments_seller_id__c576); Numeric/public-key pair verification required |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_marketplace_seller_commission_assignments_updated_by_users) |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the seller commission assignments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_commission_assignments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_marketplace_seller_commission_assignments_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_marketplace_seller_commission_assignments_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `commission_plan_id` → `marketplace.commission_plans(id)` via `fk_marketplace_seller_commission_assignments_commission_b453`; FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT
- `seller_id` → `marketplace.sellers(id)` via `fk_marketplace_seller_commission_assignments_seller_id_sellers`; FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE
- `commission_plan_id_internal_id` → `marketplace.commission_plans(internal_id)` via `fk_marketplace_seller_commission_assignments_commission_de18`; FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT
- `seller_id_internal_id` → `marketplace.sellers(internal_id)` via `fk_marketplace_seller_commission_assignments_seller_id__c576`; FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE

## marketplace.seller_commission_assignments — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 12 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_marketplace_seller_commission_assignments_created_by_users` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_commission_assignments_updated_by_users` |
| `commission_plan_id` | `marketplace.commission_plans` | `fk_marketplace_seller_commission_assignments_commission_b453` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_commission_assignments_seller_id_sellers` |
| `commission_plan_id_internal_id` | `marketplace.commission_plans` | `fk_marketplace_seller_commission_assignments_commission_de18` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_commission_assignments_seller_id__c576` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_marketplace_seller_commission_assignments_numeric_pa_ad67` | CHECK | `CHECK ((commission_plan_id IS NULL) = (commission_plan_id_internal_id IS NULL))` |
| `ck_marketplace_seller_commission_assignments_numeric_pa_ce6c` | CHECK | `CHECK ((seller_id IS NULL) = (seller_id_internal_id IS NULL))` |
| `ck_marketplace_seller_commission_assignments_row_versio_14e2` | CHECK | `CHECK (row_version > 0)` |
| `ck_marketplace_seller_commission_assignments_valid_window` | CHECK | `CHECK (valid_until IS NULL OR valid_until > valid_from)` |
| `fk_marketplace_seller_commission_assignments_commission_b453` | FOREIGN KEY | `FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_commission_assignments_commission_de18` | FOREIGN KEY | `FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_commission_assignments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_marketplace_seller_commission_assignments_seller_id__c576` | FOREIGN KEY | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| `fk_marketplace_seller_commission_assignments_seller_id_sellers` | FOREIGN KEY | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| `fk_marketplace_seller_commission_assignments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_marketplace_seller_commission_assignments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_marketplace_seller_commission_assignments_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_marketplace_commission_assignments_seller` | `CREATE INDEX ix_marketplace_commission_assignments_seller ON marketplace.seller_commission_assignments USING btree (seller_id)` |
| `pk_marketplace_seller_commission_assignments` | `CREATE UNIQUE INDEX pk_marketplace_seller_commission_assignments ON marketplace.seller_commission_assignments USING btree (internal_id)` |
| `uq_marketplace_seller_commission_assignments_id` | `CREATE UNIQUE INDEX uq_marketplace_seller_commission_assignments_id ON marketplace.seller_commission_assignments USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_commission_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_commission_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_commission_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
