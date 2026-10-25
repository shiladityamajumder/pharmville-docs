# Customer Accounts business flow

**Status: Proposed workflow; not implemented.** Accountable role: Customer platform. Profiles, addresses, family associations and consent; delegates credentials and sessions to Authentication.

## Normal flow

1. Complete destination-bound OTP through Authentication; return only the authenticated customer profile.
2. Create or select an owned address and patient association; do not infer legal consent from family membership.
3. Record an explicit versioned consent choice and preferences; keep withdrawn consent effective for subsequent access.
4. Expose saved products and own-account resources; account changes needing renewed proof remain blocked by D-023.

## Requirements and acceptance

| Feature | Inherited requirement | Designed acceptance |
| --- | --- | --- |
| `ACC-01` | Must (draft) | [TC-ACC-01-01 / adverse cases](LLD.md) |
| `ACC-02` | Must (draft) | [TC-ACC-02-01 / adverse cases](LLD.md) |
| `ACC-03` | Must (draft) | [TC-ACC-03-OK / adverse cases](LLD.md) |
| `ACC-04` | Must (draft) | [TC-ACC-04-OK / adverse cases](LLD.md) |
| `ACC-05` | Must (draft) | [TC-ACC-05-OK / adverse cases](LLD.md) |
| `ACC-06` | Should (draft) | [TC-ACC-06-OK / adverse cases](LLD.md) |
| `ACC-07` | Should (draft) | [TC-ACC-07-OK / adverse cases](LLD.md) |

## Orchestration and exceptions

[WF-001](../../06-Workflows/WF-001-Identity-and-Session.md), [WF-003](../../06-Workflows/WF-003-Cart-Quote-and-Reservation.md). Exact transitions, recovery and permission checks remain in [LLD](LLD.md), [endpoint contracts](APIs.md), [edge cases](Edge-Cases.md) and the [state/ownership contract](../../07-Engineering/State-and-Recovery-Contracts.md).

[Shared business journey](../../00-Business-Guide/Accounts-and-Login.md) supplies cross-module actor context without creating another requirement inventory. Approval dependencies: D-003; D-010; D-023; D-024.


## Unified identity and workspace access

**Proposed / Unapproved / Not Implemented — D-003/D-024/D-028.** [Unified Identity policy](../Authentication_Access/Unified-Identity-Architecture.md) is the canonical authentication, scoped authorization, context-switch, step-up and revocation design. [Role/workspace matrix](../../01-Project/User-Roles.md) defines proposed defaults without granting permissions. Customer and Rider phone OTP and AUTH-01 password/authenticator requirements remain. Account, role and panel are separate: menus and client role strings never authorize an API. No grant means account access only; suspension/expiry deny protected operations. Existing service identities/provider signatures remain separate trust types.
