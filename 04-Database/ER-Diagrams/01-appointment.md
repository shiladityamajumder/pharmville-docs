# Appointment ER diagrams

## What this part of the database stores

The `appointment` schema stores appointments and scheduling. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`appointment_slots`](../Tables/appointment/appointment_slots.md) | Holds appointment slots records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/appointment_slots.md) |
| [`appointment_status_history`](../Tables/appointment/appointment_status_history.md) | Holds appointment status history records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/appointment_status_history.md) |
| [`appointments`](../Tables/appointment/appointments.md) | Holds appointments records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/appointments.md) |
| [`availability_exceptions`](../Tables/appointment/availability_exceptions.md) | Holds availability exceptions records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/availability_exceptions.md) |
| [`availability_rules`](../Tables/appointment/availability_rules.md) | Holds availability rules records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/availability_rules.md) |
| [`practitioner_services`](../Tables/appointment/practitioner_services.md) | Holds practitioner services records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/practitioner_services.md) |
| [`service_types`](../Tables/appointment/service_types.md) | Holds service types records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/service_types.md) |
| [`teleconsultation_sessions`](../Tables/appointment/teleconsultation_sessions.md) | Holds teleconsultation sessions records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/teleconsultation_sessions.md) |
| [`waiting_room_events`](../Tables/appointment/waiting_room_events.md) | Holds waiting room events records within the appointment domain (appointments and scheduling). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/appointment/waiting_room_events.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — appointments, appointment_slots, availability_rules, availability_exceptions, appointment_status_history, practitioner_services, service_types, teleconsultation_sessions

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/appointment.md) for exact columns and actions.

```mermaid
erDiagram
    appointment__appointment_slots {
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid practitioner_service_id FK, UK
        bigint practitioner_service_id_internal_id FK
        timestamptz starts_at UK
        uuid updated_by FK
    }
    appointment__appointment_status_history {
        uuid actor_user_id FK
        uuid appointment_id FK
        bigint appointment_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    appointment__appointments {
        varchar appointment_number UK
        uuid booked_by_user_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        uuid practitioner_profile_id FK
        bigint practitioner_profile_id_internal_id FK
        uuid practitioner_service_id FK
        bigint practitioner_service_id_internal_id FK
        uuid slot_id FK
        bigint slot_id_internal_id FK
        uuid updated_by FK
    }
    appointment__availability_exceptions {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid practitioner_service_id FK
        bigint practitioner_service_id_internal_id FK
        uuid updated_by FK
    }
    appointment__availability_rules {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid practitioner_service_id FK
        bigint practitioner_service_id_internal_id FK
        uuid updated_by FK
    }
    appointment__practitioner_services {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid location_id FK, UK
        bigint location_id_internal_id FK
        uuid organization_id FK, UK
        bigint organization_id_internal_id FK
        uuid practitioner_profile_id FK, UK
        bigint practitioner_profile_id_internal_id FK
        uuid service_type_id FK, UK
        bigint service_type_id_internal_id FK
        uuid updated_by FK
    }
    appointment__service_types {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    appointment__teleconsultation_sessions {
        uuid appointment_id FK, UK
        bigint appointment_id_internal_id FK
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid recording_file_id FK
        bigint recording_file_id_internal_id FK
        uuid updated_by FK
    }
    clinical__patient_profiles {
        uuid created_by FK
        uuid deleted_by FK
        uuid family_member_id FK
        bigint family_member_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    clinical__practitioner_profiles {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    organization__locations {
        varchar code UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid organization_id FK, UK
        bigint organization_id_internal_id FK
        uuid updated_by FK
    }
    organization__organizations {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    platform__file_objects {
        varchar bucket UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar object_key UK
        uuid updated_by FK
        uuid uploaded_by_user_id FK
    }
    identity__users ||--o{ appointment__appointments : "FK-0008"
    identity__users o|--o{ appointment__appointments : "FK-0009 FK-0018"
    clinical__patient_profiles ||--o{ appointment__appointments : "FK-0010 FK-0011"
    clinical__practitioner_profiles ||--o{ appointment__appointments : "FK-0012 FK-0013"
    appointment__practitioner_services ||--o{ appointment__appointments : "FK-0014 FK-0015"
    appointment__appointment_slots o|--o{ appointment__appointments : "FK-0016 FK-0017"
    identity__users o|--o{ appointment__appointment_slots : "FK-0001 FK-0004"
    appointment__practitioner_services ||--o{ appointment__appointment_slots : "FK-0002 FK-0003"
    identity__users o|--o{ appointment__availability_rules : "FK-0023 FK-0024 FK-0027"
    appointment__practitioner_services ||--o{ appointment__availability_rules : "FK-0025 FK-0026"
    identity__users o|--o{ appointment__availability_exceptions : "FK-0019 FK-0022"
    appointment__practitioner_services ||--o{ appointment__availability_exceptions : "FK-0020 FK-0021"
    identity__users o|--o{ appointment__appointment_status_history : "FK-0005"
    appointment__appointments ||--o{ appointment__appointment_status_history : "FK-0006 FK-0007"
    identity__users o|--o{ appointment__practitioner_services : "FK-0028 FK-0029 FK-0038"
    organization__locations o|--o{ appointment__practitioner_services : "FK-0030 FK-0031"
    organization__organizations o|--o{ appointment__practitioner_services : "FK-0032 FK-0033"
    clinical__practitioner_profiles ||--o{ appointment__practitioner_services : "FK-0034 FK-0035"
    appointment__service_types ||--o{ appointment__practitioner_services : "FK-0036 FK-0037"
    identity__users o|--o{ appointment__service_types : "FK-0039 FK-0040 FK-0041"
    appointment__appointments ||--o{ appointment__teleconsultation_sessions : "FK-0042"
    appointment__appointments ||--o| appointment__teleconsultation_sessions : "FK-0043"
    identity__users o|--o{ appointment__teleconsultation_sessions : "FK-0044 FK-0047"
    platform__file_objects o|--o{ appointment__teleconsultation_sessions : "FK-0045 FK-0046"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `appointment__appointment_slots` | [`appointment.appointment_slots`](../Tables/appointment/appointment_slots.md) |
| `appointment__appointment_status_history` | [`appointment.appointment_status_history`](../Tables/appointment/appointment_status_history.md) |
| `appointment__appointments` | [`appointment.appointments`](../Tables/appointment/appointments.md) |
| `appointment__availability_exceptions` | [`appointment.availability_exceptions`](../Tables/appointment/availability_exceptions.md) |
| `appointment__availability_rules` | [`appointment.availability_rules`](../Tables/appointment/availability_rules.md) |
| `appointment__practitioner_services` | [`appointment.practitioner_services`](../Tables/appointment/practitioner_services.md) |
| `appointment__service_types` | [`appointment.service_types`](../Tables/appointment/service_types.md) |
| `appointment__teleconsultation_sessions` | [`appointment.teleconsultation_sessions`](../Tables/appointment/teleconsultation_sessions.md) |
| `clinical__patient_profiles` | [`clinical.patient_profiles`](../Tables/clinical/patient_profiles.md) |
| `clinical__practitioner_profiles` | [`clinical.practitioner_profiles`](../Tables/clinical/practitioner_profiles.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `organization__locations` | [`organization.locations`](../Tables/organization/locations.md) |
| `organization__organizations` | [`organization.organizations`](../Tables/organization/organizations.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 8 focus tables, 14 entities, 47 FK constraints (47 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — waiting_room_events

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/appointment.md) for exact columns and actions.

```mermaid
erDiagram
    appointment__appointments {
        varchar appointment_number UK
        uuid booked_by_user_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        uuid practitioner_profile_id FK
        bigint practitioner_profile_id_internal_id FK
        uuid practitioner_service_id FK
        bigint practitioner_service_id_internal_id FK
        uuid slot_id FK
        bigint slot_id_internal_id FK
        uuid updated_by FK
    }
    appointment__waiting_room_events {
        uuid appointment_id FK
        bigint appointment_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    appointment__appointments ||--o{ appointment__waiting_room_events : "FK-0048 FK-0049"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `appointment__appointments` | [`appointment.appointments`](../Tables/appointment/appointments.md) |
| `appointment__waiting_room_events` | [`appointment.waiting_room_events`](../Tables/appointment/waiting_room_events.md) |

Coverage: 1 focus tables, 2 entities, 2 FK constraints (2 unique IDs).

## How the tables connect

- **appointment.appointment_slots → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **appointment.appointment_slots → appointment.practitioner_services:** `practitioner_service_id_internal_id` references `internal_id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **appointment.appointment_slots → appointment.practitioner_services:** `practitioner_service_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **appointment.appointment_slots → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **appointment.appointment_status_history → identity.users:** `actor_user_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **appointment.appointment_status_history → appointment.appointments:** `appointment_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/appointment/README.md) · [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md)
