# `support.ticket_messages`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds ticket messages records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | support.ticket_messages |
| Classification | Audit / History |
| Proposed business write owner | Future support owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `author_type` | `character varying(32)` | No | — | Inferred: stores author type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `author_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_messages_author_user_id_users` |
| `body` | `text` | No | — | Inferred: stores body for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `channel` | `character varying(32)` | No | `'in_app'::character varying` | Inferred: stores channel for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_messages_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_internal` | `boolean` | No | `false` | Yes/no flag for is internal | Control conditional business behavior | Exact constraints below |
| `message_type` | `character varying(32)` | No | — | Inferred: stores message type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` via `fk_support_ticket_messages_ticket_id_tickets` |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` via `fk_support_ticket_messages_ticket_id_tickets_numeric` |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_ticket_messages_updated_by_users` |

## Record lifecycle and users

- **Created:** when the ticket messages business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_messages` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_support_ticket_messages_author_user_id_users | `author_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (author_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_support_ticket_messages_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_support_ticket_messages_ticket_id_tickets | `ticket_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| fk_support_ticket_messages_ticket_id_tickets_numeric | `ticket_id_internal_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| fk_support_ticket_messages_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_ticket_message_id_ticket__7442 | `ticket_message_id_internal_id` | `internal_id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_ticket_message_id_ticket_messages | `ticket_message_id` | `id` |

## `support.ticket_messages` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `author_user_id` | `identity.users` | `fk_support_ticket_messages_author_user_id_users` |
| `created_by` | `identity.users` | `fk_support_ticket_messages_created_by_users` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_messages_ticket_id_tickets` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_messages_ticket_id_tickets_numeric` |
| `updated_by` | `identity.users` | `fk_support_ticket_messages_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_ticket_messages_numeric_pair_ticket_id` | CHECK | `CHECK ((ticket_id IS NULL) = (ticket_id_internal_id IS NULL))` |
| `ck_support_ticket_messages_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_support_ticket_messages_author_user_id_users` | FOREIGN KEY | `FOREIGN KEY (author_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_support_ticket_messages_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_ticket_messages_ticket_id_tickets` | FOREIGN KEY | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| `fk_support_ticket_messages_ticket_id_tickets_numeric` | FOREIGN KEY | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| `fk_support_ticket_messages_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_support_ticket_messages` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_support_ticket_messages_id` | UNIQUE | `UNIQUE (id)` |
| `ticket_messages_author_type_not_null` | NOT NULL | `NOT NULL author_type` |
| `ticket_messages_body_not_null` | NOT NULL | `NOT NULL body` |
| `ticket_messages_channel_not_null` | NOT NULL | `NOT NULL channel` |
| `ticket_messages_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `ticket_messages_id_not_null` | NOT NULL | `NOT NULL id` |
| `ticket_messages_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `ticket_messages_is_internal_not_null` | NOT NULL | `NOT NULL is_internal` |
| `ticket_messages_message_type_not_null` | NOT NULL | `NOT NULL message_type` |
| `ticket_messages_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `ticket_messages_ticket_id_internal_id_not_null` | NOT NULL | `NOT NULL ticket_id_internal_id` |
| `ticket_messages_ticket_id_not_null` | NOT NULL | `NOT NULL ticket_id` |
| `ticket_messages_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_support_ticket_messages_author` | btree | `(author_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_ticket_messages_author ON support.ticket_messages USING btree (author_user_id)` |
| `ix_support_ticket_messages_ticket_time` | btree | `(ticket_id, created_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_ticket_messages_ticket_time ON support.ticket_messages USING btree (ticket_id, created_at)` |
| `pk_support_ticket_messages` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_support_ticket_messages ON support.ticket_messages USING btree (internal_id)` |
| `uq_support_ticket_messages_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_support_ticket_messages_id ON support.ticket_messages USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.ticket_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_messages FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
