# Delivery Operations HLD

<!-- ERD-NAV-START -->

## Database relationships

[`logistics` ERD](../../04-Database/ER-Diagrams/12-logistics.md) · [`organization` ERD](../../04-Database/ER-Diagrams/16-organization.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Delivery-and-Rider-App.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-012: Delivery planning, route and proof — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Delivery planning, route and proof. Order handoff to courier requires authorised assignment; failed attempts retain reason and evidence.

**System responsibility:** The `Delivery_Operations` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Live map of riders (available, on delivery, offline) and orders ready for pickup (`DLV-01`)
- Suggest the nearest available rider; staff confirm or choose another (`DLV-02`)
- Failed-delivery queue: reattempt, reschedule or return to store (`DLV-03`)
- COD handover: cash collected vs deposited per rider per day (`DLV-04`)
- Rider management: onboard, assign location, shifts (`DLV-05`)

## Dependencies and trust boundaries
- Database candidates: `logistics.shipments`, `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_slots`, `logistics.ndr_cases`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Order handoff to courier requires authorised assignment; failed attempts retain reason and evidence. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-012 — Delivery planning, route and proof

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Order handoff to courier requires authorised assignment; failed attempts retain reason and evidence.

**Feature coverage**
- **DLV-01 / REQ-074:** Live map of riders (available, on delivery, offline) and orders ready for pickup (Must (draft)).
- **DLV-02 / REQ-075:** Suggest the nearest available rider; staff confirm or choose another (Must (draft)).
- **DLV-03 / REQ-076:** Failed-delivery queue: reattempt, reschedule or return to store (Must (draft)).
- **DLV-04 / REQ-077:** COD handover: cash collected vs deposited per rider per day (Must (draft)).
- **DLV-05 / REQ-078:** Rider management: onboard, assign location, shifts (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Delivery_Operations.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
