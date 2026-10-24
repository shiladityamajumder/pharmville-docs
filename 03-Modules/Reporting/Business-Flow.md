# Reporting business flow

**Status: Proposed workflow; not implemented.** Accountable role: Reporting / Finance analytics. Report definitions, runs and scoped read-only outputs; source domains own data and correction commands.

## Normal flow

1. Authorize report definition and scope; snapshot validated filters without granting arbitrary SQL.
2. Create one export job/run and use approved read interfaces with consistent bounded queries.
3. Generate REP-07 Excel .xlsx output; protect the stored export with expiring resource-scoped access.
4. Audit requests/downloads and expose pending/failed outcomes; report retries cannot create business corrections.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `REP-01` | Must (draft) | [TC-REP-01-OK / adverse cases](LLD.md) |
| `REP-02` | Must (draft) | [TC-REP-02-OK / adverse cases](LLD.md) |
| `REP-03` | Must (draft) | [TC-REP-03-OK / adverse cases](LLD.md) |
| `REP-04` | Must (draft) | [TC-REP-04-OK / adverse cases](LLD.md) |
| `REP-05` | Should (draft) | [TC-REP-05-OK / adverse cases](LLD.md) |
| `REP-06` | Should (draft) | [TC-REP-06-OK / adverse cases](LLD.md) |
| `REP-07` | Must (draft) | [TC-REP-07-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Reporting-and-Audit.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-010; D-013; D-024.
