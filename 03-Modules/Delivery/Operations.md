# Delivery operations and acceptance

## Workflow and state ownership

Assignments, custody, attempts, OTP/location facts; rider is a scoped client and Finance owns COD money.

[WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-064 GET `/v1/staff/delivery/tasks` | Yes | Delivery Dispatcher; delivery.tasks.read | Delivery_Operations |
| API-065 POST `/v1/staff/delivery/tasks/{task_id}/assign` | Yes | Delivery Dispatcher; delivery.assign | Delivery_Operations |
| API-066 POST `/v1/staff/delivery/tasks/{task_id}/resolution` | Yes | Delivery Dispatcher; delivery.exceptions.resolve | Delivery_Operations |
| API-067 GET `/v1/staff/delivery/cod-handover` | Yes | Cash Receiver / Delivery Supervisor; finance.cod.handover.read | Finance_Payments projection for Delivery_Operations |
| API-068 POST `/v1/staff/delivery/riders` | Yes | Delivery Administrator; delivery.riders.onboard | Authentication_Access with Delivery_Operations membership command |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `DLV-01` | [TC-DLV-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `DLV-02` | [TC-DLV-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `DLV-03` | [TC-DLV-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `DLV-04` | [TC-DLV-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `DLV-05` | [TC-DLV-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
