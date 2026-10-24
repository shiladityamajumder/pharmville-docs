# `support.ticket_tag_assignments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds ticket tag assignments records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | support.ticket_tag_assignments |
| Classification | Mapping / Junction |
| Proposed business write owner | Future support owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 7 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 7 named PostgreSQL 18 NOT NULL constraints; 3 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `tag_id` | `uuid` | No | — | Reference linking this record to ticket tags | Ensures related business data can be joined and validated | FK → `support.ticket_tags` via `fk_support_ticket_tag_assignments_tag_id_ticket_tags` |
| `tag_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.ticket_tags` via `fk_support_ticket_tag_assignments_tag_id_ticket_tags_numeric` |
| `ticket_id` | `uuid` | No | — | Reference linking this record to tickets | Ensures related business data can be joined and validated | FK → `support.tickets` via `fk_support_ticket_tag_assignments_ticket_id_tickets` |
| `ticket_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.tickets` via `fk_support_ticket_tag_assignments_ticket_id_tickets_numeric` |

## Record lifecycle and users

- **Created:** when the ticket tag assignments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.ticket_tag_assignments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_support_ticket_tag_assignments_tag_id_ticket_tags | `tag_id` | [`support.ticket_tags`](../../Tables/support/ticket_tags.md) | `FOREIGN KEY (tag_id) REFERENCES support.ticket_tags(id) ON DELETE CASCADE` |
| fk_support_ticket_tag_assignments_tag_id_ticket_tags_numeric | `tag_id_internal_id` | [`support.ticket_tags`](../../Tables/support/ticket_tags.md) | `FOREIGN KEY (tag_id_internal_id) REFERENCES support.ticket_tags(internal_id) ON DELETE CASCADE` |
| fk_support_ticket_tag_assignments_ticket_id_tickets | `ticket_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| fk_support_ticket_tag_assignments_ticket_id_tickets_numeric | `ticket_id_internal_id` | [`support.tickets`](../../Tables/support/tickets.md) | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `support.ticket_tag_assignments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `tag_id` | `support.ticket_tags` | `fk_support_ticket_tag_assignments_tag_id_ticket_tags` |
| `tag_id_internal_id` | `support.ticket_tags` | `fk_support_ticket_tag_assignments_tag_id_ticket_tags_numeric` |
| `ticket_id` | `support.tickets` | `fk_support_ticket_tag_assignments_ticket_id_tickets` |
| `ticket_id_internal_id` | `support.tickets` | `fk_support_ticket_tag_assignments_ticket_id_tickets_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_ticket_tag_assignments_numeric_pair_tag_id` | CHECK | `CHECK ((tag_id IS NULL) = (tag_id_internal_id IS NULL))` |
| `ck_support_ticket_tag_assignments_numeric_pair_ticket_id` | CHECK | `CHECK ((ticket_id IS NULL) = (ticket_id_internal_id IS NULL))` |
| `fk_support_ticket_tag_assignments_tag_id_ticket_tags` | FOREIGN KEY | `FOREIGN KEY (tag_id) REFERENCES support.ticket_tags(id) ON DELETE CASCADE` |
| `fk_support_ticket_tag_assignments_tag_id_ticket_tags_numeric` | FOREIGN KEY | `FOREIGN KEY (tag_id_internal_id) REFERENCES support.ticket_tags(internal_id) ON DELETE CASCADE` |
| `fk_support_ticket_tag_assignments_ticket_id_tickets` | FOREIGN KEY | `FOREIGN KEY (ticket_id) REFERENCES support.tickets(id) ON DELETE CASCADE` |
| `fk_support_ticket_tag_assignments_ticket_id_tickets_numeric` | FOREIGN KEY | `FOREIGN KEY (ticket_id_internal_id) REFERENCES support.tickets(internal_id) ON DELETE CASCADE` |
| `pk_support_ticket_tag_assignments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `ticket_tag_assignment` | UNIQUE | `UNIQUE (ticket_id, tag_id)` |
| `uq_support_ticket_tag_assignments_id` | UNIQUE | `UNIQUE (id)` |
| `ticket_tag_assignments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `ticket_tag_assignments_id_not_null` | NOT NULL | `NOT NULL id` |
| `ticket_tag_assignments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `ticket_tag_assignments_tag_id_internal_id_not_null` | NOT NULL | `NOT NULL tag_id_internal_id` |
| `ticket_tag_assignments_tag_id_not_null` | NOT NULL | `NOT NULL tag_id` |
| `ticket_tag_assignments_ticket_id_internal_id_not_null` | NOT NULL | `NOT NULL ticket_id_internal_id` |
| `ticket_tag_assignments_ticket_id_not_null` | NOT NULL | `NOT NULL ticket_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `pk_support_ticket_tag_assignments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_support_ticket_tag_assignments ON support.ticket_tag_assignments USING btree (internal_id)` |
| `ticket_tag_assignment` | btree | `(ticket_id, tag_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX ticket_tag_assignment ON support.ticket_tag_assignments USING btree (ticket_id, tag_id)` |
| `uq_support_ticket_tag_assignments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_support_ticket_tag_assignments_id ON support.ticket_tag_assignments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_tag_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["tag_id","tag_id_internal_id","support","ticket_tags"],["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON support.ticket_tag_assignments FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.ticket_tag_assignments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["tag_id","tag_id_internal_id","support","ticket_tags"],["ticket_id","ticket_id_internal_id","support","tickets"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
