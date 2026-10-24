# Inventory business flow

**Status: Proposed workflow; not implemented.** Accountable role: Inventory control. Lots, balances, movement ledger, holds and adjustments; stores/warehouses supply evidence and request movements.

## Normal flow

1. Observe location-specific stock from approved authoritative inputs; preserve POS evidence and freshness.
2. Select eligible unexpired lots using documented FEFO and owner-approved shelf-life rules; serialize competing reservations.
3. Commit ledger/balance/reservation effects atomically; duplicate intent cannot move stock twice.
4. Release expired/abandoned holds once; process approved reasoned adjustments and reconcile divergence without rewriting history.
5. Provide low-stock/expiry projections; opening import and POS adapter formats remain explicit pending contracts.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `INV-01` | Must (draft) | [TC-INV-01-OK / adverse cases](LLD.md) |
| `INV-02` | Must (draft) | [TC-INV-02-OK / adverse cases](LLD.md) |
| `INV-03` | Must (draft) | [TC-INV-03-OK / adverse cases](LLD.md) |
| `INV-04` | Must (draft) | [TC-INV-04-OK / adverse cases](LLD.md) |
| `INV-05` | Must (draft) | [TC-INV-05-OK / adverse cases](LLD.md) |
| `INV-06` | Must (draft) | [TC-INV-06-OK / adverse cases](LLD.md) |
| `INV-07` | Must (draft) | [TC-INV-07-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-011](../../06-Workflows/WF-011-Inventory-Reconciliation.md), [WF-014](../../06-Workflows/WF-014-Supplier-Receiving.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Inventory-and-Stock.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-002; D-005; D-007; D-012; D-024.
