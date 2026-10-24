# `risk.blocklists`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds blocklists records within the risk domain (risk rules, cases and signals). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 10 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_blocklists_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_blocklists_deleted_by_users) |
| `entity_hash` | `character varying(255)` | No | — | Inferred: stores entity hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `entity_type` | `character varying(32)` | No | — | Inferred: stores entity type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `expires_at` | `timestamp with time zone` | Yes | — | Expiration time | Determine validity windows | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `reason_code` | `character varying(64)` | No | — | Code for reason | Link to controlled business classification or an external reference | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `source_case_id` | `uuid` | Yes | — | Reference linking this record to cases | Ensures related business data can be joined and validated | FK → `risk.cases` (fk_risk_blocklists_source_case_id_cases) |
| `source_case_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `risk.cases` (fk_risk_blocklists_source_case_id_cases_numeric); Numeric/public-key pair verification required |
| `status` | `character varying(32)` | No | `'active'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_risk_blocklists_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the blocklists business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `risk.blocklists` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_risk_blocklists_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_risk_blocklists_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_risk_blocklists_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `source_case_id` → `risk.cases(id)` via `fk_risk_blocklists_source_case_id_cases`; `FOREIGN KEY (source_case_id) REFERENCES risk.cases(id) ON DELETE SET NULL`
- `source_case_id_internal_id` → `risk.cases(internal_id)` via `fk_risk_blocklists_source_case_id_cases_numeric`; `FOREIGN KEY (source_case_id_internal_id) REFERENCES risk.cases(internal_id) ON DELETE SET NULL`

## `risk.blocklists` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 10 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_risk_blocklists_created_by_users` |
| `deleted_by` | `identity.users` | `fk_risk_blocklists_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_risk_blocklists_updated_by_users` |
| `source_case_id` | `risk.cases` | `fk_risk_blocklists_source_case_id_cases` |
| `source_case_id_internal_id` | `risk.cases` | `fk_risk_blocklists_source_case_id_cases_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `blocklist_entity_reason` | `CREATE UNIQUE INDEX blocklist_entity_reason ON risk.blocklists USING btree (entity_type, entity_hash, reason_code)` |
| `ix_risk_blocklists_entity` | `CREATE INDEX ix_risk_blocklists_entity ON risk.blocklists USING btree (entity_type, entity_hash)` |
| `pk_risk_blocklists` | `CREATE UNIQUE INDEX pk_risk_blocklists ON risk.blocklists USING btree (internal_id)` |
| `uq_risk_blocklists_id` | `CREATE UNIQUE INDEX uq_risk_blocklists_id ON risk.blocklists USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON risk.blocklists FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_case_id","source_case_id_internal_id","risk","cases"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON risk.blocklists FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON risk.blocklists FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["source_case_id","source_case_id_internal_id","risk","cases"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
