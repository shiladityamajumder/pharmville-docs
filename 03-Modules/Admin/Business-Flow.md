# Admin business flow

**Status: Proposed workflow; not implemented.** Accountable role: Administration / Operations. CMS/settings and operating organization/location management; domain owners retain controlled master semantics.

## Normal flow

1. Resolve privileged role, permission and organization/location scope for each master/configuration action.
2. Validate versioned master changes through the owning Catalog, Identity, Finance or Pharmacy command; Admin is a management surface.
3. Publish authorized CMS/settings changes with audit/outbox and retain history; deactivation cannot invalidate existing transactional evidence.
4. Retain referenced masters and enforce explicit uniqueness/foreign-key rules; proposed initial datasets require owner approval.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `ADM-01` | Must (draft) | [TC-ADM-01-OK / adverse cases](LLD.md) |
| `ADM-02` | Must (draft) | [TC-ADM-02-OK / adverse cases](LLD.md) |
| `ADM-03` | Must (draft) | [TC-ADM-03-OK / adverse cases](LLD.md) |
| `ADM-04` | Must (draft) | [TC-ADM-04-OK / adverse cases](LLD.md) |
| `ADM-05` | Must (draft) | [TC-ADM-05-OK / adverse cases](LLD.md) |
| `ADM-06` | Must (draft) | [TC-ADM-06-OK / adverse cases](LLD.md) |
| `ADM-07` | Must (draft) | [TC-ADM-07-OK / adverse cases](LLD.md) |
| `ADM-08` | Must (draft) | [TC-ADM-08-OK / adverse cases](LLD.md) |
| `ADM-09` | Should (draft) | [TC-ADM-09-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Admin-and-Operations.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-001; D-003; D-012; D-024.
