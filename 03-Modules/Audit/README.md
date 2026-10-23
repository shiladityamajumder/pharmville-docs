# Audit

## Purpose and feature scope

## MOD-016 — Immutable change evidence

**Source classification:** 2 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** All privileged and denied actions generate minimum necessary audit evidence without raw secrets.

**Feature coverage**
- **AUD-01 / REQ-100:** Log logins, changes, stock movements and prescription views (Must (draft)).
- **AUD-02 / REQ-101:** Search and export the audit log; read-only for everyone (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Audit.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## Module design

## MOD-016: Immutable change evidence — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Immutable change evidence. All privileged and denied actions generate minimum necessary audit evidence without raw secrets.

**System responsibility:** The `Audit` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Log logins, changes, stock movements and prescription views (`AUD-01`)
- Search and export the audit log; read-only for everyone (`AUD-02`)

## Dependencies and trust boundaries
- Database candidates: `platform.audit_logs`, `platform.file_access_events`, `compliance.evidence`, `platform.report_runs`, `identity.login_attempts`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
All privileged and denied actions generate minimum necessary audit evidence without raw secrets. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- [HLD](HLD.md)
- [LLD](LLD.md)
- [Edge cases](Edge-Cases.md)
- [API contracts](../../05-APIs/Audit.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [QA scenarios](../../07-Engineering/Testing.md)
- [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
