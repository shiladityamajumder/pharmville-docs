# Customer Accounts API contracts


**Shared contract standards:** [conventions](API-Conventions.md) · [authentication/authorization](Authentication-and-Authorization.md) · [response envelope](Standard-Responses.md) · [errors](Error-Catalog.md) · [pagination](Pagination-and-Filtering.md) · [idempotency/concurrency](Idempotency-and-Concurrency.md) · [database-to-DTO mapping](Database-DTO-Mapping.md) · [coverage/readiness](API-Contract-Coverage.md).

**Implementation evidence:** these Pharmville routes are proposed documentation contracts; no executable Pharmville HTTP routes or contract tests were found. A verified response envelope from the separate authentication service does not confirm these operation DTOs. Resolve the operation-specific gaps listed in the coverage ledger before implementation.

These are proposed HTTP contracts, not implemented routes. They map to `ACC-01`–`ACC-07` in [Features and modules](../01-Project/Features-and-Modules.md). Customer identity and profile ownership come from the authenticated session. API schemas and numeric security limits need owner review before release.

## ACC-01 — public customer OTP flow

Both operations are unauthenticated because they run before a customer session exists. Apply rate limits using normalized phone number and network origin. Return a generic response that does not reveal whether the number belongs to an existing customer.

**Casing reconciliation:** the earlier proposal used snake_case request keys. No Pharmville route implementation or deployed consumer was found. The new proposed request DTOs use camelCase, consistent with the package convention and the separately verified authentication-service response envelope; no compatibility for a deployed Pharmville contract is implied.

### API-001 — Request OTP

`POST /v1/auth/customer/otp/request`

```json
{
  "phoneCountryCode": "+91",
  "phoneNumber": "9876543210"
}
```

The request accepts a phone number only; it must not accept an OTP code, session token, or caller-selected user ID. Validate and normalize the number, apply configurable abuse limits, create an OTP challenge, and enqueue WhatsApp delivery. Trigger SMS only under the configured fallback rule. Return `202` with an opaque `challengeId` and a generic message. Do not return the OTP or provider response.

### API-002 — Verify OTP

`POST /v1/auth/customer/otp/verify`

```json
{
  "challengeId": "<opaque-challenge-id>",
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
  "firstName": "Asha",
  "lastName": "Shah",
  "expectedProfileVersion": 4
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

## Route-level account operation register

The following routes make the historical references and unnumbered proposals explicit. These are proposed JSON contracts; D-024 must approve each DTO and the authoritative patient model remains open for ACC-04. Collection reads are scoped to the authenticated customer, never a caller-provided `userId`.

| Reference | Method and endpoint | Proposed input / output | Authorization and effect |
|---|---|---|---|
| API-005 | `GET /v1/me/addresses` | Query: approved `cursor`; response: owned address summaries and pagination | Customer session; reads `customer.addresses`; serviceability is not inferred from address validity |
| API-006 | `POST /v1/me/addresses` | JSON: `label`, `recipientName`, `recipientPhone`, `line1`, optional `line2`, `locality`, `district`, `city`, `state`, optional `stateCode`, `postalCode`, `countryCode`, optional `latitude`/`longitude`, `isDefault`; response `201` with public `id`, approved address fields and `rowVersion` | Customer session; server sets `userId`; maps only to documented `customer.addresses` fields. Lengths come from the table (label 64, recipient name 150, phone 32, line1/2 255, locality/district/city/state 150/100/100/100, postal code 16, country code 2, state code 8, coordinates numeric(10,7) and range checks); address-validation/serviceability policy remains D-024 |
| API-007 | `GET /v1/me/patients` | Query: approved `cursor`; response: owned dependent summaries and pagination | Customer session; candidate `customer.family_members`; whether clinical profile details are joined is blocked pending patient-model approval |
| API-008 | `POST /v1/me/patients` | JSON: `name` (150), `relationship` (64), optional `dateOfBirth` (date), optional `gender` (32); response `201` with public family-member ID and `rowVersion` | Customer session; server sets `customer_user_id` and dependent/guardian linkage per approved policy. These fields map to `customer.family_members`; creating `clinical.patient_profiles` is a separate owning operation and is not implied |
| API-009 | `POST /v1/me/consents` | JSON: `consentType` (64), `purpose` (128), `version` (32), `status` (`granted`, `denied`, or `revoked`), `source` (32); response `201` with consent ID/status/time | Customer session; these map to documented non-null `customer.consents` fields and an associated `customer.consent_events` row. A user-visible withdrawal maps to persisted `revoked` plus `withdrawn_at`; `withdrawn` is not an allowed stored status. Do not combine service and marketing consent |
| ACC-ROUTE-001 | `PATCH /v1/me/addresses/{addressId}` | Partial mutable address fields plus required `expectedVersion` mapped to `customer.addresses.row_version`; response `200` updated address summary | Owner-only; compare the positive row version; preserve server ownership and internal IDs. Default-address change is validated against profile/checkout ownership |
| ACC-ROUTE-002 | `DELETE /v1/me/addresses/{addressId}` | Required strong `If-Match` ETag for the current address version; response `204` with no body | Owner-only soft-delete proposal; reject if referenced by an in-flight checkout unless checkout policy explicitly allows it |
| ACC-ROUTE-003 | `PATCH /v1/me/patients/{patientId}` | Mutable `name`, `relationship`, optional `dateOfBirth` and `gender`, plus required `expectedVersion` mapped to `customer.family_members.row_version`; response `200` summary | Owner/guardian relationship is checked server-side; stale version has no write effect. Clinical patient profile linkage is read/managed by the clinical owner and is not mass-assigned |
| ACC-ROUTE-004 | `DELETE /v1/me/patients/{patientId}` | Required strong `If-Match` ETag for the current patient association version; response `204` with no body | Owner/guardian-only; retain clinical history and reject removal where an active order/review requires the association |
| ACC-ROUTE-005 | `GET /v1/me/consents` | Query: optional approved `consentType`, cursor; response consent history and pagination | Customer session; own consent records only |
| ACC-ROUTE-006 | `GET /v1/me/deletion-requests/{requestId}` | Path UUID; response request status, submitted time and next action | Customer session; request must belong to caller; never expose internal retention/legal-hold notes |
| ACC-ROUTE-007 | `POST /v1/me/deletion-requests` | JSON: `requestType`, `reasonCode` (optional approved enum); response `202` with request reference and `pending_review` state | Customer session; creates review request, does not cascade-delete identity, orders, prescriptions or financial evidence |
| ACC-ROUTE-008 | `GET /v1/me/wishlist/items` | Query: cursor; response product references and safe published product summary | Customer session; owned wishlist only; catalog controls publication and product fields |
| ACC-ROUTE-009 | `POST /v1/me/wishlist/items` | JSON: `productId` UUID; response `201` wishlist item reference and product reference | Customer session; server validates product is visible; duplicate add returns the existing item or a documented conflict after D-024 |
| ACC-ROUTE-010 | `DELETE /v1/me/wishlist/items/{itemId}` | Path UUID; response `204` with no body; item delete is idempotent | Customer session; item must belong to caller; no effect on catalog or cart |

For all these operations, malformed UUID/JSON is `400`, unauthenticated is `401`, cross-customer access is hidden with `404`, invalid fields are `422`, and stale or duplicate state is `409` where applicable. Mutations use the shared idempotency/version policy. A 204 response contains no JSON body. See the [coverage ledger](API-Contract-Coverage.md) for OpenAPI mapping and unresolved field approval.
