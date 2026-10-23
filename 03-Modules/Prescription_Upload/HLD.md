# Prescription Upload HLD

## High-level design

## MOD-004: Private prescription intake — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Private prescription intake. An uploaded file is quarantined until inspected and can only be accessed by permitted patients and reviewers.

**System responsibility:** The `Prescription_Upload` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Upload one or more prescriptions (JPG, PNG, PDF) at checkout (`RX-01`)
- Upload within 24 hours after ordering; auto-cancel after that (`RX-02`)
- Reuse a saved, still-valid prescription (`RX-03`)
- Link each prescription to the patient (self or family member) (`RX-04`)
- See the pharmacist's decision and reason; re-upload after rejection (`RX-05`)

## Dependencies and trust boundaries
- Database candidates: `clinical.prescriptions`, `clinical.prescription_documents`, `platform.file_objects`, `platform.file_access_events`, `platform.file_upload_sessions`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
An uploaded file is quarantined until inspected and can only be accessed by permitted patients and reviewers. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Feature context

## MOD-004 — Private prescription intake

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** An uploaded file is quarantined until inspected and can only be accessed by permitted patients and reviewers.

**Feature coverage**
- **RX-01 / REQ-022:** Upload one or more prescriptions (JPG, PNG, PDF) at checkout (Must (draft)).
- **RX-02 / REQ-023:** Upload within 24 hours after ordering; auto-cancel after that (Should (draft)).
- **RX-03 / REQ-024:** Reuse a saved, still-valid prescription (Should (draft)).
- **RX-04 / REQ-025:** Link each prescription to the patient (self or family member) (Must (draft)).
- **RX-05 / REQ-026:** See the pharmacist's decision and reason; re-upload after rejection (Must (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Prescription_Upload.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
