# Notifications

**Stable module ID:** `Notifications` · **Proposed accountable role:** Communications / Platform.

## Module blueprint navigation

| Planning concern | Canonical reference |
| --- | --- |
| Scope, requirements and business flow | [Business flow](Business-Flow.md) |
| Components, boundaries and design | [HLD](HLD.md) · [LLD](LLD.md) |
| Operation contracts and DTOs | [APIs](APIs.md) |
| Owned and consumed database objects | [Database](Database.md) |
| State, permissions, recovery and tests | [Operating contract](Operations.md) · [edge cases](Edge-Cases.md) |
| Dependencies and owner decisions | [Dependencies](Dependencies.md) |


[Business flow](../../00-Business-Guide/Notifications-and-Support.md) · [feature register](../../09-References/Coverage-and-Traceability.md) · [ownership and recovery](../../07-Engineering/State-and-Recovery-Contracts.md)

## MOD-018 — Transactional customer/staff messaging

**Source classification:** 5 feature IDs from an inherited draft feature list; precise Phase 1 scope needs product-owner confirmation.

**Purpose:** Notification delivery is best effort after commit; it must never determine success of a stock or money action.

**Feature coverage**

- **NOT-01 / REQ-106:** One notification service: templates, WhatsApp first, SMS fallback, email (Must (draft)).
- **NOT-02 / REQ-107:** Delivery log with retries (Must (draft)).
- **NOT-03 / REQ-108:** Rider push notifications (FCM) (Must (draft)).
- **NOT-04 / REQ-109:** Staff alerts in the admin panel (Must (draft)).
- **NOT-05 / REQ-110:** Customer browser push notifications (Could (draft)).

### Developer navigation

- 🏗️ [Module HLD](HLD.md)
- ⚙️ [Module LLD](LLD.md)
- Internal architecture
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [Testing](../../07-Engineering/Testing.md)
- 🗓️ [Implementation plan](../../08-Development-Plan/Implementation-Plan.md)

**Dependencies:** all cross-module references require ownership and permission checks; see master dependency register.

## MOD-018: Transactional customer/staff messaging — HLD

> [!NOTE]
> **Status:** Proposed modular-monolith service boundary. Feature scope is draft and has no signed product approval in this workspace.

**Business responsibility:** Transactional customer/staff messaging. Notification delivery is best effort after commit; it must never determine success of a stock or money action.

**System responsibility:** The `Notifications` NestJS module owns its policy and HTTP use-case interface. Shared PostgreSQL schemas are **not** proof of exclusive write ownership.

### Major operations

- One notification service: templates, WhatsApp first, SMS fallback, email (`NOT-01`)
- Delivery log with retries (`NOT-02`)
- Rider push notifications (FCM) (`NOT-03`)
- Staff alerts in the admin panel (`NOT-04`)
- Customer browser push notifications (`NOT-05`)

### Dependencies and trust boundaries

- Database candidates: `notification.messages`, `notification.message_attempts`, `notification.templates`, `notification.user_channel_preferences`, `platform.outbox_events`.
- Role, patient, store and order scope resolved from trusted access context, not JSON body.
- External integrations are proposed and remain disabled until reviewed contracts and credentials are provided.
- Use local transactions for authoritative state; publish external side effects only after commit.

**Technical design:** [Module LLD](LLD.md) · [API index](../../05-APIs/README.md) · [Tests](../../07-Engineering/Testing.md)

### Risk

Notification delivery is best effort after commit; it must never determine success of a stock or money action. Open policies, cloud adapters, test fixtures and UI behavior must be signed off before go-live.

## Related design and delivery references

- 🏗️ [HLD](HLD.md)
- ⚙️ [LLD](LLD.md)
- 🧪 [Edge cases](Edge-Cases.md)
- 🔗 [API contracts](APIs.md)
- 🗄️ [Database mapping](../../04-Database/Module-Mapping.md)
- 🧪 [QA scenarios](../../07-Engineering/Testing.md)
- 🗓️ [Development tasks](../../08-Development-Plan/Implementation-Plan.md)
- End-to-end flows: [workflows](../../06-Workflows/README.md)
