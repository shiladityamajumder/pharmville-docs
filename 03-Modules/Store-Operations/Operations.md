# Store Operations operations and acceptance

## Workflow and state ownership

Store pick/pack and preparation tasks; Inventory commits stock and Delivery owns custody after handoff.

[WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-044 GET `/v1/staff/store/orders` | Yes | Store Staff; fulfillment.queue.read | Store_Operations |
| API-045 POST `/v1/staff/store/orders/{order_id}/accept` | Yes | Store Supervisor / assigned Store Staff; fulfillment.accept | Store_Operations |
| API-046 POST `/v1/staff/store/picks/{pick_id}/scan` | Yes | Assigned Store Picker; fulfillment.pick.scan | Store_Operations |
| API-047 POST `/v1/staff/store/packs/{pack_id}/close` | Yes | Assigned Store Packer; fulfillment.pack.close | Store_Operations |
| API-048 POST `/v1/staff/store/replenishments` | Yes | Store Supervisor; warehouse.replenishment.request | Warehouse via Procurement requisition command |
| API-049 POST `/v1/staff/store/transfers/{transfer_id}/receipt` | Yes | Destination Store Receiver; warehouse.transfer.receive | Warehouse |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `STO-01` | [TC-STO-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `STO-02` | [TC-STO-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `STO-03` | [TC-STO-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `STO-04` | [TC-STO-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `STO-05` | [TC-STO-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
