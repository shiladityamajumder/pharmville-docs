# Cart Checkout operations and acceptance

## Workflow and state ownership

Cart and checkout intent; Order Management owns orders, Inventory owns holds, Payments owns monetary truth.

[WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-018 GET `/v1/me/cart` | Yes | Customer; cart-checkout.read.own | Cart_Checkout |
| API-019 PUT `/v1/me/cart/items` | Yes | Customer; cart-checkout.manage.own | Cart_Checkout |
| API-020 POST `/v1/checkouts/quotes` | Yes | Customer; cart-checkout.manage.own | Cart_Checkout |
| API-021 POST `/v1/checkouts` | Yes | Customer; cart-checkout.manage.own | Cart_Checkout |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `CHK-01` | [TC-CHK-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-02` | [TC-CHK-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-03` | [TC-CHK-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-04` | [TC-CHK-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-05` | [TC-CHK-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-06` | [TC-CHK-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-07` | [TC-CHK-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `CHK-08` | [TC-CHK-08-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
