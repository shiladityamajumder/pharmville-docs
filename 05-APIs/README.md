# API contracts

[Business Guide](../00-Business-Guide/README.md) · [critical operation contracts](Critical-Operation-Contracts.md) · [ownership and recovery](../07-Engineering/State-and-Recovery-Contracts.md) · [feature traceability](../09-References/Coverage-and-Traceability.md)

## Contract status

All routes in this package are **proposed Pharmville contracts**. No Pharmville HTTP application or route-level contract tests were available for verification. A sibling healthcare authentication service does provide an implemented and unit-tested camelCase response envelope; that is evidence only for the envelope, not for Pharmville routes, authentication policy, domain DTOs, or runtime behavior. See [Standard responses](Standard-Responses.md).

The historical API identifier range API-001–API-097 is preserved. The five historical account references API-005–API-009 are now listed as individual routes in [Customer Accounts](Customer_Accounts.md). Ten additional account operations use stable `ACC-ROUTE-*` documentation references and do not consume historical IDs.

The complete mapping contains 107 HTTP operations and is recorded in the [API contract coverage ledger](API-Contract-Coverage.md).

## Domain contracts

| Domain | Contract |
| --- | --- |
| Authentication and access | [Authentication_Access.md](Authentication_Access.md) |
| Customer accounts | [Customer_Accounts.md](Customer_Accounts.md) |
| Product catalog | [Product_Catalog.md](Product_Catalog.md) |
| Cart and checkout | [Cart_Checkout.md](Cart_Checkout.md) |
| Prescription upload | [Prescription_Upload.md](Prescription_Upload.md) |
| Pharmacist review | [Pharmacist_Review.md](Pharmacist_Review.md) |
| Customer orders | [Customer_Orders.md](Customer_Orders.md) |
| Order operations | [Order_Operations.md](Order_Operations.md) |
| Store operations | [Store_Operations.md](Store_Operations.md) |
| Warehouse | [Warehouse.md](Warehouse.md) |
| Inventory | [Inventory.md](Inventory.md) |
| Delivery operations | [Delivery_Operations.md](Delivery_Operations.md) |
| Rider app | [Rider_App.md](Rider_App.md) |
| Finance and payments | [Finance_Payments.md](Finance_Payments.md) |
| Admin and CMS | [Admin_CMS.md](Admin_CMS.md) |
| Notifications | [Notifications.md](Notifications.md) |
| Reporting | [Reporting.md](Reporting.md) |
| Audit | [Audit.md](Audit.md) |

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

Review [API contract coverage](API-Contract-Coverage.md) before implementation; all unresolved fields, owners and decision impacts must be approved under D-024.
