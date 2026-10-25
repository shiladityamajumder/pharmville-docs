# Customer Accounts operations and acceptance

## Workflow and state ownership

Profiles, addresses, family associations and consent; delegates credentials and sessions to Authentication.

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-001 POST `/v1/auth/customer/otp/request` | No; endpoint-specific pre-login/provider trust | Public; Public challenge issuance; no role grant | Authentication_Access |
| API-002 POST `/v1/auth/customer/otp/verify` | No; endpoint-specific pre-login/provider trust | Public; Valid customer-login proof; no existing access session | Authentication_Access |
| API-003 GET `/v1/me` | Yes | Customer; customer-accounts.read.own | Customer_Accounts |
| API-004 PATCH `/v1/me` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| API-005 GET `/v1/me/addresses` | Yes | Customer; customer-accounts.read.own | Customer_Accounts |
| API-006 POST `/v1/me/addresses` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| API-007 GET `/v1/me/patients` | Yes | Customer; customer-accounts.read.own | Customer_Accounts |
| API-008 POST `/v1/me/patients` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| API-009 POST `/v1/me/consents` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| ACC-ROUTE-005 GET `/v1/me/consents` | Yes | Customer; customer-accounts.read.own | Customer_Accounts |
| ACC-ROUTE-001 PATCH `/v1/me/addresses/{addressId}` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| ACC-ROUTE-002 DELETE `/v1/me/addresses/{addressId}` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| ACC-ROUTE-007 POST `/v1/me/deletion-requests` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts via Privacy owner command |
| ACC-ROUTE-006 GET `/v1/me/deletion-requests/{requestId}` | Yes | Customer; customer-accounts.read.own | Customer_Accounts via Privacy read projection |
| ACC-ROUTE-003 PATCH `/v1/me/patients/{patientId}` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| ACC-ROUTE-004 DELETE `/v1/me/patients/{patientId}` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| ACC-ROUTE-008 GET `/v1/me/wishlist/items` | Yes | Customer; customer-accounts.read.own | Customer_Accounts |
| ACC-ROUTE-009 POST `/v1/me/wishlist/items` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |
| ACC-ROUTE-010 DELETE `/v1/me/wishlist/items/{itemId}` | Yes | Customer; customer-accounts.manage.own | Customer_Accounts |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `ACC-01` | [TC-ACC-01-01](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ACC-02` | [TC-ACC-02-01](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ACC-03` | [TC-ACC-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ACC-04` | [TC-ACC-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ACC-05` | [TC-ACC-05-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ACC-06` | [TC-ACC-06-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `ACC-07` | [TC-ACC-07-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.
