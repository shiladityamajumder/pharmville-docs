# `procurement.goods_receipt_quality_checks`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds goods receipt quality checks records within the procurement domain (suppliers, purchase orders and receiving). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | procurement.goods_receipt_quality_checks |
| Classification | Transactional |
| Proposed business write owner | Warehouse |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 14 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `check_type` | `character varying(64)` | No | — | Inferred: stores check type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `checked_at` | `timestamp with time zone` | No | `now()` | Time of checked | Support chronology, deadlines or audit evidence | Exact constraints below |
| `checked_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipt_quality_checks_checked_by__6713` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipt_quality_checks_created_by_users` |
| `goods_receipt_item_id` | `uuid` | No | — | Reference linking this record to goods receipt items | Ensures related business data can be joined and validated | FK → `procurement.goods_receipt_items` via `fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c` |
| `goods_receipt_item_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `procurement.goods_receipt_items` via `fk_procurement_goods_receipt_quality_checks_goods_recei_6c95` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `observations` | `jsonb` | No | `'{}'::jsonb` | Structured observations information | Retain a versioned payload or relevant details | Exact constraints below |
| `result` | `character varying(32)` | No | — | Inferred: stores result for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_procurement_goods_receipt_quality_checks_updated_by_users` |

## Record lifecycle and users

- **Created:** when the goods receipt quality checks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Store_Operations, Warehouse. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `procurement.goods_receipt_quality_checks` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_procurement_goods_receipt_quality_checks_checked_by__6713 | `checked_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (checked_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipt_quality_checks_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_procurement_goods_receipt_quality_checks_goods_recei_6c95 | `goods_receipt_item_id_internal_id` | [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | `FOREIGN KEY (goods_receipt_item_id_internal_id) REFERENCES procurement.goods_receipt_items(internal_id) ON DELETE CASCADE` |
| fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c | `goods_receipt_item_id` | [`procurement.goods_receipt_items`](../../Tables/procurement/goods_receipt_items.md) | `FOREIGN KEY (goods_receipt_item_id) REFERENCES procurement.goods_receipt_items(id) ON DELETE CASCADE` |
| fk_procurement_goods_receipt_quality_checks_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `procurement.goods_receipt_quality_checks` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `checked_by_user_id` | `identity.users` | `fk_procurement_goods_receipt_quality_checks_checked_by__6713` |
| `created_by` | `identity.users` | `fk_procurement_goods_receipt_quality_checks_created_by_users` |
| `goods_receipt_item_id_internal_id` | `procurement.goods_receipt_items` | `fk_procurement_goods_receipt_quality_checks_goods_recei_6c95` |
| `goods_receipt_item_id` | `procurement.goods_receipt_items` | `fk_procurement_goods_receipt_quality_checks_goods_recei_ac2c` |
| `updated_by` | `identity.users` | `fk_procurement_goods_receipt_quality_checks_updated_by_users` |

### Existing constraints

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
| `goods_receipt_quality_check_goods_receipt_item_id_inte_not_null` | NOT NULL | `NOT NULL goods_receipt_item_id_internal_id` |
| `goods_receipt_quality_checks_check_type_not_null` | NOT NULL | `NOT NULL check_type` |
| `goods_receipt_quality_checks_checked_at_not_null` | NOT NULL | `NOT NULL checked_at` |
| `goods_receipt_quality_checks_checked_by_user_id_not_null` | NOT NULL | `NOT NULL checked_by_user_id` |
| `goods_receipt_quality_checks_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `goods_receipt_quality_checks_goods_receipt_item_id_not_null` | NOT NULL | `NOT NULL goods_receipt_item_id` |
| `goods_receipt_quality_checks_id_not_null` | NOT NULL | `NOT NULL id` |
| `goods_receipt_quality_checks_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `goods_receipt_quality_checks_observations_not_null` | NOT NULL | `NOT NULL observations` |
| `goods_receipt_quality_checks_result_not_null` | NOT NULL | `NOT NULL result` |
| `goods_receipt_quality_checks_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `goods_receipt_quality_checks_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_procurement_grn_quality_item` | btree | `(goods_receipt_item_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_procurement_grn_quality_item ON procurement.goods_receipt_quality_checks USING btree (goods_receipt_item_id)` |
| `pk_procurement_goods_receipt_quality_checks` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_procurement_goods_receipt_quality_checks ON procurement.goods_receipt_quality_checks USING btree (internal_id)` |
| `uq_procurement_goods_receipt_quality_checks_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_procurement_goods_receipt_quality_checks_id ON procurement.goods_receipt_quality_checks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_quality_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON procurement.goods_receipt_quality_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON procurement.goods_receipt_quality_checks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["goods_receipt_item_id","goods_receipt_item_id_internal_id","procurement","goods_receipt_items"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
