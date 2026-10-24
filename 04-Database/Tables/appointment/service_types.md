# `appointment.service_types`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds service types records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 17 columns, 7 constraints, 3 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `code` | `character varying(64)` | No | — | Inferred: stores code for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_service_types_created_by_users) |
| `default_duration_minutes` | `integer` | No | — | Inferred: stores default duration minutes for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `deleted_at` | `timestamp with time zone` | Yes | — | Soft-deletion time when used | Avoid treating hidden records as active | See exact constraints |
| `deleted_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_service_types_deleted_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `is_active` | `boolean` | No | `true` | Yes/no flag for is active | Control conditional business behavior | See exact constraints |
| `is_deleted` | `boolean` | No | `false` | Yes/no flag for is deleted | Control conditional business behavior | See exact constraints |
| `name` | `character varying(128)` | No | — | Inferred: stores name for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requires_payment` | `boolean` | No | `true` | Inferred: stores requires payment for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `requires_prescription` | `boolean` | No | `false` | Inferred: stores requires prescription for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `service_mode` | `character varying(32)` | No | — | Inferred: stores service mode for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_service_types_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the service types business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.service_types` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `created_by` → `identity.users(id)` via `fk_appointment_service_types_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `deleted_by` → `identity.users(id)` via `fk_appointment_service_types_deleted_by_users`; `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_appointment_service_types_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`

**Referenced by 2 FK constraints** (sample): `appointment.practitioner_services`, `appointment.practitioner_services`.

## `appointment.service_types` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 17 columns, 7 constraints, 3 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `created_by` | `identity.users` | `fk_appointment_service_types_created_by_users` |
| `deleted_by` | `identity.users` | `fk_appointment_service_types_deleted_by_users` |
| `updated_by` | `identity.users` | `fk_appointment_service_types_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_service_types_duration_positive` | CHECK | `CHECK (default_duration_minutes > 0)` |
| `ck_appointment_service_types_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `fk_appointment_service_types_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_service_types_deleted_by_users` | FOREIGN KEY | `FOREIGN KEY (deleted_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_service_types_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_service_types` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_service_types_id` | UNIQUE | `UNIQUE (id)` |

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `pk_appointment_service_types` | `CREATE UNIQUE INDEX pk_appointment_service_types ON appointment.service_types USING btree (internal_id)` |
| `uq_appointment_service_types_code_active` | `CREATE UNIQUE INDEX uq_appointment_service_types_code_active ON appointment.service_types USING btree (code) WHERE is_deleted = false` |
| `uq_appointment_service_types_id` | `CREATE UNIQUE INDEX uq_appointment_service_types_id ON appointment.service_types USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.service_types FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.service_types FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.service_types FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.

## Master-data planning

**Status: Proposed maintenance design; Unapproved; no seed or migration modified.** [Central inventory](../../Master-Data-Inventory.md) · [planning decisions](../../../05-APIs/Planning-Decisions.md).

| Definition | Contract |
| --- | --- |
| Schema/table | `appointment.service_types` |
| Category | Master / Reference — Service offerings and duration/payment/prescription configuration |
| Proposed owner / maintenance role | Future appointments / Scheduling administrator |
| Scope | Global catalog/reference; scope still limits administrative maintenance. |
| Referencing tables | `appointment.practitioner_services` |
| Features | Outside the 110-feature launch API scope; table existence does not approve a new feature. |
| API consumers | No inventoried API. Future-scope onboarding/maintenance requires separate approved requirements. |

### Expected initial records

| Code | Name | Description | Status | Source |
| --- | --- | --- | --- | --- |
| Not allocated | No approved initial record | Verified real records and identifiers must come from the responsible business owner; the schema/page contains no seed-row evidence. Never create synthetic live parties/products or claim rows exist. | Open | Checked-in table schema only; owner evidence required. |

Required nondefault business attributes to obtain: `code`, `default_duration_minutes`, `name`, `service_mode`.

### Lifecycle and seed requirements

| Concern | Proposed lifecycle |
| --- | --- |
| Deployment or operational creation | Deferred future module: no launch seed or API scope is implied. |
| Create/update permissions | Scheduling administrator through the owning domain command. Read access is separate; general Admin does not grant clinical/Finance write authority. |
| Activation/deactivation | Use is_active=false to retire from new selection; keep referenced history. |
| Deletion | Physical deletion denied for referenced records; respect the exact FK ON DELETE behavior, legal/clinical retention and stable-code guards. A cascading SQL possibility is not API permission. |
| Uniqueness / stable codes | UNIQUE: UNIQUE (id); CREATE UNIQUE INDEX uq_appointment_service_types_code_active ON appointment.service_types USING btree (code) WHERE is_deleted = false; CREATE UNIQUE INDEX uq_appointment_service_types_id ON appointment.service_types USING btree (id) |
| Foreign-key dependencies | No non-actor FK dependencies recorded. |
| Initial load order | Load referenced master identities first; resolve UUID/BIGINT crosswalks through documented triggers; then load this master and dependent mappings. Deployment/operational owner verifies required fields, exact CHECKs and active uniqueness. |
| Seed status | Open; an empty migration/schema is not a usable approved business seed. Obtain the named owner dataset before enabling dependent journeys. |
| Pending decisions | D-024 ownership/lifecycle approval; D-001 phase scope and responsible steward evidence. |
