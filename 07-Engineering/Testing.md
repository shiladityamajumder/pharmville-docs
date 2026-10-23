# Testing strategy

## Database Evidence vs Application Tests

## Recorded DB validation versus unexecuted application tests

**Recorded database evidence:** isolated PostgreSQL server `180001`, {'tests': 108, 'failures': 0, 'errors': 0, 'skipped': 0} pytest summary (see source final acceptance report), 10-concurrent-checkout last-unit test, restore and schema parity checks. These historical reports are evidence supplied by the user, not a fresh execution of those tests.

**Not executed here:** Next.js/NestJS tests, real provider callbacks, hardware rider proof, production restore, hosted CI, PG15 matrix, penetration testing, signed UAT. The database repository does not contain an HTTP application.

**Planned coverage:** the module sections below contain three generic scenario prompts per feature (authorized, denial, concurrency/provider failure). These prompts are incomplete test specifications; the distinct ACC-01/ACC-02 cases in the [Customer LLD](../03-Modules/Customer_Accounts/LLD.md#feature-tests) take precedence for those two features. Mark each test `NOT RUN` until a test harness and result is attached.

Module test cases · DB migration policy

## Database Testing

## Migration and SQL validation plan

Reuse repo's SQL runner and validation scripts, not Alembic. Validate checksum/ledger, V0001 on empty DB, the documented forward upgrade nonempty upgrade, model/catalog parity and numeric crosswalk integrity on isolated PG18 and a clean PG15 environment when available. Exercise all existing PK/FK/UNIQUE/CHECK/index/trigger/RLS semantics through their canonical service operations.

Priority races: ten parallel last-unit checkouts yield one allocation; concurrent revised consent vs pharmacist approval; conflicting inventory site holds; simultaneous refunds and webhook replay; stale staff pack commands after license expiry. For each, check exact state and immutable money/clinical/audit effects, not just HTTP status.

The supplied report records local 108/108 tests pass and a catalog diff count of zero on PostgreSQL `180001`, but no new DB container is run in this documentation build. Verify hosted CI, real production-like restore and measured latency separately before release. See Source Acceptance.

## End To End Testing

## End-to-end customer, staff and rider scenarios

Execute customer browse → cart → address/patient → Rx conditional branch → accepted quote → signed payment or eligible COD → single-site stock reservation → pick/pack → rider assignment → OTP proof → invoice/status. For P+M+O, reject one P line, confirm unchanged M/O remain, require explicit customer consent to new total before charge, then verify only approved P items can enter package.

Also cover guest vs authenticated customer, expired OTP/session mid-checkout, refresh after order submit, store closed/no safe lot, no provider response, last-unit collision, manual reassignment, delivery refusal/reattempt, uncollected vs deposited COD, return/refund and customer support escalation. Test error copy and keyboard/mobile forms as well as side effects.

Do not assume UI screenshot screens demonstrate backend readiness. Require traced API request IDs, database revisions and actor-scoped audit records for each successful/failed route. Rider Android build/distribution decision remains open; test plan should be upgraded after tech selection.

## Integration Testing

## API and provider integration verification

Boot the proposed NestJS API against a disposable DB migrated through authoritative the checked-in SQL migration history. Validate request schema, object-level authorization, transaction behavior, provider adapter signatures, late callbacks, outbox/inbox event ordering and application ↔ SQL contract parity. Ensure API-created UUID identifiers align with BIGINT internal crosswalks.

Cashfree sandbox tests must cover pending/failed/success, signature and raw-body validation, replay and reconciliation. Techsmith must demonstrate authoritative location-lot observation and loss/reconnect handling; simulate stale stock before allowing reservations. MSG91/SES should receive only approved redacted notification templates; Rx file adapter should scan, store privately and reauthorize access. Rider/GPS app must handle offline and duplicate OTP evidence.

A sandbox success does not guarantee a production provider account or pharmacy policy; approvals and real operating SOP remain separate gates. See Provider Dependencies.

## Performance Testing

## Performance and concurrency benchmarks

Measure representative catalogue/search reads, customer order list p95, prescription queue age, stock hold/update contention, settlement/webhook backlog, rider position ingest load, mass exports and API response under realistic input sizes. Measure PostgreSQL query plans, lock wait, deadlocks, buffer hits, worker lag and real user experience separately.

The supplied database performance appendix records synthetic tests on 19 query shapes and a 50,000-row BIGINT/UUID comparison. It is useful engineering evidence, not a production demand forecast or proof of 99.9% service availability. Sizing and response targets in the checklists/HLD require owner review and independent staging load validation.

Target failure tests include Cashfree slow status callback, Techsmith feed gap, Redis job backlog, Rx scan outage and last-unit checkout storm. Correctness must be preserved even when latency increases. No test should infer successful charge/delivery from a timeout or stale cache. See Scalability.

## README

## Proposed QA and test case register

**330 proposed application test scenarios** across 18 module files (three per inherited feature ID) plus 14 cross-module workflow plans. No application tests were run. The supplied DB repo separately records 108/108 PG18 database tests.

- Customer_Accounts
- Product_Catalog
- Cart_Checkout
- Prescription_Upload
- Customer_Orders
- Admin_CMS
- Order_Operations
- Store_Operations
- Inventory
- Warehouse
- Pharmacist_Review
- Delivery_Operations
- Rider_App
- Finance_Payments
- Reporting
- Audit
- Authentication_Access
- Notifications

Evidence boundary

## Security Testing

## Security test approach

Run authenticated IDOR probes across customer/patient/order/Rx, unauthorized pharmacy decisions, staff cross-store operations, rider task/GPS snooping, refund threshold bypass and report/export leaks. Confirm sensitive file access requires download-time reauthorization and cannot be guessed from public UUID or long-lived object URL.

Verify OTP session replay/lockout, privileged TOTP/rotation, logout invalidation, provider webhook spoof and duplicate event, API rate limiting, injection/HTML sanitization in CMS/search, SSRF/file upload type/malware checks and secret redaction. Exercise restricted DB capability roles and default denied SQL, not a migration-owner runtime connection.

A passed local DB RLS suite supports defense-in-depth but does not prove the client/API/cloud are secure. Threat-model signoff, penetration testing in staging and legal privacy approval are production gates. See Threat Model.

## Test Strategy

## Quality strategy and evidence levels

A database-only test is not a delivered customer journey. Test the stack in layers: domain/DTO unit tests, PostgreSQL migration and concurrency tests, API and provider sandbox integration tests, browser/rider end-to-end journeys, privacy/security tests, representative performance tests, owner UAT and operational recovery drills.

The database acceptance report records 108 independently run PostgreSQL 18 local tests passed and zero SQL↔model parity differences, but no implemented NestJS endpoints, Cashfree adapter, production POS sync, rider app or deployed file-signing service. Therefore **application test completion is zero proven by these files**, not 108. Never inherit DB PASS as full-product readiness.

Prioritize all seven nonempty P/M/O basket combinations; wrong-patient/version approval; mixed rejected P with customer consent; last unit contention; stale inventory; paid-but-out-of-stock recovery; duplicate payment/refund/COD callback; license expiration; unauthorized customer/staff/rider access; evidence-based delivery and private export download.

Assign stable `TC-{feature ID}-OK/DENY` cases from LLD and attach actual run reports before calling a feature complete. See Acceptance Criteria, Coverage.

## UAT

## User acceptance testing (UAT)

Business owners should witness, not merely read about: all seven P/M/O basket types; exact pharmacist outcomes on multiple P lines; changed basket requiring consent; single-site stock and last-pack conflict; Cashfree pending and COD acceptance; manual store queue; warehouse transfer/fallback; rider GPS/OTP and failed delivery; refund and daily COD reconciliation; private file/export permission denial.

Use the journey v3 source's 34 stages and documented exception cases as walkthroughs. The source LLD describes 31 acceptance tests, but their results are not present in this documentation bundle; don't count them as passed. Attach Jira ticket, test evidence, actor/location, order revision, provider event ID redacted, expected/actual result and named owner signoff.

No go-live without approved clinical SOP and pharmacist/legal evidence, warehouse opening stock data, POS authority, tax/return policies, configured templates and production account ownership. See Acceptance Gates and Decisions.

## Unit Testing

## Unit tests per domain

Use isolated unit tests for P/M/O classification selection, quote/version confirmation, checkout state guards, single-site routing policy, VAT/GST input validation (not legal correctness), lot expiry conditions, session policy, permission predicates, OTP retry windows, refund idempotency keys, event deduplication and customer-safe state projection.

Mock I/O at service boundaries, not database behavior you should trust to PostgreSQL. A unit test for stock eligibility should cover unknown/expired observation and mixed P approval, but must be paired with a real database lock and foreign-key test. Finance unit tests need duplicate and out-of-order event cases; never make a fake provider result look like verified bank settlement.

Module sections enumerate three scenario prompts per draft feature ID and cross-module negative controls. Concrete fixtures, actions and assertions remain D-024 work. Use fixture-only synthetic customers/prescriptions; don't import sensitive legal identity documents or production data.

## Admin CMS

## Admin masters and editorial pages — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-ADM-01-01` | `REQ-036` / `ADM-01` | Valid actor, valid fixtures; carry out: Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-01-02` | `REQ-036` / `ADM-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-01-03` | `REQ-036` / `ADM-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-02-01` | `REQ-037` / `ADM-02` | Valid actor, valid fixtures; carry out: Staff users: invite, assign role and location, deactivate, log out sessions. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-02-02` | `REQ-037` / `ADM-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-02-03` | `REQ-037` / `ADM-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-03-01` | `REQ-038` / `ADM-03` | Valid actor, valid fixtures; carry out: Roles and permissions for 16 roles, limited to own store or warehouse. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-03-02` | `REQ-038` / `ADM-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-03-03` | `REQ-038` / `ADM-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-04-01` | `REQ-039` / `ADM-04` | Valid actor, valid fixtures; carry out: CMS: home banners, FAQs, policy pages, with draft and publish. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-04-02` | `REQ-039` / `ADM-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-04-03` | `REQ-039` / `ADM-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-05-01` | `REQ-040` / `ADM-05` | Valid actor, valid fixtures; carry out: System settings (PRD section 8). | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-05-02` | `REQ-040` / `ADM-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-05-03` | `REQ-040` / `ADM-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-06-01` | `REQ-041` / `ADM-06` | Valid actor, valid fixtures; carry out: Catalogue admin: products, categories, brands, salt master, prices, GST and HSN. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-06-02` | `REQ-041` / `ADM-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-06-03` | `REQ-041` / `ADM-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-07-01` | `REQ-042` / `ADM-07` | Valid actor, valid fixtures; carry out: Bulk product import from Excel, with error report. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-07-02` | `REQ-042` / `ADM-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-07-03` | `REQ-042` / `ADM-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-08-01` | `REQ-043` / `ADM-08` | Valid actor, valid fixtures; carry out: Store and warehouse master: address, hours, GSTIN, service areas. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-08-02` | `REQ-043` / `ADM-08` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-08-03` | `REQ-043` / `ADM-08` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ADM-09-01` | `REQ-044` / `ADM-09` | Valid actor, valid fixtures; carry out: Offer settings: start and end dates, maximum discount, first-order offer. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ADM-09-02` | `REQ-044` / `ADM-09` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ADM-09-03` | `REQ-044` / `ADM-09` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Audit

## Immutable change evidence — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-AUD-01-01` | `REQ-100` / `AUD-01` | Valid actor, valid fixtures; carry out: Log logins, changes, stock movements and prescription views. | Correct scoped result; durable state and audit consistent | High |
| `TEST-AUD-01-02` | `REQ-100` / `AUD-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-AUD-01-03` | `REQ-100` / `AUD-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-AUD-02-01` | `REQ-101` / `AUD-02` | Valid actor, valid fixtures; carry out: Search and export the audit log; read-only for everyone. | Correct scoped result; durable state and audit consistent | High |
| `TEST-AUD-02-02` | `REQ-101` / `AUD-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-AUD-02-03` | `REQ-101` / `AUD-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Authentication Access

## Login, sessions, roles and access control — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-AUTH-01-01` | `REQ-102` / `AUTH-01` | Valid actor, valid fixtures; carry out: Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager. | Correct scoped result; durable state and audit consistent | High |
| `TEST-AUTH-01-02` | `REQ-102` / `AUTH-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-AUTH-01-03` | `REQ-102` / `AUTH-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-AUTH-02-01` | `REQ-103` / `AUTH-02` | Valid actor, valid fixtures; carry out: Lockout rules, session limits, one session per staff account. | Correct scoped result; durable state and audit consistent | High |
| `TEST-AUTH-02-02` | `REQ-103` / `AUTH-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-AUTH-02-03` | `REQ-103` / `AUTH-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-AUTH-03-01` | `REQ-104` / `AUTH-03` | Valid actor, valid fixtures; carry out: OTP rate limits per number and IP. | Correct scoped result; durable state and audit consistent | High |
| `TEST-AUTH-03-02` | `REQ-104` / `AUTH-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-AUTH-03-03` | `REQ-104` / `AUTH-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-AUTH-04-01` | `REQ-105` / `AUTH-04` | Valid actor, valid fixtures; carry out: Permissions checked on the server for every request. | Correct scoped result; durable state and audit consistent | High |
| `TEST-AUTH-04-02` | `REQ-105` / `AUTH-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-AUTH-04-03` | `REQ-105` / `AUTH-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Cart Checkout

## Cart, quote and placement intent — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-CHK-01-01` | `REQ-014` / `CHK-01` | Valid actor, valid fixtures; carry out: Cart saved across devices for logged-in customers. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-01-02` | `REQ-014` / `CHK-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-01-03` | `REQ-014` / `CHK-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-02-01` | `REQ-015` / `CHK-02` | Valid actor, valid fixtures; carry out: Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-02-02` | `REQ-015` / `CHK-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-02-03` | `REQ-015` / `CHK-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-03-01` | `REQ-016` / `CHK-03` | Valid actor, valid fixtures; carry out: Online payment via Cashfree: UPI, cards, net banking. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-03-02` | `REQ-016` / `CHK-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-03-03` | `REQ-016` / `CHK-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-04-01` | `REQ-017` / `CHK-04` | Valid actor, valid fixtures; carry out: Cash on delivery, with a maximum order value and a block after repeated refusals. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-04-02` | `REQ-017` / `CHK-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-04-03` | `REQ-017` / `CHK-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-05-01` | `REQ-018` / `CHK-05` | Valid actor, valid fixtures; carry out: Minimum order value and delivery fee applied from settings. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-05-02` | `REQ-018` / `CHK-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-05-03` | `REQ-018` / `CHK-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-06-01` | `REQ-019` / `CHK-06` | Valid actor, valid fixtures; carry out: Price or stock change detected before payment; customer confirms. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-06-02` | `REQ-019` / `CHK-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-06-03` | `REQ-019` / `CHK-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-07-01` | `REQ-020` / `CHK-07` | Valid actor, valid fixtures; carry out: No duplicate orders or charges (double tap, refresh, closed browser after payment). | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-07-02` | `REQ-020` / `CHK-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-07-03` | `REQ-020` / `CHK-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CHK-08-01` | `REQ-021` / `CHK-08` | Valid actor, valid fixtures; carry out: Stock reserved during checkout, released automatically if payment does not finish. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CHK-08-02` | `REQ-021` / `CHK-08` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CHK-08-03` | `REQ-021` / `CHK-08` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Customer Accounts

## Customer profiles and family access — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-ACC-01-01` | `REQ-001` / `ACC-01` | Valid actor, valid fixtures; carry out: Sign up and log in with mobile OTP (WhatsApp first, SMS fallback). | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-01-02` | `REQ-001` / `ACC-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-01-03` | `REQ-001` / `ACC-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ACC-02-01` | `REQ-002` / `ACC-02` | Valid actor, valid fixtures; carry out: Profile: name, email, phone. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-02-02` | `REQ-002` / `ACC-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-02-03` | `REQ-002` / `ACC-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ACC-03-01` | `REQ-003` / `ACC-03` | Valid actor, valid fixtures; carry out: Saved addresses with map pin; serviceability checked when the address is entered. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-03-02` | `REQ-003` / `ACC-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-03-03` | `REQ-003` / `ACC-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ACC-04-01` | `REQ-004` / `ACC-04` | Valid actor, valid fixtures; carry out: Family profiles for dependents (name, age, relation). | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-04-02` | `REQ-004` / `ACC-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-04-03` | `REQ-004` / `ACC-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ACC-05-01` | `REQ-005` / `ACC-05` | Valid actor, valid fixtures; carry out: Privacy notice and consent at signup. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-05-02` | `REQ-005` / `ACC-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-05-03` | `REQ-005` / `ACC-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ACC-06-01` | `REQ-006` / `ACC-06` | Valid actor, valid fixtures; carry out: Account deletion request. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-06-02` | `REQ-006` / `ACC-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-06-03` | `REQ-006` / `ACC-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ACC-07-01` | `REQ-007` / `ACC-07` | Valid actor, valid fixtures; carry out: Wishlist. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ACC-07-02` | `REQ-007` / `ACC-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ACC-07-03` | `REQ-007` / `ACC-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Customer Orders

## Order tracking and aftercare — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-ORD-01-01` | `REQ-027` / `ORD-01` | Valid actor, valid fixtures; carry out: Order confirmation on screen, WhatsApp and email. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-01-02` | `REQ-027` / `ORD-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-01-03` | `REQ-027` / `ORD-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-02-01` | `REQ-028` / `ORD-02` | Valid actor, valid fixtures; carry out: Status timeline (placed → packed → out for delivery → delivered). | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-02-02` | `REQ-028` / `ORD-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-02-03` | `REQ-028` / `ORD-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-03-01` | `REQ-029` / `ORD-03` | Valid actor, valid fixtures; carry out: Order history with GST invoice download. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-03-02` | `REQ-029` / `ORD-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-03-03` | `REQ-029` / `ORD-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-04-01` | `REQ-030` / `ORD-04` | Valid actor, valid fixtures; carry out: Cancel before the order is packed. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-04-02` | `REQ-030` / `ORD-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-04-03` | `REQ-030` / `ORD-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-05-01` | `REQ-031` / `ORD-05` | Valid actor, valid fixtures; carry out: Return request within the return window. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-05-02` | `REQ-031` / `ORD-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-05-03` | `REQ-031` / `ORD-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-06-01` | `REQ-032` / `ORD-06` | Valid actor, valid fixtures; carry out: Refund status for cancelled and returned orders. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-06-02` | `REQ-032` / `ORD-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-06-03` | `REQ-032` / `ORD-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-07-01` | `REQ-033` / `ORD-07` | Valid actor, valid fixtures; carry out: Live rider location on a map, estimated arrival, masked call button. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-07-02` | `REQ-033` / `ORD-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-07-03` | `REQ-033` / `ORD-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-08-01` | `REQ-034` / `ORD-08` | Valid actor, valid fixtures; carry out: Delivery OTP shown to the customer. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-08-02` | `REQ-034` / `ORD-08` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-08-03` | `REQ-034` / `ORD-08` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-ORD-09-01` | `REQ-035` / `ORD-09` | Valid actor, valid fixtures; carry out: Change items or address after placing an order. | Correct scoped result; durable state and audit consistent | High |
| `TEST-ORD-09-02` | `REQ-035` / `ORD-09` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-ORD-09-03` | `REQ-035` / `ORD-09` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Delivery Operations

## Delivery planning, route and proof — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-DLV-01-01` | `REQ-074` / `DLV-01` | Valid actor, valid fixtures; carry out: Live map of riders (available, on delivery, offline) and orders ready for pickup. | Correct scoped result; durable state and audit consistent | High |
| `TEST-DLV-01-02` | `REQ-074` / `DLV-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-DLV-01-03` | `REQ-074` / `DLV-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-DLV-02-01` | `REQ-075` / `DLV-02` | Valid actor, valid fixtures; carry out: Suggest the nearest available rider; staff confirm or choose another. | Correct scoped result; durable state and audit consistent | High |
| `TEST-DLV-02-02` | `REQ-075` / `DLV-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-DLV-02-03` | `REQ-075` / `DLV-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-DLV-03-01` | `REQ-076` / `DLV-03` | Valid actor, valid fixtures; carry out: Failed-delivery queue: reattempt, reschedule or return to store. | Correct scoped result; durable state and audit consistent | High |
| `TEST-DLV-03-02` | `REQ-076` / `DLV-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-DLV-03-03` | `REQ-076` / `DLV-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-DLV-04-01` | `REQ-077` / `DLV-04` | Valid actor, valid fixtures; carry out: COD handover: cash collected vs deposited per rider per day. | Correct scoped result; durable state and audit consistent | High |
| `TEST-DLV-04-02` | `REQ-077` / `DLV-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-DLV-04-03` | `REQ-077` / `DLV-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-DLV-05-01` | `REQ-078` / `DLV-05` | Valid actor, valid fixtures; carry out: Rider management: onboard, assign location, shifts. | Correct scoped result; durable state and audit consistent | High |
| `TEST-DLV-05-02` | `REQ-078` / `DLV-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-DLV-05-03` | `REQ-078` / `DLV-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Finance Payments

## Payment truth, refunds and invoice evidence — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-FIN-01-01` | `REQ-086` / `FIN-01` | Valid actor, valid fixtures; carry out: Payment records from Cashfree webhooks and COD collections. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-01-02` | `REQ-086` / `FIN-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-01-03` | `REQ-086` / `FIN-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-FIN-02-01` | `REQ-087` / `FIN-02` | Valid actor, valid fixtures; carry out: GST invoice per order, from the right GSTIN. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-02-02` | `REQ-087` / `FIN-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-02-03` | `REQ-087` / `FIN-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-FIN-03-01` | `REQ-088` / `FIN-03` | Valid actor, valid fixtures; carry out: Automatic refunds; manual refunds need approval above a set amount. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-03-02` | `REQ-088` / `FIN-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-03-03` | `REQ-088` / `FIN-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-FIN-04-01` | `REQ-089` / `FIN-04` | Valid actor, valid fixtures; carry out: COD refunds by bank transfer or UPI. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-04-02` | `REQ-089` / `FIN-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-04-03` | `REQ-089` / `FIN-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-FIN-05-01` | `REQ-090` / `FIN-05` | Valid actor, valid fixtures; carry out: Daily reconciliation: Cashfree settlements vs orders. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-05-02` | `REQ-090` / `FIN-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-05-03` | `REQ-090` / `FIN-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-FIN-06-01` | `REQ-091` / `FIN-06` | Valid actor, valid fixtures; carry out: COD reconciliation: collected vs deposited. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-06-02` | `REQ-091` / `FIN-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-06-03` | `REQ-091` / `FIN-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-FIN-07-01` | `REQ-092` / `FIN-07` | Valid actor, valid fixtures; carry out: Credit notes for refunds and returns. | Correct scoped result; durable state and audit consistent | High |
| `TEST-FIN-07-02` | `REQ-092` / `FIN-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-FIN-07-03` | `REQ-092` / `FIN-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Inventory

## Lot-aware inventory and reservation — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-INV-01-01` | `REQ-057` / `INV-01` | Valid actor, valid fixtures; carry out: Stock per location and batch, with manufacturing and expiry dates. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-01-02` | `REQ-057` / `INV-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-01-03` | `REQ-057` / `INV-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-INV-02-01` | `REQ-058` / `INV-02` | Valid actor, valid fixtures; carry out: Stock ledger: every movement recorded; stock is the sum of the ledger. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-02-02` | `REQ-058` / `INV-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-02-03` | `REQ-058` / `INV-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-INV-03-01` | `REQ-059` / `INV-03` | Valid actor, valid fixtures; carry out: Allocate nearest-expiry batch first; block batches below minimum shelf life. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-03-02` | `REQ-059` / `INV-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-03-03` | `REQ-059` / `INV-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-INV-04-01` | `REQ-060` / `INV-04` | Valid actor, valid fixtures; carry out: Stock adjustments with reason; manager approval above a threshold. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-04-02` | `REQ-060` / `INV-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-04-03` | `REQ-060` / `INV-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-INV-05-01` | `REQ-061` / `INV-05` | Valid actor, valid fixtures; carry out: Low-stock and near-expiry alerts. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-05-02` | `REQ-061` / `INV-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-05-03` | `REQ-061` / `INV-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-INV-06-01` | `REQ-062` / `INV-06` | Valid actor, valid fixtures; carry out: Opening stock import per location. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-06-02` | `REQ-062` / `INV-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-06-03` | `REQ-062` / `INV-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-INV-07-01` | `REQ-063` / `INV-07` | Valid actor, valid fixtures; carry out: Stock sync with Techsmith. | Correct scoped result; durable state and audit consistent | High |
| `TEST-INV-07-02` | `REQ-063` / `INV-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-INV-07-03` | `REQ-063` / `INV-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Notifications

## Transactional customer/staff messaging — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-NOT-01-01` | `REQ-106` / `NOT-01` | Valid actor, valid fixtures; carry out: One notification service: templates, WhatsApp first, SMS fallback, email. | Correct scoped result; durable state and audit consistent | High |
| `TEST-NOT-01-02` | `REQ-106` / `NOT-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-NOT-01-03` | `REQ-106` / `NOT-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-NOT-02-01` | `REQ-107` / `NOT-02` | Valid actor, valid fixtures; carry out: Delivery log with retries. | Correct scoped result; durable state and audit consistent | High |
| `TEST-NOT-02-02` | `REQ-107` / `NOT-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-NOT-02-03` | `REQ-107` / `NOT-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-NOT-03-01` | `REQ-108` / `NOT-03` | Valid actor, valid fixtures; carry out: Rider push notifications (FCM). | Correct scoped result; durable state and audit consistent | High |
| `TEST-NOT-03-02` | `REQ-108` / `NOT-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-NOT-03-03` | `REQ-108` / `NOT-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-NOT-04-01` | `REQ-109` / `NOT-04` | Valid actor, valid fixtures; carry out: Staff alerts in the admin panel. | Correct scoped result; durable state and audit consistent | High |
| `TEST-NOT-04-02` | `REQ-109` / `NOT-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-NOT-04-03` | `REQ-109` / `NOT-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-NOT-05-01` | `REQ-110` / `NOT-05` | Valid actor, valid fixtures; carry out: Customer browser push notifications. | Correct scoped result; durable state and audit consistent | High |
| `TEST-NOT-05-02` | `REQ-110` / `NOT-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-NOT-05-03` | `REQ-110` / `NOT-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Order Operations

## Order orchestration and routing — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-OMS-01-01` | `REQ-045` / `OMS-01` | Valid actor, valid fixtures; carry out: Order list with filters (status, location, date, payment, Rx) and search by order number or phone. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-01-02` | `REQ-045` / `OMS-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-01-03` | `REQ-045` / `OMS-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-OMS-02-01` | `REQ-046` / `OMS-02` | Valid actor, valid fixtures; carry out: Order detail: items, batches, prescription, payment, delivery, full history. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-02-02` | `REQ-046` / `OMS-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-02-03` | `REQ-046` / `OMS-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-OMS-03-01` | `REQ-047` / `OMS-03` | Valid actor, valid fixtures; carry out: Automatic routing to the nearest open store with every item; warehouse as fallback. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-03-02` | `REQ-047` / `OMS-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-03-03` | `REQ-047` / `OMS-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-OMS-04-01` | `REQ-048` / `OMS-04` | Valid actor, valid fixtures; carry out: Reassign an order to another location, with a reason. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-04-02` | `REQ-048` / `OMS-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-04-03` | `REQ-048` / `OMS-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-OMS-05-01` | `REQ-049` / `OMS-05` | Valid actor, valid fixtures; carry out: Cancel, partly fulfil, raise return, add internal note. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-05-02` | `REQ-049` / `OMS-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-05-03` | `REQ-049` / `OMS-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-OMS-06-01` | `REQ-050` / `OMS-06` | Valid actor, valid fixtures; carry out: Attention queue: payment pending, stuck orders, failed deliveries. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-06-02` | `REQ-050` / `OMS-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-06-03` | `REQ-050` / `OMS-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-OMS-07-01` | `REQ-051` / `OMS-07` | Valid actor, valid fixtures; carry out: Assisted order entry for phone orders. | Correct scoped result; durable state and audit consistent | High |
| `TEST-OMS-07-02` | `REQ-051` / `OMS-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-OMS-07-03` | `REQ-051` / `OMS-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Pharmacist Review

## Clinical review for prescription items — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-PHM-01-01` | `REQ-069` / `PHM-01` | Valid actor, valid fixtures; carry out: Review queue, oldest first, with waiting time. | Correct scoped result; durable state and audit consistent | High |
| `TEST-PHM-01-02` | `REQ-069` / `PHM-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-PHM-01-03` | `REQ-069` / `PHM-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-PHM-02-01` | `REQ-070` / `PHM-02` | Valid actor, valid fixtures; carry out: Side-by-side view: zoomable prescription and order items. | Correct scoped result; durable state and audit consistent | High |
| `TEST-PHM-02-02` | `REQ-070` / `PHM-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-PHM-02-03` | `REQ-070` / `PHM-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-PHM-03-01` | `REQ-071` / `PHM-03` | Valid actor, valid fixtures; carry out: Approve all, approve some, or reject with a reason. | Correct scoped result; durable state and audit consistent | High |
| `TEST-PHM-03-02` | `REQ-071` / `PHM-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-PHM-03-03` | `REQ-071` / `PHM-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-PHM-04-01` | `REQ-072` / `PHM-04` | Valid actor, valid fixtures; carry out: Confirm a chosen alternative matches the prescription. | Correct scoped result; durable state and audit consistent | High |
| `TEST-PHM-04-02` | `REQ-072` / `PHM-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-PHM-04-03` | `REQ-072` / `PHM-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-PHM-05-01` | `REQ-073` / `PHM-05` | Valid actor, valid fixtures; carry out: Pharmacist name, registration number and time on every decision. | Correct scoped result; durable state and audit consistent | High |
| `TEST-PHM-05-02` | `REQ-073` / `PHM-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-PHM-05-03` | `REQ-073` / `PHM-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Prescription Upload

## Private prescription intake — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-RX-01-01` | `REQ-022` / `RX-01` | Valid actor, valid fixtures; carry out: Upload one or more prescriptions (JPG, PNG, PDF) at checkout. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RX-01-02` | `REQ-022` / `RX-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RX-01-03` | `REQ-022` / `RX-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RX-02-01` | `REQ-023` / `RX-02` | Valid actor, valid fixtures; carry out: Upload within 24 hours after ordering; auto-cancel after that. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RX-02-02` | `REQ-023` / `RX-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RX-02-03` | `REQ-023` / `RX-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RX-03-01` | `REQ-024` / `RX-03` | Valid actor, valid fixtures; carry out: Reuse a saved, still-valid prescription. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RX-03-02` | `REQ-024` / `RX-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RX-03-03` | `REQ-024` / `RX-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RX-04-01` | `REQ-025` / `RX-04` | Valid actor, valid fixtures; carry out: Link each prescription to the patient (self or family member). | Correct scoped result; durable state and audit consistent | High |
| `TEST-RX-04-02` | `REQ-025` / `RX-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RX-04-03` | `REQ-025` / `RX-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RX-05-01` | `REQ-026` / `RX-05` | Valid actor, valid fixtures; carry out: See the pharmacist's decision and reason; re-upload after rejection. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RX-05-02` | `REQ-026` / `RX-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RX-05-03` | `REQ-026` / `RX-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Product Catalog

## Product discovery and classification — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-CAT-01-01` | `REQ-008` / `CAT-01` | Valid actor, valid fixtures; carry out: Browse by category and sub-category. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CAT-01-02` | `REQ-008` / `CAT-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CAT-01-03` | `REQ-008` / `CAT-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CAT-02-01` | `REQ-009` / `CAT-02` | Valid actor, valid fixtures; carry out: Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CAT-02-02` | `REQ-009` / `CAT-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CAT-02-03` | `REQ-009` / `CAT-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CAT-03-01` | `REQ-010` / `CAT-03` | Valid actor, valid fixtures; carry out: Search by name, brand and composition, with typo tolerance and autosuggest. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CAT-03-02` | `REQ-010` / `CAT-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CAT-03-03` | `REQ-010` / `CAT-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CAT-04-01` | `REQ-011` / `CAT-04` | Valid actor, valid fixtures; carry out: Availability for the customer's pin code (in stock / out of stock). | Correct scoped result; durable state and audit consistent | High |
| `TEST-CAT-04-02` | `REQ-011` / `CAT-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CAT-04-03` | `REQ-011` / `CAT-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CAT-05-01` | `REQ-012` / `CAT-05` | Valid actor, valid fixtures; carry out: Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CAT-05-02` | `REQ-012` / `CAT-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CAT-05-03` | `REQ-012` / `CAT-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-CAT-06-01` | `REQ-013` / `CAT-06` | Valid actor, valid fixtures; carry out: Placeholder image when a product has none. | Correct scoped result; durable state and audit consistent | High |
| `TEST-CAT-06-02` | `REQ-013` / `CAT-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-CAT-06-03` | `REQ-013` / `CAT-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Reporting

## Scoped operations and financial reports — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-REP-01-01` | `REQ-093` / `REP-01` | Valid actor, valid fixtures; carry out: Sales and orders, by date, store and product. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-01-02` | `REQ-093` / `REP-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-01-03` | `REQ-093` / `REP-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-REP-02-01` | `REQ-094` / `REP-02` | Valid actor, valid fixtures; carry out: GST report for filing. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-02-02` | `REQ-094` / `REP-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-02-03` | `REQ-094` / `REP-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-REP-03-01` | `REQ-095` / `REP-03` | Valid actor, valid fixtures; carry out: Stock, low stock and near-expiry. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-03-02` | `REQ-095` / `REP-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-03-03` | `REQ-095` / `REP-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-REP-04-01` | `REQ-096` / `REP-04` | Valid actor, valid fixtures; carry out: COD, rider collections and deliveries per rider. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-04-02` | `REQ-096` / `REP-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-04-03` | `REQ-096` / `REP-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-REP-05-01` | `REQ-097` / `REP-05` | Valid actor, valid fixtures; carry out: Refunds, cancellations and failed deliveries. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-05-02` | `REQ-097` / `REP-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-05-03` | `REQ-097` / `REP-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-REP-06-01` | `REQ-098` / `REP-06` | Valid actor, valid fixtures; carry out: Replenishment transfers. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-06-02` | `REQ-098` / `REP-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-06-03` | `REQ-098` / `REP-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-REP-07-01` | `REQ-099` / `REP-07` | Valid actor, valid fixtures; carry out: Excel export for every report. | Correct scoped result; durable state and audit consistent | High |
| `TEST-REP-07-02` | `REQ-099` / `REP-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-REP-07-03` | `REQ-099` / `REP-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Rider App

## Rider shifts and delivery actions — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-RID-01-01` | `REQ-079` / `RID-01` | Valid actor, valid fixtures; carry out: OTP login; on duty, off duty and break. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-01-02` | `REQ-079` / `RID-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-01-03` | `REQ-079` / `RID-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RID-02-01` | `REQ-080` / `RID-02` | Valid actor, valid fixtures; carry out: Task list; accept; open Google Maps to navigate; mark picked up. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-02-02` | `REQ-080` / `RID-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-02-03` | `REQ-080` / `RID-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RID-03-01` | `REQ-081` / `RID-03` | Valid actor, valid fixtures; carry out: Background location: every 5–10 s on delivery, 15–30 s idle. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-03-02` | `REQ-081` / `RID-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-03-03` | `REQ-081` / `RID-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RID-04-01` | `REQ-082` / `RID-04` | Valid actor, valid fixtures; carry out: Complete delivery with customer OTP and photo; record COD collected. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-04-02` | `REQ-082` / `RID-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-04-03` | `REQ-082` / `RID-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RID-05-01` | `REQ-083` / `RID-05` | Valid actor, valid fixtures; carry out: Door checks for prescription medicines. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-05-02` | `REQ-083` / `RID-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-05-03` | `REQ-083` / `RID-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RID-06-01` | `REQ-084` / `RID-06` | Valid actor, valid fixtures; carry out: Failed attempt with a reason from a fixed list. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-06-02` | `REQ-084` / `RID-06` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-06-03` | `REQ-084` / `RID-06` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-RID-07-01` | `REQ-085` / `RID-07` | Valid actor, valid fixtures; carry out: Daily deliveries and incentive earned. | Correct scoped result; durable state and audit consistent | High |
| `TEST-RID-07-02` | `REQ-085` / `RID-07` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-RID-07-03` | `REQ-085` / `RID-07` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Store Operations

## Picking, packing and store replenishment — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-STO-01-01` | `REQ-052` / `STO-01` | Valid actor, valid fixtures; carry out: Incoming order queue for my store, with sound alert. | Correct scoped result; durable state and audit consistent | High |
| `TEST-STO-01-02` | `REQ-052` / `STO-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-STO-01-03` | `REQ-052` / `STO-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-STO-02-01` | `REQ-053` / `STO-02` | Valid actor, valid fixtures; carry out: Accept order, pick list, mark packed, hand over to rider. | Correct scoped result; durable state and audit consistent | High |
| `TEST-STO-02-02` | `REQ-053` / `STO-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-STO-02-03` | `REQ-053` / `STO-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-STO-03-01` | `REQ-054` / `STO-03` | Valid actor, valid fixtures; carry out: Raise replenishment request (normal or urgent). | Correct scoped result; durable state and audit consistent | High |
| `TEST-STO-03-02` | `REQ-054` / `STO-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-STO-03-03` | `REQ-054` / `STO-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-STO-04-01` | `REQ-055` / `STO-04` | Valid actor, valid fixtures; carry out: Confirm receipt of a transfer; record shortages. | Correct scoped result; durable state and audit consistent | High |
| `TEST-STO-04-02` | `REQ-055` / `STO-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-STO-04-03` | `REQ-055` / `STO-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-STO-05-01` | `REQ-056` / `STO-05` | Valid actor, valid fixtures; carry out: My store's stock, with low-stock and near-expiry alerts. | Correct scoped result; durable state and audit consistent | High |
| `TEST-STO-05-02` | `REQ-056` / `STO-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-STO-05-03` | `REQ-056` / `STO-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.

## Warehouse

## Warehouse replenishment and transfers — proposed acceptance test scenarios

**None of these application tests has been executed.** Each test uses an isolated database and approved synthetic data; provider failures are simulated or exercised against a permitted sandbox.

| Test ID | Draft requirement | Preconditions / steps | Expected result | Priority |
| --- | --- | --- | --- | --- |
| `TEST-WH-01-01` | `REQ-064` / `WH-01` | Valid actor, valid fixtures; carry out: Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice. | Correct scoped result; durable state and audit consistent | High |
| `TEST-WH-01-02` | `REQ-064` / `WH-01` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-WH-01-03` | `REQ-064` / `WH-01` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-WH-02-01` | `REQ-065` / `WH-02` | Valid actor, valid fixtures; carry out: Replenishment queue: approve, dispatch with note, stock "in transit". | Correct scoped result; durable state and audit consistent | High |
| `TEST-WH-02-02` | `REQ-065` / `WH-02` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-WH-02-03` | `REQ-065` / `WH-02` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-WH-03-01` | `REQ-066` / `WH-03` | Valid actor, valid fixtures; carry out: Urgent runs, up to two extra a day. | Correct scoped result; durable state and audit consistent | High |
| `TEST-WH-03-02` | `REQ-066` / `WH-03` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-WH-03-03` | `REQ-066` / `WH-03` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-WH-04-01` | `REQ-067` / `WH-04` | Valid actor, valid fixtures; carry out: Pick, pack and dispatch fallback online orders. | Correct scoped result; durable state and audit consistent | High |
| `TEST-WH-04-02` | `REQ-067` / `WH-04` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-WH-04-03` | `REQ-067` / `WH-04` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |
| `TEST-WH-05-01` | `REQ-068` / `WH-05` | Valid actor, valid fixtures; carry out: Basic stock audit. | Correct scoped result; durable state and audit consistent | High |
| `TEST-WH-05-02` | `REQ-068` / `WH-05` | Bad input, expired session or cross-scope resource; repeat request. | Validation/permission denial; no unauthorized row changes | High |
| `TEST-WH-05-03` | `REQ-068` / `WH-05` | Concurrent requests, stale version, provider timeout if relevant. | One authoritative transition or controlled recoverable state; no duplicates | High |

Module LLD · Original requirement links.
