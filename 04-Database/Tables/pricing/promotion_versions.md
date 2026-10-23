# pricing.promotion_versions

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds promotion versions records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 13 columns, 10 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `benefits` | `jsonb` | No | — | Structured benefits information | Retain a versioned payload or relevant details | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_promotion_versions_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `promotion_id` | `uuid` | No | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` (fk_pricing_promotion_versions_promotion_id_promotions) |
| `promotion_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` (fk_pricing_promotion_versions_promotion_id_promotions_numeric); Numeric/public-key pair verification required |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `rules` | `jsonb` | No | — | Structured rules information | Retain a versioned payload or relevant details | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_pricing_promotion_versions_updated_by_users) |
| `version_no` | `integer` | No | — | Inferred: stores version no for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the promotion versions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.promotion_versions` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_pricing_promotion_versions_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_pricing_promotion_versions_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `promotion_id` → `pricing.promotions(id)` via `fk_pricing_promotion_versions_promotion_id_promotions`; FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE CASCADE
- `promotion_id_internal_id` → `pricing.promotions(internal_id)` via `fk_pricing_promotion_versions_promotion_id_promotions_numeric`; FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE CASCADE

**Referenced by 2 FK constraints** (sample): `pricing.promotion_redemptions`, `pricing.promotion_redemptions`.

## pricing.promotion_versions — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 13 columns, 10 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_promotion_versions_created_by_users` |
| `updated_by` | `identity.users` | `fk_pricing_promotion_versions_updated_by_users` |
| `promotion_id` | `pricing.promotions` | `fk_pricing_promotion_versions_promotion_id_promotions` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_pricing_promotion_versions_promotion_id_promotions_numeric` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_pricing_promotion_versions_numeric_pair_promotion_id` | CHECK | `CHECK ((promotion_id IS NULL) = (promotion_id_internal_id IS NULL))` |
| `ck_pricing_promotion_versions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_pricing_promotion_versions_version_positive` | CHECK | `CHECK (version_no > 0)` |
| `fk_pricing_promotion_versions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_pricing_promotion_versions_promotion_id_promotions` | FOREIGN KEY | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE CASCADE` |
| `fk_pricing_promotion_versions_promotion_id_promotions_numeric` | FOREIGN KEY | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE CASCADE` |
| `fk_pricing_promotion_versions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_pricing_promotion_versions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `promotion_version` | UNIQUE | `UNIQUE (promotion_id, version_no)` |
| `uq_pricing_promotion_versions_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_pricing_promotion_versions_promotion` | `CREATE INDEX ix_pricing_promotion_versions_promotion ON pricing.promotion_versions USING btree (promotion_id)` |
| `pk_pricing_promotion_versions` | `CREATE UNIQUE INDEX pk_pricing_promotion_versions ON pricing.promotion_versions USING btree (internal_id)` |
| `promotion_version` | `CREATE UNIQUE INDEX promotion_version ON pricing.promotion_versions USING btree (promotion_id, version_no)` |
| `uq_pricing_promotion_versions_id` | `CREATE UNIQUE INDEX uq_pricing_promotion_versions_id ON pricing.promotion_versions USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.promotion_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
