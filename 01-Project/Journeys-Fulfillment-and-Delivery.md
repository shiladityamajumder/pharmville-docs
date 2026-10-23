# Fulfillment and delivery

## S17 — Find a store with the full order

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Order_Operations. **Actor:** Stock / operations team.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S17`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Pharmville chooses a permitted store able to fulfil the accepted order. Under the proposed first-release rule, one order uses one selling/fulfilment location.

**User sees:** Finding a store and checking availability.

**Service responsibility:** Confirm exact quantities, correct packs and eligible batches; convert the short hold into a firm allocation.

**Completion condition:** All accepted items have valid stock at an eligible location.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `fulfillment`, `warehouse`, `organization`. Representative existing tables: `commerce.order_allocations`, `commerce.orders`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/admin/orders`, `GET /v1/admin/orders/{order_id}`, `POST /v1/admin/orders/{order_id}/allocate`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S18 — Resolve a stock or delivery problem

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Order_Operations. **Actor:** Customer / operations.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S18`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

If anything is unavailable or the promise changes, show which exact items are affected. Offer safe choices rather than silently changing medicines or charging a different amount.

**User sees:** Exact affected item, new estimated delivery time and options to Accept change, Wait if allowed or Cancel.

**Service responsibility:** Try an eligible location or the same exact SKU; request customer consent for removing lines and review for a different P medicine.

**Completion condition:** A workable, customer-approved order exists, or cancellation/refund is started.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `fulfillment`, `warehouse`, `organization`. Representative existing tables: `commerce.order_allocations`, `commerce.orders`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/admin/orders`, `GET /v1/admin/orders/{order_id}`, `POST /v1/admin/orders/{order_id}/allocate`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S19 — Assign the order to a store

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Order_Operations. **Actor:** Store / warehouse.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S19`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Once all items are safely reserved, the selected store receives the confirmed order and its pick list.

**User sees:** Order confirmed - preparing at store.

**Service responsibility:** Assign one location and keep the reserved quantities available for that order.

**Completion condition:** Store accepts the work and begins picking.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `fulfillment`, `warehouse`, `organization`. Representative existing tables: `commerce.order_allocations`, `commerce.orders`, `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/admin/orders`, `GET /v1/admin/orders/{order_id}`, `POST /v1/admin/orders/{order_id}/allocate`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S20 — Pick the exact ordered items

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Store_Operations. **Actor:** Store team.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S20`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

A store worker picks the items by product, pack size and eligible batch. The worker checks strength and expiry, especially for P medicines.

**User sees:** Preparing your order.

**Service responsibility:** Scan and check each item. Never pack a different strength or unapproved P line.

**Completion condition:** Every accepted item is checked and ready to pack.

## Data and cross-module handoff

Primary affected database domain(s): `warehouse`, `fulfillment`, `procurement`. Representative existing tables: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/staff/store/orders`, `POST /v1/staff/store/orders/{order_id}/accept`, `POST /v1/staff/store/picks/{pick_id}/scan`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S21 — Fix a picking mistake or shortage

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Store_Operations. **Actor:** Store / operations.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S21`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The shelf may not match the computer stock. The order pauses so the team can locate the correct item, request an approved change or cancel affected lines.

**User sees:** We are checking an item in your order.

**Service responsibility:** Check same item and batch availability; for product changes go back through customer agreement and P review where required.

**Completion condition:** Correct items are found or the customer accepts a revised order.

## Data and cross-module handoff

Primary affected database domain(s): `warehouse`, `fulfillment`, `procurement`. Representative existing tables: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/staff/store/orders`, `POST /v1/staff/store/orders/{order_id}/accept`, `POST /v1/staff/store/picks/{pick_id}/scan`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S22 — Check, invoice and seal the package

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Store_Operations. **Actor:** Store quality / billing.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S22`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Before packing, staff compare the picked items with the agreed order. The package is sealed and the proper invoice is prepared at the approved business point.

**User sees:** Packed and ready for pickup.

**Service responsibility:** Confirm prices, quantities, batch details and P approvals; stop any mismatch.

**Completion condition:** The parcel passes final checks.

## Data and cross-module handoff

Primary affected database domain(s): `warehouse`, `fulfillment`, `procurement`. Representative existing tables: `fulfillment.fulfillment_events`, `fulfillment.fulfillment_order_items`, `fulfillment.fulfillment_orders`, `fulfillment.pack_tasks`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/staff/store/orders`, `POST /v1/staff/store/orders/{order_id}/accept`, `POST /v1/staff/store/picks/{pick_id}/scan`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S23 — Assign the rider and hand over the parcel

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Delivery_Operations. **Actor:** Dispatch / rider.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S23`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

A delivery person is assigned. The store gives the correct sealed parcel to that person using a verified handover.

**User sees:** Ready for dispatch, then Rider picked up your order.

**Service responsibility:** Check the rider assignment, parcel identity and handover. If no rider is available, communicate a realistic delay.

**Completion condition:** The rider has accepted the correct package.

## Data and cross-module handoff

Primary affected database domain(s): `logistics`, `fulfillment`, `organization`. Representative existing tables: `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/staff/delivery/tasks`, `POST /v1/staff/delivery/tasks/{task_id}/assign`, `POST /v1/staff/delivery/tasks/{task_id}/resolution`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** One approved location, authoritative inventory, and exact lot/line evidence are required before dispatch.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S24 — Travel to the delivery address

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Rider_App. **Actor:** Rider.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S24`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The rider follows the delivery instructions. Tracking should show only reliable information rather than an invented live location.

**User sees:** Out for delivery, contact options and available ETA.

**Service responsibility:** Keep package custody recorded and flag accidents, delays or address issues.

**Completion condition:** Rider arrives at the address or flags an unsuccessful attempt.

## Data and cross-module handoff

Primary affected database domain(s): `logistics`, `identity`, `notification`. Representative existing tables: `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/rider/shifts`, `GET /v1/rider/tasks`, `POST /v1/rider/tasks/{task_id}/pickup`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S25 — Verify the recipient and hand over the order

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Rider_App. **Actor:** Rider / customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S25`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The rider checks the required delivery proof, collects COD money if due, and hands over the correct sealed package.

**User sees:** Delivery code, final payable COD amount if applicable.

**Service responsibility:** Never mark delivered without valid proof. If cash, safety or proof is in doubt, pause the handover.

**Completion condition:** Successful delivery proof and any due COD collection are recorded.

## Data and cross-module handoff

Primary affected database domain(s): `logistics`, `identity`, `notification`. Representative existing tables: `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/rider/shifts`, `GET /v1/rider/tasks`, `POST /v1/rider/tasks/{task_id}/pickup`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S26 — Finish delivery and provide documents

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Delivery_Operations. **Actor:** Customer / order support.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S26`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

After successful handover, the order shows Delivered and the customer can access the invoice, order history and help.

**User sees:** Delivered status, receipt/invoice, feedback and help options.

**Service responsibility:** Record delivery once and keep the history available for genuine complaints.

**Completion condition:** Financial checks are completed or the customer opens an after-sales case.

## Data and cross-module handoff

Primary affected database domain(s): `logistics`, `fulfillment`, `organization`. Representative existing tables: `logistics.delivery_assignments`, `logistics.delivery_attempts`, `logistics.delivery_failure_reasons`, `logistics.delivery_location_updates`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/staff/delivery/tasks`, `POST /v1/staff/delivery/tasks/{task_id}/assign`, `POST /v1/staff/delivery/tasks/{task_id}/resolution`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Never silently bypass a policy or retry a non-idempotent state change.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.
