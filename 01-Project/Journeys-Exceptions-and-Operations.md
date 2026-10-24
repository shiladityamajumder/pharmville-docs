# Exceptions and operations

## S27 — Handle a failed delivery

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Delivery_Operations.
- **Actor:** Rider / dispatch.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S27`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

If the rider cannot hand over the parcel, Pharmville chooses an approved retry, reschedule or return-to-store route.

**User sees:** Delivery attempt unsuccessful, reason and next attempt where available.

**Service responsibility:** Keep custody clear; returned P products must go through the required safety check before any stock action.

**Completion condition:** Another delivery attempt begins, or the parcel returns to the store.

### Data and cross-module handoff

Primary affected database domain(s): `logistics`, `fulfillment`, `organization`. Representative existing tables: `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/staff/delivery/tasks`, `POST /v1/staff/delivery/tasks/{task_id}/assign`, `POST /v1/staff/delivery/tasks/{task_id}/resolution`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S28 — Cancel safely at the correct stage

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Customer_Orders.
- **Actor:** Customer / support.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S28`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

Cancellation depends on whether the order is still awaiting payment, being packed or already travelling. A cancel request is not proof that a rider or packer has stopped.

**User sees:** Cancel availability, confirmation and any refund status.

**Service responsibility:** Stop work where possible, record the reason and arrange a return if the parcel has already left.

**Completion condition:** An unpaid order closes or any paid amount moves to refund handling.

### Data and cross-module handoff

Primary affected database domain(s): `commerce`, `finance`, `logistics`, `fulfillment`. Representative existing tables: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/me/orders`, `GET /v1/me/orders/{order_id}`, `POST /v1/me/orders/{order_id}/cancel`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S29 — Raise a return, wrong item or quality complaint

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Customer_Orders.
- **Actor:** Customer / support.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S29`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

After delivery, the customer selects the issue and affected items. Refund or return eligibility depends on product type, safety and approved policies.

**User sees:** Raise an issue, upload evidence if relevant and see what happens next.

**Service responsibility:** Do not treat medicines as ordinary resale returns; escalate wrong or unsafe P products immediately.

**Completion condition:** A permitted pickup is booked, an approved adjustment is made or support investigates.

### Data and cross-module handoff

Primary affected database domain(s): `commerce`, `finance`, `logistics`, `fulfillment`. Representative existing tables: `commerce.cancellations`, `commerce.order_items`, `commerce.orders`, `commerce.returns`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/me/orders`, `GET /v1/me/orders/{order_id}`, `POST /v1/me/orders/{order_id}/cancel`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S30 — Receive and inspect returned items

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Store_Operations.
- **Actor:** Returns / quality team.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S30`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

If a physical return is approved, the parcel is collected, received and checked. Items that may be unsafe are kept away from saleable stock.

**User sees:** Return pickup and inspection status.

**Service responsibility:** Check identity, condition, lot, missing items and the reason for return before deciding next action.

**Completion condition:** Inspection supports a refund or sends a disputed case to support.

### Data and cross-module handoff

Primary affected database domain(s): `warehouse`, `fulfillment`, `procurement`. Representative existing tables: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/staff/store/orders`, `POST /v1/staff/store/orders/{order_id}/accept`, `POST /v1/staff/store/picks/{pick_id}/scan`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S31 — Return the correct money once

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Finance_Payments.
- **Actor:** Finance / payment team.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S31`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

Refunds may follow cancellation, failed payment, shortages or approved returns. The amount must match the affected order lines and prior payments.

**User sees:** Refund started, expected method and confirmed completion.

**Service responsibility:** Avoid double refunds, handle partial refunds and reconcile online or COD refunds separately.

**Completion condition:** The refund is confirmed, or a payment investigation is opened.

### Data and cross-module handoff

Primary affected database domain(s): `payment`, `finance`, `commerce`. Representative existing tables: `commerce.orders`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `POST /v1/payments/intents`, `POST /v1/webhooks/cashfree`, `GET /v1/admin/finance/payments`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** No external payment confirmation may be inferred from a browser redirect.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S32 — Close the order records

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Order_Operations.
- **Actor:** Finance / operations.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S32`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

After delivery or cancellation, finance confirms that money, stock, delivery and any refund records agree.

**User sees:** Final order history and invoice/refund records remain accessible.

**Service responsibility:** Complete cash and settlement checks without changing the earlier history.

**Completion condition:** The case is closed unless a new support problem arises.

### Data and cross-module handoff

Primary affected database domain(s): `commerce`, `fulfillment`, `warehouse`, `organization`. Representative existing tables: `commerce.order_allocations`, `commerce.orders`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/admin/orders`, `GET /v1/admin/orders/{order_id}`, `POST /v1/admin/orders/{order_id}/allocate`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S33 — Investigate an unusual problem

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Audit.
- **Actor:** Customer support / specialist.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S33`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

If the normal flow cannot resolve a customer problem, a trained support owner investigates and coordinates the right team.

**User sees:** A case number, current status and next update.

**Service responsibility:** Support can solve service issues, but cannot personally approve a P prescription.

**Completion condition:** The appropriate team resolves the problem and returns the order to a safe next step.

### Data and cross-module handoff

Primary affected database domain(s): `platform`, `compliance`, `risk`. Representative existing tables: `compliance.adverse_event_reports`, `compliance.evidence`, `compliance.legal_holds`, `compliance.privacy_requests`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/admin/audit/events`, `POST /v1/admin/audit/exports`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S34 — Stop unsafe products immediately

- **Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval.
- **Owning module:** Product_Catalog.
- **Actor:** Pharmacy quality / operations.

### Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S34`. Preconditions are rechecked server-side; UI status is not authority.

### Normal path and on-screen behavior

A recall, suspected incorrect medicine, damaged parcel or serious safety concern can stop picking, delivery or further sale at any point.

**User sees:** Clear safety guidance and a support channel, without exposing private health data.

**Service responsibility:** Block affected batches/orders, trace deliveries and follow the approved quality process.

**Completion condition:** A qualified authority approves release, safe cancellation or recall/refund handling.

### Data and cross-module handoff

Primary affected database domain(s): `catalog`, `search`, `pricing`, `marketplace`. Representative existing tables: `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable.

Related APIs: `GET /v1/catalog/categories`, `GET /v1/catalog/products`, `GET /v1/catalog/products/{product_id}`. All endpoints are **Proposed**, not implemented.

### Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

### Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

### Phase 1 screen and interaction state inventory

**Source:** 60-screen wireframe specification and order journey v3. This is a text-only behavioral inventory, not new UI mockups. Implement customer browsing/category/search, product detail with P badge and strength/form, cart editable quantities, address/serviceability, OTP, family/patient selection conditional on P, private prescription upload/preview/correction, accepted order summary, clinical wait/rejected line revision acceptance, payment pending/verified/COD, stock unavailable or changed ETA, order status/invoice, live rider/OTP, cancellation/return/refund.

Staff surfaces include role-scoped dashboard, catalog import/classification/publish, warehouse/store/location masters, pharmacist queue and side-by-side Rx/P-line decisions, order exception queue, stock lot/hold/adjustments, replenishment/transfer, picking/packing and license blocks, rider map/assignments, finance settlement/COD/refunds, reports/export and immutable audit.

Rider Android includes shift, task, accept/pickup, location consent, recipient OTP, failure reasons and COD collection.

Every form needs empty/loading/validation/expired-session/stale-version/provider-unknown/offline/permission-denied states. Customer must deliberately choose new order revision; no hidden automatic substitution or payment. File-upload progress cannot be shown as pharmacist approval. All stage contracts and Module LLD supply dependencies and authoritative API mapping.
