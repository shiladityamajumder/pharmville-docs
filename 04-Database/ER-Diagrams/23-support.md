# Support ER diagrams

## What this part of the database stores

The `support` schema stores customer support cases. The names and structural relationships below come from the checked-out database catalog snapshot; business-purpose summaries marked inferred are not product-owner approval.

## Main tables

| Table | Recorded purpose | Table definition |
|---|---|---|
| [`sla_policies`](../Tables/support/sla_policies.md) | Holds sla policies records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/sla_policies.md) |
| [`ticket_actions`](../Tables/support/ticket_actions.md) | Holds ticket actions records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/ticket_actions.md) |
| [`ticket_attachments`](../Tables/support/ticket_attachments.md) | Holds ticket attachments records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/ticket_attachments.md) |
| [`ticket_messages`](../Tables/support/ticket_messages.md) | Holds ticket messages records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/ticket_messages.md) |
| [`ticket_status_history`](../Tables/support/ticket_status_history.md) | Holds ticket status history records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/ticket_status_history.md) |
| [`ticket_tag_assignments`](../Tables/support/ticket_tag_assignments.md) | Holds ticket tag assignments records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/ticket_tag_assignments.md) |
| [`ticket_tags`](../Tables/support/ticket_tags.md) | Holds ticket tags records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/ticket_tags.md) |
| [`tickets`](../Tables/support/tickets.md) | Holds tickets records within the support domain (customer support case records). Its precise write owner and lifecycle must be accepted during module implementation. (inferred meaning) | [Table contract](../Tables/support/tickets.md) |

## ER diagrams

These diagrams show declared PostgreSQL foreign keys from focused source tables. Entity fields include primary keys, unique keys, and FK columns; exact data types remain in the linked table contracts. `PK`, `FK`, and `UK` mark key roles. Relationship cardinality comes from FK nullability and unique constraints/indexes in the recorded catalog.

<a id="diagram-01"></a>

### Diagram 01 — tickets, sla_policies, ticket_actions, ticket_messages, ticket_attachments, ticket_status_history, ticket_tags, ticket_tag_assignments

This focused view contains every declared FK owned by the listed focus tables. Referenced tables outside that set appear as context. Parallel FK constraints are distinguished by their stable IDs; search those IDs in the [relationship catalog](Relationship-Catalog/support.md) for exact columns and actions.

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
    commerce__orders {
        uuid checkout_id FK
        bigint checkout_id_internal_id FK
        uuid created_by FK
        uuid current_revision_id FK
        bigint current_revision_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        varchar order_number UK
        uuid patient_profile_id FK, UK
        bigint patient_profile_id_internal_id FK, UK
        uuid updated_by FK
        uuid user_id FK, UK
    }
    diagnostics__diagnostic_orders {
        uuid address_id FK
        bigint address_id_internal_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid lab_location_id FK
        bigint lab_location_id_internal_id FK
        varchar order_number UK
        uuid patient_profile_id FK
        bigint patient_profile_id_internal_id FK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__users {
        uuid created_by FK
        varchar email_normalized UK
        uuid id PK, FK, UK
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
    support__sla_policies {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    support__ticket_actions {
        uuid approved_by_user_id FK
        uuid created_by FK
        uuid id UK
        bigint internal_id PK, UK
        uuid requested_by_user_id FK
        uuid ticket_id FK
        bigint ticket_id_internal_id FK
        uuid updated_by FK
    }
    support__ticket_attachments {
        uuid created_by FK
        uuid file_object_id FK, UK
        bigint file_object_id_internal_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid ticket_id FK
        bigint ticket_id_internal_id FK
        uuid ticket_message_id FK
        bigint ticket_message_id_internal_id FK
        uuid updated_by FK
    }
    support__ticket_messages {
        uuid author_user_id FK
        uuid created_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid ticket_id FK
        bigint ticket_id_internal_id FK
        uuid updated_by FK
    }
    support__ticket_status_history {
        uuid actor_user_id FK
        uuid id UK
        bigint internal_id PK, UK
        uuid ticket_id FK
        bigint ticket_id_internal_id FK
    }
    support__ticket_tag_assignments {
        uuid id UK
        bigint internal_id PK, UK
        uuid tag_id FK, UK
        bigint tag_id_internal_id FK
        uuid ticket_id FK, UK
        bigint ticket_id_internal_id FK
    }
    support__ticket_tags {
        uuid created_by FK
        uuid deleted_by FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid updated_by FK
    }
    support__tickets {
        uuid appointment_id FK
        bigint appointment_id_internal_id FK
        uuid assigned_to_user_id FK
        uuid created_by FK
        uuid diagnostic_order_id FK
        bigint diagnostic_order_id_internal_id FK
        uuid id FK, UK
        bigint internal_id PK, FK, UK
        uuid order_id FK
        bigint order_id_internal_id FK
        uuid sla_policy_id FK
        bigint sla_policy_id_internal_id FK
        varchar ticket_number UK
        uuid updated_by FK
        uuid user_id FK
    }
    identity__users o|--o{ support__tickets : "FK-1317 FK-1308 FK-1309 FK-1316"
    support__sla_policies o|--o{ support__tickets : "FK-1314 FK-1315"
    appointment__appointments o|--o{ support__tickets : "FK-1306 FK-1307"
    diagnostics__diagnostic_orders o|--o{ support__tickets : "FK-1311 FK-1310"
    commerce__orders o|--o{ support__tickets : "FK-1312 FK-1313"
    identity__users o|--o{ support__sla_policies : "FK-1274 FK-1275 FK-1276"
    identity__users ||--o{ support__ticket_actions : "FK-1279"
    identity__users o|--o{ support__ticket_actions : "FK-1277 FK-1278 FK-1282"
    support__tickets ||--o{ support__ticket_actions : "FK-1280 FK-1281"
    identity__users o|--o{ support__ticket_messages : "FK-1291 FK-1292 FK-1295"
    support__tickets ||--o{ support__ticket_messages : "FK-1293 FK-1294"
    identity__users o|--o{ support__ticket_attachments : "FK-1283 FK-1290"
    support__tickets ||--o{ support__ticket_attachments : "FK-1286 FK-1287"
    support__ticket_messages o|--o{ support__ticket_attachments : "FK-1289 FK-1288"
    platform__file_objects ||--o| support__ticket_attachments : "FK-1285"
    platform__file_objects ||--o{ support__ticket_attachments : "FK-1284"
    identity__users o|--o{ support__ticket_status_history : "FK-1296"
    support__tickets ||--o{ support__ticket_status_history : "FK-1297 FK-1298"
    identity__users o|--o{ support__ticket_tags : "FK-1303 FK-1304 FK-1305"
    support__ticket_tags ||--o{ support__ticket_tag_assignments : "FK-1299 FK-1300"
    support__tickets ||--o{ support__ticket_tag_assignments : "FK-1301 FK-1302"
```

**Entity name mapping**

| Mermaid name | PostgreSQL table |
|---|---|
| `appointment__appointments` | [`appointment.appointments`](../Tables/appointment/appointments.md) |
| `commerce__orders` | [`commerce.orders`](../Tables/commerce/orders.md) |
| `diagnostics__diagnostic_orders` | [`diagnostics.diagnostic_orders`](../Tables/diagnostics/diagnostic_orders.md) |
| `identity__users` | [`identity.users`](../Tables/identity/users.md) |
| `platform__file_objects` | [`platform.file_objects`](../Tables/platform/file_objects.md) |
| `support__sla_policies` | [`support.sla_policies`](../Tables/support/sla_policies.md) |
| `support__ticket_actions` | [`support.ticket_actions`](../Tables/support/ticket_actions.md) |
| `support__ticket_attachments` | [`support.ticket_attachments`](../Tables/support/ticket_attachments.md) |
| `support__ticket_messages` | [`support.ticket_messages`](../Tables/support/ticket_messages.md) |
| `support__ticket_status_history` | [`support.ticket_status_history`](../Tables/support/ticket_status_history.md) |
| `support__ticket_tag_assignments` | [`support.ticket_tag_assignments`](../Tables/support/ticket_tag_assignments.md) |
| `support__ticket_tags` | [`support.ticket_tags`](../Tables/support/ticket_tags.md) |
| `support__tickets` | [`support.tickets`](../Tables/support/tickets.md) |

Coverage: 8 focus tables, 13 entities, 44 FK constraints (44 unique IDs).

## How the tables connect

- **support.sla_policies → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **support.sla_policies → identity.users:** `deleted_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **support.sla_policies → identity.users:** `updated_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **support.ticket_actions → identity.users:** `approved_by_user_id` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE SET NULL`. This keeps the child record tied to an existing parent key.
- **support.ticket_actions → identity.users:** `created_by` references `id`; Each child may reference zero or one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.
- **support.ticket_actions → identity.users:** `requested_by_user_id` references `id`; Each child must reference exactly one parent; each parent may have zero or more child row(s). The database applies `ON DELETE RESTRICT`. This keeps the child record tied to an existing parent key.

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

[Schema overview](../Schema-Overview.md) · [Database rules](../Database-Rules.md) · [Model and parity notes](../Models-and-Parity.md) · [Migration evidence](../Migrations.md) · [Full relationship catalog](Relationship-Catalog.md) · [Non-FK reference review](Logical-References.md) · [Table index](../Tables/support/README.md) · [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md)
