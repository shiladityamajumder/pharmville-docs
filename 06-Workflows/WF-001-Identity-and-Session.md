# WF-001 — Identity and Session

Status: proposed orchestration for ACC-01 and AUTH-01–AUTH-04. Customer_Accounts owns the customer entry flow; Authentication_Access owns proof verification, session creation, rotation and revocation. Notifications delivers messages after commit. No application implementation is asserted.

## Preconditions

Initial login has no existing-session requirement. It requires a valid normalized destination or approved staff identifier and the proof required by the current role policy. MFA completion uses a purpose-bound pre-session challenge; refresh uses a refresh credential.

Only protected post-login operations require an existing application session. See [authentication contracts](../03-Modules/Authentication/APIs.md) and [customer contracts](../03-Modules/Customer-Accounts/APIs.md).

## Normal path and transaction boundary

1. Validate phone/identifier and enforce D-003 abuse policy before delivery or credential verification. Do not expose whether an account exists.
2. Create a durable purpose-bound challenge and its expiry/attempt state. Phone OTP queues WhatsApp delivery with the approved SMS fallback; email/password proof does not invent an OTP delivery channel. Never log a proof.
3. Verify the supplied proof; atomically consume the challenge and create the eligible session after rechecking account status and role policy. Staff requiring MFA receive no privileged session before completing it.
4. Resolve/create a customer identity without inventing required profile data. Collect first_name before creating `customer.profiles`. Required consent and incomplete-onboarding permissions follow D-003/D-013.
5. Commit account/session and audit facts before returning credentials. Profile changes later use the profile and identity versions separately.

## Failure, rollback and recovery

Incorrect/expired/blocked/consumed proof returns a generic denial and no new session. Concurrent verification may consume a challenge once. If the transaction fails, challenge consumption and session creation roll back together; issue no credential. A lost successful response does not permit unrestricted proof replay: the client reauthenticates through the documented challenge flow.

Provider failure leaves delivery pending/failed and follows the approved fallback rule; it never bypasses verification. Refresh replay and role removal cause the security response in AUTH-02/D-003. Revocation denies new authoritative checks after its commit; no positive authorization cache or unexpired-JWT role fallback is allowed. Audit failures must not result in an unaudited privileged session.

## Data and sequence

Tables: `identity.users`, `identity.otp_challenges`, `identity.sessions`, `identity.mfa_factors`, `identity.login_attempts`; `customer.profiles` is created only after mandatory data exists. Identity/session writes are owned by Authentication_Access; customer profile writes by Customer_Accounts through the defined transaction boundary.

```mermaid
sequenceDiagram
  participant C as Client
  participant A as Authentication
  participant D as PostgreSQL
  participant N as Notification worker
  C->>A: Request challenge (no session)
  A->>D: Commit challenge and delivery job
  N->>D: Read committed job
  N-->>C: Deliver code under channel policy
  C->>A: Submit challenge and proof
  A->>D: Check status, consume proof, create session atomically
  alt Valid proof and committed session
    D-->>A: Committed
    A-->>C: Session credentials
  else Invalid proof or transaction failure
    A-->>C: Safe denial, no credentials
  end
```

## Required tests

Link TC-ACC-01-01 through TC-ACC-01-05 in [Customer LLD](../03-Modules/Customer-Accounts/LLD.md). Also test login without an existing bearer token, MFA bypass, refresh replay, role removal during verification, rollback before credential return, missing profile name, required consent, provider fallback and redacted logs. Proposed tests are not execution evidence.


## Unified multi-workspace continuation

After committed proof/session creation, API-099 returns identity and permission-derived choices. API-101 pages current choices; API-102 activates one signed assignment/scope selector with session context ETag. A stronger target requires API-103 proof first; API-104 enrollment cannot bootstrap without fresh phone OTP/password and staff eligibility. API-093 returns permissions only for the active context. Role removal clears that context; another valid assignment remains selectable. API-091 rotation detects spent-token replay; API-092 revokes owned lineage.

The [authorization commit-order policy](../03-Modules/Authentication/Unified-Identity-Architecture.md#authorization-consistency-and-revocation) supersedes any ambiguous cache-expiry wording above: no positive authorization cache; new checks after revocation commit deny. Failure attempt counters commit on denied proofs; successful proof/session/factor-counter/refresh-lineage changes commit together. Added security tables are [authentication_challenges](../04-Database/Tables/identity/authentication_challenges.md) and [session_refresh_tokens](../04-Database/Tables/identity/session_refresh_tokens.md).

Designed tests additionally cover revoked assignment after chooser, stale generation in another tab, cross-organization selector substitution, one staff session across panels, factor replay during concurrent step-up, enrollment without existing staff eligibility, no-workspace fallback, and refresh response loss. Tests remain NOT RUN.
