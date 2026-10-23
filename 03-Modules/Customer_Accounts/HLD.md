# Customer Accounts HLD

[Business flow](../../00-Business-Guide/Accounts-and-Login.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-001: Customer profiles and family access — HLD

**Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Customer profiles and family access. Customer submits OTP, selects patient/address; sensitive information is never returned to other accounts.

**System responsibility:** The `Customer_Accounts` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

## Major operations

- Sign up and log in with mobile OTP (WhatsApp first, SMS fallback) (`ACC-01`)
- Profile: name, email, phone (`ACC-02`)
- Saved addresses with map pin; serviceability checked when the address is entered (`ACC-03`)
- Family profiles for dependents (name, age, relation) (`ACC-04`)
- Privacy notice and consent at signup (`ACC-05`)
- Account deletion request (`ACC-06`)
- Wishlist (`ACC-07`)

## Dependencies and trust boundaries
- Database candidates: `identity.users`, `customer.profiles`, `customer.family_members`, `customer.addresses`, `clinical.patient_profiles`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** Module LLD · API index · Tests

## Risk
Customer submits OTP, selects patient/address; sensitive information is never returned to other accounts. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-001 — Customer profiles and family access

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Customer submits OTP, selects patient/address; sensitive information is never returned to other accounts.

**Feature coverage**
- **ACC-01 / REQ-001:** Sign up and log in with mobile OTP (WhatsApp first, SMS fallback) (Must (draft)).
- **ACC-02 / REQ-002:** Profile: name, email, phone (Must (draft)).
- **ACC-03 / REQ-003:** Saved addresses with map pin; serviceability checked when the address is entered (Must (draft)).
- **ACC-04 / REQ-004:** Family profiles for dependents (name, age, relation) (Must (draft)).
- **ACC-05 / REQ-005:** Privacy notice and consent at signup (Must (draft)).
- **ACC-06 / REQ-006:** Account deletion request (Should (draft)).
- **ACC-07 / REQ-007:** Wishlist (Should (draft)).

## Developer navigation
- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Customer_Accounts.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## Identity and profile implementation boundary

Customer_Accounts owns ACC-01 signup/login UX and ACC-02 profile behavior. Authentication_Access owns challenge verification and sessions; Notifications owns channel delivery. Pre-login proof operations require no existing session. OTP verification cannot fabricate a required profile name. Identity and profile are separate versioned rows; see [LLD](LLD.md), [API contracts](../../05-APIs/Customer_Accounts.md), and [identity workflow](../../06-Workflows/WF-001-Identity-and-Session.md). Contact-change proof/storage remains D-023.
