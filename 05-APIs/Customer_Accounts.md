# Customer Accounts API contracts

These are proposed HTTP contracts, not implemented routes. They map to `ACC-01`–`ACC-07` in [Features and modules](../01-Project/Features-and-Modules.md). Customer identity and profile ownership come from the authenticated session. API schemas and numeric security limits need owner review before release.

## ACC-01 — public customer OTP flow

Both operations are unauthenticated because they run before a customer session exists. Apply rate limits using normalized phone number and network origin. Return a generic response that does not reveal whether the number belongs to an existing customer.

### API-001 — Request OTP

`POST /v1/auth/customer/otp/request`

```json
{
  "phone_country_code": "+91",
  "phone_number": "9876543210"
}
```

The request accepts a phone number only; it must not accept an OTP code, session token, or caller-selected user ID. Validate and normalize the number, apply configurable abuse limits, create an OTP challenge, and enqueue WhatsApp delivery. Trigger SMS only under the configured fallback rule. Return `202` with an opaque `challenge_id` and a generic message. Do not return the OTP or provider response.

### API-002 — Verify OTP

`POST /v1/auth/customer/otp/verify`

```json
{
  "challenge_id": "<opaque-challenge-id>",
  "code": "<user-entered-code>"
}
```

Validate challenge ownership against the normalized number, expiry, attempts, and one-time state. On success, resolve/create the eligible customer identity, create a session, and return the session credentials over TLS. OTP input does not contain the mandatory profile first_name: create the profile only during profile completion with a real name. Restrict incomplete onboarding to approved onboarding actions (D-003/D-013). Do not return a session for locked, suspended, or closed identities. Wrong, expired, superseded, and consumed codes return a generic `401` or `422` outcome and never create a session.

OTP expiry, resend, rate limits and effective attempt policy are governed by D-003. The database default for max_attempts is 5; it is observed schema behavior, not approved product policy. Store only a protected representation of the OTP. Never log the code. A timeout while sending leaves delivery outcome pending/failed; a client retry must not create an unlimited set of valid challenges.

## ACC-02 — profile

### API-003 — Read profile

`GET /v1/me`

Requires a valid customer session. Return the caller's profile and contact verification state. Mask the phone number in routine response views where the full value is not needed.

### API-004 — Update profile

`PATCH /v1/me`

```json
{
  "first_name": "Asha",
  "last_name": "Shah",
  "expected_profile_version": 4
}
```

Only supplied fields change. `first_name` is required in persisted profile state; nullable profile fields may be set to `null`. Validate name lengths against the schema (100 characters for first, last, and preferred name), validate email syntax, and normalize email before checking uniqueness. Preserve verified email/phone until a replacement proof succeeds. Contact changes need the D-023 proof and storage contract before implementation; do not assume pending-contact columns exist. Phone changes require an OTP to the proposed number. Never accept `user_id` as the target account.

Expose separate identity and profile versions. Require `expected_profile_version` for name edits and `expected_user_version` for identity updates; check both if an approved operation changes both tables. Stale updates return `409` and do not overwrite concurrent changes. A duplicate normalized email or phone returns `409` with no partial identity/profile write. The exact email-verification policy remains open; unverified email must not be treated as a verified destination.

## Remaining customer account contracts

These routes are proposed shapes. Confirm exact payloads, serviceability provider behavior, consent version semantics, retention policy, and ownership constraints against approved product decisions before implementation.

| Feature | Proposed operations | Main data mapping | Important rule |
| --- | --- | --- | --- |
| `ACC-03` | `GET/POST /v1/me/addresses`; `PATCH/DELETE /v1/me/addresses/{addressId}` | `customer.addresses`; `customer.profiles.default_address_id` | Address ID must belong to caller. Serviceability result is separate from address validity. |
| `ACC-04` | `GET/POST /v1/me/patients`; `PATCH/DELETE /v1/me/patients/{patientId}` | `customer.family_members`; possibly `clinical.patient_profiles` | Confirm authoritative patient model. Never associate a prescription without checking owner and patient relationship. |
| `ACC-05` | `POST /v1/me/consents`; `GET /v1/me/consents` | `customer.consents`, `customer.consent_events` | Record consent version, purpose, actor, time, and withdrawal as an event. Do not bundle optional marketing consent with required service consent. |
| `ACC-06` | `POST /v1/me/deletion-requests`; `GET /v1/me/deletion-requests/{requestId}` | `compliance.privacy_requests`, identity closure fields | Request review and retention handling; do not cascade-delete regulated records directly. |
| `ACC-07` | `GET/POST /v1/me/wishlist/items`; `DELETE /v1/me/wishlist/items/{itemId}` | `customer.wishlists`, `customer.wishlist_items` | Verify item ownership; product availability is read from Product_Catalog. |

## Shared response and error rules

Use `400` for malformed requests, `401` for absent/invalid session or challenge, `403` for denied action, `404` for inaccessible resource without exposing another customer's existence, `409` for uniqueness or version conflicts, `422` for valid syntax that violates business validation, and `429` for rate limits. Use `503` only when an upstream dependency prevents a reliable outcome. Include a correlation ID in responses and logs.

For writes, use idempotency keys where retrying the same intent could create duplicate state. Commit authoritative records and audit/outbox entries in one database transaction; send notifications after commit. Do not retry provider or money-moving operations without a provider-supported idempotency contract. Application logs must not contain OTPs, full phone numbers, or sensitive profile values.

## Data and implementation references

See [Customer Accounts LLD](../03-Modules/Customer_Accounts/LLD.md), [customer profile schema](../04-Database/Tables/customer/profiles.md), [identity users](../04-Database/Tables/identity/users.md), [OTP challenges](../04-Database/Tables/identity/otp_challenges.md), [sessions](../04-Database/Tables/identity/sessions.md), and [database module mapping](../04-Database/Module-Mapping.md). Schema presence does not by itself grant an application role write access.

## Preserved API identifiers

API-005 is address listing; API-006 is address creation (ACC-03). API-007 is family/patient listing; API-008 is family/patient creation (ACC-04). API-009 records consent (ACC-05). The additional edit/delete/request routes in the table are proposals without newly assigned API numbers. Existing identifiers are preserved; they do not imply those additional routes are implemented.
