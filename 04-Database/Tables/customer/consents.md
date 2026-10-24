# `customer.consents`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds consents records within the customer domain (customer profiles and addresses). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | customer.consents |
| Classification | Transactional |
| Proposed business write owner | Customer_Accounts |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 17 columns; 9 PK/FK/UQ/CHECK/exclusion constraints; 12 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `consent_type` | `character varying(64)` | No | — | Inferred: stores consent type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_consents_created_by_users` |
| `evidence` | `jsonb` | No | `'{}'::jsonb` | Structured evidence information | Retain a versioned payload or relevant details | Exact constraints below |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | Exact constraints below |
| `granted_at` | `timestamp with time zone` | Yes | — | Time of granted | Support chronology, deadlines or audit evidence | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `purpose` | `character varying(128)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `source` | `character varying(32)` | No | — | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(16)` | No | — | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_consents_updated_by_users` |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_customer_consents_user_id_users` |
| `version` | `character varying(32)` | No | — | Inferred: stores version for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `withdrawn_at` | `timestamp with time zone` | Yes | — | Time of withdrawn | Support chronology, deadlines or audit evidence | Exact constraints below |

## Record lifecycle and users

- **Created:** when the consents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Cart_Checkout, Prescription_Upload. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `customer.consents` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_customer_consents_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_consents_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_customer_consents_user_id_users | `user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`customer.consent_events`](../../Tables/customer/consent_events.md) | fk_customer_consent_events_consent_id_consents | `consent_id` | `id` |
| [`customer.consent_events`](../../Tables/customer/consent_events.md) | fk_customer_consent_events_consent_id_consents_numeric | `consent_id_internal_id` | `internal_id` |

## `customer.consents` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_customer_consents_created_by_users` |
| `updated_by` | `identity.users` | `fk_customer_consents_updated_by_users` |
| `user_id` | `identity.users` | `fk_customer_consents_user_id_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_customer_consents_consentstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['requested'::text, 'granted'::text, 'denied'::text, 'revoked'::text, 'expired'::text]))` |
| `ck_customer_consents_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_customer_consents_withdrawn_after_granted` | CHECK | `CHECK (withdrawn_at IS NULL OR granted_at IS NULL OR withdrawn_at >= granted_at)` |
| `fk_customer_consents_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_consents_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_customer_consents_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_customer_consents` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_customer_consents_id` | UNIQUE | `UNIQUE (id)` |
| `user_consent_version` | UNIQUE | `UNIQUE (user_id, consent_type, version, purpose)` |
| `consents_consent_type_not_null` | NOT NULL | `NOT NULL consent_type` |
| `consents_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `consents_evidence_not_null` | NOT NULL | `NOT NULL evidence` |
| `consents_id_not_null` | NOT NULL | `NOT NULL id` |
| `consents_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `consents_purpose_not_null` | NOT NULL | `NOT NULL purpose` |
| `consents_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `consents_source_not_null` | NOT NULL | `NOT NULL source` |
| `consents_status_not_null` | NOT NULL | `NOT NULL status` |
| `consents_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |
| `consents_user_id_not_null` | NOT NULL | `NOT NULL user_id` |
| `consents_version_not_null` | NOT NULL | `NOT NULL version` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_customer_consents_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_consents_status ON customer.consents USING btree (status)` |
| `ix_customer_consents_user_id` | btree | `(user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_customer_consents_user_id ON customer.consents USING btree (user_id)` |
| `pk_customer_consents` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_customer_consents ON customer.consents USING btree (internal_id)` |
| `uq_customer_consents_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_customer_consents_id ON customer.consents USING btree (id)` |
| `user_consent_version` | btree | `(user_id, consent_type, version, purpose)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX user_consent_version ON customer.consents USING btree (user_id, consent_type, version, purpose)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON customer.consents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON customer.consents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON customer.consents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
