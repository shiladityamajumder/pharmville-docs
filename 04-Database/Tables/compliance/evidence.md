# `compliance.evidence`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds evidence records within the compliance domain (regulatory documentation and retention actions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 5 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `category` | `character varying(64)` | No | — | Inferred: stores category for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `evidence_type` | `character varying(64)` | No | — | Inferred: stores evidence type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `file_object_id` | `uuid` | Yes | — | Reference linking this record to file objects | Ensures related business data can be joined and validated | FK → `platform.file_objects` (fk_compliance_evidence_file_object_id_file_objects) |
| `file_object_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `platform.file_objects` (fk_compliance_evidence_file_object_id_file_objects_numeric); Numeric/public-key pair verification required |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `payload_hash` | `character varying(64)` | Yes | — | Inferred: stores payload hash for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `reference_id` | `uuid` | No | — | Identifier associated with reference | Link the event or entity to its subject; verify constraints | See exact constraints |
| `reference_type` | `character varying(64)` | No | — | Inferred: stores reference type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the evidence business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Pharmacist_Review, Audit. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `compliance.evidence` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `file_object_id` → `platform.file_objects(id)` via `fk_compliance_evidence_file_object_id_file_objects`; `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT`
- `file_object_id_internal_id` → `platform.file_objects(internal_id)` via `fk_compliance_evidence_file_object_id_file_objects_numeric`; `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT`

## `compliance.evidence` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 11 columns, 5 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `file_object_id` | `platform.file_objects` | `fk_compliance_evidence_file_object_id_file_objects` |
| `file_object_id_internal_id` | `platform.file_objects` | `fk_compliance_evidence_file_object_id_file_objects_numeric` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_compliance_evidence_numeric_pair_file_object_id` | CHECK | `CHECK ((file_object_id IS NULL) = (file_object_id_internal_id IS NULL))` |
| `fk_compliance_evidence_file_object_id_file_objects` | FOREIGN KEY | `FOREIGN KEY (file_object_id) REFERENCES platform.file_objects(id) ON DELETE RESTRICT` |
| `fk_compliance_evidence_file_object_id_file_objects_numeric` | FOREIGN KEY | `FOREIGN KEY (file_object_id_internal_id) REFERENCES platform.file_objects(internal_id) ON DELETE RESTRICT` |
| `pk_compliance_evidence` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_compliance_evidence_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_compliance_evidence_category_time` | `CREATE INDEX ix_compliance_evidence_category_time ON compliance.evidence USING btree (category, created_at)` |
| `ix_compliance_evidence_reference` | `CREATE INDEX ix_compliance_evidence_reference ON compliance.evidence USING btree (reference_type, reference_id)` |
| `pk_compliance_evidence` | `CREATE UNIQUE INDEX pk_compliance_evidence ON compliance.evidence USING btree (internal_id)` |
| `uq_compliance_evidence_id` | `CREATE UNIQUE INDEX uq_compliance_evidence_id ON compliance.evidence USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON compliance.evidence FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON compliance.evidence FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON compliance.evidence FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["file_object_id","file_object_id_internal_id","platform","file_objects"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
