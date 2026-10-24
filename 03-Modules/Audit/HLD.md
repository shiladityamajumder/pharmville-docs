# Audit HLD

<!-- ERD-NAV-START -->

## Database relationships

[`compliance` ERD](../../04-Database/ER-Diagrams/05-compliance.md) · [`platform` ERD](../../04-Database/ER-Diagrams/18-platform.md) · [`risk` ERD](../../04-Database/ER-Diagrams/21-risk.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Reporting-and-Audit.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-016: Immutable change evidence — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Immutable change evidence. All privileged and denied actions generate minimum necessary audit evidence without raw secrets.

**System responsibility:** The `Audit` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- Log logins, changes, stock movements and prescription views (`AUD-01`)
- Search and export the audit log; read-only for everyone (`AUD-02`)

### Dependencies and trust boundaries

- Database candidates: `platform.audit_logs`, `platform.file_access_events`, `compliance.evidence`, `platform.report_runs`, `identity.login_attempts`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

All privileged and denied actions generate minimum necessary audit evidence without raw secrets. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-016 — Immutable change evidence

**Source classification:** 2 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** All privileged and denied actions generate minimum necessary audit evidence without raw secrets.

**Feature coverage**

- **AUD-01 / REQ-100:** Log logins, changes, stock movements and prescription views (Must (draft)).
- **AUD-02 / REQ-101:** Search and export the audit log; read-only for everyone (Must (draft)).

### Developer navigation

- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Audit.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
