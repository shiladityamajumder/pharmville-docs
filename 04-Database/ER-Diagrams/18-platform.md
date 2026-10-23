# Platform ER diagrams

## What this part of the database stores

The `platform` schema stores configuration, files, audit, events, and reports. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`application_settings`](../Tables/platform/application_settings.md) | Holds application settings records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/application_settings.md) |
| [`audit_logs`](../Tables/platform/audit_logs.md) | Holds audit logs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/audit_logs.md) |
| [`cms_banners`](../Tables/platform/cms_banners.md) | Holds cms banners records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/cms_banners.md) |
| [`cms_page_versions`](../Tables/platform/cms_page_versions.md) | Holds cms page versions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/cms_page_versions.md) |
| [`cms_pages`](../Tables/platform/cms_pages.md) | Holds cms pages records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/cms_pages.md) |
| [`data_retention_policies`](../Tables/platform/data_retention_policies.md) | Holds data retention policies records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/data_retention_policies.md) |
| [`feature_flags`](../Tables/platform/feature_flags.md) | Holds feature flags records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/feature_flags.md) |
| [`file_access_events`](../Tables/platform/file_access_events.md) | Holds file access events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/file_access_events.md) |
| [`file_access_grants`](../Tables/platform/file_access_grants.md) | Holds file access grants records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/file_access_grants.md) |
| [`file_objects`](../Tables/platform/file_objects.md) | Holds file objects records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/file_objects.md) |
| [`file_scan_events`](../Tables/platform/file_scan_events.md) | Holds file scan events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/file_scan_events.md) |
| [`file_upload_sessions`](../Tables/platform/file_upload_sessions.md) | Holds file upload sessions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/file_upload_sessions.md) |
| [`file_variants`](../Tables/platform/file_variants.md) | Holds file variants records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/file_variants.md) |
| [`idempotency_keys`](../Tables/platform/idempotency_keys.md) | Holds idempotency keys records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/idempotency_keys.md) |
| [`inbox_messages`](../Tables/platform/inbox_messages.md) | Holds inbox messages records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/inbox_messages.md) |
| [`outbox_events`](../Tables/platform/outbox_events.md) | Holds outbox events records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/outbox_events.md) |
| [`report_definitions`](../Tables/platform/report_definitions.md) | Holds report definitions records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/report_definitions.md) |
| [`report_runs`](../Tables/platform/report_runs.md) | Holds report runs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/report_runs.md) |
| [`scheduled_jobs`](../Tables/platform/scheduled_jobs.md) | Holds scheduled jobs records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/scheduled_jobs.md) |
| [`webhook_deliveries`](../Tables/platform/webhook_deliveries.md) | Holds webhook deliveries records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/webhook_deliveries.md) |
| [`webhook_endpoints`](../Tables/platform/webhook_endpoints.md) | Holds webhook endpoints records within the platform domain (configuration, documents, audit, events and reports). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/platform/webhook_endpoints.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — file_variants, file_objects, file_upload_sessions, file_access_grants, file_access_events, report_runs, report_definitions, cms_pages

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/platform.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    platform__cms_pages {
        uuid created_by FK
        uuid created_by_user_id FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid updated_by_user_id FK
    }
    platform__file_access_events {
        uuid actor_user_id FK
        uuid file_object_id FK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    platform__file_access_grants {
        uuid created_by FK
        uuid file_object_id FK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
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
    platform__file_upload_sessions {
        uuid created_by FK
        uuid file_object_id FK
        bigint file_object_id_internal_id FK
        uuid id UK
        varchar idempotency_key UK
        bigint internal_id PK, UK
        uuid requested_by_user_id FK
        varchar scope UK
        uuid updated_by FK
    }
    platform__file_variants {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid source_file_id FK
        bigint source_file_id_internal_id FK
        uuid updated_by FK
        uuid variant_file_id FK, UK
        bigint variant_file_id_internal_id FK
    }
    platform__report_definitions {
        varchar code UK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
    }
    platform__report_runs {
        uuid definition_id FK
        bigint definition_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid requested_by_user_id FK
        uuid result_file_object_id FK
        bigint result_file_object_id_internal_id FK
    }
    identity__users o|--o{ platform__file_variants : "FK-1086 FK-1087 FK-1090"
    platform__file_objects ||--o{ platform__file_variants : "FK-1088 FK-1089 FK-1092"
    platform__file_objects ||--o| platform__file_variants : "FK-1091"
    identity__users o|--o{ platform__file_objects : "FK-1078 FK-1075 FK-1076 FK-1077"
    identity__users o|--o{ platform__file_upload_sessions : "FK-1084 FK-1081 FK-1085"
    platform__file_objects ||--o{ platform__file_upload_sessions : "FK-1083 FK-1082"
    identity__users o|--o{ platform__file_access_grants : "FK-1071 FK-1074"
    platform__file_objects ||--o{ platform__file_access_grants : "FK-1073 FK-1072"
    identity__users o|--o{ platform__file_access_events : "FK-1068"
    platform__file_objects ||--o{ platform__file_access_events : "FK-1070 FK-1069"
    identity__users ||--o{ platform__report_runs : "FK-1101"
    platform__report_definitions ||--o{ platform__report_runs : "FK-1100 FK-1099"
    platform__file_objects o|--o{ platform__report_runs : "FK-1103 FK-1102"
    identity__users o|--o{ platform__cms_pages : "FK-1057 FK-1060 FK-1058 FK-1059 FK-1061"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__cms_pages` | [`platform.cms_pages`](../Tables/platform/cms_pages.md) |
| `platform__file_access_events` | [`platform.file_access_events`](../Tables/platform/file_access_events.md) |
| `platform__file_access_grants` | [`platform.file_access_grants`](../Tables/platform/file_access_grants.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |
| `platform__file_upload_sessions` | [`platform.file_upload_sessions`](../Tables/platform/file_upload_sessions.md) |
| `platform__file_variants` | [`platform.file_variants`](../Tables/platform/file_variants.md) |
| `platform__report_definitions` | [`platform.report_definitions`](../Tables/platform/report_definitions.md) |
| `platform__report_runs` | [`platform.report_runs`](../Tables/platform/report_runs.md) |

Coverage: 8 focus tables, 9 entities, 33 FK constraints (33 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — cms_page_versions, application_settings, data_retention_policies, feature_flags, webhook_endpoints, webhook_deliveries, idempotency_keys, inbox_messages

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/platform.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    platform__application_settings {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar key UK
        varchar namespace UK
        uuid updated_by FK
    }
    platform__cms_page_versions {
        uuid approved_by_user_id FK
        uuid created_by_user_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid page_id FK, UK
        bigint page_id_internal_id FK
        integer version UK
    }
    platform__cms_pages {
        uuid created_by FK
        uuid created_by_user_id FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
        uuid updated_by_user_id FK
    }
    platform__data_retention_policies {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    platform__feature_flags {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    platform__idempotency_keys {
        uuid created_by FK
        uuid id UK
        varchar idempotency_key UK
        bigint internal_id PK, UK
        varchar scope UK
        uuid updated_by FK
    }
    platform__inbox_messages {
        varchar consumer_name UK
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid message_id UK
        uuid updated_by FK
    }
    platform__webhook_deliveries {
        uuid created_by FK
        uuid endpoint_id FK, UK
        bigint endpoint_id_internal_id FK
        uuid event_id UK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    platform__webhook_endpoints {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    identity__users o|--o{ platform__cms_page_versions : "FK-1053"
    identity__users ||--o{ platform__cms_page_versions : "FK-1054"
    platform__cms_pages ||--o{ platform__cms_page_versions : "FK-1055 FK-1056"
    identity__users o|--o{ platform__application_settings : "FK-1047 FK-1048 FK-1049"
    identity__users o|--o{ platform__data_retention_policies : "FK-1062 FK-1063 FK-1064"
    identity__users o|--o{ platform__feature_flags : "FK-1065 FK-1066 FK-1067"
    identity__users o|--o{ platform__webhook_endpoints : "FK-1110 FK-1111 FK-1112"
    identity__users o|--o{ platform__webhook_deliveries : "FK-1106 FK-1109"
    platform__webhook_endpoints ||--o{ platform__webhook_deliveries : "FK-1108 FK-1107"
    identity__users o|--o{ platform__idempotency_keys : "FK-1093 FK-1094"
    identity__users o|--o{ platform__inbox_messages : "FK-1095 FK-1096"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__application_settings` | [`platform.application_settings`](../Tables/platform/application_settings.md) |
| `platform__cms_page_versions` | [`platform.cms_page_versions`](../Tables/platform/cms_page_versions.md) |
| `platform__cms_pages` | [`platform.cms_pages`](../Tables/platform/cms_pages.md) |
| `platform__data_retention_policies` | [`platform.data_retention_policies`](../Tables/platform/data_retention_policies.md) |
| `platform__feature_flags` | [`platform.feature_flags`](../Tables/platform/feature_flags.md) |
| `platform__idempotency_keys` | [`platform.idempotency_keys`](../Tables/platform/idempotency_keys.md) |
| `platform__inbox_messages` | [`platform.inbox_messages`](../Tables/platform/inbox_messages.md) |
| `platform__webhook_deliveries` | [`platform.webhook_deliveries`](../Tables/platform/webhook_deliveries.md) |
| `platform__webhook_endpoints` | [`platform.webhook_endpoints`](../Tables/platform/webhook_endpoints.md) |

Coverage: 8 focus tables, 10 entities, 24 FK constraints (24 unique IDs).

<a id="diagram-03"></a>

### Diagram 03 — cms_banners, file_scan_events, outbox_events, scheduled_jobs, audit_logs

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/platform.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    platform__audit_logs {
        uuid actor_user_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    platform__cms_banners {
        varchar code UK
        uuid id UK
        uuid image_file_id FK
        bigint image_file_id_internal_id FK
        bigint internal_id PK, UK
        varchar locale UK
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
    platform__file_scan_events {
        uuid file_object_id FK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
    }
    platform__outbox_events {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
    }
    platform__scheduled_jobs {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar job_key UK
        uuid updated_by FK
    }
    platform__file_objects o|--o{ platform__cms_banners : "FK-1051 FK-1052"
    platform__file_objects ||--o{ platform__file_scan_events : "FK-1080 FK-1079"
    identity__users o|--o{ platform__outbox_events : "FK-1097 FK-1098"
    identity__users o|--o{ platform__scheduled_jobs : "FK-1104 FK-1105"
    identity__users o|--o{ platform__audit_logs : "FK-1050"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__audit_logs` | [`platform.audit_logs`](../Tables/platform/audit_logs.md) |
| `platform__cms_banners` | [`platform.cms_banners`](../Tables/platform/cms_banners.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |
| `platform__file_scan_events` | [`platform.file_scan_events`](../Tables/platform/file_scan_events.md) |
| `platform__outbox_events` | [`platform.outbox_events`](../Tables/platform/outbox_events.md) |
| `platform__scheduled_jobs` | [`platform.scheduled_jobs`](../Tables/platform/scheduled_jobs.md) |

Coverage: 5 focus tables, 7 entities, 9 FK constraints (9 unique IDs).

## How the tables connect

- **platform.application_settings → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **platform.application_settings → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **platform.application_settings → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **platform.audit_logs → identity.users:** `actor_user_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **platform.cms_banners → platform.file_objects:** `image_file_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **platform.cms_banners → platform.file_objects:** `image_file_id_internal_id` references `internal_id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

See [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md) for the reviewed workflows that touch this schema. The workflows describe business sequencing; these ERDs describe enforced database references.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/platform/README.md) · [Admin_CMS HLD](../../03-Modules/Admin_CMS/HLD.md) · [Admin_CMS LLD](../../03-Modules/Admin_CMS/LLD.md) · [Audit HLD](../../03-Modules/Audit/HLD.md) · [Audit LLD](../../03-Modules/Audit/LLD.md) · [Notifications HLD](../../03-Modules/Notifications/HLD.md) · [Notifications LLD](../../03-Modules/Notifications/LLD.md) · [Prescription_Upload HLD](../../03-Modules/Prescription_Upload/HLD.md) · [Prescription_Upload LLD](../../03-Modules/Prescription_Upload/LLD.md) · [Reporting HLD](../../03-Modules/Reporting/HLD.md) · [Reporting LLD](../../03-Modules/Reporting/LLD.md) · [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md) · [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md)
