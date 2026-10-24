# `membership.loyalty_ledger`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds loyalty ledger records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | membership.loyalty_ledger |
| Classification | Audit / History |
| Proposed business write owner | Future membership owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 8 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `loyalty_account_id` | `uuid` | No | — | Reference linking this record to loyalty accounts | Ensures related business data can be joined and validated | FK → `membership.loyalty_accounts` via `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85` |
| `loyalty_account_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.loyalty_accounts` via `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f` |
| `movement_type` | `character varying(32)` | No | — | Inferred: stores movement type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `points` | `numeric(18,3)` | No | — | Inferred: stores points for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |

## Record lifecycle and users

- **Created:** when the loyalty ledger business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.loyalty_ledger` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f | `loyalty_account_id_internal_id` | [`membership.loyalty_accounts`](../../Tables/membership/loyalty_accounts.md) | `FOREIGN KEY (loyalty_account_id_internal_id) REFERENCES membership.loyalty_accounts(internal_id) ON DELETE RESTRICT` |
| fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85 | `loyalty_account_id` | [`membership.loyalty_accounts`](../../Tables/membership/loyalty_accounts.md) | `FOREIGN KEY (loyalty_account_id) REFERENCES membership.loyalty_accounts(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `membership.loyalty_ledger` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `loyalty_account_id_internal_id` | `membership.loyalty_accounts` | `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f` |
| `loyalty_account_id` | `membership.loyalty_accounts` | `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_membership_loyalty_ledger_finite_numeric_values` | CHECK | `CHECK (points IS NULL OR (points <> ALL (ARRAY['NaN'::numeric, 'Infinity'::numeric, '-Infinity'::numeric])))` |
| `ck_membership_loyalty_ledger_numeric_pair_loyalty_account_id` | CHECK | `CHECK ((loyalty_account_id IS NULL) = (loyalty_account_id_internal_id IS NULL))` |
| `ck_membership_loyalty_ledger_points_nonzero` | CHECK | `CHECK (points <> 0::numeric)` |
| `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f` | FOREIGN KEY | `FOREIGN KEY (loyalty_account_id_internal_id) REFERENCES membership.loyalty_accounts(internal_id) ON DELETE RESTRICT` |
| `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85` | FOREIGN KEY | `FOREIGN KEY (loyalty_account_id) REFERENCES membership.loyalty_accounts(id) ON DELETE RESTRICT` |
| `loyalty_ledger_idempotency` | UNIQUE | `UNIQUE (idempotency_key)` |
| `pk_membership_loyalty_ledger` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_membership_loyalty_ledger_id` | UNIQUE | `UNIQUE (id)` |
| `loyalty_ledger_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `loyalty_ledger_id_not_null` | NOT NULL | `NOT NULL id` |
| `loyalty_ledger_idempotency_key_not_null` | NOT NULL | `NOT NULL idempotency_key` |
| `loyalty_ledger_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `loyalty_ledger_loyalty_account_id_internal_id_not_null` | NOT NULL | `NOT NULL loyalty_account_id_internal_id` |
| `loyalty_ledger_loyalty_account_id_not_null` | NOT NULL | `NOT NULL loyalty_account_id` |
| `loyalty_ledger_movement_type_not_null` | NOT NULL | `NOT NULL movement_type` |
| `loyalty_ledger_points_not_null` | NOT NULL | `NOT NULL points` |
| `loyalty_ledger_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `loyalty_ledger_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_membership_loyalty_ledger_account_time` | btree | `(loyalty_account_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_loyalty_ledger_account_time ON membership.loyalty_ledger USING btree (loyalty_account_id, created_at)` |
| `ix_membership_loyalty_ledger_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_membership_loyalty_ledger_reference ON membership.loyalty_ledger USING btree (reference_type, reference_id)` |
| `loyalty_ledger_idempotency` | btree | `(idempotency_key)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX loyalty_ledger_idempotency ON membership.loyalty_ledger USING btree (idempotency_key)` |
| `pk_membership_loyalty_ledger` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_membership_loyalty_ledger ON membership.loyalty_ledger USING btree (internal_id)` |
| `uq_membership_loyalty_ledger_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_membership_loyalty_ledger_id ON membership.loyalty_ledger USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_ledger FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["loyalty_account_id","loyalty_account_id_internal_id","membership","loyalty_accounts"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON membership.loyalty_ledger FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_ledger FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["loyalty_account_id","loyalty_account_id_internal_id","membership","loyalty_accounts"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
