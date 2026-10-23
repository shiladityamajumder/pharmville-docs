# Prescription review and payment

## S09 Review only the P medicines

## S09 — Review only the P medicines

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Pharmacist_Review. **Actor:** Pharmacist.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S09`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The pharmacist checks the attached prescription, the patient and each P item. M and O items remain in the order but are not put in the pharmacist decision list.

**User sees:** Prescription under review, with a realistic wait message.

**Service responsibility:** Approve or reject each P item and record a clear reason where needed.

**Completion condition:** All P accepted, correction requested, or the customer is offered a revised basket.

## Data and cross-module handoff

Primary affected database domain(s): `clinical`, `commerce`, `compliance`. Representative existing tables: `clinical.order_review_items`, `clinical.order_reviews`, `clinical.prescriptions`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/pharmacy/reviews`, `GET /v1/pharmacy/reviews/{review_id}`, `POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Prescription items classified P require a current pharmacist decision before progressing; M/O items do not need that review.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S10 Fix a prescription problem

## S10 — Fix a prescription problem

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Prescription_Upload. **Actor:** Customer / pharmacist.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S10`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

If the prescription image is unclear, belongs to the wrong person or lacks required information, the customer must fix it. P items stay on hold.

**User sees:** What needs correcting and options to Upload again, Remove P item or Contact support.

**Service responsibility:** Set a clear response deadline, keep M/O items unchanged and send the new file back for review.

**Completion condition:** A corrected prescription is approved or the customer chooses to remove/cancel affected P.

## Data and cross-module handoff

Primary affected database domain(s): `clinical`, `platform`, `customer`. Representative existing tables: `clinical.prescription_documents`, `clinical.prescriptions`, `platform.file_access_events`, `platform.file_access_grants`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/prescriptions/upload-intents`, `POST /v1/prescriptions/documents/confirm`, `POST /v1/orders/{order_id}/prescriptions`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Prescription items classified P require a current pharmacist decision before progressing; M/O items do not need that review.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S11 Approve a changed basket

## S11 — Approve a changed basket

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Cart_Checkout. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S11`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

If some or all P items cannot be supplied, Pharmville shows the remaining items and a fresh total. No P item is silently removed from a paid order.

**User sees:** Before and after item lists, updated amount, delivery fee and options to Accept changes, Retry or Cancel.

**Service responsibility:** Retain M/O items and approved P items; do not charge until the customer accepts changes.

**Completion condition:** A revised basket is accepted, corrected prescription is submitted, or order is cancelled.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `pricing`, `customer`, `warehouse`. Representative existing tables: `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/me/cart`, `PUT /v1/me/cart/items`, `POST /v1/checkouts/quotes`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Prescription items classified P require a current pharmacist decision before progressing; M/O items do not need that review.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S12 Confirm the prescription step is complete

## S12 — Confirm the prescription step is complete

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Pharmacist_Review. **Actor:** Pharmville system.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S12`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

There are two valid outcomes: remaining P items are approved, or the order has no P items and does not need pharmacist review.

**User sees:** P orders may show Prescription approved. M/O-only orders simply continue to payment.

**Service responsibility:** Make sure no unapproved P item can move into payment or picking.

**Completion condition:** Customer moves to payment selection.

## Data and cross-module handoff

Primary affected database domain(s): `clinical`, `commerce`, `compliance`. Representative existing tables: `clinical.order_review_items`, `clinical.order_reviews`, `clinical.prescriptions`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/pharmacy/reviews`, `GET /v1/pharmacy/reviews/{review_id}`, `POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** Prescription items classified P require a current pharmacist decision before progressing; M/O items do not need that review.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S13 Choose payment with stock briefly held

## S13 — Choose payment with stock briefly held

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Cart_Checkout. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S13`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Pharmville checks available stock again and temporarily holds the items while the customer pays. Cash on delivery is offered only if eligible.

**User sees:** Final amount, delivery charges, online payment and eligible cash-on-delivery option.

**Service responsibility:** Hold the stock for a limited time; if it cannot be held, show an availability problem before taking payment.

**Completion condition:** A valid stock hold exists and the customer selects a payment method.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `pricing`, `customer`, `warehouse`. Representative existing tables: `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/me/cart`, `PUT /v1/me/cart/items`, `POST /v1/checkouts/quotes`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** No external payment confirmation may be inferred from a browser redirect.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S14 Pay online

## S14 — Pay online

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Finance_Payments. **Actor:** Customer / payment provider.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S14`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The customer uses UPI, a card or another supported method. Pharmville must confirm payment with the payment provider, not merely trust the screen returning to the website.

**User sees:** Secure payment experience and exact payable amount.

**Service responsibility:** Treat repeated Pay clicks as the same attempt, and record the result only when verified.

**Completion condition:** Payment succeeds, fails, or needs more time to confirm.

## Data and cross-module handoff

Primary affected database domain(s): `payment`, `finance`, `commerce`. Representative existing tables: `commerce.orders`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/payments/intents`, `POST /v1/webhooks/cashfree`, `GET /v1/admin/finance/payments`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** No external payment confirmation may be inferred from a browser redirect.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S15 Check a payment with an uncertain result

## S15 — Check a payment with an uncertain result

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Finance_Payments. **Actor:** Payment support.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S15`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Sometimes the bank has charged the customer but the website has not received confirmation. Pharmville must investigate without asking the customer to pay twice.

**User sees:** Checking your payment. Please do not pay again yet.

**Service responsibility:** Check the payment provider and bank settlement records; resolve late or duplicate payments.

**Completion condition:** The payment is confirmed, shown to have failed, or moved to support.

## Data and cross-module handoff

Primary affected database domain(s): `payment`, `finance`, `commerce`. Representative existing tables: `commerce.orders`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/payments/intents`, `POST /v1/webhooks/cashfree`, `GET /v1/admin/finance/payments`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** No external payment confirmation may be inferred from a browser redirect.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.

## S16 Recognise paid or COD order

## S16 — Recognise paid or COD order

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Finance_Payments. **Actor:** Pharmville system / finance.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S16`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

An online payment is verified, or an eligible cash-on-delivery request is accepted. For COD, the cash has not been collected yet.

**User sees:** Payment successful, or Cash on delivery selected - pay when delivered.

**Service responsibility:** Record the correct payment arrangement once, then send the order for stock allocation.

**Completion condition:** The order is sent to the fulfilment location decision.

## Data and cross-module handoff

Primary affected database domain(s): `payment`, `finance`, `commerce`. Representative existing tables: `commerce.orders`, `finance.accounts`, `finance.credit_notes`, `finance.invoice_items`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/payments/intents`, `POST /v1/webhooks/cashfree`, `GET /v1/admin/finance/payments`. All endpoints are **Proposed**, not implemented.

## Alternative paths and recovery

- **Missing/invalid evidence:** return a specific validation reason; preserve already committed business facts.
- **Duplicate or concurrent command:** use an idempotency key and row/version guard so exactly one transition wins.
- **Unavailable upstream service:** leave the item pending, do not assume success and create a recoverable operations alert.
- **Cancelled/unsafe/ineligible state:** stop progression; release uncommitted holds or create compensating records when required.

**Safety invariant:** No external payment confirmation may be inferred from a browser redirect.

## Acceptance checks

1. Authorized actor completes the step with one stored transition and audit actor.
2. A stale, unauthorized or duplicate command has no unintended side effects.
3. The correct customer-visible outcome reflects committed subsystem states.

See module test plan and end-to-end sequence.
