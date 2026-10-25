# Authentication API compatibility and rollout

**Proposed / Unapproved / Not Implemented — D-003, D-024, D-028.** All 107 inherited operations, IDs, methods and paths remain. Fifteen additions are explicit proposals; no endpoint is declared runtime-deprecated or removed.

| Existing ID | Retained route | Unified interpretation / client impact |
| --- | --- | --- |
| API-001 | `POST /v1/auth/customer/otp/request` | OTP adapter creates the same durable Identity challenge; existing challenge UUID stays supported. |
| API-002 | `POST /v1/auth/customer/otp/verify` | OTP adapter returns existing SessionData. Customer context only with a real grant; otherwise account access and explicit workspace selection. |
| API-033 | `POST /v1/admin/staff` | Admin invitation delegates shared identity and scoped assignment commands; never creates a separate staff account. |
| API-034 | `PATCH /v1/admin/staff/{staff_id}` | Legacy membership-scoped update preserves unrelated assignments. Ambiguous replacement requires explicit assignment APIs. |
| API-089 | `POST /v1/auth/staff/login` | Password adapter returns existing challenge DTO; challenge is durable and single-use, not a signed-only MFA ticket. |
| API-090 | `POST /v1/auth/staff/mfa/verify` | MFA adapter returns existing SessionData after consuming the challenge and TOTP counter. |
| API-091 | `POST /v1/auth/sessions/refresh` | Existing refresh DTO; retained hashed history detects spent-token replay and revokes its family. |
| API-092 | `POST /v1/auth/sessions/revoke` | Existing session revocation DTO; revoke owned session, pending session proofs and refresh lineage. |
| API-093 | `GET /v1/auth/permissions` | Own effective current-context permissions available to every authenticated subject; no union of roles or cross-scope permission read. |

## Proposed unified routes

| ID | Route | Purpose |
| --- | --- | --- |
| API-098 | `POST /v1/auth/login/initiate` | Begin the common identifier-first login challenge |
| API-099 | `POST /v1/auth/login/verify` | Verify the required login proof and complete its MFA chain |
| API-100 | `GET /v1/auth/identity` | Read the current shared subject, session assurance and context |
| API-101 | `GET /v1/auth/workspaces` | Discover only live permission-authorized workspace choices |
| API-102 | `POST /v1/auth/context` | Activate an already authorized workspace and scope |
| API-103 | `POST /v1/auth/step-up` | Prove missing methods for a granted workspace without switching it |
| API-104 | `POST /v1/auth/mfa/enrollment` | Enroll and confirm an owned authenticator under the reviewed bootstrap policy |
| API-105 | `POST /v1/auth/credentials/password` | Change an existing password and invalidate all sessions |
| API-106 | `POST /v1/auth/recovery/request` | Begin neutral password recovery or assisted authenticator recovery |
| API-107 | `POST /v1/auth/recovery/complete` | Reset a password only after existing OTP and authenticator proof |
| API-108 | `PUT /v1/admin/roles/{role_id}/permissions` | Replace an existing role permission set through central Identity |
| API-109 | `POST /v1/admin/users/{user_id}/role-assignments` | Assign an existing role to the shared subject in an exact scope |
| API-110 | `PATCH /v1/admin/role-assignments/{assignment_id}` | Change assignment activity or validity with immediate live-policy effect |


API-098/099 form the common identifier/proof entry; API-100/101/093 expose identity, choices and effective permissions; API-102/103 activate and strengthen an already granted context. API-104/105/106/107 cover existing credential/MFA/recovery needs; API-108/109/110 close existing ADM-03 grant administration. They reuse Identity commands rather than duplicate databases or credential stacks. [Contracts](APIs.md) and [Admin contracts](../Admin_CMS/APIs.md) specify every operation. [Workspace matrix](../../01-Project/User-Roles.md) contains proposed defaults, never automatic grants.

## Migration and compatibility impact

1. Approve D-028 schema and ownership, D-003 strength/transport/budgets/recovery, and D-024 operation contracts before implementation. Runtime role memberships remain a deployment prerequisite.
2. Implement a single Identity command boundary and both old adapters and new routes together. Existing applications may retain legacy request/response fields; adopting multi-role selection requires identity/workspace/context endpoints and generation-aware token handling.
3. Existing sessions have null method/context fields after a future data migration. Never backfill proof timestamps from login time or JWT role claims. Require fresh proof before privileged context entry; populated-data migration/backfill is a separate reviewed implementation task, not supplied here.
4. Clients serialize refresh and context changes, refresh identity after a lost context-switch response and reauthenticate after lost refresh/credential responses. Stale context tokens fail closed. No legacy adapter may bypass strength, grant or scope checks.
5. No sunset date, live traffic, implemented replacement or approved permission grant is asserted. Workload/service identities and signed provider callbacks retain their separate non-person trust mechanisms.


## Administration read dependencies

API-111 GET /v1/admin/roles/{role_id}/permissions obtains the current shared role policy and strong role ETag for API-108. API-112 GET /v1/admin/users/{user_id}/role-assignments returns only delegation-visible assignments and their row versions for API-110. Both use IAM read permissions, current scope and fresh privileged proof; neither grants listed capabilities. These two ADM-03/AUTH-04 proposals complete the precondition/read dependency rather than adding general CRUD.


API-034 retains its identity-status DTO field, but its shared-person impact now has an explicit proposed conditional global identity.accounts.manage permission with recent password/authenticator. A scoped store/organization manager uses assignment deactivation instead; removing a staff assignment does not suspend Customer or other organization access. D-003/D-024 approve this security clarification.
