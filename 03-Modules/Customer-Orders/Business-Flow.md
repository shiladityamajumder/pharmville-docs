# Customer Orders business flow

**Status: Proposed workflow; not implemented.** Accountable role: Customer commerce surface. Customer order projections and command facade; no independent authoritative order, payment or clinical tables.

## Normal flow

1. Read only owned orders and the composed clinical/payment/fulfillment/delivery timeline.
2. Request pre-pack cancellation or a return through Order Management; the customer surface cannot directly write another owner’s truth.
3. Download only the owned invoice, using JSON or the existing application/pdf representation; payment/refund status comes from Payments.
4. Show authorized delivery projection, OTP and masked contact only within current ownership and privacy rules.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `ORD-01` | Must (draft) | [TC-ORD-01-OK / adverse cases](LLD.md) |
| `ORD-02` | Must (draft) | [TC-ORD-02-OK / adverse cases](LLD.md) |
| `ORD-03` | Must (draft) | [TC-ORD-03-OK / adverse cases](LLD.md) |
| `ORD-04` | Must (draft) | [TC-ORD-04-OK / adverse cases](LLD.md) |
| `ORD-05` | Should (draft) | [TC-ORD-05-OK / adverse cases](LLD.md) |
| `ORD-06` | Must (draft) | [TC-ORD-06-OK / adverse cases](LLD.md) |
| `ORD-07` | Must (draft) | [TC-ORD-07-OK / adverse cases](LLD.md) |
| `ORD-08` | Must (draft) | [TC-ORD-08-OK / adverse cases](LLD.md) |
| `ORD-09` | Could (draft) | [TC-ORD-09-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Orders-and-Fulfillment.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-004; D-010; D-011; D-024.
