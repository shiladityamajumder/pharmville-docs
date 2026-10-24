# Inventory operations and acceptance

## Workflow and state ownership

Lots, balances, movement ledger, holds and adjustments; stores/warehouses supply evidence and request movements.

[WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md), [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-050 GET `/v1/staff/inventory` | Yes | Inventory Operator; inventory.read | Inventory |
| API-051 POST `/v1/staff/inventory/observations` | Yes | Inventory Integration Operator / approved POS service; inventory.observation.ingest | Inventory |
| API-052 POST `/v1/internal/inventory/reservations` | Yes | Internal Checkout / Order Operations workload; inventory.reservations.create | Inventory |
| API-053 POST `/v1/internal/inventory/reservations/{reservation_id}/release` | Yes | Internal Order Operations / reservation-expiry workload; inventory.reservations.release | Inventory |
| API-054 POST `/v1/staff/inventory/adjustments` | Yes | Inventory Controller; inventory.adjustments.request | Inventory |
| API-055 GET `/v1/staff/inventory/alerts` | Yes | Inventory Operator; inventory.alerts.read | Inventory |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `INV-01` | [TC-INV-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `INV-02` | [TC-INV-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `INV-03` | [TC-INV-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `INV-04` | [TC-INV-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `INV-05` | [TC-INV-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `INV-06` | [TC-INV-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `INV-07` | [TC-INV-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
