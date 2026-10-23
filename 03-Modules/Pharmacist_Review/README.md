# Pharmacist Review

## Purpose and feature scope

## MOD-011 — Clinical review for prescription items

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone.

**Feature coverage**
- **PHM-01 / REQ-069:** Review queue, oldest first, with waiting time (Must (draft)).
- **PHM-02 / REQ-070:** Side-by-side view: zoomable prescription and order items (Must (draft)).
- **PHM-03 / REQ-071:** Approve all, approve some, or reject with a reason (Must (draft)).
- **PHM-04 / REQ-072:** Confirm a chosen alternative matches the prescription (Should (draft)).
- **PHM-05 / REQ-073:** Pharmacist name, registration number and time on every decision (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Pharmacist_Review.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## Module design

## MOD-011: Clinical review for prescription items — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Clinical review for prescription items. Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone.

**System responsibility:** The `Pharmacist_Review` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Review queue, oldest first, with waiting time (`PHM-01`)
- Side-by-side view: zoomable prescription and order items (`PHM-02`)
- Approve all, approve some, or reject with a reason (`PHM-03`)
- Confirm a chosen alternative matches the prescription (`PHM-04`)
- Pharmacist name, registration number and time on every decision (`PHM-05`)

## Dependencies and trust boundaries
- Database candidates: `clinical.order_reviews`, `clinical.order_review_items`, `clinical.prescriptions`, `clinical.review_reason_codes`, `commerce.order_items`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Only P-classified products trigger mandatory pharmacist review; M and O do not on classification alone. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- [HLD](HLD.md)
- [LLD](LLD.md)
- [Edge cases](Edge-Cases.md)
- [API contracts](../../05-APIs/Pharmacist_Review.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [QA scenarios](../../07-Engineering/Testing.md)
- [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
