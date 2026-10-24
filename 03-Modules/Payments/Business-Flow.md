# Payments business flow

**Status: Proposed workflow; not implemented.** Accountable role: Finance / Payments. Money, refunds, invoices, accounting and reconciliation; no direct clinical or stock approval.

## Normal flow

1. Create one payment attempt for the accepted order revision and amount; uncertain provider outcomes remain pending.
2. Authenticate provider evidence using the validated provider signature contract; reconcile trusted callback/status evidence before marking money.
3. Process permitted COD collection/handover and reconcile collected versus deposited money without treating delivery as bank settlement.
4. Create reasoned idempotent refunds and approved ledger/invoice/settlement effects; duplicate events cannot duplicate money.
5. Expose scoped reconciliation/reporting; provider wire formats and multi-state action mappings remain incomplete where recorded.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `FIN-01` | Must (draft) | [TC-FIN-01-OK / adverse cases](LLD.md) |
| `FIN-02` | Must (draft) | [TC-FIN-02-OK / adverse cases](LLD.md) |
| `FIN-03` | Must (draft) | [TC-FIN-03-OK / adverse cases](LLD.md) |
| `FIN-04` | Should (draft) | [TC-FIN-04-OK / adverse cases](LLD.md) |
| `FIN-05` | Must (draft) | [TC-FIN-05-OK / adverse cases](LLD.md) |
| `FIN-06` | Must (draft) | [TC-FIN-06-OK / adverse cases](LLD.md) |
| `FIN-07` | Should (draft) | [TC-FIN-07-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Payments-and-Billing.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-004; D-007; D-008; D-011; D-012; D-016; D-024.
