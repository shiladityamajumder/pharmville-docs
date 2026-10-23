# compliance.privacy_requests

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds privacy requests records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 15 columns, 7 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `completed_at` | `timestamp with time zone` | Yes | — | Time of completed | Support chronology, deadlines or audit evidence | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_privacy_requests_created_by_users) |
| `due_at` | `timestamp with time zone` | Yes | — | Time of due | Support chronology, deadlines or audit evidence | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `request_number` | `character varying(64)` | No | — | Inferred: stores request number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `request_type` | `character varying(64)` | No | — | Inferred: stores request type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requested_at` | `timestamp with time zone` | No | `now()` | Time of requested | Support chronology, deadlines or audit evidence | See exact constraints |
| `resolution_notes` | `text` | Yes | — | Inferred: stores resolution notes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `status` | `character varying(32)` | No | `'received'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_privacy_requests_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_compliance_privacy_requests_user_id_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the privacy requests business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.privacy_requests` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_compliance_privacy_requests_user_id_users`; FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT
- `created_by` → `identity.users(id)` via `fk_compliance_privacy_requests_created_by_users`; FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT
- `updated_by` → `identity.users(id)` via `fk_compliance_privacy_requests_updated_by_users`; FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT

## compliance.privacy_requests — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 15 columns, 7 constraints, 4 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_compliance_privacy_requests_user_id_users` |
| `created_by` | `identity.users` | `fk_compliance_privacy_requests_created_by_users` |
| `updated_by` | `identity.users` | `fk_compliance_privacy_requests_updated_by_users` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_privacy_requests_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_compliance_privacy_requests_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_privacy_requests_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_compliance_privacy_requests_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_compliance_privacy_requests` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `privacy_request_number` | UNIQUE | `UNIQUE (request_number)` |
| `uq_compliance_privacy_requests_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_compliance_privacy_requests_user_status` | `CREATE INDEX ix_compliance_privacy_requests_user_status ON compliance.privacy_requests USING btree (user_id, status)` |
| `pk_compliance_privacy_requests` | `CREATE UNIQUE INDEX pk_compliance_privacy_requests ON compliance.privacy_requests USING btree (internal_id)` |
| `privacy_request_number` | `CREATE UNIQUE INDEX privacy_request_number ON compliance.privacy_requests USING btree (request_number)` |
| `uq_compliance_privacy_requests_id` | `CREATE UNIQUE INDEX uq_compliance_privacy_requests_id ON compliance.privacy_requests USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.privacy_requests FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON compliance.privacy_requests FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.privacy_requests FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
