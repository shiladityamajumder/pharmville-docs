# Warehouse business flow

**Status: Proposed workflow; not implemented.** Accountable role: Warehouse / Procurement. Warehouse geometry, receiving and transfers/procurement; Inventory owns stock ledger and balances.

## Normal flow

1. Load scoped warehouse tasks, receiving or transfer intent and approved supplier/location dependencies.
2. Receive exact products and lots with batch/expiry/quality evidence; Inventory applies durable stock effects.
3. Dispatch and receive transfers with distinct custody outcomes; never count in-transit quantities twice.
4. Replenish within approved launch scope; full procurement/fallback rollout remains a product/operations decision.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `WH-01` | Must (draft) | [TC-WH-01-OK / adverse cases](LLD.md) |
| `WH-02` | Must (draft) | [TC-WH-02-OK / adverse cases](LLD.md) |
| `WH-03` | Must (draft) | [TC-WH-03-OK / adverse cases](LLD.md) |
| `WH-04` | Must (draft) | [TC-WH-04-OK / adverse cases](LLD.md) |
| `WH-05` | Could (draft) | [TC-WH-05-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md), [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Store-and-Warehouse.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-002; D-007; D-012; D-024.
