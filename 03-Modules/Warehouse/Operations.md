# Warehouse operations and acceptance

## Workflow and state ownership

Warehouse geometry, receiving and transfers/procurement; Inventory owns stock ledger and balances.

[WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md), [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-056 POST `/v1/staff/warehouse/receipts` | Yes | Warehouse Receiver; warehouse.receipts.create | Warehouse via Procurement receiving owner |
| API-057 GET `/v1/staff/warehouse/replenishments` | Yes | Warehouse Supervisor; warehouse.replenishment.read | Warehouse |
| API-058 POST `/v1/staff/warehouse/transfers/{transfer_id}/dispatch` | Yes | Warehouse Dispatcher; warehouse.transfer.dispatch | Warehouse |
| API-059 GET `/v1/staff/warehouse/fallback-orders` | Yes | Warehouse Supervisor / Order Operator; warehouse.fallback.read | Warehouse |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `WH-01` | [TC-WH-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `WH-02` | [TC-WH-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `WH-03` | [TC-WH-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `WH-04` | [TC-WH-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `WH-05` | [TC-WH-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
