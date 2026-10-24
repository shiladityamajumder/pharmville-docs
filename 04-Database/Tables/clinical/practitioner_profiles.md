# `clinical.practitioner_profiles`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds practitioner profiles records within the clinical domain (prescriptions and pharmacist decisions). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 21 columns, 8 constraints, 4 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_practitioner_profiles_created_by_users) |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_practitioner_profiles_deleted_by_users) |
| `hpr_id` | `character varying(128)` | Yes | — | Identifier associated with hpr | Link the event or entity to its subject; verify constraints | See exact constraints |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `practitioner_type` | `character varying(32)` | No | — | Inferred: stores practitioner type for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `profile_metadata` | `jsonb` | No | `'{}'::jsonb` | Structured profile metadata information | Retain a versioned payload or relevant details | See exact constraints |
| `qualification` | `character varying(255)` | Yes | — | Inferred: stores qualification for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `registration_council` | `character varying(255)` | No | — | Inferred: stores registration council for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `registration_number` | `character varying(128)` | No | — | Inferred: stores registration number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `specialization` | `character varying(128)` | Yes | — | Inferred: stores specialization for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_practitioner_profiles_updated_by_users) |
| `user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_clinical_practitioner_profiles_user_id_users) |
| `verification_status` | `character varying(16)` | No | `'pending'::character varying` | Inferred: stores verification status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `verified_at` | `timestamp with time zone` | Yes | — | Time of verified | Support chronology, deadlines or audit evidence | See exact constraints |
| `years_of_experience` | `integer` | Yes | — | Inferred: stores years of experience for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the practitioner profiles business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** Customer_Accounts, Prescription_Upload, Pharmacist_Review. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `clinical.practitioner_profiles` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `user_id` → `identity.users(id)` via `fk_clinical_practitioner_profiles_user_id_users`; `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE`
- `created_by` → `identity.users(id)` via `fk_clinical_practitioner_profiles_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_clinical_practitioner_profiles_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_clinical_practitioner_profiles_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 8 FK constraints** (sample): `appointment.practitioner_services`, `appointment.appointments`, `clinical.practitioner_organizations`, `clinical.consultations`, `appointment.appointments`, `appointment.practitioner_services`, `clinical.consultations`, `clinical.practitioner_organizations`.

## `clinical.practitioner_profiles` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 21 columns, 8 constraints, 4 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `user_id` | `identity.users` | `fk_clinical_practitioner_profiles_user_id_users` |
| `created_by` | `identity.users` | `fk_clinical_practitioner_profiles_created_by_users` |
| `deleted_by` | `identity.users` | `fk_clinical_practitioner_profiles_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_clinical_practitioner_profiles_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_clinical_practitioner_profiles_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_clinical_practitioner_profiles_verificationstatus` | CHECK | `CHECK (verification_status::text = ANY (ARRAY['pending'::text, 'verified'::text, 'rejected'::text, 'expired'::text]))` |
| `fk_clinical_practitioner_profiles_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_profiles_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_profiles_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_clinical_practitioner_profiles_user_id_users` | FOREIGN KEY | `FOREIGN KEY (user_id) REFERENCES identity.users(id) ON DELETE CASCADE` |
| `pk_clinical_practitioner_profiles` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_clinical_practitioner_profiles_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_clinical_practitioner_profiles` | `CREATE UNIQUE INDEX pk_clinical_practitioner_profiles ON clinical.practitioner_profiles USING btree (internal_id)` |
| `uq_clinical_practitioner_profiles_id` | `CREATE UNIQUE INDEX uq_clinical_practitioner_profiles_id ON clinical.practitioner_profiles USING btree (id)` |
| `uq_clinical_practitioner_registration_active` | `CREATE UNIQUE INDEX uq_clinical_practitioner_registration_active ON clinical.practitioner_profiles USING btree (registration_number, registration_council) WHERE is_deleted = false` |
| `uq_clinical_practitioner_user_active` | `CREATE UNIQUE INDEX uq_clinical_practitioner_user_active ON clinical.practitioner_profiles USING btree (user_id) WHERE is_deleted = false` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON clinical.practitioner_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON clinical.practitioner_profiles FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `clinical.practitioner_profiles` |
| Category | Master / Reference — Verified practitioner identity and qualifications |
| Proposed owner / maintenance role | Pharmacist_Review / Credentialing administrator |
| Scope | User/patient-specific protected party master. |
| Referencing tables | `appointment.appointments`, `appointment.practitioner_services`, `clinical.consultations`, `clinical.practitioner_organizations` |
| Features | `PHM-01`, `PHM-03`, `PHM-05`, `RX-05` |
| API consumers | [API-060](../../../05-APIs/Pharmacist_Review.md), [API-062](../../../05-APIs/Pharmacist_Review.md) |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `practitioner_type`, `registration_council`, `registration_number`, `user_id`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Operationally curated/imported after verification; no production seed identities or fabricated product rows. |
| Create/update permissions | Credentialing administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | No is_active/status column. Soft-delete through is_deleted only after privacy/reference review; retain historical FK targets. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_clinical_practitioner_profiles_id ON clinical.practitioner_profiles USING btree (id); CREATE UNIQUE INDEX uq_clinical_practitioner_registration_active ON clinical.practitioner_profiles USING btree (registration_number, registration_council) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_clinical_practitioner_user_active ON clinical.practitioner_profiles USING btree (user_id) WHERE is_deleted = false |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-006/D-019 clinical/catalog source validation. |
