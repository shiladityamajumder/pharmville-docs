# Notification ER diagrams

## What this part of the database stores

The `notification` schema stores templates, messages, and delivery attempts. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`device_endpoints`](../Tables/notification/device_endpoints.md) | Holds device endpoints records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/device_endpoints.md) |
| [`in_app_notifications`](../Tables/notification/in_app_notifications.md) | Holds in app notifications records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/in_app_notifications.md) |
| [`message_attachments`](../Tables/notification/message_attachments.md) | Holds message attachments records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/message_attachments.md) |
| [`message_attempts`](../Tables/notification/message_attempts.md) | Holds message attempts records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/message_attempts.md) |
| [`messages`](../Tables/notification/messages.md) | Holds messages records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/messages.md) |
| [`provider_configurations`](../Tables/notification/provider_configurations.md) | Holds provider configurations records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/provider_configurations.md) |
| [`provider_webhooks`](../Tables/notification/provider_webhooks.md) | Holds provider webhooks records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/provider_webhooks.md) |
| [`suppressions`](../Tables/notification/suppressions.md) | Holds suppressions records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/suppressions.md) |
| [`templates`](../Tables/notification/templates.md) | Holds templates records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/templates.md) |
| [`user_channel_preferences`](../Tables/notification/user_channel_preferences.md) | Holds user channel preferences records within the notification domain (templates, messages and delivery attempts). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/notification/user_channel_preferences.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — messages, provider_configurations, templates, message_attachments, in_app_notifications, device_endpoints, user_channel_preferences, suppressions

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/notification.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    notification__device_endpoints {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid updated_by FK
        uuid user_id FK
    }
    notification__in_app_notifications {
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        varchar idempotency_key UK
        uuid image_file_id FK
        bigint image_file_id_internal_id FK
        bigint internal_id PK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    notification__message_attachments {
        uuid created_by FK
        uuid file_object_id FK, UK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid message_id FK, UK
        bigint message_id_internal_id FK
        uuid updated_by FK
    }
    notification__messages {
        uuid created_by FK
        uuid id FK, UK
        varchar idempotency_key UK
        varchar idempotency_scope UK
        bigint internal_id PK, FK, UK
        uuid provider_configuration_id FK
        bigint provider_configuration_id_internal_id FK
        uuid template_id FK
        bigint template_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK
    }
    notification__provider_configurations {
        varchar account_code UK
        varchar channel UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar provider UK
        uuid updated_by FK
    }
    notification__suppressions {
        varchar channel UK
        uuid created_by FK
        uuid deleted_by FK
        varchar destination_hash UK
        uuid id UK
        bigint internal_id PK, UK
        varchar reason UK
        uuid updated_by FK
    }
    notification__templates {
        varchar channel UK
        varchar code UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar locale UK
        uuid updated_by FK
        integer version UK
    }
    notification__user_channel_preferences {
        varchar channel UK
        uuid created_by FK
        uuid deleted_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar notification_type UK
        uuid updated_by FK
        uuid user_id FK, UK
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
    identity__users o|--o{ notification__messages : "FK-0916 FK-0921 FK-0922"
    notification__provider_configurations o|--o{ notification__messages : "FK-0917 FK-0918"
    notification__templates o|--o{ notification__messages : "FK-0919 FK-0920"
    identity__users o|--o{ notification__provider_configurations : "FK-0923 FK-0924 FK-0925"
    identity__users o|--o{ notification__templates : "FK-0931 FK-0932 FK-0933"
    identity__users o|--o{ notification__message_attachments : "FK-0908 FK-0913"
    platform__file_objects ||--o{ notification__message_attachments : "FK-0909 FK-0910"
    notification__messages ||--o{ notification__message_attachments : "FK-0911 FK-0912"
    identity__users o|--o{ notification__in_app_notifications : "FK-0902 FK-0903 FK-0906"
    platform__file_objects o|--o{ notification__in_app_notifications : "FK-0904 FK-0905"
    identity__users ||--o{ notification__in_app_notifications : "FK-0907"
    identity__users o|--o{ notification__device_endpoints : "FK-0898 FK-0899 FK-0900"
    identity__users ||--o{ notification__device_endpoints : "FK-0901"
    identity__users o|--o{ notification__user_channel_preferences : "FK-0934 FK-0935 FK-0936"
    identity__users ||--o{ notification__user_channel_preferences : "FK-0937"
    identity__users o|--o{ notification__suppressions : "FK-0928 FK-0929 FK-0930"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `notification__device_endpoints` | [`notification.device_endpoints`](../Tables/notification/device_endpoints.md) |
| `notification__in_app_notifications` | [`notification.in_app_notifications`](../Tables/notification/in_app_notifications.md) |
| `notification__message_attachments` | [`notification.message_attachments`](../Tables/notification/message_attachments.md) |
| `notification__messages` | [`notification.messages`](../Tables/notification/messages.md) |
| `notification__provider_configurations` | [`notification.provider_configurations`](../Tables/notification/provider_configurations.md) |
| `notification__suppressions` | [`notification.suppressions`](../Tables/notification/suppressions.md) |
| `notification__templates` | [`notification.templates`](../Tables/notification/templates.md) |
| `notification__user_channel_preferences` | [`notification.user_channel_preferences`](../Tables/notification/user_channel_preferences.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |

Coverage: 8 focus tables, 10 entities, 36 FK constraints (36 unique IDs).

<a id="diagram-02"></a>

### Diagram 02 — message_attempts, provider_webhooks

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/notification.md) for exact columns and actions.

```mermaid
erDiagram
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
        uuid updated_by FK
    }
    notification__message_attempts {
        integer attempt_number UK
        uuid id UK
        bigint internal_id PK, UK
        uuid message_id FK, UK
        bigint message_id_internal_id FK
    }
    notification__messages {
        uuid created_by FK
        uuid id FK, UK
        varchar idempotency_key UK
        varchar idempotency_scope UK
        bigint internal_id PK, FK, UK
        uuid provider_configuration_id FK
        bigint provider_configuration_id_internal_id FK
        uuid template_id FK
        bigint template_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK
    }
    notification__provider_webhooks {
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        varchar provider UK
        varchar provider_event_id UK
        uuid updated_by FK
    }
    notification__messages ||--o{ notification__message_attempts : "FK-0914 FK-0915"
    identity__users o|--o{ notification__provider_webhooks : "FK-0926 FK-0927"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `notification__message_attempts` | [`notification.message_attempts`](../Tables/notification/message_attempts.md) |
| `notification__messages` | [`notification.messages`](../Tables/notification/messages.md) |
| `notification__provider_webhooks` | [`notification.provider_webhooks`](../Tables/notification/provider_webhooks.md) |

Coverage: 2 focus tables, 4 entities, 4 FK constraints (4 unique IDs).

## How the tables connect

- **notification.device_endpoints → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **notification.device_endpoints → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **notification.device_endpoints → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **notification.device_endpoints → identity.users:** `user_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE CASCADE`. This keeps the child record tied to an existing parent key.
- **notification.in_app_notifications → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **notification.in_app_notifications → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

Paired public UUID and internal BIGINT foreign keys are real separate constraints. Diagrams use relationship IDs to keep those links readable; each underlying constraint is listed separately in the catalog. The application must keep paired identifiers consistent under the database's numeric-key guards. A relationship does not itself grant read or write permission.

## Important database rules

- The database primary key strategy uses an internal numeric key for most domain rows while retaining public UUID aliases; `identity.users` retains a UUID primary key. The table diagram labels expose the exact keys for each entity.
- A nullable FK permits a child row without that association; it does not make the referenced parent optional when a value is present.
- Composite FKs remain composite in the relationship catalog. Their scope columns must not be dropped when reading the diagram.
- A many-to-many association uses its actual junction table where one exists; no direct association is inferred.
- Authorization, tenant/site scoping, and service write ownership are separate contracts. See the linked database rules and module designs.

## What happens during normal operations

No dedicated workflow from the 14 documented workflows is mapped to this schema. It is still represented because it exists in the checked-out database catalog.

## Related documents

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/notification/README.md) · [Notifications HLD](../../03-Modules/Notifications/HLD.md) · [Notifications LLD](../../03-Modules/Notifications/LLD.md) · [Rider_App HLD](../../03-Modules/Rider_App/HLD.md) · [Rider_App LLD](../../03-Modules/Rider_App/LLD.md)
