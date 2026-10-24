# Audit business flow

**Status: Proposed workflow; not implemented.** Accountable role: Security / Audit platform. Append-only evidence infrastructure and authorized audit reads; business domains own command effects.

## Normal flow

1. Accept trusted append-only domain/security evidence with actor, resource and correlation identifiers.
2. Redact credentials, OTPs and private document content; record only permitted metadata and references.
3. Authorize bounded audit queries and exports by purpose and scope; access itself is auditable.
4. Retain immutable history under approved retention/legal-hold policy; auditor reads grant no history edit/delete capability.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `AUD-01` | Must (draft) | [TC-AUD-01-OK / adverse cases](LLD.md) |
| `AUD-02` | Must (draft) | [TC-AUD-02-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Reporting-and-Audit.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-010; D-013; D-024.
