# `pricing.pricing_evaluations`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds pricing evaluations records within the pricing domain (prices, taxes, promotions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | pricing.pricing_evaluations |
| Classification | Derived / Operational |
| Proposed business write owner | Product_Catalog |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 9 columns; 3 PK/FK/UQ/CHECK/exclusion constraints; 8 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | Exact constraints below |
| `reference_type` | `character varying(32)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `request_payload` | `jsonb` | No | — | Structured request payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `response_snapshot` | `jsonb` | No | — | Structured response snapshot information | Retain a versioned payload or relevant details | Exact constraints below |
| `rule_version` | `character varying(64)` | No | — | Inferred: stores rule version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_pricing_pricing_evaluations_user_id_users` |

## Record lifecycle and users

- **Created:** when the pricing evaluations business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Product_Catalog, Cart_Checkout. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `pricing.pricing_evaluations` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_pricing_pricing_evaluations_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `pricing.pricing_evaluations` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_pricing_pricing_evaluations_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `fk_pricing_pricing_evaluations_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_pricing_pricing_evaluations` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_pricing_pricing_evaluations_id` | UNIQUE | `UNIQUE (id)` |
| `pricing_evaluations_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `pricing_evaluations_id_not_null` | NOT NULL | `NOT NULL id` |
| `pricing_evaluations_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `pricing_evaluations_reference_id_not_null` | NOT NULL | `NOT NULL reference_id` |
| `pricing_evaluations_reference_type_not_null` | NOT NULL | `NOT NULL reference_type` |
| `pricing_evaluations_request_payload_not_null` | NOT NULL | `NOT NULL request_payload` |
| `pricing_evaluations_response_snapshot_not_null` | NOT NULL | `NOT NULL response_snapshot` |
| `pricing_evaluations_rule_version_not_null` | NOT NULL | `NOT NULL rule_version` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_pricing_evaluations_reference` | btree | `(reference_type, reference_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_evaluations_reference ON pricing.pricing_evaluations USING btree (reference_type, reference_id)` |
| `ix_pricing_evaluations_user_time` | btree | `(user_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_pricing_evaluations_user_time ON pricing.pricing_evaluations USING btree (user_id, created_at)` |
| `pk_pricing_pricing_evaluations` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_pricing_pricing_evaluations ON pricing.pricing_evaluations USING btree (internal_id)` |
| `uq_pricing_pricing_evaluations_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_pricing_pricing_evaluations_id ON pricing.pricing_evaluations USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON pricing.pricing_evaluations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON pricing.pricing_evaluations FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON pricing.pricing_evaluations FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
