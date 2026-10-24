# `membership.benefit_usage`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds benefit usage records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | membership.benefit_usage |
| Classification | Transactional |
| Proposed business write owner | Future membership owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 11 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount_saved` | `numeric(14,2)` | No | `0` | Inferred: stores amount saved for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `benefit_id` | `uuid` | No | — | Reference linking this record to plan benefits | Ensures related business data can be joined and validated | FK → `membership.plan_benefits` via `fk_membership_benefit_usage_benefit_id_plan_benefits` |
| `benefit_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.plan_benefits` via `fk_membership_benefit_usage_benefit_id_plan_benefits_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `quantity` | `numeric(12,3)` | No | `1` | Quantity value | Track resource or item amounts accurately | Exact constraints below |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `subscription_id` | `uuid` | No | — | Reference linking this record to subscriptions | Ensures related business data can be joined and validated | FK → `membership.subscriptions` via `fk_membership_benefit_usage_subscription_id_subscriptions` |
| `subscription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.subscriptions` via `fk_membership_benefit_usage_subscription_id_subscriptio_1c27` |

## Record lifecycle and users

- **Created:** when the benefit usage business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.benefit_usage` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_membership_benefit_usage_benefit_id_plan_benefits | `benefit_id` | [`membership.plan_benefits`](../../Tables/membership/plan_benefits.md) | `FOREIGN KEY (benefit_id) REFERENCES membership.plan_benefits(id) ON DELETE RESTRICT` |
| fk_membership_benefit_usage_benefit_id_plan_benefits_numeric | `benefit_id_internal_id` | [`membership.plan_benefits`](../../Tables/membership/plan_benefits.md) | `FOREIGN KEY (benefit_id_internal_id) REFERENCES membership.plan_benefits(internal_id) ON DELETE RESTRICT` |
| fk_membership_benefit_usage_subscription_id_subscriptio_1c27 | `subscription_id_internal_id` | [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | `FOREIGN KEY (subscription_id_internal_id) REFERENCES membership.subscriptions(internal_id) ON DELETE RESTRICT` |
| fk_membership_benefit_usage_subscription_id_subscriptions | `subscription_id` | [`membership.subscriptions`](../../Tables/membership/subscriptions.md) | `FOREIGN KEY (subscription_id) REFERENCES membership.subscriptions(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `membership.benefit_usage` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `benefit_id` | `membership.plan_benefits` | `fk_membership_benefit_usage_benefit_id_plan_benefits` |
| `benefit_id_internal_id` | `membership.plan_benefits` | `fk_membership_benefit_usage_benefit_id_plan_benefits_numeric` |
| `subscription_id_internal_id` | `membership.subscriptions` | `fk_membership_benefit_usage_subscription_id_subscriptio_1c27` |
| `subscription_id` | `membership.subscriptions` | `fk_membership_benefit_usage_subscription_id_subscriptions` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_membership_benefit_usage_amount_saved_nonnegative` | CHECK | `CHECK (amount_saved >= 0::numeric)` |
| `ck_membership_benefit_usage_finite_numeric_values` | CHECK | `CHECK ((quantity IS NULL OR (quantity <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))) AND (amount_saved IS NULL OR (amount_saved <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric]))))` |
| `ck_membership_benefit_usage_numeric_pair_benefit_id` | CHECK | `CHECK ((benefit_id IS NULL) = (benefit_id_internal_id IS NULL))` |
| `ck_membership_benefit_usage_numeric_pair_subscription_id` | CHECK | `CHECK ((subscription_id IS NULL) = (subscription_id_internal_id IS NULL))` |
| `ck_membership_benefit_usage_quantity_positive` | CHECK | `CHECK (quantity > 0::numeric)` |
| `fk_membership_benefit_usage_benefit_id_plan_benefits` | FOREIGN KEY | `FOREIGN KEY (benefit_id) REFERENCES membership.plan_benefits(id) ON DELETE RESTRICT` |
| `fk_membership_benefit_usage_benefit_id_plan_benefits_numeric` | FOREIGN KEY | `FOREIGN KEY (benefit_id_internal_id) REFERENCES membership.plan_benefits(internal_id) ON DELETE RESTRICT` |
| `fk_membership_benefit_usage_subscription_id_subscriptio_1c27` | FOREIGN KEY | `FOREIGN KEY (subscription_id_internal_id) REFERENCES membership.subscriptions(internal_id) ON DELETE RESTRICT` |
| `fk_membership_benefit_usage_subscription_id_subscriptions` | FOREIGN KEY | `FOREIGN KEY (subscription_id) REFERENCES membership.subscriptions(id) ON DELETE RESTRICT` |
| `pk_membership_benefit_usage` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_membership_benefit_usage_id` | UNIQUE | `UNIQUE (id)` |
| `benefit_usage_amount_saved_not_null` | NOT NULL | `NOT NULL amount_saved` |
| `benefit_usage_benefit_id_internal_id_not_null` | NOT NULL | `NOT NULL benefit_id_internal_id` |
| `benefit_usage_benefit_id_not_null` | NOT NULL | `NOT NULL benefit_id` |
| `benefit_usage_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `benefit_usage_id_not_null` | NOT NULL | `NOT NULL id` |
| `benefit_usage_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `benefit_usage_quantity_not_null` | NOT NULL | `NOT NULL quantity` |
| `benefit_usage_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `benefit_usage_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |
| `benefit_usage_subscription_id_internal_id_not_null` | NOT NULL | `NOT NULL subscription_id_internal_id` |
| `benefit_usage_subscription_id_not_null` | NOT NULL | `NOT NULL subscription_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_membership_benefit_usage_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_benefit_usage_reference ON membership.benefit_usage USING btree (reference_type, reference_id)` |
| `ix_membership_benefit_usage_subscription` | btree | `(subscription_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_benefit_usage_subscription ON membership.benefit_usage USING btree (subscription_id)` |
| `pk_membership_benefit_usage` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_membership_benefit_usage ON membership.benefit_usage USING btree (internal_id)` |
| `uq_membership_benefit_usage_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_membership_benefit_usage_id ON membership.benefit_usage USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.benefit_usage FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["benefit_id","benefit_id_internal_id","membership","plan_benefits"],["subscription_id","subscription_id_internal_id","membership","subscriptions"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON membership.benefit_usage FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.benefit_usage FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["benefit_id","benefit_id_internal_id","membership","plan_benefits"],["subscription_id","subscription_id_internal_id","membership","subscriptions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
