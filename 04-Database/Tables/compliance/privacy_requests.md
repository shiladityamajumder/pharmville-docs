# `compliance.privacy_requests`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds privacy requests records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | compliance.privacy_requests |
| Classification | Transactional |
| Proposed business write owner | Customer_Accounts via Privacy/Legal owner |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 15 columns; 7 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | Exact constraints below |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_privacy_requests_created_by_users` |
| `due_at` | `timestamp with time zone` | Yes | — | Time of due | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `request_number` | `character varying(64)` | No | — | Inferred: stores request number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `request_type` | `character varying(64)` | No | — | Inferred: stores request type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `requested_at` | `timestamp with time zone` | No | `now()` | Time of requested | Support chronology, deadlines or audit evidence | Exact constraints below |
| `resolution_notes` | `text` | Yes | — | Inferred: stores resolution notes for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `status` | `character varying(32)` | No | `'received'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_privacy_requests_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_compliance_privacy_requests_user_id_users` |

## Record lifecycle and users

- **Created:** when the privacy requests business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.privacy_requests` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_compliance_privacy_requests_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_privacy_requests_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_compliance_privacy_requests_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `compliance.privacy_requests` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_compliance_privacy_requests_created_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_privacy_requests_updated_by_users` |
| `user_id` | `identity.users` | `fk_compliance_privacy_requests_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_privacy_requests_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_compliance_privacy_requests_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_privacy_requests_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_privacy_requests_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_privacy_requests` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `privacy_request_number` | UNIQUE | `UNIQUE (request_number)` |
| `uq_compliance_privacy_requests_id` | UNIQUE | `UNIQUE (id)` |
| `privacy_requests_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `privacy_requests_id_not_null` | NOT NULL | `NOT NULL id` |
| `privacy_requests_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `privacy_requests_request_number_not_null` | NOT NULL | `NOT NULL request_number` |
| `privacy_requests_request_type_not_null` | NOT NULL | `NOT NULL request_type` |
| `privacy_requests_requested_at_not_null` | NOT NULL | `NOT NULL requested_at` |
| `privacy_requests_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `privacy_requests_status_not_null` | NOT NULL | `NOT NULL status` |
| `privacy_requests_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `privacy_requests_user_id_not_null` | NOT NULL | `NOT NULL user_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_compliance_privacy_requests_user_status` | btree | `(user_id, status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_compliance_privacy_requests_user_status ON compliance.privacy_requests USING btree (user_id, status)` |
| `pk_compliance_privacy_requests` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_compliance_privacy_requests ON compliance.privacy_requests USING btree (internal_id)` |
| `privacy_request_number` | btree | `(request_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX privacy_request_number ON compliance.privacy_requests USING btree (request_number)` |
| `uq_compliance_privacy_requests_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_compliance_privacy_requests_id ON compliance.privacy_requests USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.privacy_requests FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.privacy_requests FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.privacy_requests FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
