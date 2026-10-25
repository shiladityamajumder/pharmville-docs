# Delivery business flow

**Status: Proposed workflow; not implemented.** Accountable role: Delivery operations. Assignments, custody, attempts, OTP/location facts; rider is a scoped client and Finance owns COD money.

## Normal flow

1. Assign an eligible scoped rider to a dispatch-ready shipment with optimistic version control.
2. Record custody and attempts against the current assignment; stale reassignment cannot complete a previous task.
3. Validate mandatory delivery OTP and photo evidence before completion; failure remains retryable or escalated under approved policy.
4. Record COD handover evidence and request Finance reconciliation; delivery completion cannot settle money.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `DLV-01` | Must (draft) | [TC-DLV-01-OK / adverse cases](LLD.md) |
| `DLV-02` | Must (draft) | [TC-DLV-02-OK / adverse cases](LLD.md) |
| `DLV-03` | Must (draft) | [TC-DLV-03-OK / adverse cases](LLD.md) |
| `DLV-04` | Must (draft) | [TC-DLV-04-OK / adverse cases](LLD.md) |
| `DLV-05` | Must (draft) | [TC-DLV-05-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-007](../../06-Workflows/WF-007-Picking-Packing-and-Handoff.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md), [WF-010](../../06-Workflows/WF-010-Cancellation-Return-and-Refund.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Delivery-and-Rider-App.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-008; D-010; D-011; D-024.
