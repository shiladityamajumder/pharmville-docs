# procurement.goods_receipt_quality_checks

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds goods receipt quality checks records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 14 columns, 9 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `check_type` | `character varying(64)` | No | — | Inferred: stores check type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `checked_at` | `timestamp with time zone` | No | `now()` | Time of checked | Support chronology, deadlines or audit evidence | See exact constraints |
| `checked_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipt_quality_checks_checked_by__6713) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipt_quality_checks_created_by_users) |
| `goods_receipt_item_id` | `uuid` | No | — | Reference linking this record to goods receipt items | Ensures related business data can be joined and validated | FK → `procurement.goods_receipt_items` (fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c) |
| `goods_receipt_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.goods_receipt_items` (fk_procurement_goods_receipt_quality_checks_goods_recei_6c95); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `observations` | `jsonb` | No | `'{}'::jsonb` | Structured observations information | Retain a versioned payload or relevant details | See exact constraints |
| `result` | `character varying(32)` | No | — | Inferred: stores result for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_procurement_goods_receipt_quality_checks_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the goods receipt quality checks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.goods_receipt_quality_checks` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `checked_by_user_id` → `identity.users(id)` via `fk_procurement_goods_receipt_quality_checks_checked_by__6713`; FOREIGN KEY (checked_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_procurement_goods_receipt_quality_checks_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_procurement_goods_receipt_quality_checks_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `goods_receipt_item_id` → `procurement.goods_receipt_items(id)` via `fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c`; FOREIGN KEY (goods_receipt_item_id) REFERENCES procurement.goods_receipt_items(id) ON DELETE CASCADE
- `goods_receipt_item_id_internal_id` → `procurement.goods_receipt_items(internal_id)` via `fk_procurement_goods_receipt_quality_checks_goods_recei_6c95`; FOREIGN KEY (goods_receipt_item_id_internal_id) REFERENCES procurement.goods_receipt_items(internal_id) ON DELETE CASCADE

## procurement.goods_receipt_quality_checks — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 14 columns, 9 constraints, 3 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `checked_by_user_id` | `identity.users` | `fk_procurement_goods_receipt_quality_checks_checked_by__6713` |
| `created_by` | `identity.users` | `fk_procurement_goods_receipt_quality_checks_created_by_users` |
| `updated_by` | `identity.users` | `fk_procurement_goods_receipt_quality_checks_updated_by_users` |
| `goods_receipt_item_id` | `procurement.goods_receipt_items` | `fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c` |
| `goods_receipt_item_id_internal_id` | `procurement.goods_receipt_items` | `fk_procurement_goods_receipt_quality_checks_goods_recei_6c95` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_procurement_goods_receipt_quality_checks_numeric_pai_921d` | CHECK | `CHECK ((goods_receipt_item_id IS NULL) = (goods_receipt_item_id_internal_id IS NULL))` |
| `ck_procurement_goods_receipt_quality_checks_row_version_a285` | CHECK | `CHECK (row_version > 0)` |
| `fk_procurement_goods_receipt_quality_checks_checked_by__6713` | FOREIGN KEY | `FOREIGN KEY (checked_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipt_quality_checks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_procurement_goods_receipt_quality_checks_goods_recei_6c95` | FOREIGN KEY | `FOREIGN KEY (goods_receipt_item_id_internal_id) REFERENCES procurement.goods_receipt_items(internal_id) ON DELETE CASCADE` |
| `fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c` | FOREIGN KEY | `FOREIGN KEY (goods_receipt_item_id) REFERENCES procurement.goods_receipt_items(id) ON DELETE CASCADE` |
| `fk_procurement_goods_receipt_quality_checks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_procurement_goods_receipt_quality_checks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_procurement_goods_receipt_quality_checks_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_procurement_grn_quality_item` | `CREATE INDEX ix_procurement_grn_quality_item ON procurement.goods_receipt_quality_checks USING btree (goods_receipt_item_id)` |
| `pk_procurement_goods_receipt_quality_checks` | `CREATE UNIQUE INDEX pk_procurement_goods_receipt_quality_checks ON procurement.goods_receipt_quality_checks USING btree (internal_id)` |
| `uq_procurement_goods_receipt_quality_checks_id` | `CREATE UNIQUE INDEX uq_procurement_goods_receipt_quality_checks_id ON procurement.goods_receipt_quality_checks USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_quality_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.goods_receipt_quality_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_quality_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
