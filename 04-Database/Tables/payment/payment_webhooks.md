# `payment.payment_webhooks`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds payment webhooks records within the payment domain (attempts, confirmation, chargebacks and refunds). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | payment.payment_webhooks |
| Classification | Audit / History |
| Proposed business write owner | Finance_Payments |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 16 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_payment_webhooks_created_by_users` |
| `error_message` | `text` | Yes | — | Inferred: stores error message for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `event_type` | `character varying(128)` | Yes | — | Inferred: stores event type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payload` | `jsonb` | No | — | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `processed_at` | `timestamp with time zone` | Yes | — | Time of processed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `processing_attempts` | `integer` | No | `0` | Inferred: stores processing attempts for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `processing_status` | `character varying(32)` | No | `'pending'::character varying` | Inferred: stores processing status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider` | `character varying(64)` | No | — | Inferred: stores provider for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `provider_event_id` | `character varying(255)` | No | — | Identifier associated with provider event | Link the event or entity to its subject; verify constraints | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `signature_valid` | `boolean` | No | — | Inferred: stores signature valid for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_payment_payment_webhooks_updated_by_users` |

## Record lifecycle and users

- **Created:** when the payment webhooks business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Finance_Payments. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `payment.payment_webhooks` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_payment_payment_webhooks_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_payment_payment_webhooks_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `payment.payment_webhooks` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_payment_payment_webhooks_created_by_users` |
| `updated_by` | `identity.users` | `fk_payment_payment_webhooks_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_payment_payment_webhooks_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_payment_payment_webhooks_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_payment_payment_webhooks_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_payment_payment_webhooks` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `provider_event` | UNIQUE | `UNIQUE (provider, provider_event_id)` |
| `uq_payment_payment_webhooks_id` | UNIQUE | `UNIQUE (id)` |
| `payment_webhooks_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `payment_webhooks_id_not_null` | NOT NULL | `NOT NULL id` |
| `payment_webhooks_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `payment_webhooks_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `payment_webhooks_processing_attempts_not_null` | NOT NULL | `NOT NULL processing_attempts` |
| `payment_webhooks_processing_status_not_null` | NOT NULL | `NOT NULL processing_status` |
| `payment_webhooks_provider_event_id_not_null` | NOT NULL | `NOT NULL provider_event_id` |
| `payment_webhooks_provider_not_null` | NOT NULL | `NOT NULL provider` |
| `payment_webhooks_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `payment_webhooks_signature_valid_not_null` | NOT NULL | `NOT NULL signature_valid` |
| `payment_webhooks_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_payment_webhooks_status_created` | btree | `(processing_status, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_payment_webhooks_status_created ON payment.payment_webhooks USING btree (processing_status, created_at)` |
| `pk_payment_payment_webhooks` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_payment_payment_webhooks ON payment.payment_webhooks USING btree (internal_id)` |
| `provider_event` | btree | `(provider, provider_event_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX provider_event ON payment.payment_webhooks USING btree (provider, provider_event_id)` |
| `uq_payment_payment_webhooks_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_payment_payment_webhooks_id ON payment.payment_webhooks USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON payment.payment_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON payment.payment_webhooks FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
