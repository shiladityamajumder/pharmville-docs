# Admin operations and acceptance

## Workflow and state ownership

CMS/settings and operating organization/location management; domain owners retain controlled master semantics.

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-002](../../06-Workflows/WF-002-Search-and-Availability.md), [WF-006](../../06-Workflows/WF-006-Licensed-Site-Allocation.md), [WF-012](../../06-Workflows/WF-012-Report-Export-and-Audit.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-032 GET `/v1/admin/dashboard` | Yes | Admin / scoped Operations Manager; admin.dashboard.read | Admin_CMS |
| API-033 POST `/v1/admin/staff` | Yes | Identity Administrator; identity.staff.invite | Authentication_Access with organization membership owner |
| API-034 PATCH `/v1/admin/staff/{staff_id}` | Yes | Identity Administrator; identity.staff.manage | Authentication_Access with organization membership owner |
| API-035 GET `/v1/admin/settings` | Yes | Admin / Configuration Manager; admin.settings.read | Admin_CMS |
| API-036 PATCH `/v1/admin/settings` | Yes | Configuration Manager with Finance approval; admin.settings.manage | Admin_CMS |
| API-037 POST `/v1/admin/cms/pages/{page_id}/publish` | Yes | Content Publisher; cms.publish | Admin_CMS |
| API-038 POST `/v1/admin/locations` | Yes | Organization Administrator; organization.locations.create | Admin_CMS |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `ADM-01` | [TC-ADM-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-02` | [TC-ADM-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-03` | [TC-ADM-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-04` | [TC-ADM-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-05` | [TC-ADM-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-06` | [TC-ADM-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-07` | [TC-ADM-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-08` | [TC-ADM-08-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ADM-09` | [TC-ADM-09-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.


## Unified identity and workspace access

**Proposed / Unapproved / Not Implemented — D-003/D-024/D-028.** [Unified Identity policy](../Authentication/Unified-Identity-Architecture.md) is the canonical authentication, scoped authorization, context-switch, step-up and revocation design. [Role/workspace matrix](../../01-Project/User-Roles.md) defines proposed defaults without granting permissions. Customer and Rider phone OTP and AUTH-01 password/authenticator requirements remain. Account, role and panel are separate: menus and client role strings never authorize an API. No grant means account access only; suspension/expiry deny protected operations. Existing service identities/provider signatures remain separate trust types.
