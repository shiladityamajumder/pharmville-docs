# Authentication business flow

**Status: Proposed workflow; not implemented.** Accountable role: Security / Identity. Authentication mechanics and role grants; customer login endpoints retain their historical customer contract surface.

## Normal flow

1. Resolve customer OTP or staff password/MFA proof through its own pre-login trust path; never require an existing bearer for login.
2. Bind proof to purpose and expiry, consume it once, enforce approved throttling and staff session limits.
3. Issue or rotate a session only after valid proof; resolve current permission and organization/location scope server-side.
4. Revoke the owned session on logout and deny stale/replayed refresh proof.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `AUTH-01` | Must (draft) | [TC-AUTH-01-OK / adverse cases](LLD.md) |
| `AUTH-02` | Must (draft) | [TC-AUTH-02-OK / adverse cases](LLD.md) |
| `AUTH-03` | Must (draft) | [TC-AUTH-03-OK / adverse cases](LLD.md) |
| `AUTH-04` | Must (draft) | [TC-AUTH-04-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Accounts-and-Login.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-003; D-023; D-024.
