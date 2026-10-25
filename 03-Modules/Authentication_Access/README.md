# Authentication Access

**Stable module ID:** `Authentication_Access` · **Proposed accountable role:** Security / Identity.

## Module blueprint navigation

| Planning concern | Canonical reference |
| --- | --- |
| Unified Identity, scoped sessions and revocation | [Canonical architecture](Unified-Identity-Architecture.md) |
| Role/workspace defaults and permissions | [Access matrix](../../01-Project/User-Roles.md) |
| Legacy adapters and new API rollout | [Compatibility](API-Compatibility.md) |
| Identity persistence changes and decisions | [Assessment](../../04-Database/Identity-Authentication-Assessment.md) |
| Scope, requirements and business flow | [Business flow](Business-Flow.md) |
| Components, boundaries and design | [HLD](HLD.md) · [LLD](LLD.md) |
| Operation contracts and DTOs | [APIs](APIs.md) |
| Owned and consumed database objects | [Database](Database.md) |
| State, permissions, recovery and tests | [Operating contract](Operations.md) · [edge cases](Edge-Cases.md) |
| Dependencies and owner decisions | [Dependencies](Dependencies.md) |


[Business flow](../../00-Business-Guide/Accounts-and-Login.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-017 — Login, sessions, roles and access control

**Source classification:** 4 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Client-supplied actor, role and location are never trusted as authorisation context.

**Feature coverage**

- **AUTH-01 / REQ-102:** Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager (Must (draft)).
- **AUTH-02 / REQ-103:** Lockout rules, session limits, one session per staff account (Must (draft)).
- **AUTH-03 / REQ-104:** OTP rate limits per number and IP (Must (draft)).
- **AUTH-04 / REQ-105:** Permissions checked on the server for every request (Must (draft)).

### Developer navigation

- 🏗️ [Module HLD](HLD.md)
- ⚙️ [Module LLD](LLD.md)
- Internal architecture
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [Testing](../../07-Engineering/Testing.md)
- 🗓️ [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## MOD-017: Login, sessions, roles and access control — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Login, sessions, roles and access control. Client-supplied actor, role and location are never trusted as authorisation context.

**System responsibility:** The `Authentication_Access` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager (`AUTH-01`)
- Lockout rules, session limits, one session per staff account (`AUTH-02`)
- OTP rate limits per number and IP (`AUTH-03`)
- Permissions checked on the server for every request (`AUTH-04`)

### Dependencies and trust boundaries

- Database candidates: `identity.users`, `identity.sessions`, `identity.roles`, `identity.user_roles`, `identity.permissions`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

Client-supplied actor, role and location are never trusted as authorisation context. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- 🏗️ [HLD](HLD.md)
- ⚙️ [LLD](LLD.md)
- 🧪 [Edge cases](Edge-Cases.md)
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [QA scenarios](../../07-Engineering/Testing.md)
- 🗓️ [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)


## Unified authentication source of truth

**Proposed / Unapproved / Not Implemented.** All people share Identity; application panels consume verified workspace projections. Start with [unified architecture](Unified-Identity-Architecture.md), [role/workspace policy](../../01-Project/User-Roles.md), [API compatibility](API-Compatibility.md) and [database assessment](../../04-Database/Identity-Authentication-Assessment.md). Historical Customer/Admin contract surfaces are adapters; Authentication owns credential and grant commands.
