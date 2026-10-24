# Customer Accounts low level design

<!-- ERD-NAV-START -->

## Database relationships

[`customer` ERD](../../04-Database/ER-Diagrams/06-customer.md) · [`identity` ERD](../../04-Database/ER-Diagrams/10-identity.md) · [`clinical` ERD](../../04-Database/ER-Diagrams/03-clinical.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Accounts-and-Login.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

This document defines the proposed implementation for customer identity, profile, address, family, consent, and wishlist features. The feature list is inherited draft scope, not signed product approval. API routes are proposals; the SQL schema is the checked-in database contract described in [Database migrations](../../04-Database/Migrations.md).

## Feature ownership and boundaries

| Feature | Behavior | Owner | Supporting component |
| --- | --- | --- | --- |
| `ACC-01` | Customer signup and sign-in by mobile OTP; WhatsApp delivery with SMS fallback | Customer_Accounts | Authentication_Access verifies challenges; Notifications delivers messages |
| `ACC-02` | Customer profile name, email, and phone | Customer_Accounts | Authentication_Access verifies sensitive contact changes |
| `ACC-03` | Saved delivery addresses and serviceability lookup | Customer_Accounts | Order_Operations or serviceability adapter evaluates delivery coverage |
| `ACC-04` | Family profiles for dependents | Customer_Accounts | Prescription_Upload consumes an explicitly selected patient |
| `ACC-05` | Record privacy notice and consent version | Customer_Accounts | Audit records access and changes |
| `ACC-06` | Account deletion request | Customer_Accounts | Compliance applies retention and legal holds |
| `ACC-07` | Wishlist | Customer_Accounts | Product_Catalog supplies product read models |

Customer_Accounts owns customer-facing profile and household data. It does not decide prescription eligibility, clinical decisions, payment policy, or legal retention. Internal IDs are never authorization evidence; every patient, address, and prescription association must be checked against the authenticated customer's ownership.

## ACC-01 — customer mobile OTP signup and login

### Flow

1. An unauthenticated client submits a normalized mobile number to the OTP request operation. The server validates format and applies abuse limits by phone and network origin.
2. The authentication component creates an OTP challenge and requests WhatsApp delivery. It requests SMS fallback only when the configured delivery policy says the primary delivery failed or timed out. A fallback must not silently create a second valid challenge unless the challenge policy explicitly permits it.
3. The client submits the challenge reference and OTP to the separate verification operation. The server checks challenge ownership, expiry, attempt state, and one-time use.
4. A verified number resolves an existing eligible user or creates an identity under the account-registration policy. Create `customer.profiles` only after the customer supplies its required `first_name`; OTP input alone cannot populate it. Never insert a fabricated name. Until profile completion and required consent, restrict the onboarding session to permitted onboarding actions (D-003/D-013). Suspended, closed, or locked identities do not receive a session.
5. The server creates a session and returns it only after the account and session transaction commits.

The OTP request is public and unauthenticated. It does not accept an OTP code. Verification is a separate public pre-login operation. Do not copy staff-session requirements onto either pre-login operation. Expiry, resend and rate-limit thresholds remain configurable policy values until Security and Product approve them.

The challenge table has a recorded `max_attempts` default of 5; this observed database default is not approval of the effective security policy. Explicitly supply approved challenge policy values instead of silently assuming defaults.

### Failure and retry behavior

Invalid or expired challenges are rejected without creating a session. A used challenge cannot be replayed. Resending invalidates or supersedes the previous challenge according to the configured challenge policy. Provider timeouts leave delivery pending/failed and can be retried with a provider idempotency key where supported.

If delivery outcome is unknown, do not claim the OTP was delivered. Duplicate requests are rate limited and deduplicated within the configured intent window. Logs contain challenge IDs and masked phone numbers, never OTP values.

### Acceptance criteria

- Existing active and new customer paths return a session only after successful OTP verification.
- OTP request needs no existing session; verification requires a valid challenge and code.
- Wrong, expired, consumed, or superseded codes cannot create sessions.
- Provider failure and rate limiting return actionable safe outcomes without exposing whether a phone is registered.
- Challenge reuse, resend, concurrent verification, and brute-force limits are tested.

## ACC-02 — customer profile

### Behavior and validation

An authenticated customer can read and partially update their own profile. The API derives the user ID from the session; a caller cannot select another account. `first_name` is required by the current table; `last_name`, `preferred_name`, `date_of_birth`, and `gender` are nullable schema fields.

The feature requirement names name, email, and phone, but email and phone live on `identity.users`, not `customer.profiles`. Treat those identity fields as contact data and route sensitive updates through verification. No profile operation copies OTP expiry errors unless it initiates contact verification.

Validate name lengths against the database limits (100 characters for first/last/preferred name), trim surrounding whitespace, reject empty required names, and validate email syntax and normalized uniqueness. Database evidence shows `identity.users.email_normalized` is unique and phone country-code/number is unique when present.

Phone changes require a verified challenge before replacing the current verified number. Do not expose full phone values in logs or unrelated read models. Email verification and contact-change delivery policy remain D-023. Preserve the currently verified contact while verifying a proposed replacement.

The schema has no dedicated pending-contact columns; do not invent them or overwrite the verified destination. D-023 must select a purpose-bound challenge/proof design before contact-change implementation.

PATCH applies only supplied fields. Omitted fields remain unchanged; explicit `null` is accepted only for nullable fields. Return separate identity and profile `row_version` values. For profile-only writes require `expected_profile_version`; for identity changes require `expected_user_version`; a combined write must check both versions in the same transaction.

A stale version returns `409` with the current safe version; it does not overwrite the concurrent edit. Persist identity and profile changes atomically when both tables change. Audit the actor, changed field names, timestamp, and outcome without recording old/new contact values in general logs.

### Acceptance criteria

- A customer can read and update only their own profile.
- Partial updates preserve omitted fields and validate nullability.
- Duplicate normalized email or phone returns a conflict without partial writes.
- Sensitive contact changes do not overwrite verified identity fields until the verification flow succeeds; the pending-proof contract remains D-023.
- Concurrent edits produce a conflict instead of a lost update.
- Audit and application logs do not contain OTPs or unmasked contact values.

## Data mapping

| Feature | Tables and fields | Verified constraints / limits |
| --- | --- | --- |
| `ACC-01` | `identity.users` (`id`, `phone_country_code`, `phone_number`, `phone_verified_at`, `status`, `row_version`); `identity.otp_challenges`; `identity.sessions` | Phone pair must be complete; phone pair is unique when present; user status is constrained. Confirm exact challenge fields in the table contract before implementing. |
| `ACC-02` | `customer.profiles` (`user_id`, `first_name`, `last_name`, `preferred_name`, `row_version`); `identity.users` (`email`, `email_normalized`, `email_verified_at`, `phone_country_code`, `phone_number`, verification timestamps) | First/last/preferred name max 100; one active profile per user; normalized email unique; phone pair unique when present. |
| `ACC-03` | `customer.addresses`; `customer.profiles.default_address_id` and `user_id` | Composite foreign key ensures default address belongs to the same user. Serviceability is an external/business decision, not guaranteed by address persistence. |
| `ACC-04` | `customer.family_members`; where clinical patient records are used, `clinical.patient_profiles` | Verify whether the implementation uses one or both models and their ownership constraints before associating prescriptions. |
| `ACC-05` | `customer.consents`, `customer.consent_events`; identity terms/privacy version fields | Consent text/version and purpose are product/legal controlled. Store an immutable event for grant/withdrawal. |
| `ACC-06` | `identity.users.account_closed_at`, `status`; `compliance.privacy_requests`, legal-hold/retention records | Deletion is a request workflow, not a direct cascade. Preserve records required by an approved retention or legal hold. |
| `ACC-07` | `customer.wishlists`, `customer.wishlist_items` | Unique ownership/product rules are database enforced where present; product availability is read from Product_Catalog. |

See [customer profile schema](../../04-Database/Tables/customer/profiles.md), [identity users](../../04-Database/Tables/identity/users.md), [OTP challenges](../../04-Database/Tables/identity/otp_challenges.md), [sessions](../../04-Database/Tables/identity/sessions.md), and [database module mapping](../../04-Database/Module-Mapping.md). These mappings identify schema relationships, not approved runtime write grants.

## APIs and integration

Proposed contracts are indexed in [Customer Accounts API](APIs.md) and [Authentication and Access API](../Authentication/APIs.md). Customer_Accounts calls Authentication_Access for challenge verification and session creation; Notifications handles channel delivery.

Provider callbacks must be authenticated, deduplicated, and stored before processing. User/profile writes and their audit/outbox records commit together; outbound notifications occur after commit.

## Feature tests

| Test ID | Feature | Scenario | Expected result |
| --- | --- | --- | --- |
| `TC-ACC-01-01` | `ACC-01` | New customer verifies valid OTP | One eligible customer identity and one session are created; a profile is created only after a valid first_name is supplied. |
| `TC-ACC-01-02` | `ACC-01` | Request OTP with no session | Request is accepted or safely rate limited; no OTP is accepted in the request body. |
| `TC-ACC-01-03` | `ACC-01` | Wrong, expired, consumed, or superseded OTP | Verification fails; no session is created. |
| `TC-ACC-01-04` | `ACC-01` | WhatsApp failure followed by configured SMS fallback | One valid challenge remains; outcome is reported accurately. |
| `TC-ACC-01-05` | `ACC-01` | Concurrent verification or duplicate request | At most one session-producing verification; replay is idempotent or rejected. |
| `TC-ACC-02-01` | `ACC-02` | Customer reads and partially edits own profile | Only submitted fields change and response is scoped to the caller. |
| `TC-ACC-02-02` | `ACC-02` | Customer submits another user's ID or stale version | Access is denied without leaking account existence, or `409` is returned for stale state. |
| `TC-ACC-02-03` | `ACC-02` | Duplicate email/phone or invalid field length | Validation/conflict is returned; identity and profile remain unchanged. |
| `TC-ACC-02-04` | `ACC-02` | Email/phone change before verification | Existing verified contact remains unchanged until the replacement proof is accepted; no undocumented pending-contact field is written. |

All tests above are proposed and not run. Full module edge cases are in [Customer Accounts edge cases](Edge-Cases.md).

## Additional account feature tests

> [!NOTE]
> **Status: Designed; NOT RUN.** Existing detailed ACC-01/ACC-02 IDs above remain authoritative.

| Test | Feature/input | Expected result |
| --- | --- | --- |
| `TC-ACC-03-OK` | Saved addresses with map pin; serviceability checked when the address is entered | Owned address and map pin save; checkout checks current serviceability |
| `TC-ACC-03-DENY` | Serviceability lookup times out or another customer’s address is submitted | Deny cross-owner address use without mutation; Address-only save may persist but serviceability is unknown; checkout is blocked; Customer retries lookup; integration owner restores service |
| `TC-ACC-04-OK` | Family profiles for dependents (name, age, relation) | Owned dependent is available to the permitted account |
| `TC-ACC-04-DENY` | Another household’s patient ID is attached | Association denied; no order/prescription link changed; Customer selects an authorized patient |
| `TC-ACC-05-OK` | Privacy notice and consent at signup | Explicit choice is stored against the presented current notice version |
| `TC-ACC-05-DENY` | Client submits an obsolete notice version | No consent to an unseen version is recorded; Customer sees current notice and chooses again |
| `TC-ACC-06-OK` | Account deletion request | Deletion request is acknowledged and routed for retention review |
| `TC-ACC-06-DENY` | Legal hold exists at deletion processing | Held evidence remains protected; request is pending, not completed; Privacy reviews permitted deletion and exceptions |
| `TC-ACC-07-OK` | Wishlist | A wishlist contains the selected item once for its owner |
| `TC-ACC-07-DENY` | Same item is added twice | One logical wishlist item; another customer’s list is unchanged; Customer reloads the saved list |
