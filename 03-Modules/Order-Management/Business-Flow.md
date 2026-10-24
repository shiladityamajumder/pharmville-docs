# Order Management business flow

**Status: Proposed workflow; not implemented.** Accountable role: Order operations. Order aggregate, revisions and orchestration; consumers request commands rather than directly mutating order state.

## Normal flow

1. Accept the current checkout intent and revision; preserve one order intent and distinct clinical, stock and payment facts.
2. Select one eligible licensed fulfillment site using current safe stock evidence; do not split a launch order across sites.
3. Orchestrate store preparation only when clinical, stock and payment/COD gates are satisfied.
4. Handle rejection, correction, cancellation, return and refund through the responsible owners; revised baskets require explicit acceptance.
5. Compose the customer-visible timeline from committed facts and publish durable events after commit.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `OMS-01` | Must (draft) | [TC-OMS-01-OK / adverse cases](LLD.md) |
| `OMS-02` | Must (draft) | [TC-OMS-02-OK / adverse cases](LLD.md) |
| `OMS-03` | Must (draft) | [TC-OMS-03-OK / adverse cases](LLD.md) |
| `OMS-04` | Must (draft) | [TC-OMS-04-OK / adverse cases](LLD.md) |
| `OMS-05` | Must (draft) | [TC-OMS-05-OK / adverse cases](LLD.md) |
| `OMS-06` | Must (draft) | [TC-OMS-06-OK / adverse cases](LLD.md) |
| `OMS-07` | Could (draft) | [TC-OMS-07-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md), [WF-004](../../06-Workflows/WF-004-Prescription-Intake-and-Review.md), [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Orders-and-Fulfillment.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-002; D-004; D-006; D-024.
