# Pharmacist Review

**Stable module ID:** `Pharmacist_Review` · **Proposed accountable role:** Pharmacy clinical lead.

## Module blueprint navigation

| Planning concern | Canonical reference |
| --- | --- |
| Scope, requirements and business flow | [Business flow](Business-Flow.md) |
| Components, boundaries and design | [HLD](HLD.md) · [LLD](LLD.md) |
| Operation contracts and DTOs | [APIs](APIs.md) |
| Owned and consumed database objects | [Database](Database.md) |
| State, permissions, recovery and tests | [Operating contract](Operations.md) · [edge cases](Edge-Cases.md) |
| Dependencies and owner decisions | [Dependencies](Dependencies.md) |


[Business flow](../../00-Business-Guide/Prescription-and-Pharmacy.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-011 — Clinical review for prescription items

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone.

**Feature coverage**

- **PHM-01 / REQ-069:** Review queue, oldest first, with waiting time (Must (draft)).
- **PHM-02 / REQ-070:** Side-by-side view: zoomable prescription and order items (Must (draft)).
- **PHM-03 / REQ-071:** Approve all, approve some, or reject with a reason (Must (draft)).
- **PHM-04 / REQ-072:** Confirm a chosen alternative matches the prescription (Should (draft)).
- **PHM-05 / REQ-073:** Pharmacist name, registration number and time on every decision (Must (draft)).

### Developer navigation

- 🏗️ [Module HLD](HLD.md)
- ⚙️ [Module LLD](LLD.md)
- Internal architecture
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [Testing](../../07-Engineering/Testing.md)
- 🗓️ [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## MOD-011: Clinical review for prescription items — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Clinical review for prescription items. Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone.

**System responsibility:** The `Pharmacist_Review` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- Review queue, oldest first, with waiting time (`PHM-01`)
- Side-by-side view: zoomable prescription and order items (`PHM-02`)
- Approve all, approve some, or reject with a reason (`PHM-03`)
- Confirm a chosen alternative matches the prescription (`PHM-04`)
- Pharmacist name, registration number and time on every decision (`PHM-05`)

### Dependencies and trust boundaries

- Database candidates: `clinical.order_reviews`, `clinical.order_review_items`, `clinical.prescriptions`, `clinical.review_reason_codes`, `commerce.order_items`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- 🏗️ [HLD](HLD.md)
- ⚙️ [LLD](LLD.md)
- 🧪 [Edge cases](Edge-Cases.md)
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [QA scenarios](../../07-Engineering/Testing.md)
- 🗓️ [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
