# Rider Operations business flow

**Status: Proposed workflow; not implemented.** Accountable role: Rider operations / mobile client. Rider client workflows; no independent direct table write ownership or clinical/finance authority.

## Normal flow

1. Authenticate the rider and set allowed duty state; load only current assigned tasks.
2. Navigate and submit location/attempt evidence only for authorized live tasks; tolerate offline retries without duplicate completion.
3. Submit both mandatory RID-04 OTP and photo evidence; a stale version or reassigned task must fail.
4. Record collection/handover inputs to Delivery/Finance commands, then show the trusted task outcome.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `RID-01` | Must (draft) | [TC-RID-01-OK / adverse cases](LLD.md) |
| `RID-02` | Must (draft) | [TC-RID-02-OK / adverse cases](LLD.md) |
| `RID-03` | Must (draft) | [TC-RID-03-OK / adverse cases](LLD.md) |
| `RID-04` | Must (draft) | [TC-RID-04-OK / adverse cases](LLD.md) |
| `RID-05` | Should (draft) | [TC-RID-05-OK / adverse cases](LLD.md) |
| `RID-06` | Must (draft) | [TC-RID-06-OK / adverse cases](LLD.md) |
| `RID-07` | Should (draft) | [TC-RID-07-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-009](../../06-Workflows/WF-009-COD-Collection.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Delivery-and-Rider-App.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-008; D-010; D-021; D-024.
