# Notifications business flow

**Status: Proposed workflow; not implemented.** Accountable role: Communications / Platform. Notification messages and attempts; source domains own business events and customer support remains a separate scope decision.

## Normal flow

1. Consume committed domain outbox events; deduplicate delivery intent without repeating source business commands.
2. Choose approved template/version, recipient and allowed channel based on current consent and operational context.
3. Dispatch through the configured provider and persist attempt/outcome; authenticate callback evidence before changing delivery state.
4. Retry recoverable delivery failures within approved policy; provider outage cannot roll back a committed order or payment.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `NOT-01` | Must (draft) | [TC-NOT-01-OK / adverse cases](LLD.md) |
| `NOT-02` | Must (draft) | [TC-NOT-02-OK / adverse cases](LLD.md) |
| `NOT-03` | Must (draft) | [TC-NOT-03-OK / adverse cases](LLD.md) |
| `NOT-04` | Must (draft) | [TC-NOT-04-OK / adverse cases](LLD.md) |
| `NOT-05` | Could (draft) | [TC-NOT-05-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-005](../../06-Workflows/WF-005-Payment-and-Confirmation.md), [WF-008](../../06-Workflows/WF-008-Rider-Assignment-and-POD.md), [WF-013](../../06-Workflows/WF-013-Customer-Support-Triage.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Notifications-and-Support.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-005; D-010; D-024.
