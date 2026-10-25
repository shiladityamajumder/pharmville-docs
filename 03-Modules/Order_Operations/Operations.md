# Order Management operations and acceptance

## Workflow and state ownership

Order aggregate, revisions and orchestration; consumers request commands rather than directly mutating order state.

[WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-039 GET `/v1/admin/orders` | Yes | Order Operator; orders.queue.read | Order_Operations |
| API-040 GET `/v1/admin/orders/{order_id}` | Yes | Order Operator; orders.detail.read | Order_Operations |
| API-041 POST `/v1/admin/orders/{order_id}/allocate` | Yes | Order Allocator; orders.allocate | Order_Operations |
| API-042 POST `/v1/admin/orders/{order_id}/reassign` | Yes | Order Allocator; orders.reassign | Order_Operations |
| API-043 POST `/v1/admin/orders/{order_id}/revisions` | Yes | Order Operator; orders.revision.propose | Order_Operations |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `OMS-01` | [TC-OMS-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `OMS-02` | [TC-OMS-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `OMS-03` | [TC-OMS-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `OMS-04` | [TC-OMS-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `OMS-05` | [TC-OMS-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `OMS-06` | [TC-OMS-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `OMS-07` | [TC-OMS-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
