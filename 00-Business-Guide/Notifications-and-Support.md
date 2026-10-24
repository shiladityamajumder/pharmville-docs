# Notifications and support

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Notifications explain recorded progress and required actions. Support resolves stalled journeys using the same facts; delivering a message does not complete an order or payment.

## Who is involved?

Customers, staff, riders, support, notification operations and the responsible Pharmacy/Operations/Finance team.

## How does it normally work?

1. After a business action is recorded, Pharmville prepares an approved message for the permitted recipient.
2. The draft plan uses WhatsApp first, configured SMS fallback and email where appropriate. Riders receive push tasks; staff receive panel alerts. Customer browser push remains optional draft scope.
3. Delivery attempts and approved retries are logged. Sensitive details remain in the protected app rather than message content.
4. Support checks identity and access, reads the current order/reference and routes clinical questions to Pharmacy, supply to Operations and money uncertainty to Finance.
5. Only an authorized responsible team changes the business outcome. Case recording, response commitments and full ticket integration await D-020 approval.

## What happens next?

Recipients continue in the relevant [order](Orders-and-Fulfillment.md), [prescription](Prescription-and-Pharmacy.md) or [refund](Returns-and-Refunds.md) flow.

## What can go wrong, and what does the system do?

### No confirmation arrives

A provider outage or blocked endpoint can fail after the order committed. The app still shows the existing record. Notification operations retries safely; support uses its reference, never another order.

### An old or repeated alert arrives

Worker restarts and delayed callbacks can repeat delivery. The message is tied to the same event; opening it loads current status. Notification operations fixes delivery without repeating stock or money actions.

### A message risks exposing medical details

A wrong recipient/template must not disclose a prescription. Approved minimal content and protected links enforce access; suspicious disclosure goes to Security. Support verifies identity before explaining private records.

### A customer shows a bank-debit screenshot

Support cannot infer trusted provider success from the screenshot. Finance checks the existing reference; the customer sees checking payment. Support neither marks paid nor requests another charge to close the case.

### Push permission is refused

A device may reject push or its endpoint expire. The task/status stays visible in the app with approved alternative alerts where applicable. The user refreshes; notification failure alone does not cancel the business record.

## What does the user see?

Recipients see minimal progress/action messages and protected links. Support sees verified current references, routed responsibility and pending/resolved evidence.

## What still needs approval?

D-013 (privacy/preferences), D-014/D-016 (providers), D-020 (support ownership and commitments). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Notifications | [HLD](../03-Modules/Notifications/HLD.md) | [LLD](../03-Modules/Notifications/LLD.md) | [API](../05-APIs/Notifications.md) | [Mapping](../04-Database/Module-Mapping.md#notifications) | [Cases](../03-Modules/Notifications/Edge-Cases.md) |

Technical workflows: [WF-001](../06-Workflows/WF-001-Identity-and-Session.md) · [WF-005](../06-Workflows/WF-005-Payment-and-Confirmation.md) · [WF-008](../06-Workflows/WF-008-Rider-Assignment-and-POD.md) · [WF-013](../06-Workflows/WF-013-Customer-Support-Triage.md).

Feature references: `NOT-01`, `NOT-02`, `NOT-03`, `NOT-04`, `NOT-05`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
