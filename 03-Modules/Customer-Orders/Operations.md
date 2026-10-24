# Customer Orders operations and acceptance

## Workflow and state ownership

Customer order projections and command facade; no independent authoritative order, payment or clinical tables.

[WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-025 GET `/v1/me/orders` | Yes | Customer; customer-orders.read.own | Customer_Orders |
| API-026 GET `/v1/me/orders/{order_id}` | Yes | Customer; customer-orders.read.own | Customer_Orders |
| API-027 POST `/v1/me/orders/{order_id}/cancel` | Yes | Customer; customer-orders.manage.own | Order_Operations |
| API-028 POST `/v1/me/orders/{order_id}/returns` | Yes | Customer; customer-orders.manage.own | Order_Operations |
| API-029 GET `/v1/me/orders/{order_id}/invoice` | Yes | Customer; customer-orders.read.own | Finance_Payments |
| API-030 GET `/v1/me/orders/{order_id}/refunds` | Yes | Customer; customer-orders.read.own | Finance_Payments |
| API-031 GET `/v1/me/orders/{order_id}/delivery` | Yes | Customer; customer-orders.read.own | Delivery_Operations |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `ORD-01` | [TC-ORD-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-02` | [TC-ORD-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-03` | [TC-ORD-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-04` | [TC-ORD-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-05` | [TC-ORD-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-06` | [TC-ORD-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-07` | [TC-ORD-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-08` | [TC-ORD-08-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ORD-09` | [TC-ORD-09-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
