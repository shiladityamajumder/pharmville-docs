# `clinical.prescription_access_logs`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds prescription access logs records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | clinical.prescription_access_logs |
| Classification | Audit / History |
| Proposed business write owner | Prescription_Upload |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 11 columns; 6 PK/FK/UQ/CHECK/exclusion constraints; 9 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | `character varying(32)` | No | — | Inferred: stores action for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_clinical_prescription_access_logs_actor_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | Exact constraints below |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` via `fk_clinical_prescription_access_logs_prescription_id_pr_fb69` |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` via `fk_clinical_prescription_access_logs_prescription_id_pr_2810` |
| `purpose` | `character varying(128)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `request_id` | `uuid` | No | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | Exact constraints below |

## Record lifecycle and users

- **Created:** when the prescription access logs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescription_access_logs` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_clinical_prescription_access_logs_actor_user_id_users | `actor_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| fk_clinical_prescription_access_logs_prescription_id_pr_2810 | `prescription_id_internal_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| fk_clinical_prescription_access_logs_prescription_id_pr_fb69 | `prescription_id` | [`clinical.prescriptions`](../../Tables/clinical/prescriptions.md) | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `clinical.prescription_access_logs` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_clinical_prescription_access_logs_actor_user_id_users` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_prescription_access_logs_prescription_id_pr_2810` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_prescription_access_logs_prescription_id_pr_fb69` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_prescription_access_logs_numeric_pair_presc_af20` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `fk_clinical_prescription_access_logs_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_clinical_prescription_access_logs_prescription_id_pr_2810` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| `fk_clinical_prescription_access_logs_prescription_id_pr_fb69` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |
| `pk_clinical_prescription_access_logs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_prescription_access_logs_id` | UNIQUE | `UNIQUE (id)` |
| `prescription_access_logs_action_not_null` | NOT NULL | `NOT NULL action` |
| `prescription_access_logs_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `prescription_access_logs_id_not_null` | NOT NULL | `NOT NULL id` |
| `prescription_access_logs_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `prescription_access_logs_occurred_at_not_null` | NOT NULL | `NOT NULL occurred_at` |
| `prescription_access_logs_prescription_id_internal_id_not_null` | NOT NULL | `NOT NULL prescription_id_internal_id` |
| `prescription_access_logs_prescription_id_not_null` | NOT NULL | `NOT NULL prescription_id` |
| `prescription_access_logs_purpose_not_null` | NOT NULL | `NOT NULL purpose` |
| `prescription_access_logs_request_id_not_null` | NOT NULL | `NOT NULL request_id` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_clinical_rx_access_actor` | btree | `(actor_user_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_rx_access_actor ON clinical.prescription_access_logs USING btree (actor_user_id)` |
| `ix_clinical_rx_access_prescription_time` | btree | `(prescription_id, occurred_at)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_rx_access_prescription_time ON clinical.prescription_access_logs USING btree (prescription_id, occurred_at)` |
| `ix_clinical_rx_access_request` | btree | `(request_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_clinical_rx_access_request ON clinical.prescription_access_logs USING btree (request_id)` |
| `pk_clinical_prescription_access_logs` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_clinical_prescription_access_logs ON clinical.prescription_access_logs USING btree (internal_id)` |
| `uq_clinical_prescription_access_logs_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_clinical_prescription_access_logs_id ON clinical.prescription_access_logs USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_access_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` | O |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON clinical.prescription_access_logs FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_access_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
