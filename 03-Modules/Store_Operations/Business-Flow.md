# Store Operations business flow

**Status: Proposed workflow; not implemented.** Accountable role: Store fulfillment. Store pick/pack and preparation tasks; Inventory commits stock and Delivery owns custody after handoff.

## Normal flow

1. Load scoped assigned orders and current fulfillment task version; recheck licensed site and P-line pharmacist evidence.
2. Pick only allocated eligible batches; record short pick or mismatch through an exception command rather than inventing stock.
3. Pack the accepted revision with exact contents and custody evidence; payment or approved COD is a separate gate.
4. Hand off only when committed stock, valid licenses and preparation evidence satisfy dispatch guards.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `STO-01` | Must (draft) | [TC-STO-01-OK / adverse cases](LLD.md) |
| `STO-02` | Must (draft) | [TC-STO-02-OK / adverse cases](LLD.md) |
| `STO-03` | Must (draft) | [TC-STO-03-OK / adverse cases](LLD.md) |
| `STO-04` | Must (draft) | [TC-STO-04-OK / adverse cases](LLD.md) |
| `STO-05` | Must (draft) | [TC-STO-05-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Store-and-Warehouse.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-002; D-009; D-024.
