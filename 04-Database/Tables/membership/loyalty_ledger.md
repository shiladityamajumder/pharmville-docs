# membership.loyalty_ledger

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds loyalty ledger records within the membership domain (benefits and loyalty). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 8 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `idempotency_key` | `character varying(128)` | No | — | Inferred: stores idempotency key for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `loyalty_account_id` | `uuid` | No | — | Reference linking this record to loyalty accounts | Ensures related business data can be joined and validated | FK → `membership.loyalty_accounts` (fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85) |
| `loyalty_account_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `membership.loyalty_accounts` (fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f); Numeric/public-key pair verification required |
| `movement_type` | `character varying(32)` | No | — | Inferred: stores movement type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `points` | `numeric(18,3)` | No | — | Inferred: stores points for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the loyalty ledger business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `membership.loyalty_ledger` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `loyalty_account_id` → `membership.loyalty_accounts(id)` via `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85`; FOREIGN KEY (loyalty_account_id) REFERENCES membership.loyalty_accounts(id) ON DELETE RESTRICT
- `loyalty_account_id_internal_id` → `membership.loyalty_accounts(internal_id)` via `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f`; FOREIGN KEY (loyalty_account_id_internal_id) REFERENCES membership.loyalty_accounts(internal_id) ON DELETE RESTRICT

## membership.loyalty_ledger — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 11 columns, 8 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `loyalty_account_id` | `membership.loyalty_accounts` | `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_ee85` |
| `loyalty_account_id_internal_id` | `membership.loyalty_accounts` | `fk_membership_loyalty_ledger_loyalty_account_id_loyalty_c32f` |

## Existing constraints

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

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_membership_loyalty_ledger_account_time` | `CREATE INDEX ix_membership_loyalty_ledger_account_time ON membership.loyalty_ledger USING btree (loyalty_account_id, created_at)` |
| `ix_membership_loyalty_ledger_reference` | `CREATE INDEX ix_membership_loyalty_ledger_reference ON membership.loyalty_ledger USING btree (reference_type, reference_id)` |
| `loyalty_ledger_idempotency` | `CREATE UNIQUE INDEX loyalty_ledger_idempotency ON membership.loyalty_ledger USING btree (idempotency_key)` |
| `pk_membership_loyalty_ledger` | `CREATE UNIQUE INDEX pk_membership_loyalty_ledger ON membership.loyalty_ledger USING btree (internal_id)` |
| `uq_membership_loyalty_ledger_id` | `CREATE UNIQUE INDEX uq_membership_loyalty_ledger_id ON membership.loyalty_ledger USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_ledger FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["loyalty_account_id","loyalty_account_id_internal_id","membership","loyalty_accounts"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON membership.loyalty_ledger FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON membership.loyalty_ledger FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["loyalty_account_id","loyalty_account_id_internal_id","membership","loyalty_accounts"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
