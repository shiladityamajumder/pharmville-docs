# API contracts

[Business Guide](../00-Business-Guide/README.md) · [critical operation contracts](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md) · [feature traceability](../09-References/Coverage-and-Traceability.md)

## Contract status

All routes in this package are **proposed Pharmville contracts**. No Pharmville HTTP application or route-level contract tests were available for verification. A sibling healthcare authentication service does provide an implemented and unit-tested camelCase response envelope; that is evidence only for the envelope, not for Pharmville routes, authentication policy, domain DTOs, or runtime behavior. See [Standard responses](Standard-Responses.md).

The historical API identifier range API-001–API-097 is preserved. The five historical account references API-005–API-009 are now listed as individual routes in [Customer Accounts](../03-Modules/Customer_Accounts/APIs.md). Ten additional account operations use stable `ACC-ROUTE-*` documentation references and do not consume historical IDs.

The complete mapping preserves 107 existing HTTP operations and adds 15 explicit unified-Identity proposals (122 total) and is recorded in the [API contract coverage ledger](API-Contract-Coverage.md).

## Domain contracts

Canonical endpoint contracts now live in each module’s `APIs.md`; this shared area owns conventions, OpenAPI, indexes and coverage. Historical domain filenames are compatibility navigation only.

| Domain | Contract |
| --- | --- |
| Authentication and access | [Authentication Access](../03-Modules/Authentication_Access/APIs.md) |
| Customer accounts | [Customer Accounts](../03-Modules/Customer_Accounts/APIs.md) |
| Product catalog | [Product Catalog](../03-Modules/Product_Catalog/APIs.md) |
| Cart and checkout | [Cart Checkout](../03-Modules/Cart_Checkout/APIs.md) |
| Prescription upload | [Prescription Upload](../03-Modules/Prescription_Upload/APIs.md) |
| Pharmacist review | [Pharmacist Review](../03-Modules/Pharmacist_Review/APIs.md) |
| Customer orders | [Customer Orders](../03-Modules/Customer_Orders/APIs.md) |
| Order operations | [Order Operations](../03-Modules/Order_Operations/APIs.md) |
| Store operations | [Store Operations](../03-Modules/Store_Operations/APIs.md) |
| Warehouse | [Warehouse](../03-Modules/Warehouse/APIs.md) |
| Inventory | [Inventory](../03-Modules/Inventory/APIs.md) |
| Delivery operations | [Delivery Operations](../03-Modules/Delivery_Operations/APIs.md) |
| Rider app | [Rider App](../03-Modules/Rider_App/APIs.md) |
| Finance and payments | [Finance Payments](../03-Modules/Finance_Payments/APIs.md) |
| Admin and CMS | [Admin CMS](../03-Modules/Admin_CMS/APIs.md) |
| Notifications | [Notifications](../03-Modules/Notifications/APIs.md) |
| Reporting | [Reporting](../03-Modules/Reporting/APIs.md) |
| Audit | [Audit](../03-Modules/Audit/APIs.md) |

## Shared contract standards

- [API conventions](API-Conventions.md) define versioning, public identifiers, casing, request processing and server-generated fields.
- [Authentication and authorization](Authentication-and-Authorization.md) define caller trust, object ownership and candidate headers. D-003 and D-023 remain open.
- [Standard responses](Standard-Responses.md) define the verified reference envelope and its proposed Pharmville use, including list, async, replay and no-content exceptions.
- [Error catalog](Error-Catalog.md) gives stable proposed machine codes and retry guidance.
- [Pagination and filtering](Pagination-and-Filtering.md) define scope-safe cursor/offset rules; operation limits and supported fields remain owner decisions unless stated.
- [Idempotency and concurrency](Idempotency-and-Concurrency.md) define proposed replay and stale-version behavior; D-024 approval remains required.
- [Database-first DTO mapping](Database-DTO-Mapping.md) links operation groups to documented table fields, types, nullability, constraints and relationships while separating persisted, derived and public-only values.
- [OpenAPI 3.1](openapi.yaml) maps each operation to an owner contract. OpenAPI descriptions/extensions mark proposed contracts and blockers; it does not imply implementation.

## Cross-domain invariants

Public catalog reads expose only published safe fields. Catalog availability is advisory; inventory rechecks eligible stock at reservation and picking. Prescription access is private and bound to the correct customer, patient, order revision and evidence. Clinical approval, order acceptance, payment success, stock commitment and delivery completion are distinct business facts.

Browser payment redirects are not authoritative. Signed provider callbacks require D-016 wire evidence, durable deduplication and reconciliation. Staff, warehouse, pharmacist, finance, rider, export and audit access always checks server-side permissions and object scope.

Each module document preserves its feature IDs, candidate data ownership, failure handling and designed test cases. These test scenarios are **Designed / NOT RUN** unless execution evidence is explicitly cited. The documented authoritative database source folder is absent here, and the adjacent similarly named folder does not match the evidence manifest; only checked-in database documentation is available for this turn.

Review [API contract coverage](API-Contract-Coverage.md) before implementation; remaining incomplete fields and all proposed owner decisions must be approved under D-024.

## Detailed planning blueprint

The preserved 107-operation inventory now has **97 documentation-complete proposed contracts (90.65%)**, **10 incomplete**, **0 approved**, and **0 verified implementations**. Every operation has its own section in its module document, with request/auth/header/response/error/database/operational/test detail. Ten explicitly excluded contracts retain concrete unresolved gaps; complete proposals still require domain approval.

- [Coverage and per-operation status](API-Contract-Coverage.md)
- [API/database/feature matrix](API-Database-Feature-Matrix.md)
- [Master inventory and initial records](../04-Database/Master-Data-Inventory.md) — 266 tables classified, 44 masters, 11 explicit initial-value lists, 33 Open datasets.
- [Planning decisions](Planning-Decisions.md)
- [Journey gaps and 16 candidate commands](Journey-API-Gaps.md) — not added to the existing inventory.
- [Validation evidence](Planning-Validation.md)

## Standard problem response behavior

Use the existing four-field response envelope and the [error catalog](Error-Catalog.md). Each endpoint supplies its applicable error triggers and recovery; protected failures redact patient, credential, provider and hidden-resource information. HTTP 204 has no body. Shared envelope reuse does not replace an operation DTO.


[Unified Identity architecture](../03-Modules/Authentication_Access/Unified-Identity-Architecture.md) · [compatibility and rollout](../03-Modules/Authentication_Access/API-Compatibility.md) · [workspace matrix](../01-Project/User-Roles.md).
