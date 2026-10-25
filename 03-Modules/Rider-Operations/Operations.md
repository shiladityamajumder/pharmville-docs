# Rider Operations operations and acceptance

## Workflow and state ownership

Rider client workflows; no independent direct table write ownership or clinical/finance authority.

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-069 POST `/v1/rider/shifts` | Yes | Rider; delivery.shift.manage.own | Delivery_Operations |
| API-070 GET `/v1/rider/tasks` | Yes | Rider; delivery.tasks.read.own | Delivery_Operations |
| API-071 POST `/v1/rider/tasks/{task_id}/pickup` | Yes | Rider; delivery.pickup.own | Delivery_Operations with Fulfillment handoff command |
| API-072 POST `/v1/rider/tasks/{task_id}/location` | Yes | Rider; delivery.location.write.own | Delivery_Operations |
| API-073 POST `/v1/rider/tasks/{task_id}/complete` | Yes | Rider; delivery.complete.own | Delivery_Operations with Finance COD command |
| API-074 POST `/v1/rider/tasks/{task_id}/fail` | Yes | Rider; delivery.failure.record.own | Delivery_Operations |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `RID-01` | [TC-RID-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RID-02` | [TC-RID-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RID-03` | [TC-RID-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RID-04` | [TC-RID-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RID-05` | [TC-RID-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RID-06` | [TC-RID-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `RID-07` | [TC-RID-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.


## Unified identity and workspace access

**Proposed / Unapproved / Not Implemented — D-003/D-024/D-028.** [Unified Identity policy](../Authentication/Unified-Identity-Architecture.md) is the canonical authentication, scoped authorization, context-switch, step-up and revocation design. [Role/workspace matrix](../../01-Project/User-Roles.md) defines proposed defaults without granting permissions. Customer and Rider phone OTP and AUTH-01 password/authenticator requirements remain. Account, role and panel are separate: menus and client role strings never authorize an API. No grant means account access only; suspension/expiry deny protected operations. Existing service identities/provider signatures remain separate trust types.
