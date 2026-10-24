# Notifications operations and acceptance

## Workflow and state ownership

Notification messages and attempts; source domains own business events and customer support remains a separate scope decision.

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-094 POST `/v1/internal/notifications/jobs` | Yes | Internal committed-event consumer; notifications.jobs.create | Notifications |
| API-095 GET `/v1/admin/notifications/deliveries` | Yes | Notification Operator; notifications.deliveries.read | Notifications |
| API-096 POST `/v1/rider/push-tokens` | Yes | Rider; notifications.devices.manage.own | Notifications |
| API-097 GET `/v1/admin/notifications/alerts` | Yes | Notification Operator; notifications.alerts.read | Notifications |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `NOT-01` | [TC-NOT-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `NOT-02` | [TC-NOT-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `NOT-03` | [TC-NOT-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `NOT-04` | [TC-NOT-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `NOT-05` | [TC-NOT-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
