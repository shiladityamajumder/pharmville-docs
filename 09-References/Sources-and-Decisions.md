# Sources and decisions

## How to read status

- **Confirmed** means visible in a checked-in repository file or directly counted from it.
- **Proposed** means an implementation design that still needs review or approval.
- **Inferred** means an interpretation that lacks an approved source.
- **Open** means an owner decision or verification is still needed.

The current database source is the standalone effective SQL, with derived PostgreSQL catalog/table documentation. The actual legacy `heathcare_db` nested checkout was privately archived after validated reconstruction. Earlier names and deployment-tool claims are historical evidence, retained separately.

No signed client PRD is checked into this documentation repository. Sibling application directories are available but their behavior was not audited in this documentation pass. The 110 feature IDs, 18 module groupings, API contracts, workflows, and most technology choices came from inherited draft documentation. Treat them as proposals until the product owner supplies approved sources.

## Confirmed repository facts

- The current schema authority is [pharmville_schema.sql](../pharmville-database/pharmville_schema.sql), reconstructed from the effective V0001–V0030 result. Archived migrations establish lineage, not current installation dependencies.
- Historical SQLAlchemy/models/runner tooling is privately archived. The final database directory contains SQL only; documentation and validators consume the derived PostgreSQL catalog.
- Executed isolated PostgreSQL 18.6 schema parity is dated 2026-10-24. Production/provider/application validation remains separate and unexecuted.
- The inspected legacy `heathcare_db` checkout has nested Git history, now preserved in a private sibling archive. Current standalone SQL and derived catalog hashes, migration lineage and zero-difference isolated PostgreSQL parity are recorded in [database evidence](Database-Evidence.json).

## Proposed product and engineering decisions

- NestJS modular monolith and Next.js web clients are reported in inherited architecture notes. No application code was available to verify implementation.
- REST v1 endpoints, provider adapters, Redis/BullMQ, AWS storage, and deployment designs are proposals or reported preferences. They are not evidence of running services.
- Database schema membership does not grant a module permission to write a table. Each service needs explicit ownership and runtime-role review.
- Product scope, licensed dispensing rules, payment behavior, stock freshness, rider policy, retention, and release readiness require owner or specialist approval.

## Open decisions

| ID | Decision needed | Owner |
| --- | --- | --- |
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
| D-015 | Standalone SQL/catalog parity resolved in isolated PostgreSQL; verify runtime grants, application data-access parity and separately approved deployment process | Tech lead and DBA |
| D-016 | Provision production accounts, provider sandbox, and signed webhook contract | Product owner and Security |
| D-017 | Demonstrate CI, restore, load, TLS, rollback, and operations ownership | DevOps and DBA |
| D-018 | Approve Phase 1 changes or defer them | Product owner |
| D-019 | Supply approved catalog sources and reconciliation evidence | Product owner, Catalog, and Operations |
| D-020 | Set support ownership, SLA, and ticket integration | Support lead |
| D-021 | Confirm rider Android release and app-store ownership | Product owner and Engineering |
| D-022 | Approve security controls and GitHub protections | Security and DevOps |
| D-023 | Approve replacement-contact proof and storage without weakening verified identity | Security and Product owner |
| D-024 | Approve each proposed API operation contract: request/response field names and nullability, status transitions, table read/write set and owner, authorization scope, idempotency/version checks, error/recovery behavior, and named contract tests | Tech lead, module owners and QA lead |
| D-025 | Standalone effective-schema consolidation authorized by this rework; executed private PostgreSQL parity evidence recorded. Runtime provisioning, approved bootstrap data and production release remain open. | DBA and DevOps |
| D-026 | Module directory normalization retains stable IDs/contracts; validate domain-owner acceptance separately from navigation changes. | Tech lead and module owners |
| D-027 | Assign accountable future-domain owners and phase for appointment, diagnostics, insurance, membership, marketplace, support, risk and broader clinical-care tables; retain all physical objects without inferring launch scope. | Product owner and relevant Clinical/Finance/Operations leads |
| D-028 | Approve unified Identity, scoped workspaces, additive proof/session persistence, API-098–112 and the scoped-offboarding versus identity-wide status boundary; Open / Unapproved / Not Implemented. | Security architect, Product owner, Backend/PostgreSQL leads and QA |

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
| D-024 | Review the per-operation rows in [API-Contract-Coverage](../05-APIs/API-Contract-Coverage.md) in vertical slices. For each one, approve (1) public DTO fields/types/nullability and API-only versus database-backed fields, (2) caller permission and object ownership, (3) exact owned-table write set and transaction boundary, (4) allowed current→next states, (5) required idempotency/version token and replay/conflict semantics, and (6) endpoint-specific error/recovery and normal/adverse contract tests. Start with checkout/reservation, prescription upload/review, payment/refund, and delivery; D-016 provider evidence and the distinct D-003/D-023 security decisions remain prerequisites where linked. Recommended option: approve these as small module-owned contract slices, update Markdown/OpenAPI/mapping/ledger together, and only then mark a slice approved. This keeps unapproved persistence and clinical/money behavior from being mistaken for an implementation mandate; delaying approval blocks implementation of the affected operations. | Shared envelopes, candidate table discovery and feature IDs do not establish field projections, write grants, business state transitions, or runtime behavior. | Any operation whose ledger row still shows an incomplete contract or unresolved decision; no Pharmville API becomes verified merely through documentation. | Tech lead, module owner and QA lead |

D-023 and D-024 retain security and per-contract approval gaps from the engineering audit. D-015 source reconstruction is resolved by the standalone SQL and executed isolated catalog parity; runtime memberships, domain behavior and production release remain unapproved. Earlier source-selection narratives are archived.

## Conflicting order paths requiring explicit resolution

RX-02 retains a draft 24-hour post-order upload/auto-cancel requirement. Detailed journey S07–S14 instead supplies prescription evidence and completes P-line review before payment. Product, Pharmacy and Finance must approve whether a deferred route exists, its request/payment timing, deadline, stock treatment and compensation.

Until then the Business Guide explains the detailed path and labels the deferred route blocked; it does not invent a universal sequence or approved deadline.

## Detailed API and master-data planning refinement

The [planning decision register](../05-APIs/Planning-Decisions.md) refines existing D-001–D-024 with operation-specific blockers and compatible database proposals. [API coverage](../05-APIs/API-Contract-Coverage.md) records the historical 97/107 baseline; current unified-Identity coverage is 114/122 complete proposed and 0/122 approved. [Master inventory](../04-Database/Master-Data-Inventory.md) records classifications and initial records without changing source SQL, product requirements or approval status.

## Architecture rework evidence and remaining gates

D-015 source selection and fresh empty-schema reconstruction are resolved by inspected source and [zero-difference catalog evidence](Database-Parity-Result.json). Earlier missing-source/no-nested-Git statements describe the historical pre-rework checkout and are superseded by [current provenance](../04-Database/Migrations.md). D-025 is user-authorized consolidation, not approval of runtime memberships, master datasets, clinical/financial policies or production deployment. D-026 preserves all 18 IDs and every existing API contract. D-027 is Open: domain leads must accept future ownership before implementation.


## D-028 — Unified Identity and scoped workspaces

**Open / Proposed / Pending Approval / Not Implemented. Owners: Security architect, Product owner, PostgreSQL/Backend leads and QA.** Review [unified architecture](../03-Modules/Authentication_Access/Unified-Identity-Architecture.md), [persistence assessment](../04-Database/Identity-Authentication-Assessment.md), API-098–112, permission-derived navigation, live revocation ordering and compatibility impact. The two transactional security tables, method/context session fields and replay/ownership guards are explicit additive schema proposals; structural SQL execution is not business approval.

D-003 remains unresolved for MFA defaults, bootstrap/assisted recovery, credential/session/rate/freshness budgets and transport. D-023 remains unresolved for replacement contacts. D-024 remains unresolved for each contract, owner and runtime SQL grant. Support role/navigation permission defaults are proposals, not approved grants or seed records. Existing 107 API identities remain; see [current coverage](../05-APIs/API-Contract-Coverage.md).
