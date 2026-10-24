# `appointment.appointments`

Schema contract and field explanations from the documentation catalog. The database migration files are the deployment authority. See [migration evidence](../../Migrations.md) for the local source baseline and deployment limits.

**Business purpose (Inferred):** Holds appointments records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation.

**Technical purpose:** 24 columns, 21 constraints, 7 indexes, 3 triggers; PK: `internal_id`.

| Column | Type | Nullable | Default | Meaning | Why needed | Relationship / rule |
| --- | --- | --- | --- | --- | --- | --- |
| `appointment_number` | `character varying(64)` | No | — | Inferred: stores appointment number for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `booked_by_user_id` | `uuid` | No | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_appointments_booked_by_user_id_users) |
| `created_at` | `timestamp with time zone` | No | `now()` | Row creation time | Audit timeline and lifecycle | See exact constraints |
| `created_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_appointments_created_by_users) |
| `id` | `uuid` | No | `gen_random_uuid()` | Public identifier for this record | Stable, externally shareable identity | key: review PK and unique rules below |
| `internal_id` | `bigint` | No | — | Database internal primary key | Efficient internal relationships; never used as authorization proof | key: review PK and unique rules below |
| `metadata_json` | `jsonb` | No | `'{}'::jsonb` | Structured metadata json information | Retain a versioned payload or relevant details | See exact constraints |
| `patient_profile_id` | `uuid` | No | — | Reference linking this record to patient profiles | Ensures related business data can be joined and validated | FK → `clinical.patient_profiles` (fk_appointment_appointments_patient_profile_id_patient_profiles) |
| `patient_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.patient_profiles` (fk_appointment_appointments_patient_profile_id_patient__c088); Numeric/public-key pair verification required |
| `payment_status` | `character varying(32)` | No | `'not_required'::character varying` | Inferred: stores payment status for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `practitioner_profile_id` | `uuid` | No | — | Reference linking this record to practitioner profiles | Ensures related business data can be joined and validated | FK → `clinical.practitioner_profiles` (fk_appointment_appointments_practitioner_profile_id_pra_450f) |
| `practitioner_profile_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `clinical.practitioner_profiles` (fk_appointment_appointments_practitioner_profile_id_pra_e47a); Numeric/public-key pair verification required |
| `practitioner_service_id` | `uuid` | No | — | Reference linking this record to practitioner services | Ensures related business data can be joined and validated | FK → `appointment.practitioner_services` (fk_appointment_appointments_practitioner_service_id_pra_39cd) |
| `practitioner_service_id_internal_id` | `bigint` | No | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.practitioner_services` (fk_appointment_appointments_practitioner_service_id_pra_6424); Numeric/public-key pair verification required |
| `reason_for_visit` | `text` | Yes | — | Inferred: stores reason for visit for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `row_version` | `bigint` | No | `1` | Change counter | Detect conflicting concurrent updates | optimistic concurrency |
| `scheduled_end` | `timestamp with time zone` | No | — | Inferred: stores scheduled end for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `scheduled_start` | `timestamp with time zone` | No | — | Inferred: stores scheduled start for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `slot_id` | `uuid` | Yes | — | Reference linking this record to appointment slots | Ensures related business data can be joined and validated | FK → `appointment.appointment_slots` (fk_appointment_appointments_slot_id_appointment_slots) |
| `slot_id_internal_id` | `bigint` | Yes | — | Internal numeric reference to related row | Maintains typed FK correspondence with public UUID reference | FK → `appointment.appointment_slots` (fk_appointment_appointments_slot_id_appointment_slots_numeric); Numeric/public-key pair verification required |
| `source` | `character varying(32)` | No | `'app'::character varying` | Inferred: stores source for this table | Inferred: carries this domain attribute; meaning needs owner review | See exact constraints |
| `status` | `character varying(16)` | No | `'pending'::character varying` | Current business or processing state | Restricts and records allowed actions | See exact constraints |
| `updated_at` | `timestamp with time zone` | No | `now()` | Last update time | Detect staleness and support traceability | See exact constraints |
| `updated_by` | `uuid` | Yes | — | Reference linking this record to users | Ensures related business data can be joined and validated | FK → `identity.users` (fk_appointment_appointments_updated_by_users) |

**Primary key columns (Confirmed):** `internal_id`. See the structural contract for the exact primary-key constraint name.

## Record lifecycle and users

- **Created:** when the appointments business process first needs a durable record; endpoint and actor require workflow review.
- **Updated:** on authorized state, amount, association or lifecycle changes only. Respect version/trigger rules.
- **Candidate consuming modules:** future-domain features. This is schema-level discovery, **not confirmed table-level write ownership**.
- **Without it:** any feature that reads or writes `appointment.appointments` fails its required persistence checks; do not fall back to invented customer or payment state.

## Actual relationships

- `booked_by_user_id` → `identity.users(id)` via `fk_appointment_appointments_booked_by_user_id_users`; `FOREIGN KEY (booked_by_user_id) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `created_by` → `identity.users(id)` via `fk_appointment_appointments_created_by_users`; `FOREIGN KEY (created_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `updated_by` → `identity.users(id)` via `fk_appointment_appointments_updated_by_users`; `FOREIGN KEY (updated_by) REFERENCES identity.users(id) ON DELETE RESTRICT`
- `practitioner_profile_id` → `clinical.practitioner_profiles(id)` via `fk_appointment_appointments_practitioner_profile_id_pra_450f`; `FOREIGN KEY (practitioner_profile_id) REFERENCES clinical.practitioner_profiles(id) ON DELETE RESTRICT`
- `practitioner_service_id` → `appointment.practitioner_services(id)` via `fk_appointment_appointments_practitioner_service_id_pra_39cd`; `FOREIGN KEY (practitioner_service_id) REFERENCES appointment.practitioner_services(id) ON DELETE RESTRICT`
- `slot_id` → `appointment.appointment_slots(id)` via `fk_appointment_appointments_slot_id_appointment_slots`; `FOREIGN KEY (slot_id) REFERENCES appointment.appointment_slots(id) ON DELETE SET NULL`
- `patient_profile_id` → `clinical.patient_profiles(id)` via `fk_appointment_appointments_patient_profile_id_patient_profiles`; `FOREIGN KEY (patient_profile_id) REFERENCES clinical.patient_profiles(id) ON DELETE RESTRICT`
- `patient_profile_id_internal_id` → `clinical.patient_profiles(internal_id)` via `fk_appointment_appointments_patient_profile_id_patient__c088`; `FOREIGN KEY (patient_profile_id_internal_id) REFERENCES clinical.patient_profiles(internal_id) ON DELETE RESTRICT`
- `practitioner_profile_id_internal_id` → `clinical.practitioner_profiles(internal_id)` via `fk_appointment_appointments_practitioner_profile_id_pra_e47a`; `FOREIGN KEY (practitioner_profile_id_internal_id) REFERENCES clinical.practitioner_profiles(internal_id) ON DELETE RESTRICT`
- `practitioner_service_id_internal_id` → `appointment.practitioner_services(internal_id)` via `fk_appointment_appointments_practitioner_service_id_pra_6424`; `FOREIGN KEY (practitioner_service_id_internal_id) REFERENCES appointment.practitioner_services(internal_id) ON DELETE RESTRICT`
- `slot_id_internal_id` → `appointment.appointment_slots(internal_id)` via `fk_appointment_appointments_slot_id_appointment_slots_numeric`; `FOREIGN KEY (slot_id_internal_id) REFERENCES appointment.appointment_slots(internal_id) ON DELETE SET NULL`

**Referenced by 10 FK constraints** (sample): `appointment.appointment_status_history`, `appointment.teleconsultation_sessions`, `appointment.waiting_room_events`, `clinical.consultations`, `support.tickets`, `appointment.appointment_status_history`, `appointment.teleconsultation_sessions`, `appointment.waiting_room_events`, `clinical.consultations`, `support.tickets`.

## `appointment.appointments` — exact structural contracts

**Identity:** `internal_id` BIGINT.

**Counts:** 24 columns, 21 constraints, 7 indexes, 3 triggers.

### Existing foreign-key dependencies

| Local columns | References | Constraint |
| --- | --- | --- |
| `booked_by_user_id` | `identity.users` | `fk_appointment_appointments_booked_by_user_id_users` |
| `created_by` | `identity.users` | `fk_appointment_appointments_created_by_users` |
| `updated_by` | `identity.users` | `fk_appointment_appointments_updated_by_users` |
| `practitioner_profile_id` | `clinical.practitioner_profiles` | `fk_appointment_appointments_practitioner_profile_id_pra_450f` |
| `practitioner_service_id` | `appointment.practitioner_services` | `fk_appointment_appointments_practitioner_service_id_pra_39cd` |
| `slot_id` | `appointment.appointment_slots` | `fk_appointment_appointments_slot_id_appointment_slots` |
| `patient_profile_id` | `clinical.patient_profiles` | `fk_appointment_appointments_patient_profile_id_patient_profiles` |
| `patient_profile_id_internal_id` | `clinical.patient_profiles` | `fk_appointment_appointments_patient_profile_id_patient__c088` |
| `practitioner_profile_id_internal_id` | `clinical.practitioner_profiles` | `fk_appointment_appointments_practitioner_profile_id_pra_e47a` |
| `practitioner_service_id_internal_id` | `appointment.practitioner_services` | `fk_appointment_appointments_practitioner_service_id_pra_6424` |
| `slot_id_internal_id` | `appointment.appointment_slots` | `fk_appointment_appointments_slot_id_appointment_slots_numeric` |

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

### Existing indexes

| Exact name | Recorded definition |
| --- | --- |
| `ix_appointment_appointments_patient_time` | `CREATE INDEX ix_appointment_appointments_patient_time ON appointment.appointments USING btree (patient_profile_id, scheduled_start)` |
| `ix_appointment_appointments_practitioner_time` | `CREATE INDEX ix_appointment_appointments_practitioner_time ON appointment.appointments USING btree (practitioner_profile_id, scheduled_start)` |
| `ix_appointment_appointments_slot` | `CREATE INDEX ix_appointment_appointments_slot ON appointment.appointments USING btree (slot_id)` |
| `ix_appointment_appointments_status` | `CREATE INDEX ix_appointment_appointments_status ON appointment.appointments USING btree (status)` |
| `pk_appointment_appointments` | `CREATE UNIQUE INDEX pk_appointment_appointments ON appointment.appointments USING btree (internal_id)` |
| `uq_appointment_appointments_appointment_number` | `CREATE UNIQUE INDEX uq_appointment_appointments_appointment_number ON appointment.appointments USING btree (appointment_number)` |
| `uq_appointment_appointments_id` | `CREATE UNIQUE INDEX uq_appointment_appointments_id ON appointment.appointments USING btree (id)` |

### Existing triggers

| Exact name | Recorded definition |
| --- | --- |
| `aa_internal_keys` | `CREATE TRIGGER aa_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"],["slot_id","slot_id_internal_id","appointment","appointment_slots"]]', 'internal_id', 'id')` |
| `zz_record_maintenance` | `CREATE TRIGGER zz_record_maintenance BEFORE UPDATE ON appointment.appointments FOR EACH ROW EXECUTE FUNCTION platform.maintain_record('versioned')` |
| `zzzz_internal_keys` | `CREATE TRIGGER zzzz_internal_keys BEFORE INSERT OR UPDATE ON appointment.appointments FOR EACH ROW EXECUTE FUNCTION platform.maintain_internal_keys('[["patient_profile_id","patient_profile_id_internal_id","clinical","patient_profiles"],["practitioner_profile_id","practitioner_profile_id_internal_id","clinical","practitioner_profiles"],["practitioner_service_id","practitioner_service_id_internal_id","appointment","practitioner_services"],["slot_id","slot_id_internal_id","appointment","appointment_slots"]]', 'internal_id', 'id')` |

## Engineering interpretation

The foreign keys prevent dangling references; unique constraints reject duplicate business identities; checks reject invalid state or numeric values; indexes support lookup paths but still require plan testing at realistic data sizes. Triggers may enforce row-version, crosswalk, audit or domain invariants.

Application code should catch and translate database errors into safe user messages without bypassing these protections.
