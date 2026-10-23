# membership.benefit_usage

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds benefit usage records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 11 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `amount_saved` | `numeric(14,2)` | No | `0` | Inferred: stores amount saved for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `benefit_id` | `uuid` | No | — | Reference linking this record to plan benefits | Ensures related business data can be joined and validated | FK → `membership.plan_benefits` (fk_membership_benefit_usage_benefit_id_plan_benefits) |
| `benefit_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.plan_benefits` (fk_membership_benefit_usage_benefit_id_plan_benefits_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `quantity` | `numeric(12,3)` | No | `1` | Quantity value | Track resource or item amounts accurately | See exact constraints |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `subscription_id` | `uuid` | No | — | Reference linking this record to subscriptions | Ensures related business data can be joined and validated | FK → `membership.subscriptions` (fk_membership_benefit_usage_subscription_id_subscriptions) |
| `subscription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.subscriptions` (fk_membership_benefit_usage_subscription_id_subscriptio_1c27); Numeric/public-key pair verification required |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the benefit usage business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.benefit_usage` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `benefit_id` → `membership.plan_benefits(id)` via `fk_membership_benefit_usage_benefit_id_plan_benefits`; FOREIGN KEY (benefit_id) REFERENCES membership.plan_benefits(id) ON DELETE RESTRICT
- `subscription_id` → `membership.subscriptions(id)` via `fk_membership_benefit_usage_subscription_id_subscriptions`; FOREIGN KEY (subscription_id) REFERENCES membership.subscriptions(id) ON DELETE RESTRICT
- `benefit_id_internal_id` → `membership.plan_benefits(internal_id)` via `fk_membership_benefit_usage_benefit_id_plan_benefits_numeric`; FOREIGN KEY (benefit_id_internal_id) REFERENCES membership.plan_benefits(internal_id) ON DELETE RESTRICT
- `subscription_id_internal_id` → `membership.subscriptions(internal_id)` via `fk_membership_benefit_usage_subscription_id_subscriptio_1c27`; FOREIGN KEY (subscription_id_internal_id) REFERENCES membership.subscriptions(internal_id) ON DELETE RESTRICT

## membership.benefit_usage — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 11 columns, 11 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `benefit_id` | `membership.plan_benefits` | `fk_membership_benefit_usage_benefit_id_plan_benefits` |
| `subscription_id` | `membership.subscriptions` | `fk_membership_benefit_usage_subscription_id_subscriptions` |
| `benefit_id_internal_id` | `membership.plan_benefits` | `fk_membership_benefit_usage_benefit_id_plan_benefits_numeric` |
| `subscription_id_internal_id` | `membership.subscriptions` | `fk_membership_benefit_usage_subscription_id_subscriptio_1c27` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_membership_benefit_usage_reference` | `CREATE INDEX ix_membership_benefit_usage_reference ON membership.benefit_usage USING btree (reference_type, reference_id)` |
| `ix_membership_benefit_usage_subscription` | `CREATE INDEX ix_membership_benefit_usage_subscription ON membership.benefit_usage USING btree (subscription_id)` |
| `pk_membership_benefit_usage` | `CREATE UNIQUE INDEX pk_membership_benefit_usage ON membership.benefit_usage USING btree (internal_id)` |
| `uq_membership_benefit_usage_id` | `CREATE UNIQUE INDEX uq_membership_benefit_usage_id ON membership.benefit_usage USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.benefit_usage FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["benefit_id","benefit_id_internal_id","membership","plan_benefits"],["subscription_id","subscription_id_internal_id","membership","subscriptions"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON membership.benefit_usage FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.benefit_usage FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["benefit_id","benefit_id_internal_id","membership","plan_benefits"],["subscription_id","subscription_id_internal_id","membership","subscriptions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
