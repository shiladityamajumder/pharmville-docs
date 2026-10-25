# Cart Checkout business flow

**Status: Proposed workflow; not implemented.** Accountable role: Commerce / Checkout. Cart and checkout intent; Order Management owns orders, Inventory owns holds, Payments owns monetary truth.

## Normal flow

1. Validate the owned cart, destination and patient; re-price exact variants and quantities against current authorized masters.
2. Obtain an Inventory-owned concurrency-safe hold for eligible lot/site stock; stale POS evidence blocks reservation.
3. Create one durable checkout/order intent and accepted revision using the same idempotency key on a retry.
4. Route orders containing P lines through the existing pharmacist-review flow; M/O-only orders skip it unless another documented rule applies.
5. Consume trusted Finance results and the current approved clinical/revision state before progression; uncertain payment stays pending.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `CHK-01` | Must (draft) | [TC-CHK-01-OK / adverse cases](LLD.md) |
| `CHK-02` | Must (draft) | [TC-CHK-02-OK / adverse cases](LLD.md) |
| `CHK-03` | Must (draft) | [TC-CHK-03-OK / adverse cases](LLD.md) |
| `CHK-04` | Must (draft) | [TC-CHK-04-OK / adverse cases](LLD.md) |
| `CHK-05` | Must (draft) | [TC-CHK-05-OK / adverse cases](LLD.md) |
| `CHK-06` | Must (draft) | [TC-CHK-06-OK / adverse cases](LLD.md) |
| `CHK-07` | Must (draft) | [TC-CHK-07-OK / adverse cases](LLD.md) |
| `CHK-08` | Must (draft) | [TC-CHK-08-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Cart-and-Checkout.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-004; D-006; D-007; D-024.
