# `insurance.claim_documents`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds claim documents records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | insurance.claim_documents |
| Classification | Mapping / Junction |
| Proposed business write owner | Future insurance owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 12 columns; 12 PK/FK/UQ/CHECK/exclusion constraints; 10 named PostgreSQL 18 NOT NULL constraints; 5 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `claim_id` | `uuid` | No | — | Reference linking this record to claims | Ensures related business data can be joined and validated | FK → `insurance.claims` via `fk_insurance_claim_documents_claim_id_claims` |
| `claim_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.claims` via `fk_insurance_claim_documents_claim_id_claims_numeric` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_claim_documents_created_by_users` |
| `document_type` | `character varying(64)` | No | — | Inferred: stores document type for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` via `fk_insurance_claim_documents_file_object_id_file_objects` |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` via `fk_insurance_claim_documents_file_object_id_file_object_2e7f` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_insurance_claim_documents_updated_by_users` |

## Record lifecycle and users

- **Created:** when the claim documents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.claim_documents` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_insurance_claim_documents_claim_id_claims | `claim_id` | [`insurance.claims`](../../Tables/insurance/claims.md) | `FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE` |
| fk_insurance_claim_documents_claim_id_claims_numeric | `claim_id_internal_id` | [`insurance.claims`](../../Tables/insurance/claims.md) | `FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE` |
| fk_insurance_claim_documents_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_insurance_claim_documents_file_object_id_file_object_2e7f | `file_object_id_internal_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| fk_insurance_claim_documents_file_object_id_file_objects | `file_object_id` | [`platform.file_objects`](../../Tables/platform/file_objects.md) | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| fk_insurance_claim_documents_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

No inbound FK is present in the validated catalog.

## `insurance.claim_documents` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `claim_id` | `insurance.claims` | `fk_insurance_claim_documents_claim_id_claims` |
| `claim_id_internal_id` | `insurance.claims` | `fk_insurance_claim_documents_claim_id_claims_numeric` |
| `created_by` | `identity.users` | `fk_insurance_claim_documents_created_by_users` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_insurance_claim_documents_file_object_id_file_object_2e7f` |
| `file_object_id` | `platform.file_objects` | `fk_insurance_claim_documents_file_object_id_file_objects` |
| `updated_by` | `identity.users` | `fk_insurance_claim_documents_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_insurance_claim_documents_numeric_pair_claim_id` | CHECK | `CHECK ((claim_id IS NULL) = (claim_id_internal_id IS NULL))` |
| `ck_insurance_claim_documents_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `ck_insurance_claim_documents_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `claim_document_file` | UNIQUE | `UNIQUE (file_object_id)` |
| `fk_insurance_claim_documents_claim_id_claims` | FOREIGN KEY | `FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE` |
| `fk_insurance_claim_documents_claim_id_claims_numeric` | FOREIGN KEY | `FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE` |
| `fk_insurance_claim_documents_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_insurance_claim_documents_file_object_id_file_object_2e7f` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `fk_insurance_claim_documents_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_insurance_claim_documents_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_insurance_claim_documents` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_insurance_claim_documents_id` | UNIQUE | `UNIQUE (id)` |
| `claim_documents_claim_id_internal_id_not_null` | NOT NULL | `NOT NULL claim_id_internal_id` |
| `claim_documents_claim_id_not_null` | NOT NULL | `NOT NULL claim_id` |
| `claim_documents_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `claim_documents_document_type_not_null` | NOT NULL | `NOT NULL document_type` |
| `claim_documents_file_object_id_internal_id_not_null` | NOT NULL | `NOT NULL file_object_id_internal_id` |
| `claim_documents_file_object_id_not_null` | NOT NULL | `NOT NULL file_object_id` |
| `claim_documents_id_not_null` | NOT NULL | `NOT NULL id` |
| `claim_documents_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `claim_documents_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `claim_documents_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `claim_document_file` | btree | `(file_object_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX claim_document_file ON insurance.claim_documents USING btree (file_object_id)` |
| `ix_insurance_claim_documents_claim` | btree | `(claim_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_claim_documents_claim ON insurance.claim_documents USING btree (claim_id)` |
| `ix_insurance_claim_documents_file` | btree | `(file_object_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_insurance_claim_documents_file ON insurance.claim_documents USING btree (file_object_id)` |
| `pk_insurance_claim_documents` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_insurance_claim_documents ON insurance.claim_documents USING btree (internal_id)` |
| `uq_insurance_claim_documents_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_insurance_claim_documents_id ON insurance.claim_documents USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"],["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.claim_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"],["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
