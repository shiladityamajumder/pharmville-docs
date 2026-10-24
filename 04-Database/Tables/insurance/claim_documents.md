# `insurance.claim_documents`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds claim documents records within the insurance domain (policies and claims). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 12 columns, 12 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `claim_id` | `uuid` | No | — | Reference linking this record to claims | Ensures related business data can be joined and validated | FK → `insurance.claims` (fk_insurance_claim_documents_claim_id_claims) |
| `claim_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `insurance.claims` (fk_insurance_claim_documents_claim_id_claims_numeric); Numeric/public-key pair verification required |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_claim_documents_created_by_users) |
| `document_type` | `character varying(64)` | No | — | Inferred: stores document type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `file_object_id` | `uuid` | No | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_insurance_claim_documents_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_insurance_claim_documents_file_object_id_file_object_2e7f); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_insurance_claim_documents_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the claim documents business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `insurance.claim_documents` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_insurance_claim_documents_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_insurance_claim_documents_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `file_object_id` → `platform.file_objects(id)` via `fk_insurance_claim_documents_file_object_id_file_objects`; `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT`
- `claim_id` → `insurance.claims(id)` via `fk_insurance_claim_documents_claim_id_claims`; `FOREIGN KEY (claim_id) REFERENCES insurance.claims(id) ON DELETE CASCADE`
- `claim_id_internal_id` → `insurance.claims(internal_id)` via `fk_insurance_claim_documents_claim_id_claims_numeric`; `FOREIGN KEY (claim_id_internal_id) REFERENCES insurance.claims(internal_id) ON DELETE CASCADE`
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_insurance_claim_documents_file_object_id_file_object_2e7f`; `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT`

## `insurance.claim_documents` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 12 columns, 12 constraints, 5 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_insurance_claim_documents_created_by_users` |
| `updated_by` | `identity.users` | `fk_insurance_claim_documents_updated_by_users` |
| `file_object_id` | `platform.file_objects` | `fk_insurance_claim_documents_file_object_id_file_objects` |
| `claim_id` | `insurance.claims` | `fk_insurance_claim_documents_claim_id_claims` |
| `claim_id_internal_id` | `insurance.claims` | `fk_insurance_claim_documents_claim_id_claims_numeric` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_insurance_claim_documents_file_object_id_file_object_2e7f` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `claim_document_file` | `CREATE UNIQUE INDEX claim_document_file ON insurance.claim_documents USING btree (file_object_id)` |
| `ix_insurance_claim_documents_claim` | `CREATE INDEX ix_insurance_claim_documents_claim ON insurance.claim_documents USING btree (claim_id)` |
| `ix_insurance_claim_documents_file` | `CREATE INDEX ix_insurance_claim_documents_file ON insurance.claim_documents USING btree (file_object_id)` |
| `pk_insurance_claim_documents` | `CREATE UNIQUE INDEX pk_insurance_claim_documents ON insurance.claim_documents USING btree (internal_id)` |
| `uq_insurance_claim_documents_id` | `CREATE UNIQUE INDEX uq_insurance_claim_documents_id ON insurance.claim_documents USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"],["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON insurance.claim_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON insurance.claim_documents FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["claim_id","claim_id_internal_id","insurance","claims"],["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
