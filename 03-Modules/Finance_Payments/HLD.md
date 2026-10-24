# Finance Payments HLD

<!-- ERD-NAV-START -->

## Database relationships

[`payment` ERD](../../04-Database/ER-Diagrams/17-payment.md) · [`finance` ERD](../../04-Database/ER-Diagrams/08-finance.md) · [`commerce` ERD](../../04-Database/ER-Diagrams/04-commerce.md) · [FK catalog](../../04-Database/ER-Diagrams/Relationship-Catalog.md)

These diagrams show recorded PostgreSQL constraints, not approved module write ownership or authorization. See [migration evidence](../../04-Database/Migrations.md) for the supplied source and deployment verification limits.

<!-- ERD-NAV-END -->

[Business flow](../../00-Business-Guide/Finance-and-Reconciliation.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-014: Payment truth, refunds and invoice evidence — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Payment truth, refunds and invoice evidence. Unknown provider outcomes stay pending; external callbacks cannot double-apply money.

**System responsibility:** The `Finance_Payments` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- Payment records from Cashfree webhooks and COD collections (`FIN-01`)
- GST invoice per order, from the right GSTIN (`FIN-02`)
- Automatic refunds; manual refunds need approval above a set amount (`FIN-03`)
- COD refunds by bank transfer or UPI (`FIN-04`)
- Daily reconciliation: Cashfree settlements vs orders (`FIN-05`)
- COD reconciliation: collected vs deposited (`FIN-06`)
- Credit notes for refunds and returns (`FIN-07`)

### Dependencies and trust boundaries

- Database candidates: `payment.payment_intents`, `payment.payment_attempts`, `payment.payment_webhooks`, `payment.refunds`, `finance.invoices`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

Unknown provider outcomes stay pending; external callbacks cannot double-apply money. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## MOD-014 — Payment truth, refunds and invoice evidence

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Unknown provider outcomes stay pending; external callbacks cannot double-apply money.

**Feature coverage**

- **FIN-01 / REQ-086:** Payment records from Cashfree webhooks and COD collections (Must (draft)).
- **FIN-02 / REQ-087:** GST invoice per order, from the right GSTIN (Must (draft)).
- **FIN-03 / REQ-088:** Automatic refunds; manual refunds need approval above a set amount (Must (draft)).
- **FIN-04 / REQ-089:** COD refunds by bank transfer or UPI (Should (draft)).
- **FIN-05 / REQ-090:** Daily reconciliation: Cashfree settlements vs orders (Must (draft)).
- **FIN-06 / REQ-091:** COD reconciliation: collected vs deposited (Must (draft)).
- **FIN-07 / REQ-092:** Credit notes for refunds and returns (Should (draft)).

### Developer navigation

- [Module HLD](HLD.md)
- [Module LLD](LLD.md)
- Internal architecture
- [API contracts](../../05-APIs/Finance_Payments.md)
- [Database mapping](../../04-Database/Module-Mapping.md)
- [Testing](../../07-Engineering/Testing.md)
- [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.
