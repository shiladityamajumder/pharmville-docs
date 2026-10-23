# Sources and decisions

## How to read status

- **Confirmed** means visible in a checked-in repository file or directly counted from it.
- **Proposed** means an implementation design that still needs review or approval.
- **Inferred** means an interpretation that lacks an approved source.
- **Open** means an owner decision or verification is still needed.

The `healthcare_db` checkout is the available database source. Its README names PostgreSQL SQL migrations as the deployment authority and freezes historical Alembic execution. Local migration evidence and deployment limits are recorded in [Database migrations](../04-Database/Migrations.md).

No application source repository or signed client PRD was present. The 110 feature IDs, 18 module groupings, API contracts, workflows, and most technology choices came from inherited draft documentation. Treat them as proposals until the product owner supplies approved sources.

## Confirmed repository facts

- SQL under `healthcare_db/healthcare_db/postgresql/migrations/` is described as the deployment history.
- The database repository contains SQLAlchemy models and PostgreSQL catalog validation tools. The database README describes the ORM as a consistency companion.
- Local database validation evidence is dated 2026-10-22. Its exact counts and limits are in [Database migrations](../04-Database/Migrations.md).
- The workspace has Git metadata. The current documentation and database directories are untracked in that outer repository; upstream revision and deployment state are not established by its history.

## Proposed product and engineering decisions

- NestJS modular monolith and Next.js web clients are reported in inherited architecture notes. No application code was available to verify implementation.
- REST v1 endpoints, provider adapters, Redis/BullMQ, AWS storage, and deployment designs are proposals or reported preferences. They are not evidence of running services.
- Database schema membership does not grant a module permission to write a table. Each service needs explicit ownership and runtime-role review.
- Product scope, licensed dispensing rules, payment behavior, stock freshness, rider policy, retention, and release readiness require owner or specialist approval.

## Open decisions

| ID | Decision needed | Owner |
|---|---|---|
| D-001 | Approve Phase 1 module boundaries | Product owner |
| D-002 | Set receiving, replenishment, and warehouse fallback scope | Product owner and Operations |
| D-003 | Approve login, role, and lockout rules | Security and Product owner |
| D-004 | Approve payment capture, cancellation, and refund flow | Product owner, Finance, and Pharmacist |
| D-005 | Name the authoritative stock feed and freshness limit | Operations and POS vendor |
| D-006 | Approve license, dispensing, schedule, and pharmacist review rules | Pharmacist and Legal |
| D-007 | Set COD eligibility, limits, and reconciliation ownership | Product owner and Finance |
| D-008 | Approve accounting and finance policies | Finance and Legal |
| D-009 | Set eligible lot, site, expiry, and retry rules | Operations and Pharmacist |
| D-010 | Decide partial shipment, warehouse fallback, and substitution rules | Product owner, Operations, and Pharmacist |
| D-011 | Approve rider privacy and proof-of-delivery rules | Operations and Privacy |
| D-012 | Approve invoice, HSN, tax rate, and jurisdiction rules | Finance and CA |
| D-013 | Approve consent versions, retention, and deletion exceptions | Privacy and Legal |
| D-014 | Select vendors and billing for each use case | Tech lead and Product owner |
| D-015 | Define migration and ORM parity checks | Tech lead |
| D-016 | Provision production accounts, provider sandbox, and signed webhook contract | Product owner and Security |
| D-017 | Demonstrate CI, restore, load, TLS, rollback, and operations ownership | DevOps and DBA |
| D-018 | Approve Phase 1 changes or defer them | Product owner |
| D-019 | Supply approved catalog sources and reconciliation evidence | Product owner, Catalog, and Operations |
| D-020 | Set support ownership, SLA, and ticket integration | Support lead |
| D-021 | Confirm rider Android release and app-store ownership | Product owner and Engineering |
| D-022 | Approve security controls and GitHub protections | Security and DevOps |

Decisions D-004 through D-013, D-016, and D-017 need evidence before production. D-001, D-002, D-003, D-005, D-015, D-019, and D-021 affect kickoff scope or architecture.

## Decisions that block implementation

These recommendations are proposals, not substituted business approvals. Developers may build isolated infrastructure and approved read-only slices; the listed actions wait for their owners.

| Decision | Recommended option | Reason | Blocked action | Owner |
| --- | --- | --- | --- | --- |
| D-001 / D-014 | Approve one modular monolith and explicit module command interfaces before splitting services. | Keep transaction and ownership boundaries clear. | Committing application/repository architecture. | Product owner and Tech lead |
| D-003 | Approve credential paths, effective OTP limits, MFA, session/refresh/revocation and onboarding permissions as configuration. | Schema defaults do not approve security policy. | Production identity and privileged access flows. | Security and Product owner |
| D-004 / D-007 / D-008 / D-012 | Finance approves capture, late success, refund, COD and invoice rules with signed examples. | Money outcomes cannot be inferred from generic status strings. | Real charging, automated refunds and accounting. | Finance and Product owner |
| D-005 / D-009 / D-010 | Name the stock authority and approve freshness, expiry/site, reservation and fallback policy. | An available quantity is insufficient without current evidence and location eligibility. | Reserving and fulfilling real stock. | Operations and Pharmacist |
| D-006 / D-013 | Approve prescription review/eligibility, consent, retention and privacy policy. | Clinical access and dispensing cannot be invented from table presence. | Clinical decisions, regulated fulfillment and deletion. | Pharmacist, Privacy and Legal |
| D-016 | Supply exact provider API/signature versions and permitted test accounts. | Raw callback contracts and retry behavior require provider evidence. | Live payment/notification adapters. | Security and provider owner |
| D-023 | Use purpose-bound verification before atomically replacing a contact; approve proof transport/storage and separate user/profile versions. | Existing schema lacks dedicated pending-contact columns. Preserve verified destinations during proof. | Email/phone change implementation and recovery. | Security and Product owner |
| D-024 | Approve operation-specific schemas, table write owner, failure transitions and named test cases per vertical slice; treat generic rows as review prompts. | ID mentions and shared schemas cannot establish implementable feature contracts. | Features with incomplete API/schema or failure contracts in the traceability register. | Tech lead, module owner and QA lead |

D-023 and D-024 record gaps found in the independent engineering audit. D-015 additionally requires the deployment owner to reconcile the intended upstream revision and target migration ledger; no unsupported migration-removal claim is deployment authority.
