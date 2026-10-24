# `support.ticket_actions`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds ticket actions records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | support.ticket_actions |
| Classification | Audit / History |
| Proposed business write owner | Future support owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action_type` | `character varying(64)` | No | — | Inferred: stores action type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `approved_by_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_actions_approved_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_actions_created_by_users` |
| `executed_at` | `timestamp with time zone` | Yes | — | Time of executed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `payload` | `jsonb` | No | `'{}'::jsonb` | Structured payload information | Retain a versioned payload or relevant details | Exact constraints below |
| `requested_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_actions_requested_by_user_id_users` |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` via `fk_support_ticket_actions_ticket_id_tickets` |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` via `fk_support_ticket_actions_ticket_id_tickets_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_actions_updated_by_users` |

## Record lifecycle and users

- **Created:** when the ticket actions business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_actions` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_support_ticket_actions_approved_by_user_id_users | `approved_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_support_ticket_actions_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_support_ticket_actions_requested_by_user_id_users | `requested_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_support_ticket_actions_ticket_id_tickets | `ticket_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| fk_support_ticket_actions_ticket_id_tickets_numeric | `ticket_id_internal_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| fk_support_ticket_actions_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `support.ticket_actions` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `approved_by_user_id` | `identity.users` | `fk_support_ticket_actions_approved_by_user_id_users` |
| `created_by` | `identity.users` | `fk_support_ticket_actions_created_by_users` |
| `requested_by_user_id` | `identity.users` | `fk_support_ticket_actions_requested_by_user_id_users` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_actions_ticket_id_tickets` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_actions_ticket_id_tickets_numeric` |
| `updated_by` | `identity.users` | `fk_support_ticket_actions_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_ticket_actions_numeric_pair_ticket_id` | CHECK | `CHECK ((ticket_id IS NULL) = (ticket_id_internal_id IS NULL))` |
| `ck_support_ticket_actions_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_support_ticket_actions_approved_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (approved_by_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_support_ticket_actions_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_ticket_actions_requested_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (requested_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_ticket_actions_ticket_id_tickets` | FOREIGN KEY | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| `fk_support_ticket_actions_ticket_id_tickets_numeric` | FOREIGN KEY | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| `fk_support_ticket_actions_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_support_ticket_actions` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_support_ticket_actions_id` | UNIQUE | `UNIQUE (id)` |
| `ticket_actions_action_type_not_null` | NOT NULL | `NOT NULL action_type` |
| `ticket_actions_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `ticket_actions_id_not_null` | NOT NULL | `NOT NULL id` |
| `ticket_actions_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `ticket_actions_payload_not_null` | NOT NULL | `NOT NULL payload` |
| `ticket_actions_requested_by_user_id_not_null` | NOT NULL | `NOT NULL requested_by_user_id` |
| `ticket_actions_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `ticket_actions_status_not_null` | NOT NULL | `NOT NULL status` |
| `ticket_actions_ticket_id_internal_id_not_null` | NOT NULL | `NOT NULL ticket_id_internal_id` |
| `ticket_actions_ticket_id_not_null` | NOT NULL | `NOT NULL ticket_id` |
| `ticket_actions_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_support_ticket_actions_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_ticket_actions_status ON support.ticket_actions USING btree (status)` |
| `ix_support_ticket_actions_ticket` | btree | `(ticket_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_ticket_actions_ticket ON support.ticket_actions USING btree (ticket_id)` |
| `pk_support_ticket_actions` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_support_ticket_actions ON support.ticket_actions USING btree (internal_id)` |
| `uq_support_ticket_actions_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_support_ticket_actions_id ON support.ticket_actions USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_actions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.ticket_actions FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_actions FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
