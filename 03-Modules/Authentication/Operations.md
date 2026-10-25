# Authentication operations and acceptance

## Workflow and state ownership

Authentication mechanics and role grants; customer login endpoints retain their historical customer contract surface.

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md). The [LLD](LLD.md) holds module algorithms and transition cases; [APIs](APIs.md) holds command-specific allowed/denied transitions. [Shared recovery contracts](../../07-Engineering/State-and-Recovery-Contracts.md) define cross-owner compensation.

## Authentication and authorization

| Operation | Authentication | Roles / permission | Command owner |
| --- | --- | --- | --- |
| API-089 POST `/v1/auth/staff/login` | No; endpoint-specific pre-login/provider trust | Public pre-login Staff; Credential proof; no existing role claim | Authentication_Access |
| API-090 POST `/v1/auth/staff/mfa/verify` | No; endpoint-specific pre-login/provider trust | Public Staff with pending MFA proof; Valid MFA challenge + authenticator proof | Authentication_Access |
| API-091 POST `/v1/auth/sessions/refresh` | Yes | Customer / Staff / Rider holding a valid refresh session; Own refresh session | Authentication_Access |
| API-092 POST `/v1/auth/sessions/revoke` | Yes | Customer / Staff / Rider; identity.sessions.revoke.own | Authentication_Access |
| API-093 GET `/v1/auth/permissions` | Yes | Customer / Staff / Rider; identity.permissions.read.own | Authentication_Access |

Resource/patient/location checks and sensitive-field filtering are endpoint-specific in [APIs](APIs.md); roles never replace object authorization. For file/provider callbacks, use the documented capability/signature path. [Security](../../07-Engineering/Security.md) applies alongside the exact retained SQL ACL/RLS policies.

## Designed tests and acceptance

| Feature | Normal case | Denied / failure evidence | Execution status |
| --- | --- | --- | --- |
| `AUTH-01` | [TC-AUTH-01-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `AUTH-02` | [TC-AUTH-02-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `AUTH-03` | [TC-AUTH-03-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |
| `AUTH-04` | [TC-AUTH-04-OK](LLD.md) | [Feature edge cases](Edge-Cases.md) and endpoint CT scenarios | Designed / NOT RUN |

Each endpoint additionally defines validation, authentication, authorization, business-gate, duplicate-intent, stale-version/concurrency and recovery cases. No execution is claimed. [Testing strategy](../../07-Engineering/Testing.md) separates schema parity from application acceptance; [delivery tasks](../../08-Development-Plan/Implementation-Plan.md) preserve existing TASK IDs.


## Context and credential lifecycle

**Proposed / Unapproved / Not Implemented.** Apply the [live authorization consistency policy](Unified-Identity-Architecture.md#authorization-consistency-and-revocation) to every protected operation. Unavailable primary policy fails closed. Revoke matching context on role removal; revoke all sessions/proofs on suspension or password change; refresh never extends method freshness. First enrollment requires fresh phone OTP and password with staff eligibility; factor replacement requires existing MFA. Assisted factor-loss recovery is pending Security approval, never OTP-only reset.
