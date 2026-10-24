# Order Operations

**Stable module ID:** `Order_Operations` · **Proposed accountable role:** Order operations.

## Module blueprint navigation

| Planning concern | Canonical reference |
| --- | --- |
| Scope, requirements and business flow | [Business flow](Business-Flow.md) |
| Components, boundaries and design | [HLD](HLD.md) · [LLD](LLD.md) |
| Operation contracts and DTOs | [APIs](APIs.md) |
| Owned and consumed database objects | [Database](Database.md) |
| State, permissions, recovery and tests | [Operating contract](Operations.md) · [edge cases](Edge-Cases.md) |
| Dependencies and owner decisions | [Dependencies](Dependencies.md) |


[Business flow](../../00-Business-Guide/Orders-and-Fulfillment.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-007 — Order orchestration and routing

**Source classification:** 7 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** One order must have one accepted revision and an auditable licensed location/fulfillment decision.

**Feature coverage**

- **OMS-01 / REQ-045:** Order list with filters (status, location, date, payment, Rx) and search by order number or phone (Must (draft)).
- **OMS-02 / REQ-046:** Order detail: items, batches, prescription, payment, delivery, full history (Must (draft)).
- **OMS-03 / REQ-047:** Automatic routing to the nearest open store with every item; warehouse as fallback (Must (draft)).
- **OMS-04 / REQ-048:** Reassign an order to another location, with a reason (Must (draft)).
- **OMS-05 / REQ-049:** Cancel, partly fulfil, raise return, add internal note (Must (draft)).
- **OMS-06 / REQ-050:** Attention queue: payment pending, stuck orders, failed deliveries (Must (draft)).
- **OMS-07 / REQ-051:** Assisted order entry for phone orders (Could (draft)).

### Developer navigation

- 🏗️ [Module HLD](HLD.md)
- ⚙️ [Module LLD](LLD.md)
- Internal architecture
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [Testing](../../07-Engineering/Testing.md)
- 🗓️ [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## MOD-007: Order orchestration and routing — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Order orchestration and routing. One order must have one accepted revision and an auditable licensed location/fulfillment decision.

**System responsibility:** The `Order_Operations` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- Order list with filters (status, location, date, payment, Rx) and search by order number or phone (`OMS-01`)
- Order detail: items, batches, prescription, payment, delivery, full history (`OMS-02`)
- Automatic routing to the nearest open store with every item; warehouse as fallback (`OMS-03`)
- Reassign an order to another location, with a reason (`OMS-04`)
- Cancel, partly fulfil, raise return, add internal note (`OMS-05`)
- Attention queue: payment pending, stuck orders, failed deliveries (`OMS-06`)
- Assisted order entry for phone orders (`OMS-07`)

### Dependencies and trust boundaries

- Database candidates: `commerce.orders`, `commerce.order_revisions`, `commerce.order_allocations`, `fulfillment.fulfillment_orders`, `organization.licenses`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

One order must have one accepted revision and an auditable licensed location/fulfillment decision. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- 🏗️ [HLD](HLD.md)
- ⚙️ [LLD](LLD.md)
- 🧪 [Edge cases](Edge-Cases.md)
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [QA scenarios](../../07-Engineering/Testing.md)
- 🗓️ [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
