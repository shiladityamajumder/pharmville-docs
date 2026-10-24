# `appointment.appointments`

**Canonical structure:** [standalone SQL](../../../pharmville-database/pharmville_schema.sql) and [validated catalog](../../Schema-Catalog.json). Generated structural sections reproduce the effective schema; business interpretation and master proposals remain separately reviewed.

**Business purpose (Inferred):** Holds appointments records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

| Attribute | Contract |
| --- | --- |
| Identity | appointment.appointments |
| Classification | Transactional |
| Proposed business write owner | Future appointment owner — Requires Decision D-027 |
| SQL ownership | Dedicated installation role; no automatic module DML grants. Existing RLS/ACL/default-denial preserved. |
| Primary key | internal_id |
| Structural counts | 24 columns; 21 PK/FK/UQ/CHECK/exclusion constraints; 19 named PostgreSQL 18 NOT NULL constraints; 7 indexes; 3 user triggers |
| Source / approval | Fresh PostgreSQL 18 catalog parity verified; module ownership/production enablement remains Proposed. |

## Fields

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_number` | `character varying(64)` | No | — | Inferred: stores appointment number for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `booked_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_appointments_booked_by_user_id_users` |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | Exact constraints below |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_appointments_created_by_users` |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | Exact constraints below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | GENERATED ALWAYS AS IDENTITY; see sequence catalog; Primary key |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | Exact constraints below |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` via `fk_appointment_appointments_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` via `fk_appointment_appointments_patient_profile_id_patient__c088` |
| `payment_status` | `character varying(32)` | No | `'not_required'::character varying` | Inferred: stores payment status for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `practitioner_profile_id` | `uuid` | No | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` via `fk_appointment_appointments_practitioner_profile_id_pra_450f` |
| `practitioner_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` via `fk_appointment_appointments_practitioner_profile_id_pra_e47a` |
| `practitioner_service_id` | `uuid` | No | — | Reference linking this record to practitioner services | Ensures related business data can be joined and validated | FK → `appointment.practitioner_services` via `fk_appointment_appointments_practitioner_service_id_pra_39cd` |
| `practitioner_service_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.practitioner_services` via `fk_appointment_appointments_practitioner_service_id_pra_6424` |
| `reason_for_visit` | `text` | Yes | — | Inferred: stores reason for visit for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | Checked positive; optimistic precondition and maintenance trigger |
| `scheduled_end` | `timestamp with time zone` | No | — | Inferred: stores scheduled end for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `scheduled_start` | `timestamp with time zone` | No | — | Inferred: stores scheduled start for this table | Inferred: carries this domain attribute; meaning needs owner review | Exact constraints below |
| `slot_id` | `uuid` | Yes | — | Reference linking this record to appointment slots | Ensures related business data can be joined and validated | FK → `appointment.appointment_slots` via `fk_appointment_appointments_slot_id_appointment_slots` |
| `slot_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointment_slots` via `fk_appointment_appointments_slot_id_appointment_slots_numeric` |
| `source` | `character varying(32)` | No | `'app'::character varying` | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | Collation: default |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | Collation: default |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | Exact constraints below |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` via `fk_appointment_appointments_updated_by_users` |

## Record lifecycle and users

- **Created:** when the appointments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.appointments` fails its required persistence checks; do not fall back to invented customer or payment state.

The declared business owner above supersedes generic schema-membership guesses. [Module/database map](../../Module-Mapping.md) distinguishes authoritative writers, consuming APIs, shared infrastructure and future-owner decisions.

## Actual relationships

| Constraint | Local columns | References | Exact rule |
| --- | --- | --- | --- |
| fk_appointment_appointments_booked_by_user_id_users | `booked_by_user_id` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (booked_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_appointments_created_by_users | `created_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| fk_appointment_appointments_patient_profile_id_patient__c088 | `patient_profile_id_internal_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| fk_appointment_appointments_patient_profile_id_patient_profiles | `patient_profile_id` | [`clinical.patient_profiles`](../../Tables/clinical/patient_profiles.md) | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| fk_appointment_appointments_practitioner_profile_id_pra_450f | `practitioner_profile_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE RESTRICT` |
| fk_appointment_appointments_practitioner_profile_id_pra_e47a | `practitioner_profile_id_internal_id` | [`clinical.practitioner_profiles`](../../Tables/clinical/practitioner_profiles.md) | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE RESTRICT` |
| fk_appointment_appointments_practitioner_service_id_pra_39cd | `practitioner_service_id` | [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE RESTRICT` |
| fk_appointment_appointments_practitioner_service_id_pra_6424 | `practitioner_service_id_internal_id` | [`appointment.practitioner_services`](../../Tables/appointment/practitioner_services.md) | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE RESTRICT` |
| fk_appointment_appointments_slot_id_appointment_slots | `slot_id` | [`appointment.appointment_slots`](../../Tables/appointment/appointment_slots.md) | `FOREIGN KEY (slot_id) REFERENCES appointment.appointment_slots(id) ON DELETE SET NULL` |
| fk_appointment_appointments_slot_id_appointment_slots_numeric | `slot_id_internal_id` | [`appointment.appointment_slots`](../../Tables/appointment/appointment_slots.md) | `FOREIGN KEY (slot_id_internal_id) REFERENCES appointment.appointment_slots(internal_id) ON DELETE SET NULL` |
| fk_appointment_appointments_updated_by_users | `updated_by` | [`identity.users`](../../Tables/identity/users.md) | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |

### Dependent tables

| Referencing table | Constraint | Local columns | Referenced columns |
| --- | --- | --- | --- |
| [`appointment.appointment_status_history`](../../Tables/appointment/appointment_status_history.md) | fk_appointment_appointment_status_history_appointment_i_dc2f | `appointment_id` | `id` |
| [`appointment.appointment_status_history`](../../Tables/appointment/appointment_status_history.md) | fk_appointment_appointment_status_history_appointment_i_ea3b | `appointment_id_internal_id` | `internal_id` |
| [`appointment.teleconsultation_sessions`](../../Tables/appointment/teleconsultation_sessions.md) | fk_appointment_teleconsultation_sessions_appointment_id_32d4 | `appointment_id_internal_id` | `internal_id` |
| [`appointment.teleconsultation_sessions`](../../Tables/appointment/teleconsultation_sessions.md) | fk_appointment_teleconsultation_sessions_appointment_id_b6ed | `appointment_id` | `id` |
| [`appointment.waiting_room_events`](../../Tables/appointment/waiting_room_events.md) | fk_appointment_waiting_room_events_appointment_id_appoi_7bad | `appointment_id_internal_id` | `internal_id` |
| [`appointment.waiting_room_events`](../../Tables/appointment/waiting_room_events.md) | fk_appointment_waiting_room_events_appointment_id_appointments | `appointment_id` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_appointment_id_appointments | `appointment_id` | `id` |
| [`clinical.consultations`](../../Tables/clinical/consultations.md) | fk_clinical_consultations_appointment_id_appointments_numeric | `appointment_id_internal_id` | `internal_id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_appointment_id_appointments | `appointment_id` | `id` |
| [`support.tickets`](../../Tables/support/tickets.md) | fk_support_tickets_appointment_id_appointments_numeric | `appointment_id_internal_id` | `internal_id` |

## `appointment.appointments` — exact structural contracts

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `booked_by_user_id` | `identity.users` | `fk_appointment_appointments_booked_by_user_id_users` |
| `created_by` | `identity.users` | `fk_appointment_appointments_created_by_users` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_appointment_appointments_patient_profile_id_patient__c088` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_appointment_appointments_patient_profile_id_patient_profiles` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_appointment_appointments_practitioner_profile_id_pra_450f` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_appointment_appointments_practitioner_profile_id_pra_e47a` |
| `practitioner_service_id` | `appointment.practitioner_services` | `fk_appointment_appointments_practitioner_service_id_pra_39cd` |
| `practitioner_service_id_internal_id` | `appointment.practitioner_services` | `fk_appointment_appointments_practitioner_service_id_pra_6424` |
| `slot_id` | `appointment.appointment_slots` | `fk_appointment_appointments_slot_id_appointment_slots` |
| `slot_id_internal_id` | `appointment.appointment_slots` | `fk_appointment_appointments_slot_id_appointment_slots_numeric` |
| `updated_by` | `identity.users` | `fk_appointment_appointments_updated_by_users` |

### Existing constraints

| Exact name | Kind | Recorded expression |
| --- | --- | --- |
| `ck_appointment_appointments_appointmentstatus` | CHECK | `CHECK (status::text = ANY (ARRAY['pending'::text, 'confirmed'::text, 'checked_in'::text, 'in_progress'::text, 'completed'::text, 'cancelled'::text, 'no_show'::text, 'rescheduled'::text]))` |
| `ck_appointment_appointments_numeric_pair_patient_profile_id` | CHECK | `CHECK ((patient_profile_id IS NULL) = (patient_profile_id_internal_id IS NULL))` |
| `ck_appointment_appointments_numeric_pair_practitioner_p_adef` | CHECK | `CHECK ((practitioner_profile_id IS NULL) = (practitioner_profile_id_internal_id IS NULL))` |
| `ck_appointment_appointments_numeric_pair_practitioner_s_3f82` | CHECK | `CHECK ((practitioner_service_id IS NULL) = (practitioner_service_id_internal_id IS NULL))` |
| `ck_appointment_appointments_numeric_pair_slot_id` | CHECK | `CHECK ((slot_id IS NULL) = (slot_id_internal_id IS NULL))` |
| `ck_appointment_appointments_row_version_positive` | CHECK | `CHECK (row_version > 0)` |
| `ck_appointment_appointments_valid_window` | CHECK | `CHECK (scheduled_end > scheduled_start)` |
| `fk_appointment_appointments_booked_by_user_id_users` | FOREIGN KEY | `FOREIGN KEY (booked_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_created_by_users` | FOREIGN KEY | `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_patient_profile_id_patient__c088` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_patient_profile_id_patient_profiles` | FOREIGN KEY | `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_practitioner_profile_id_pra_450f` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_practitioner_profile_id_pra_e47a` | FOREIGN KEY | `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_practitioner_service_id_pra_39cd` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_practitioner_service_id_pra_6424` | FOREIGN KEY | `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE RESTRICT` |
| `fk_appointment_appointments_slot_id_appointment_slots` | FOREIGN KEY | `FOREIGN KEY (slot_id) REFERENCES appointment.appointment_slots(id) ON DELETE SET NULL` |
| `fk_appointment_appointments_slot_id_appointment_slots_numeric` | FOREIGN KEY | `FOREIGN KEY (slot_id_internal_id) REFERENCES appointment.appointment_slots(internal_id) ON DELETE SET NULL` |
| `fk_appointment_appointments_updated_by_users` | FOREIGN KEY | `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT` |
| `pk_appointment_appointments` | PRIMARY KEY | `PRIMARY KEY (internal_id)` |
| `uq_appointment_appointments_appointment_number` | UNIQUE | `UNIQUE (appointment_number)` |
| `uq_appointment_appointments_id` | UNIQUE | `UNIQUE (id)` |
| `appointments_appointment_number_not_null` | NOT NULL | `NOT NULL appointment_number` |
| `appointments_booked_by_user_id_not_null` | NOT NULL | `NOT NULL booked_by_user_id` |
| `appointments_created_at_not_null` | NOT NULL | `NOT NULL created_at` |
| `appointments_id_not_null` | NOT NULL | `NOT NULL id` |
| `appointments_internal_id_not_null` | NOT NULL | `NOT NULL internal_id` |
| `appointments_metadata_json_not_null` | NOT NULL | `NOT NULL metadata_json` |
| `appointments_patient_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL patient_profile_id_internal_id` |
| `appointments_patient_profile_id_not_null` | NOT NULL | `NOT NULL patient_profile_id` |
| `appointments_payment_status_not_null` | NOT NULL | `NOT NULL payment_status` |
| `appointments_practitioner_profile_id_internal_id_not_null` | NOT NULL | `NOT NULL practitioner_profile_id_internal_id` |
| `appointments_practitioner_profile_id_not_null` | NOT NULL | `NOT NULL practitioner_profile_id` |
| `appointments_practitioner_service_id_internal_id_not_null` | NOT NULL | `NOT NULL practitioner_service_id_internal_id` |
| `appointments_practitioner_service_id_not_null` | NOT NULL | `NOT NULL practitioner_service_id` |
| `appointments_row_version_not_null` | NOT NULL | `NOT NULL row_version` |
| `appointments_scheduled_end_not_null` | NOT NULL | `NOT NULL scheduled_end` |
| `appointments_scheduled_start_not_null` | NOT NULL | `NOT NULL scheduled_start` |
| `appointments_source_not_null` | NOT NULL | `NOT NULL source` |
| `appointments_status_not_null` | NOT NULL | `NOT NULL status` |
| `appointments_updated_at_not_null` | NOT NULL | `NOT NULL updated_at` |

### Existing indexes

| Exact name | Method | Columns / expression | Predicate | Purpose | Recorded definition |
| --- | --- | --- | --- | --- | --- |
| `ix_appointment_appointments_patient_time` | btree | `(patient_profile_id, scheduled_start)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_appointments_patient_time ON appointment.appointments USING btree (patient_profile_id, scheduled_start)` |
| `ix_appointment_appointments_practitioner_time` | btree | `(practitioner_profile_id, scheduled_start)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_appointments_practitioner_time ON appointment.appointments USING btree (practitioner_profile_id, scheduled_start)` |
| `ix_appointment_appointments_slot` | btree | `(slot_id)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_appointments_slot ON appointment.appointments USING btree (slot_id)` |
| `ix_appointment_appointments_status` | btree | `(status)` | None | Read/join/filter access path; Performance effectiveness requires measured query plans. | `CREATE INDEX ix_appointment_appointments_status ON appointment.appointments USING btree (status)` |
| `pk_appointment_appointments` | btree | `(internal_id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX pk_appointment_appointments ON appointment.appointments USING btree (internal_id)` |
| `uq_appointment_appointments_appointment_number` | btree | `(appointment_number)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_appointments_appointment_number ON appointment.appointments USING btree (appointment_number)` |
| `uq_appointment_appointments_id` | btree | `(id)` | None | Enforces primary/unique identity or a scoped uniqueness invariant; Performance effectiveness requires measured query plans. | `CREATE UNIQUE INDEX uq_appointment_appointments_id ON appointment.appointments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition | Enabled |
| --- | --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"],["slot_id","slot_id_internal_id","appointment","appointment_slots"]]', 'internal_id', 'id')` | O |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.appointments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` | O |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"],["slot_id","slot_id_internal_id","appointment","appointment_slots"]]', 'internal_id', 'id')` | O |

## Engineering interpretation

Public UUID aliases and BIGINT FK crosswalks are distinct fields. SQL guards, validated constraints, indexes and ACL/RLS must remain intact; a business/API write owner is not an installed database grant. No clinical, financial or retention policy is inferred from a column or enum.
