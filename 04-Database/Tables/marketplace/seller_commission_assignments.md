# `marketplace.seller_commission_assignments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds seller commission assignments records within the marketplace domain (sellers and commercial listings). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | marketplace.seller_commission_assignments |
| Classification | Mapping / Junction |
| Proposed business write owner | Future marketplace owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `commission_plan_id` | `uuid` | No | — | Reference linking this record to commission plans | Ensures related business data can be joined and validated | FK → `marketplace.commission_plans` via `fk_marketplace_seller_commission_assignments_commission_b453` |
| `commission_plan_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.commission_plans` via `fk_marketplace_seller_commission_assignments_commission_de18` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_commission_assignments_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `seller_id` | `uuid` | No | — | Reference linking this record to sellers | Ensures related business data can be joined and validated | FK → `marketplace.sellers` via `fk_marketplace_seller_commission_assignments_seller_id_sellers` |
| `seller_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `marketplace.sellers` via `fk_marketplace_seller_commission_assignments_seller_id__c576` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_marketplace_seller_commission_assignments_updated_by_users` |
| `valid_from` | `timestamp with time zone` | No | — | Inferred: stores valid from for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `valid_until` | `timestamp with time zone` | Yes | — | Inferred: stores valid until for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the seller commission assignments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `marketplace.seller_commission_assignments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_marketplace_seller_commission_assignments_commission_b453 | `commission_plan_id` | [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | `FOREIGN KEY (commission_plan_id) REFERENCES marketplace.commission_plans(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_commission_assignments_commission_de18 | `commission_plan_id_internal_id` | [`marketplace.commission_plans`](../../Tables/marketplace/commission_plans.md) | `FOREIGN KEY (commission_plan_id_internal_id) REFERENCES marketplace.commission_plans(internal_id) ON DELETE RESTRICT` |
| fk_marketplace_seller_commission_assignments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_marketplace_seller_commission_assignments_seller_id__c576 | `seller_id_internal_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id_internal_id) REFERENCES marketplace.sellers(internal_id) ON DELETE CASCADE` |
| fk_marketplace_seller_commission_assignments_seller_id_sellers | `seller_id` | [`marketplace.sellers`](../../Tables/marketplace/sellers.md) | `FOREIGN KEY (seller_id) REFERENCES marketplace.sellers(id) ON DELETE CASCADE` |
| fk_marketplace_seller_commission_assignments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `marketplace.seller_commission_assignments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `commission_plan_id` | `marketplace.commission_plans` | `fk_marketplace_seller_commission_assignments_commission_b453` |
| `commission_plan_id_internal_id` | `marketplace.commission_plans` | `fk_marketplace_seller_commission_assignments_commission_de18` |
| `created_by` | `identity.users` | `fk_marketplace_seller_commission_assignments_created_by_users` |
| `seller_id_internal_id` | `marketplace.sellers` | `fk_marketplace_seller_commission_assignments_seller_id__c576` |
| `seller_id` | `marketplace.sellers` | `fk_marketplace_seller_commission_assignments_seller_id_sellers` |
| `updated_by` | `identity.users` | `fk_marketplace_seller_commission_assignments_updated_by_users` |

### Existing constraints

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
| `seller_commission_assignmen_commission_plan_id_interna_not_null` | NOT NULL | `NOT NULL commission_plan_id_internal_id` |
| `seller_commission_assignments_commission_plan_id_not_null` | NOT NULL | `NOT NULL commission_plan_id` |
| `seller_commission_assignments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `seller_commission_assignments_id_not_null` | NOT NULL | `NOT NULL id` |
| `seller_commission_assignments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `seller_commission_assignments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `seller_commission_assignments_seller_id_internal_id_not_null` | NOT NULL | `NOT NULL seller_id_internal_id` |
| `seller_commission_assignments_seller_id_not_null` | NOT NULL | `NOT NULL seller_id` |
| `seller_commission_assignments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `seller_commission_assignments_valid_from_not_null` | NOT NULL | `NOT NULL valid_from` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_marketplace_commission_assignments_seller` | btree | `(seller_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_marketplace_commission_assignments_seller ON marketplace.seller_commission_assignments USING btree (seller_id)` |
| `pk_marketplace_seller_commission_assignments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_marketplace_seller_commission_assignments ON marketplace.seller_commission_assignments USING btree (internal_id)` |
| `uq_marketplace_seller_commission_assignments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_marketplace_seller_commission_assignments_id ON marketplace.seller_commission_assignments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_commission_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON marketplace.seller_commission_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON marketplace.seller_commission_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["commission_plan_id","commission_plan_id_internal_id","marketplace","commission_plans"],["seller_id","seller_id_internal_id","marketplace","sellers"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
