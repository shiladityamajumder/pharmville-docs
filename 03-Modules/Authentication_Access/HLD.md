# Authentication Access HLD

<!-- ERD-NAV-START -->

## Database relationships

[`identity` ERD](../../04-Database/ER-Diagrams/10-identity.md) · [`organization` ERD](../../04-Database/ER-Diagrams/16-organization.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Accounts-and-Login.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

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

## MOD-017 — Login, sessions, roles and access control

**Source classification:** 4 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Client-supplied actor, role and location are never trusted as authorisation context.

**Feature coverage**

- **AUTH-01 / REQ-102:** Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager (Must (draft)).
- **AUTH-02 / REQ-103:** Lockout rules, session limits, one session per staff account (Must (draft)).
- **AUTH-03 / REQ-104:** OTP rate limits per number and IP (Must (draft)).
- **AUTH-04 / REQ-105:** Permissions checked on the server for every request (Must (draft)).

### Developer navigation

- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](APIs.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.


## Identity components and boundaries

**Proposed / Unapproved / Not Implemented.** The common Login Facade invokes Challenge/Proof, Session/Refresh, Policy/Scoped-Grant and Workspace Projection components in the existing modular monolith. Customer Accounts supplies onboarding/profile/consent; Admin supplies assignment administration UI; every module applies the same live authorization gate before resource access. No separate identity store, role-specific auth service or client-chosen role is introduced. [Component, scope and revocation design](Unified-Identity-Architecture.md).
