# API contracts

[Business Guide](../00-Business-Guide/README.md) · [critical operation schemas](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md)

## Proposed API contracts

**Proposed API catalog:** the historical identifiers run from API-001 through API-097. No application server routes were available for verification. Many operation schemas remain incomplete; use the readiness notes and feature register before implementation.

### Module API documents

| Domain | Contracts | Domain | Contracts |
| --- | --- | --- | --- |
| Customer accounts | [Accounts](Customer_Accounts.md) | Access | [Authentication](Authentication_Access.md) |
| Catalog | [Products](Product_Catalog.md) | Checkout | [Cart and quote](Cart_Checkout.md) |
| Prescriptions | [Intake](Prescription_Upload.md) | Pharmacy | [Review](Pharmacist_Review.md) |
| Customer orders | [Order experience](Customer_Orders.md) | Operations | [Order commands](Order_Operations.md) |
| Store | [Store work](Store_Operations.md) | Warehouse | [Receiving and transfers](Warehouse.md) |
| Inventory | [Stock and holds](Inventory.md) | Delivery | [Dispatch](Delivery_Operations.md) |
| Rider | [Rider actions](Rider_App.md) | Finance | [Payments and refunds](Finance_Payments.md) |
| Administration | [CMS and settings](Admin_CMS.md) | Notifications | [Messages](Notifications.md) |
| Reporting | [Reports](Reporting.md) | Audit | [Evidence](Audit.md) |

[Measured feature reference gaps](../09-References/Coverage-and-Traceability.md#direct-api-reference-gaps-measured-by-owner)

## REST API contract index

**Design status:** Proposed endpoints only. The SQL/SQLAlchemy database repository is not an HTTP server. The master decisions checklist selects REST v1, NestJS, JWT/session and OpenAPI/Swagger; all routes here are application design requiring review and typed DTOs.

The original numbered range is API-001 through API-097. Most module sections identify intent and candidate data, but their operation schemas remain incomplete. Customer account routes are also described by route name; count actual operations rather than assuming the historical numbered count. The routes are grouped by one of the 18 functional feature modules. The [feature register](../09-References/Coverage-and-Traceability.md) records reference gaps and distinguishes navigation from contract readiness.

An API is implementation-ready when it has signed request/response examples, approved business decisions, mapped SQL persistence, object-level authorization, failure/error semantics and tests. A GET response must not expose financial/clinical fields merely because they are available via shared DB joins. Use public UUID entity references and server-resolved scope, not BIGINT PK as authorization. Contract upgrades remain backward compatible or versioned.

See API Conventions, Authentication, Events and External Providers.

## API design conventions

Prefix application APIs with `/v1`. Use resources (plural nouns), semantic HTTP methods, consistent public UUID placeholders, ISO-8601 timestamps and currency amounts as decimal strings or integer minor units under a clearly typed schema. Do not accept a client-provided internal DB row ID or a backend actor ID. URLs, casing, paginated response shapes and field names shown in example contracts are **Proposed**, not confirmed implementation.

Request processing: authenticate, authorize object/location/patient ownership, validate DTO and approved controlled master references, compare row/accepted revision version, execute one scoped domain transaction, record audit/outbox and return the filtered read model. Every mutation must specify idempotency, expected version and one consistent error envelope.

Avoid exposing P/M/O eligibility solely from a stale cached product card; exact classification and pharmacist evidence are revalidated at checkout and picking. Use `Idempotency-Key` with body fingerprint and actor/action scope for writes; retain result to replay safely. Webhook payloads need a raw-body signature and provider event ID, with inbox/outbox for duplicate/out-of-order handling.

Related Error Responses, Pagination and Authorization.

## REST contract and integration verification

Tests must use the actual authoritative SQL migration history and restricted runtime roles. Unit tests validate DTOs, P/M/O branch rules, order version invariants and provider adapter signature logic. HTTP integration tests exercise signed Cashfree success/pending/failure/replay, race between clinical approval and revision change, last safe stock contention, cross-identity IDOR attempts and unauthorized export/download.

Run contract tests for each proposed endpoint only after OpenAPI schemas are reviewed. Include path/input validation, permission scope, accepted version mismatch, idempotent repeat with same body, mismatched idempotency key reuse, timeout-after-commit and safe business response. A mock gateway does not establish production credential/signature correctness; qualify separately with sandbox and signed webhook replay.

The DB source reports 108 independent PG18 local tests passed; none automatically proves these proposed 97 HTTP contracts were tested, since no matching HTTP application is supplied. Track each executed case to a stable feature and test ID. See QA Strategy.

## API authentication mechanisms

The source checklist selects short-lived JWT access tokens (15 minutes) and rotating refresh tokens (30 days), with OTP for customers and routine staff; privileged Super Admin, Central Admin and Finance Manager use password + authenticator 2FA in the same checklist. The earlier blanket OTP-only sentence conflicts and requires D-003 approval. These are design decisions, not proof the service is implemented.

Authenticate customers and staff through separate policy paths. Treat session rotation, device revocation, lockout, account recovery and credential enrollment as auditable protected operations. Never log OTP codes or accept a JWT as proof that a given patient, clinic record, finance ledger or location is accessible; authorize each resource after authentication.

The database has roles/sessions/challenges/login attempts, and runtime NOLOGIN capability groups. A trusted backend transaction sets scoped context; browsers never select DB roles or send actor GUC values. Reject expired or replayed challenges with non-enumerating messages and enforce IP/account throttling.

See Authentication Flows and Roles.

## API authorization and object ownership

Authentication establishes identity; authorization checks whether that identity may perform an action on one concrete resource. Distinct scope dimensions in Pharmville include customer, dependent patient, staff role, store/warehouse, pharmacist authorization, delivery task, finance operation and export purpose.

Every controller must call a server-side policy before reading/writing protected data and before returning a signed file/report URL. Staff rights are checked against authoritative location membership and required action, never solely a user-provided warehouse ID. The database's restricted runtime capability roles and three recorded RLS policies add a defense layer but are not universal RLS across all 266 tables.

High-risk denial tests: customer A requesting customer B's order/Rx, Store Manager acting on another store, rider GPS access outside assigned task, pharmacist lacking approved authorization, Finance Executive bypassing refund approval, and reporting worker exporting raw clinical rows. Use privacy-safe 404 where revealing existence is a concern; write audit evidence without logging sensitive payloads.

See Security Permissions and API Test Design.

## Standard problem response behavior

Suggested response envelope: `{"error":{"code":"STALE_VERSION","message":"This order changed. Review it again.","retryable":false},"request_id":"<opaque>"}`. Errors never contain raw Rx, OTP, credential details, payment provider tokens or the existence of another customer's records.

| Status | Meaning | Safe user/worker action |
| --- | --- | --- |
| 400/422 | Invalid field, unsupported approved code or business requirement | Fix data, no write |
| 401 | Expired/revoked session | Sign in again |
| 403/404 | Insufficient scope or inaccessible resource | Deny; audit high-risk cases |
| 409 | Duplicate incompatible command, accepted revision changed, stock/site conflict | Refresh current state; no blind retry |
| 429 | Rate-limit applied | Use bounded backoff, no exposure of account existence |
| 502/503 | Provider/POS/storage evidence unavailable | Pending/manual reconciliation; no fake success |

Business denials (P-line rejected, license expired, stock stale, COD not eligible) need stable machine codes and helpful UI copy. Avoid unbounded retries; retries only for proven idempotent commands. See Reliability.

## Pagination, filtering and data-scoped sorting

Use cursor pagination for customer orders, staff queues, pharmacy review lists, audit history, stock lots and rider events. Cursor must include stable sort order and the current scope so one user cannot reuse it to page another location's data. Cap page sizes; filter and sort through allowlists, not caller-provided SQL strings.

Customer order lists are filtered by authenticated owner, not merely a query-string `user_id`. Store queues require warehouse/store membership; pharmacist queue may need authorized scope and prioritization; report exports must recheck permission at download. Search can offer bounded typo tolerance, but never create silent medicine substitutions or disclose unpublished products.

For volatile queues use a deterministic `(created_at, immutable_id)` cursor where a suitable index exists; verify the actual SQL query and the checked-in migration file indexes with `EXPLAIN` before committing to a cursor implementation. Filtering on large JSON blobs without a tested index is not a default. A search outage may fall back to curated published catalogue browsing without claiming availability that cannot be confirmed.

See Indexing Strategy.

## Admin CMS

Module contracts

## Audit

Module contracts

## Authentication Access

Module contracts

## Cart Checkout

Module contracts

## Customer Accounts

Module contracts

## Customer Orders

Module contracts

## Delivery Operations

Module contracts

## Finance Payments

Module contracts

## Inventory

Module contracts

## Notifications

Module contracts

## Order Operations

Module contracts

## Pharmacist Review

Module contracts

## Prescription Upload

Module contracts

## Product Catalog

Module contracts

## Reporting

Module contracts

## Rider App

Module contracts

## Store Operations

Module contracts

## Warehouse

Module contracts

## Caller trust and contract readiness

Public product browse/search/category/detail/availability reads (`/v1/catalog/*`) do not need a session; limit them to published safe fields and apply abuse controls. Their admin write routes require staff catalogue permissions. Customer OTP, staff initial login and challenge completion are public proof-based operations. Refresh uses the refresh credential. Payment callbacks use verified provider signatures and do not use end-user sessions.

Customer `/v1/me/*`, checkout, prescription and payment-intent commands require the authenticated owner and object/patient scope. Rider routes require the assigned active rider and task scope. Staff/admin/pharmacy/report/audit routes require the specific action and location or patient scope; authentication alone is insufficient. Internal routes require a trusted service principal and explicit capability; they are never public simply because a URL contains `internal`. Restrict network ingress as well as checking the principal.

Before implementing an incomplete operation, record its exact required inputs, field types/nullability/limits, response schema/status, owner and permission, tables/columns, transaction boundary, duplicate/conflict behavior, retry/compensation and test IDs. A generic request ID/version/reason payload cannot substitute for item quantities, payment amounts, clinical decisions, file references or rider evidence. Numerical limits require the documented policy owner. Provider wire schemas require D-016 evidence.
