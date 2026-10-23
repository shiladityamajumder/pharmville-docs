# Admin CMS

## Purpose and feature scope

## MOD-006 — Admin masters and editorial pages

**Source classification:** 9 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Master data publication is an approved versioned action; staff scope is checked server-side.

**Feature coverage**
- **ADM-01 / REQ-036:** Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress (Must (draft)).
- **ADM-02 / REQ-037:** Staff users: invite, assign role and location, deactivate, log out sessions (Must (draft)).
- **ADM-03 / REQ-038:** Roles and permissions for 16 roles, limited to own store or warehouse (Must (draft)).
- **ADM-04 / REQ-039:** CMS: home banners, FAQs, policy pages, with draft and publish (Must (draft)).
- **ADM-05 / REQ-040:** System settings (PRD section 8) (Must (draft)).
- **ADM-06 / REQ-041:** Catalogue admin: products, categories, brands, salt master, prices, GST and HSN (Must (draft)).
- **ADM-07 / REQ-042:** Bulk product import from Excel, with error report (Must (draft)).
- **ADM-08 / REQ-043:** Store and warehouse master: address, hours, GSTIN, service areas (Must (draft)).
- **ADM-09 / REQ-044:** Offer settings: start and end dates, maximum discount, first-order offer (Should (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Admin_CMS.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## Module design

## MOD-006: Admin masters and editorial pages — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Admin masters and editorial pages. Master data publication is an approved versioned action; staff scope is checked server-side.

**System responsibility:** The `Admin_CMS` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress (`ADM-01`)
- Staff users: invite, assign role and location, deactivate, log out sessions (`ADM-02`)
- Roles and permissions for 16 roles, limited to own store or warehouse (`ADM-03`)
- CMS: home banners, FAQs, policy pages, with draft and publish (`ADM-04`)
- System settings (PRD section 8) (`ADM-05`)
- Catalogue admin: products, categories, brands, salt master, prices, GST and HSN (`ADM-06`)
- Bulk product import from Excel, with error report (`ADM-07`)
- Store and warehouse master: address, hours, GSTIN, service areas (`ADM-08`)
- Offer settings: start and end dates, maximum discount, first-order offer (`ADM-09`)

## Dependencies and trust boundaries
- Database candidates: `platform.cms_pages`, `platform.cms_page_versions`, `platform.cms_banners`, `platform.application_settings`, `organization.locations`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Master data publication is an approved versioned action; staff scope is checked server-side. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- [HLD](HLD.md)
- [LLD](LLD.md)
- [Edge cases](Edge-Cases.md)
- [API contracts](../../05-APIs/Admin_CMS.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [QA scenarios](../../07-Engineering/Testing.md)
- [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
