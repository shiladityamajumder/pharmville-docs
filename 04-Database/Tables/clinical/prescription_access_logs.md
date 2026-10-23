# clinical.prescription_access_logs

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds prescription access logs records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 11 columns, 6 constraints, 5 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `action` | `character varying(32)` | No | — | Inferred: stores action for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `actor_user_id` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_prescription_access_logs_actor_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `ip_address` | `inet` | Yes | — | Inferred: stores ip address for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `occurred_at` | `timestamp with time zone` | No | `now()` | Time of occurred | Support chronology, deadlines or audit evidence | See exact constraints |
| `prescription_id` | `uuid` | No | — | Reference linking this record to prescriptions | Ensures related business data can be joined and validated | FK → `clinical.prescriptions` (fk_clinical_prescription_access_logs_prescription_id_pr_fb69) |
| `prescription_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.prescriptions` (fk_clinical_prescription_access_logs_prescription_id_pr_2810); Numeric/public-key pair verification required |
| `purpose` | `character varying(128)` | No | — | Inferred: stores purpose for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `request_id` | `uuid` | No | — | Identifier associated with request | Link the event or entity to its subject; verify constraints | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users
- **Created:** when the prescription access logs business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.prescription_access_logs` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `actor_user_id` → `identity.users(id)` via `fk_clinical_prescription_access_logs_actor_user_id_users`; FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL
- `prescription_id` → `clinical.prescriptions(id)` via `fk_clinical_prescription_access_logs_prescription_id_pr_fb69`; FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE
- `prescription_id_internal_id` → `clinical.prescriptions(internal_id)` via `fk_clinical_prescription_access_logs_prescription_id_pr_2810`; FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE

## clinical.prescription_access_logs — exact structural contracts

**Identity:** `internal_id` BIGINT. **Counts:** 11 columns, 6 constraints, 5 indexes, 3 triggers.

## Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `actor_user_id` | `identity.users` | `fk_clinical_prescription_access_logs_actor_user_id_users` |
| `prescription_id` | `clinical.prescriptions` | `fk_clinical_prescription_access_logs_prescription_id_pr_fb69` |
| `prescription_id_internal_id` | `clinical.prescriptions` | `fk_clinical_prescription_access_logs_prescription_id_pr_2810` |

## Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_prescription_access_logs_numeric_pair_presc_af20` | CHECK | `CHECK ((prescription_id IS NULL) = (prescription_id_internal_id IS NULL))` |
| `fk_clinical_prescription_access_logs_actor_user_id_users` | FOREIGN KEY | `FOREIGN KEY (actor_user_id) REFERENCES identity.users(id) ON DELETE SET NULL` |
| `fk_clinical_prescription_access_logs_prescription_id_pr_2810` | FOREIGN KEY | `FOREIGN KEY (prescription_id_internal_id) REFERENCES clinical.prescriptions(internal_id) ON DELETE CASCADE` |
| `fk_clinical_prescription_access_logs_prescription_id_pr_fb69` | FOREIGN KEY | `FOREIGN KEY (prescription_id) REFERENCES clinical.prescriptions(id) ON DELETE CASCADE` |
| `pk_clinical_prescription_access_logs` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_prescription_access_logs_id` | UNIQUE | `UNIQUE (id)` |

## Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_clinical_rx_access_actor` | `CREATE INDEX ix_clinical_rx_access_actor ON clinical.prescription_access_logs USING btree (actor_user_id)` |
| `ix_clinical_rx_access_prescription_time` | `CREATE INDEX ix_clinical_rx_access_prescription_time ON clinical.prescription_access_logs USING btree (prescription_id, occurred_at)` |
| `ix_clinical_rx_access_request` | `CREATE INDEX ix_clinical_rx_access_request ON clinical.prescription_access_logs USING btree (request_id)` |
| `pk_clinical_prescription_access_logs` | `CREATE UNIQUE INDEX pk_clinical_prescription_access_logs ON clinical.prescription_access_logs USING btree (internal_id)` |
| `uq_clinical_prescription_access_logs_id` | `CREATE UNIQUE INDEX uq_clinical_prescription_access_logs_id ON clinical.prescription_access_logs USING btree (id)` |

## Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_access_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` |
| `immutable_record_guard` | `CREATE TRIGGER immutable_record_guard BEFORE DELETE OR UPDATE ON clinical.prescription_access_logs FOR EACH ROW EXECUTE FUNCTION platform.deny_mutation()` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.prescription_access_logs FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["prescription_id","prescription_id_internal_id","clinical","prescriptions"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants. Application code should catch and translate database errors into safe user messages without bypassing these protections.
