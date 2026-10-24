# `pricing.promotion_versions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds promotion versions records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.promotion_versions |
| Classification | Audit / History |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 13 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `benefits` | `jsonb` | No | — | Structured benefits information | Retain a versioned payload or relevant details | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_promotion_versions_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `promotion_id` | `uuid` | No | — | Reference linking this record to promotions | Ensures related business data can be joined and validated | FK → `pricing.promotions` via `fk_pricing_promotion_versions_promotion_id_promotions` |
| `promotion_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `pricing.promotions` via `fk_pricing_promotion_versions_promotion_id_promotions_numeric` |
| `published_at` | `timestamp with time zone` | Yes | — | Time of published | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `rules` | `jsonb` | No | — | Structured rules information | Retain a versioned payload or relevant details | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_promotion_versions_updated_by_users` |
| `version_no` | `integer` | No | — | Inferred: stores version no for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |

## Record lifecycle and users

- **Created:** when the promotion versions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.promotion_versions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_pricing_promotion_versions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_pricing_promotion_versions_promotion_id_promotions | `promotion_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id) REFERENCES pricing.promotions(id) ON DELETE CASCADE` |
| fk_pricing_promotion_versions_promotion_id_promotions_numeric | `promotion_id_internal_id` | [`pricing.promotions`](../../Tables/pricing/promotions.md) | `FOREIGN KEY (promotion_id_internal_id) REFERENCES pricing.promotions(internal_id) ON DELETE CASCADE` |
| fk_pricing_promotion_versions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_promotion_version_id_p_00d1 | `promotion_version_id` | `id` |
| [`pricing.promotion_redemptions`](../../Tables/pricing/promotion_redemptions.md) | fk_pricing_promotion_redemptions_promotion_version_id_p_0bd8 | `promotion_version_id_internal_id` | `internal_id` |

## `pricing.promotion_versions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_pricing_promotion_versions_created_by_users` |
| `promotion_id` | `pricing.promotions` | `fk_pricing_promotion_versions_promotion_id_promotions` |
| `promotion_id_internal_id` | `pricing.promotions` | `fk_pricing_promotion_versions_promotion_id_promotions_numeric` |
| `updated_by` | `identity.users` | `fk_pricing_promotion_versions_updated_by_users` |

### Existing constraints

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
| `promotion_versions_benefits_not_null` | NOT NULL | `NOT NULL benefits` |
| `promotion_versions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `promotion_versions_id_not_null` | NOT NULL | `NOT NULL id` |
| `promotion_versions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `promotion_versions_promotion_id_internal_id_not_null` | NOT NULL | `NOT NULL promotion_id_internal_id` |
| `promotion_versions_promotion_id_not_null` | NOT NULL | `NOT NULL promotion_id` |
| `promotion_versions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `promotion_versions_rules_not_null` | NOT NULL | `NOT NULL rules` |
| `promotion_versions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `promotion_versions_version_no_not_null` | NOT NULL | `NOT NULL version_no` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_promotion_versions_promotion` | btree | `(promotion_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_promotion_versions_promotion ON pricing.promotion_versions USING btree (promotion_id)` |
| `pk_pricing_promotion_versions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_promotion_versions ON pricing.promotion_versions USING btree (internal_id)` |
| `promotion_version` | btree | `(promotion_id, version_no)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX promotion_version ON pricing.promotion_versions USING btree (promotion_id, version_no)` |
| `uq_pricing_promotion_versions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_promotion_versions_id ON pricing.promotion_versions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON pricing.promotion_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.promotion_versions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["promotion_id","promotion_id_internal_id","pricing","promotions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
