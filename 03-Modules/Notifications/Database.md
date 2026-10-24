# Notifications database contract

**Structure validated; business write assignment Proposed.** Notification messages and attempts; source domains own business events and customer support remains a separate scope decision. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`notification.device_endpoints`](../../04-Database/Tables/notification/device_endpoints.md) | Configuration | D-024; SQL grants reviewed independently |
| [`notification.in_app_notifications`](../../04-Database/Tables/notification/in_app_notifications.md) | Transactional | D-024; SQL grants reviewed independently |
| [`notification.message_attachments`](../../04-Database/Tables/notification/message_attachments.md) | Mapping / Junction | D-024; SQL grants reviewed independently |
| [`notification.message_attempts`](../../04-Database/Tables/notification/message_attempts.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`notification.messages`](../../04-Database/Tables/notification/messages.md) | Transactional | D-024; SQL grants reviewed independently |
| [`notification.provider_configurations`](../../04-Database/Tables/notification/provider_configurations.md) | Configuration | D-024; SQL grants reviewed independently |
| [`notification.provider_webhooks`](../../04-Database/Tables/notification/provider_webhooks.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`notification.suppressions`](../../04-Database/Tables/notification/suppressions.md) | Configuration | D-024; SQL grants reviewed independently |
| [`notification.templates`](../../04-Database/Tables/notification/templates.md) | Configuration | D-024; SQL grants reviewed independently |
| [`notification.user_channel_preferences`](../../04-Database/Tables/notification/user_channel_preferences.md) | Configuration | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `current_revision_id`, `id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-094, API-095 |
| [`notification.device_endpoints`](../../04-Database/Tables/notification/device_endpoints.md) | `device_id`, `enabled`, `id`, `is_deleted`, `last_seen_at`, `locale`, `platform`, `provider`, `row_version`, `timezone`, `user_id` | `device_id`, `enabled`, `invalidated_at`, `last_seen_at`, `locale`, `platform`, `provider`, `timezone`, `token_encrypted`, `token_hash`, `user_id` | Notifications | API-096 |
| [`notification.message_attempts`](../../04-Database/Tables/notification/message_attempts.md) | `id`, `message_id`, `status` | None | Notifications | API-095, API-097 |
| [`notification.messages`](../../04-Database/Tables/notification/messages.md) | `attempt_count`, `channel`, `delivered_at`, `expires_at`, `failed_at`, `id`, `notification_type`, `row_version`, `sent_at`, `status`, `user_id` | `available_at`, `channel`, `idempotency_key`, `idempotency_scope`, `notification_type`, `payload`, `status`, `template_id`, `user_id` | Notifications | API-094, API-095, API-097 |
| [`notification.provider_configurations`](../../04-Database/Tables/notification/provider_configurations.md) | `id`, `is_deleted`, `row_version`, `status` | None | Notifications | API-094 |
| [`notification.suppressions`](../../04-Database/Tables/notification/suppressions.md) | `expires_at`, `id`, `is_active`, `is_deleted`, `row_version` | None | Notifications | API-094 |
| [`notification.templates`](../../04-Database/Tables/notification/templates.md) | `code`, `id`, `is_deleted`, `row_version`, `status` | None | Notifications | API-094 |
| [`notification.user_channel_preferences`](../../04-Database/Tables/notification/user_channel_preferences.md) | `id`, `is_deleted`, `row_version`, `user_id` | None | Notifications | API-094 |
| [`platform.outbox_events`](../../04-Database/Tables/platform/outbox_events.md) | `id`, `row_version` | None | Shared platform runtime — engineering owner | API-094 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`notification.device_endpoints`](../../04-Database/Tables/notification/device_endpoints.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`notification.provider_configurations`](../../04-Database/Tables/notification/provider_configurations.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`notification.suppressions`](../../04-Database/Tables/notification/suppressions.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`notification.templates`](../../04-Database/Tables/notification/templates.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`notification.user_channel_preferences`](../../04-Database/Tables/notification/user_channel_preferences.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
