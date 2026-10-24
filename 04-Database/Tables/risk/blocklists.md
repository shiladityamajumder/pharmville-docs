# `risk.blocklists`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds blocklists records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | risk.blocklists |
| Classification | Configuration |
| Proposed business write owner | Future risk owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 10 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 4 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_blocklists_created_by_users` |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | Exact constraints below |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_blocklists_deleted_by_users` |
| `entity_hash` | `character varying(255)` | No | — | Inferred: stores entity hash for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `entity_type` | `character varying(32)` | No | — | Inferred: stores entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | Exact constraints below |
| `reason_code` | `character varying(64)` | No | — | Code for reason | Link to controlled business classification or an external reference | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `source_case_id` | `uuid` | Yes | — | Reference linking this record to cases | Ensures related business data can be joined and validated | FK → `risk.cases` via `fk_risk_blocklists_source_case_id_cases` |
| `source_case_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `risk.cases` via `fk_risk_blocklists_source_case_id_cases_numeric` |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_risk_blocklists_updated_by_users` |

## Record lifecycle and users

- **Created:** when the blocklists business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.blocklists` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_risk_blocklists_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_risk_blocklists_deleted_by_users | `deleted_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_risk_blocklists_source_case_id_cases | `source_case_id` | [`risk.cases`](../../Tables/risk/cases.md) | `FOREIGN KEY (source_case_id) REFERENCES risk.cases(id) ON DELETE SET NULL` |
| fk_risk_blocklists_source_case_id_cases_numeric | `source_case_id_internal_id` | [`risk.cases`](../../Tables/risk/cases.md) | `FOREIGN KEY (source_case_id_internal_id) REFERENCES risk.cases(internal_id) ON DELETE SET NULL` |
| fk_risk_blocklists_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `risk.blocklists` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_risk_blocklists_created_by_users` |
| `deleted_by` | `identity.users` | `fk_risk_blocklists_deleted_by_users` |
| `source_case_id` | `risk.cases` | `fk_risk_blocklists_source_case_id_cases` |
| `source_case_id_internal_id` | `risk.cases` | `fk_risk_blocklists_source_case_id_cases_numeric` |
| `updated_by` | `identity.users` | `fk_risk_blocklists_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `blocklist_entity_reason` | UNIQUE | `UNIQUE (entity_type, entity_hash, reason_code)` |
| `ck_risk_blocklists_numeric_pair_source_case_id` | CHECK | `CHECK ((source_case_id IS NULL) = (source_case_id_internal_id IS NULL))` |
| `ck_risk_blocklists_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_risk_blocklists_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_risk_blocklists_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_risk_blocklists_source_case_id_cases` | FOREIGN KEY | `FOREIGN KEY (source_case_id) REFERENCES risk.cases(id) ON DELETE SET NULL` |
| `fk_risk_blocklists_source_case_id_cases_numeric` | FOREIGN KEY | `FOREIGN KEY (source_case_id_internal_id) REFERENCES risk.cases(internal_id) ON DELETE SET NULL` |
| `fk_risk_blocklists_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_risk_blocklists` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_risk_blocklists_id` | UNIQUE | `UNIQUE (id)` |
| `blocklists_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `blocklists_entity_hash_not_null` | NOT NULL | `NOT NULL entity_hash` |
| `blocklists_entity_type_not_null` | NOT NULL | `NOT NULL entity_type` |
| `blocklists_id_not_null` | NOT NULL | `NOT NULL id` |
| `blocklists_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `blocklists_is_deleted_not_null` | NOT NULL | `NOT NULL is_deleted` |
| `blocklists_reason_code_not_null` | NOT NULL | `NOT NULL reason_code` |
| `blocklists_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `blocklists_status_not_null` | NOT NULL | `NOT NULL status` |
| `blocklists_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `blocklist_entity_reason` | btree | `(entity_type, entity_hash, reason_code)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX blocklist_entity_reason ON risk.blocklists USING btree (entity_type, entity_hash, reason_code)` |
| `ix_risk_blocklists_entity` | btree | `(entity_type, entity_hash)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_risk_blocklists_entity ON risk.blocklists USING btree (entity_type, entity_hash)` |
| `pk_risk_blocklists` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_risk_blocklists ON risk.blocklists USING btree (internal_id)` |
| `uq_risk_blocklists_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_risk_blocklists_id ON risk.blocklists USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.blocklists FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_case_id","source_case_id_internal_id","risk","cases"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON risk.blocklists FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.blocklists FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_case_id","source_case_id_internal_id","risk","cases"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
