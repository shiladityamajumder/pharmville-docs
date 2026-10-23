# Rider App

[Business flow](../../00-Business-Guide/Delivery-and-Rider-App.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-013 — Rider shifts and delivery actions

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Rider sees only assigned delivery and masked necessary information; OTP outcome stays server-validated.

**Feature coverage**
- **RID-01 / REQ-079:** OTP login; on duty, off duty and break (Must (draft)).
- **RID-02 / REQ-080:** Task list; accept; open Google Maps to navigate; mark picked up (Must (draft)).
- **RID-03 / REQ-081:** Background location: every 5–10 s on delivery, 15–30 s idle (Must (draft)).
- **RID-04 / REQ-082:** Complete delivery with customer OTP and photo; record COD collected (Must (draft)).
- **RID-05 / REQ-083:** Door checks for prescription medicines (Should (draft)).
- **RID-06 / REQ-084:** Failed attempt with a reason from a fixed list (Must (draft)).
- **RID-07 / REQ-085:** Daily deliveries and incentive earned (Should (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Rider_App.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## MOD-013: Rider shifts and delivery actions — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Rider shifts and delivery actions. Rider sees only assigned delivery and masked necessary information; OTP outcome stays server-validated.

**System responsibility:** The `Rider_App` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- OTP login; on duty, off duty and break (`RID-01`)
- Task list; accept; open Google Maps to navigate; mark picked up (`RID-02`)
- Background location: every 5–10 s on delivery, 15–30 s idle (`RID-03`)
- Complete delivery with customer OTP and photo; record COD collected (`RID-04`)
- Door checks for prescription medicines (`RID-05`)
- Failed attempt with a reason from a fixed list (`RID-06`)
- Daily deliveries and incentive earned (`RID-07`)

## Dependencies and trust boundaries
- Database candidates: `logistics.rider_shifts`, `logistics.delivery_assignments`, `logistics.delivery_otp_challenges`, `logistics.delivery_location_updates`, `payment.cod_collections`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Rider sees only assigned delivery and masked necessary information; OTP outcome stays server-validated. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- [HLD](HLD.md)
- [LLD](LLD.md)
- [Edge cases](Edge-Cases.md)
- [API contracts](../../05-APIs/Rider_App.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [QA scenarios](../../07-Engineering/Testing.md)
- [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
