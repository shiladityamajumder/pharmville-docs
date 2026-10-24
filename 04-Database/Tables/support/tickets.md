# `support.tickets`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds tickets records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | support.tickets |
| Classification | Transactional |
| Proposed business write owner | Future support owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 30 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 11 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_id` | `uuid` | Yes | — | Reference linking this record to appointments | Ensures related business data can be joined and validated | FK → `appointment.appointments` via `fk_support_tickets_appointment_id_appointments` |
| `appointment_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointments` via `fk_support_tickets_appointment_id_appointments_numeric` |
| `assigned_team` | `character varying(64)` | Yes | — | Inferred: stores assigned team for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `assigned_to_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_tickets_assigned_to_user_id_users` |
| `category` | `character varying(64)` | No | — | Inferred: stores category for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `closed_at` | `timestamp with time zone` | Yes | — | Time of closed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_tickets_created_by_users` |
| `description` | `text` | No | — | Inferred: stores description for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `diagnostic_order_id` | `uuid` | Yes | — | Reference linking this record to diagnostic orders | Ensures related business data can be joined and validated | FK → `diagnostics.diagnostic_orders` via `fk_support_tickets_diagnostic_order_id_diagnostic_orders` |
| `diagnostic_order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `diagnostics.diagnostic_orders` via `fk_support_tickets_diagnostic_order_id_diagnostic_order_e812` |
| `first_responded_at` | `timestamp with time zone` | Yes | — | Time of first responded | Support chronology, deadlines or audit evidence | Exact constraints below |
| `first_response_due_at` | `timestamp with time zone` | Yes | — | Time of first response due | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `order_id` | `uuid` | Yes | — | Reference linking this record to orders | Ensures related business data can be joined and validated | FK → `commerce.orders` via `fk_support_tickets_order_id_orders` |
| `order_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `commerce.orders` via `fk_support_tickets_order_id_orders_numeric` |
| `priority` | `character varying(16)` | No | — | Inferred: stores priority for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `resolution_due_at` | `timestamp with time zone` | Yes | — | Time of resolution due | Support chronology, deadlines or audit evidence | Exact constraints below |
| `resolved_at` | `timestamp with time zone` | Yes | — | Time of resolved | Support chronology, deadlines or audit evidence | Exact constraints below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `sla_policy_id` | `uuid` | Yes | — | Reference linking this record to sla policies | Ensures related business data can be joined and validated | FK → `support.sla_policies` via `fk_support_tickets_sla_policy_id_sla_policies` |
| `sla_policy_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `support.sla_policies` via `fk_support_tickets_sla_policy_id_sla_policies_numeric` |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `subcategory` | `character varying(64)` | Yes | — | Inferred: stores subcategory for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `subject` | `character varying(255)` | No | — | Inferred: stores subject for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `ticket_number` | `character varying(64)` | No | — | Inferred: stores ticket number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_tickets_updated_by_users` |
| `user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_support_tickets_user_id_users` |

## Record lifecycle and users

- **Created:** when the tickets business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `support.tickets` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_support_tickets_appointment_id_appointments | `appointment_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL` |
| fk_support_tickets_appointment_id_appointments_numeric | `appointment_id_internal_id` | [`appointment.appointments`](../../Tables/appointment/appointments.md) | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL` |
| fk_support_tickets_assigned_to_user_id_users | `assigned_to_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_support_tickets_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_support_tickets_diagnostic_order_id_diagnostic_order_e812 | `diagnostic_order_id_internal_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE SET NULL` |
| fk_support_tickets_diagnostic_order_id_diagnostic_orders | `diagnostic_order_id` | [`diagnostics.diagnostic_orders`](../../Tables/diagnostics/diagnostic_orders.md) | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE SET NULL` |
| fk_support_tickets_order_id_orders | `order_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE SET NULL` |
| fk_support_tickets_order_id_orders_numeric | `order_id_internal_id` | [`commerce.orders`](../../Tables/commerce/orders.md) | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE SET NULL` |
| fk_support_tickets_sla_policy_id_sla_policies | `sla_policy_id` | [`support.sla_policies`](../../Tables/support/sla_policies.md) | `FOREIGN KEY (sla_policy_id) REFERENCES support.sla_policies(id) ON DELETE SET NULL` |
| fk_support_tickets_sla_policy_id_sla_policies_numeric | `sla_policy_id_internal_id` | [`support.sla_policies`](../../Tables/support/sla_policies.md) | `FOREIGN KEY (sla_policy_id_internal_id) REFERENCES support.sla_policies(internal_id) ON DELETE SET NULL` |
| fk_support_tickets_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_support_tickets_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`support.ticket_actions`](../../Tables/support/ticket_actions.md) | fk_support_ticket_actions_ticket_id_tickets | `ticket_id` | `id` |
| [`support.ticket_actions`](../../Tables/support/ticket_actions.md) | fk_support_ticket_actions_ticket_id_tickets_numeric | `ticket_id_internal_id` | `internal_id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_ticket_id_tickets | `ticket_id` | `id` |
| [`support.ticket_attachments`](../../Tables/support/ticket_attachments.md) | fk_support_ticket_attachments_ticket_id_tickets_numeric | `ticket_id_internal_id` | `internal_id` |
| [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | fk_support_ticket_messages_ticket_id_tickets | `ticket_id` | `id` |
| [`support.ticket_messages`](../../Tables/support/ticket_messages.md) | fk_support_ticket_messages_ticket_id_tickets_numeric | `ticket_id_internal_id` | `internal_id` |
| [`support.ticket_status_history`](../../Tables/support/ticket_status_history.md) | fk_support_ticket_status_history_ticket_id_tickets | `ticket_id` | `id` |
| [`support.ticket_status_history`](../../Tables/support/ticket_status_history.md) | fk_support_ticket_status_history_ticket_id_tickets_numeric | `ticket_id_internal_id` | `internal_id` |
| [`support.ticket_tag_assignments`](../../Tables/support/ticket_tag_assignments.md) | fk_support_ticket_tag_assignments_ticket_id_tickets | `ticket_id` | `id` |
| [`support.ticket_tag_assignments`](../../Tables/support/ticket_tag_assignments.md) | fk_support_ticket_tag_assignments_ticket_id_tickets_numeric | `ticket_id_internal_id` | `internal_id` |

## `support.tickets` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `appointment_id` | `appointment.appointments` | `fk_support_tickets_appointment_id_appointments` |
| `appointment_id_internal_id` | `appointment.appointments` | `fk_support_tickets_appointment_id_appointments_numeric` |
| `assigned_to_user_id` | `identity.users` | `fk_support_tickets_assigned_to_user_id_users` |
| `created_by` | `identity.users` | `fk_support_tickets_created_by_users` |
| `diagnostic_order_id_internal_id` | `diagnostics.diagnostic_orders` | `fk_support_tickets_diagnostic_order_id_diagnostic_order_e812` |
| `diagnostic_order_id` | `diagnostics.diagnostic_orders` | `fk_support_tickets_diagnostic_order_id_diagnostic_orders` |
| `order_id` | `commerce.orders` | `fk_support_tickets_order_id_orders` |
| `order_id_internal_id` | `commerce.orders` | `fk_support_tickets_order_id_orders_numeric` |
| `sla_policy_id` | `support.sla_policies` | `fk_support_tickets_sla_policy_id_sla_policies` |
| `sla_policy_id_internal_id` | `support.sla_policies` | `fk_support_tickets_sla_policy_id_sla_policies_numeric` |
| `updated_by` | `identity.users` | `fk_support_tickets_updated_by_users` |
| `user_id` | `identity.users` | `fk_support_tickets_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_support_tickets_numeric_pair_appointment_id` | CHECK | `CHECK ((appointment_id IS NULL) = (appointment_id_internal_id IS NULL))` |
| `ck_support_tickets_numeric_pair_diagnostic_order_id` | CHECK | `CHECK ((diagnostic_order_id IS NULL) = (diagnostic_order_id_internal_id IS NULL))` |
| `ck_support_tickets_numeric_pair_order_id` | CHECK | `CHECK ((order_id IS NULL) = (order_id_internal_id IS NULL))` |
| `ck_support_tickets_numeric_pair_sla_policy_id` | CHECK | `CHECK ((sla_policy_id IS NULL) = (sla_policy_id_internal_id IS NULL))` |
| `ck_support_tickets_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_support_tickets_ticketstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['open'::text, 'pending_customer'::text, 'pending_internal'::text, 'resolved'::text, 'closed'::text, 'reopened'::text]))` |
| `fk_support_tickets_appointment_id_appointments` | FOREIGN KEY | `FOREIGN KEY (appointment_id) REFERENCES appointment.appointments(id) ON DELETE SET NULL` |
| `fk_support_tickets_appointment_id_appointments_numeric` | FOREIGN KEY | `FOREIGN KEY (appointment_id_internal_id) REFERENCES appointment.appointments(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_assigned_to_user_id_users` | FOREIGN KEY | `FOREIGN KEY (assigned_to_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_support_tickets_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_tickets_diagnostic_order_id_diagnostic_order_e812` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id_internal_id) REFERENCES diagnostics.diagnostic_orders(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_diagnostic_order_id_diagnostic_orders` | FOREIGN KEY | `FOREIGN KEY (diagnostic_order_id) REFERENCES diagnostics.diagnostic_orders(id) ON DELETE SET NULL` |
| `fk_support_tickets_order_id_orders` | FOREIGN KEY | `FOREIGN KEY (order_id) REFERENCES commerce.orders(id) ON DELETE SET NULL` |
| `fk_support_tickets_order_id_orders_numeric` | FOREIGN KEY | `FOREIGN KEY (order_id_internal_id) REFERENCES commerce.orders(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_sla_policy_id_sla_policies` | FOREIGN KEY | `FOREIGN KEY (sla_policy_id) REFERENCES support.sla_policies(id) ON DELETE SET NULL` |
| `fk_support_tickets_sla_policy_id_sla_policies_numeric` | FOREIGN KEY | `FOREIGN KEY (sla_policy_id_internal_id) REFERENCES support.sla_policies(internal_id) ON DELETE SET NULL` |
| `fk_support_tickets_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_support_tickets_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `pk_support_tickets` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `ticket_number` | UNIQUE | `UNIQUE (ticket_number)` |
| `uq_support_tickets_id` | UNIQUE | `UNIQUE (id)` |
| `tickets_category_not_null` | NOT NULL | `NOT NULL category` |
| `tickets_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `tickets_description_not_null` | NOT NULL | `NOT NULL description` |
| `tickets_id_not_null` | NOT NULL | `NOT NULL id` |
| `tickets_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `tickets_priority_not_null` | NOT NULL | `NOT NULL priority` |
| `tickets_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `tickets_status_not_null` | NOT NULL | `NOT NULL status` |
| `tickets_subject_not_null` | NOT NULL | `NOT NULL subject` |
| `tickets_ticket_number_not_null` | NOT NULL | `NOT NULL ticket_number` |
| `tickets_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_support_tickets_assignee` | btree | `(assigned_to_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_tickets_assignee ON support.tickets USING btree (assigned_to_user_id)` |
| `ix_support_tickets_order` | btree | `(order_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_tickets_order ON support.tickets USING btree (order_id)` |
| `ix_support_tickets_status_priority` | btree | `(status, priority)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_tickets_status_priority ON support.tickets USING btree (status, priority)` |
| `ix_support_tickets_user` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_support_tickets_user ON support.tickets USING btree (user_id)` |
| `pk_support_tickets` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_support_tickets ON support.tickets USING btree (internal_id)` |
| `ticket_number` | btree | `(ticket_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX ticket_number ON support.tickets USING btree (ticket_number)` |
| `uq_support_tickets_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_support_tickets_id ON support.tickets USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON support.tickets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["order_id","order_id_internal_id","commerce","orders"],["sla_policy_id","sla_policy_id_internal_id","support","sla_policies"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON support.tickets FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON support.tickets FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["appointment_id","appointment_id_internal_id","appointment","appointments"],["diagnostic_order_id","diagnostic_order_id_internal_id","diagnostics","diagnostic_orders"],["order_id","order_id_internal_id","commerce","orders"],["sla_policy_id","sla_policy_id_internal_id","support","sla_policies"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
