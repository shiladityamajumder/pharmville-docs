# Testing strategy

## Recorded DB validation versus unexecuted application tests

**Recorded database evidence:** isolated PostgreSQL server `180001`, {'tests': 108, 'failures': 0, 'errors': 0, 'skipped': 0} pytest summary (see source final acceptance report), 10-concurrent-checkout last-unit test, restore and schema parity checks. These historical reports are evidence supplied by the user, not a fresh execution of those tests.

**Not executed here:** Next.js/NestJS tests, real provider callbacks, hardware rider proof, production restore, hosted CI, PG15 matrix, penetration testing, signed UAT. The database repository does not contain an HTTP application.

**Planned coverage:** all 110 draft features have specific normal/adverse assertions in module LLD and Edge-Cases pages. Existing detailed ACC-01/ACC-02 test IDs remain authoritative. These are designed tests, not application execution evidence; mark every case NOT RUN until a harness, fixture/policy version and result are attached.

Module test cases · DB schema/release policy

## Migration and SQL validation plan

Use `npm run validate:database` and `python3 scripts/validate-database.py --fresh` against newly initialized private PostgreSQL 18.6 only. Verify full catalog parity, all 268 empty tables, constraints, crosswalks, capability roles, grants and RLS. Legacy ORM/runner tests are archived historical evidence. A future populated-database upgrade and earlier-engine compatibility need a separate approved test design.

Exercise all existing PK/FK/UNIQUE/CHECK/index/trigger/RLS semantics through their canonical service operations.

Priority races: ten parallel last-unit checkouts yield one allocation; concurrent revised consent vs pharmacist approval; conflicting inventory site holds; simultaneous refunds and webhook replay; stale staff pack commands after license expiry. For each, check exact state and immutable money/clinical/audit effects, not just HTTP status.

The supplied report records local 108/108 tests pass and a catalog diff count of zero on PostgreSQL `180001`, but no new DB container is run in this documentation build. Verify hosted CI, real production-like restore and measured latency separately before release. See Source Acceptance.

## End-to-end customer, staff and rider scenarios

Execute customer browse → cart → address/patient → Rx conditional branch → accepted quote → signed payment or eligible COD → single-site stock reservation → pick/pack → rider assignment → OTP proof → invoice/status. For P+M+O, reject one P line, confirm unchanged M/O remain, require explicit customer consent to new total before charge, then verify only approved P items can enter package.

Also cover guest vs authenticated customer, expired OTP/session mid-checkout, refresh after order submit, store closed/no safe lot, no provider response, last-unit collision, manual reassignment, delivery refusal/reattempt, uncollected vs deposited COD, return/refund and customer support escalation. Test error copy and keyboard/mobile forms as well as side effects.

Do not assume UI screenshot screens demonstrate backend readiness. Require traced API request IDs, database revisions and actor-scoped audit records for each successful/failed route. Rider Android build/distribution decision remains open; test plan should be upgraded after tech selection.

## API and provider integration verification

Boot the proposed NestJS API against a disposable database installed from the canonical standalone SQL, with independently reviewed synthetic fixtures. Validate exact DTOs, object authorization, transactions, provider signatures, late/duplicate callbacks, outbox/inbox ordering and application-to-SQL contract parity. Public UUIDs remain separate from BIGINT crosswalk keys. These application/provider tests are designed, not executed by this rework.

Cashfree sandbox tests must cover pending/failed/success, signature and raw-body validation, replay and reconciliation. Techsmith must demonstrate authoritative location-lot observation and loss/reconnect handling; simulate stale stock before allowing reservations.

MSG91/SES should receive only approved redacted notification templates; Rx file adapter should scan, store privately and reauthorize access. Rider/GPS app must handle offline and duplicate OTP evidence.

A sandbox success does not guarantee a production provider account or pharmacy policy; approvals and real operating SOP remain separate gates. See Provider Dependencies.

## Performance and concurrency benchmarks

Measure representative catalogue/search reads, customer order list p95, prescription queue age, stock hold/update contention, settlement/webhook backlog, rider position ingest load, mass exports and API response under realistic input sizes. Measure PostgreSQL query plans, lock wait, deadlocks, buffer hits, worker lag and real user experience separately.

The supplied database performance appendix records synthetic tests on 19 query shapes and a 50,000-row BIGINT/UUID comparison. It is useful engineering evidence, not a production demand forecast or proof of 99.9% service availability. Sizing and response targets in the checklists/HLD require owner review and independent staging load validation.

Target failure tests include Cashfree slow status callback, Techsmith feed gap, Redis job backlog, Rx scan outage and last-unit checkout storm. Correctness must be preserved even when latency increases. No test should infer successful charge/delivery from a timeout or stale cache. See Scalability.

## Proposed QA and test case register

**110 feature specifications** across 18 modules plus 14 cross-module workflow plans. Generic TEST-<feature>-01/-02/-03 prompts are superseded by the corresponding TC-<feature>-OK/-DENY cases and the detailed numbered ACC-01/ACC-02 cases; they are not an additional executed suite.

No application tests were run. The supplied DB repo separately records 108/108 PG18 database tests.

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

## Security test approach

Run authenticated IDOR probes across customer/patient/order/Rx, unauthorized pharmacy decisions, staff cross-store operations, rider task/GPS snooping, refund threshold bypass and report/export leaks. Confirm sensitive file access requires download-time reauthorization and cannot be guessed from public UUID or long-lived object URL.

Verify OTP session replay/lockout, privileged TOTP/rotation, logout invalidation, provider webhook spoof and duplicate event, API rate limiting, injection/HTML sanitization in CMS/search, SSRF/file upload type/malware checks and secret redaction. Exercise restricted DB capability roles and default denied SQL, not a migration-owner runtime connection.

A passed local DB RLS suite supports defense-in-depth but does not prove the client/API/cloud are secure. Threat-model signoff, penetration testing in staging and legal privacy approval are production gates. See Threat Model.

## Quality strategy and evidence levels

A database-only test is not a delivered customer journey. Test the stack in layers: domain/DTO unit tests, PostgreSQL schema and concurrency tests, API and provider sandbox integration tests, browser/rider end-to-end journeys, privacy/security tests, representative performance tests, owner UAT and operational recovery drills.

The database acceptance report records 108 independently run PostgreSQL 18 local tests passed and zero SQL↔model parity differences, but no implemented NestJS endpoints, Cashfree adapter, production POS sync, rider app or deployed file-signing service. Therefore **application test completion is zero proven by these files**, not 108. Never inherit DB PASS as full-product readiness.

Prioritize all seven nonempty P/M/O basket combinations; wrong-patient/version approval; mixed rejected P with customer consent; last unit contention; stale inventory; paid-but-out-of-stock recovery; duplicate payment/refund/COD callback; license expiration; unauthorized customer/staff/rider access; evidence-based delivery and private export download.

Assign stable `TC-{feature ID}-OK/DENY` cases from LLD and attach actual run reports before calling a feature complete. See Acceptance Criteria, Coverage.

## User acceptance testing (UAT)

Business owners should witness, not merely read about: all seven P/M/O basket types; exact pharmacist outcomes on multiple P lines; changed basket requiring consent; single-site stock and last-pack conflict; Cashfree pending and COD acceptance; manual store queue; warehouse transfer/fallback; rider GPS/OTP and failed delivery; refund and daily COD reconciliation; private file/export permission denial.

Use the journey v3 source's 34 stages and documented exception cases as walkthroughs. The source LLD describes 31 acceptance tests, but their results are not present in this documentation bundle; don't count them as passed. Attach Jira ticket, test evidence, actor/location, order revision, provider event ID redacted, expected/actual result and named owner signoff.

No go-live without approved clinical SOP and pharmacist/legal evidence, warehouse opening stock data, POS authority, tax/return policies, configured templates and production account ownership. See Acceptance Gates and Decisions.

## Unit tests per domain

Use isolated unit tests for P/M/O classification selection, quote/version confirmation, checkout state guards, single-site routing policy, VAT/GST input validation (not legal correctness), lot expiry conditions, session policy, permission predicates, OTP retry windows, refund idempotency keys, event deduplication and customer-safe state projection.

Mock I/O at service boundaries, not database behavior you should trust to PostgreSQL. A unit test for stock eligibility should cover unknown/expired observation and mixed P approval, but must be paired with a real database lock and foreign-key test. Finance unit tests need duplicate and out-of-order event cases; never make a fake provider result look like verified bank settlement.

Module sections enumerate three scenario prompts per draft feature ID and cross-module negative controls. Concrete fixtures, actions and assertions remain D-024 work. Use fixture-only synthetic customers/prescriptions; don't import sensitive legal identity documents or production data.

## Feature test navigation

The [master register](../09-References/Coverage-and-Traceability.md) owns feature-to-document navigation. Normal assertions live in each LLD; adverse triggers, record effects and recovery owners live in its Edge-Cases page. Avoid copying those assertions into this shared strategy.

| Module | Normal/implementation tests | Adverse cases |
| --- | --- | --- |
| Admin CMS (`ADM-01`, `ADM-02`, `ADM-03`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `ADM-09`) | [LLD](../03-Modules/Admin_CMS/LLD.md) | [Edge cases](../03-Modules/Admin_CMS/Edge-Cases.md) |
| Audit (`AUD-01`, `AUD-02`) | [LLD](../03-Modules/Audit/LLD.md) | [Edge cases](../03-Modules/Audit/Edge-Cases.md) |
| Authentication Access (`AUTH-01`, `AUTH-02`, `AUTH-03`, `AUTH-04`) | [LLD](../03-Modules/Authentication_Access/LLD.md) | [Edge cases](../03-Modules/Authentication_Access/Edge-Cases.md) |
| Cart Checkout (`CHK-01`, `CHK-02`, `CHK-03`, `CHK-04`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08`) | [LLD](../03-Modules/Cart_Checkout/LLD.md) | [Edge cases](../03-Modules/Cart_Checkout/Edge-Cases.md) |
| Customer Accounts (`ACC-01`, `ACC-02`, `ACC-03`, `ACC-04`, `ACC-05`, `ACC-06`, `ACC-07`) | [LLD](../03-Modules/Customer_Accounts/LLD.md) | [Edge cases](../03-Modules/Customer_Accounts/Edge-Cases.md) |
| Customer Orders (`ORD-01`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-07`, `ORD-08`, `ORD-09`) | [LLD](../03-Modules/Customer_Orders/LLD.md) | [Edge cases](../03-Modules/Customer_Orders/Edge-Cases.md) |
| Delivery Operations (`DLV-01`, `DLV-02`, `DLV-03`, `DLV-04`, `DLV-05`) | [LLD](../03-Modules/Delivery_Operations/LLD.md) | [Edge cases](../03-Modules/Delivery_Operations/Edge-Cases.md) |
| Finance Payments (`FIN-01`, `FIN-02`, `FIN-03`, `FIN-04`, `FIN-05`, `FIN-06`, `FIN-07`) | [LLD](../03-Modules/Finance_Payments/LLD.md) | [Edge cases](../03-Modules/Finance_Payments/Edge-Cases.md) |
| Inventory (`INV-01`, `INV-02`, `INV-03`, `INV-04`, `INV-05`, `INV-06`, `INV-07`) | [LLD](../03-Modules/Inventory/LLD.md) | [Edge cases](../03-Modules/Inventory/Edge-Cases.md) |
| Notifications (`NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `NOT-05`) | [LLD](../03-Modules/Notifications/LLD.md) | [Edge cases](../03-Modules/Notifications/Edge-Cases.md) |
| Order Operations (`OMS-01`, `OMS-02`, `OMS-03`, `OMS-04`, `OMS-05`, `OMS-06`, `OMS-07`) | [LLD](../03-Modules/Order_Operations/LLD.md) | [Edge cases](../03-Modules/Order_Operations/Edge-Cases.md) |
| Pharmacist Review (`PHM-01`, `PHM-02`, `PHM-03`, `PHM-04`, `PHM-05`) | [LLD](../03-Modules/Pharmacist_Review/LLD.md) | [Edge cases](../03-Modules/Pharmacist_Review/Edge-Cases.md) |
| Prescription Upload (`RX-01`, `RX-02`, `RX-03`, `RX-04`, `RX-05`) | [LLD](../03-Modules/Prescription_Upload/LLD.md) | [Edge cases](../03-Modules/Prescription_Upload/Edge-Cases.md) |
| Product Catalog (`CAT-01`, `CAT-02`, `CAT-03`, `CAT-04`, `CAT-05`, `CAT-06`) | [LLD](../03-Modules/Product_Catalog/LLD.md) | [Edge cases](../03-Modules/Product_Catalog/Edge-Cases.md) |
| Reporting (`REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-05`, `REP-06`, `REP-07`) | [LLD](../03-Modules/Reporting/LLD.md) | [Edge cases](../03-Modules/Reporting/Edge-Cases.md) |
| Rider App (`RID-01`, `RID-02`, `RID-03`, `RID-04`, `RID-05`, `RID-06`, `RID-07`) | [LLD](../03-Modules/Rider_App/LLD.md) | [Edge cases](../03-Modules/Rider_App/Edge-Cases.md) |
| Store Operations (`STO-01`, `STO-02`, `STO-03`, `STO-04`, `STO-05`) | [LLD](../03-Modules/Store_Operations/LLD.md) | [Edge cases](../03-Modules/Store_Operations/Edge-Cases.md) |
| Warehouse (`WH-01`, `WH-02`, `WH-03`, `WH-04`, `WH-05`) | [LLD](../03-Modules/Warehouse/LLD.md) | [Edge cases](../03-Modules/Warehouse/Edge-Cases.md) |

## Interrupted-workflow checks

Use [state and recovery contracts](State-and-Recovery-Contracts.md) for commit/rollback, replay, stale-version and compensation expectations. Kill a worker before commit and after commit/before acknowledgment; verify one effect, recoverable queued work and honest customer status.

Last-unit, review-versus-revision, cancellation-versus-packing, duplicate-refund and COD-shortage tests need real restricted-role database fixtures.

## Unified Identity acceptance slice — Designed / NOT RUN

Use the endpoint-specific CT-API scenarios in [Authentication](../03-Modules/Authentication_Access/APIs.md), [Customer adapters](../03-Modules/Customer_Accounts/APIs.md) and [Admin](../03-Modules/Admin_CMS/APIs.md), traced to AUTH-01–04, ACC-01/02 and ADM-02/03. Cover: uniform unknown-identifier responses; Customer/Rider OTP and required privileged MFA; multi-role/site selection without scope union; challenge/factor/refresh replay; context ETags and stale tabs; membership/role/account revocation under commit ordering; missing-workspace fallback; scoped offboarding without global identity suspension; conditional global authority for API-034 status; locked/suspended recovery and factor replacement without MFA bypass; first-profile dependency with no fabricated name. Verify audit redaction and provider fallback. Application/security/provider results remain unexecuted.

[Current evidence](../09-References/Unified-Authentication-Validation.md) records only actual isolated SQL/constraint, schema/example and documentation validations. The absent optional formal OpenAPI validator is not reported as passed; historical meta-schema results do not cover D-028.
