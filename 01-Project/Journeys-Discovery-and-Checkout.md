# Customer discovery and checkout

## S01 — Find the right product

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Product_Catalog. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S01`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The customer searches, browses categories, or opens a previously ordered item. Only products that Pharmville is allowed to sell are shown.

**User sees:** Products, pack sizes, prices and a clear Prescription required label on P items.

**Service responsibility:** Keep the product list current and do not show recalled or blocked items as available.

**Completion condition:** The customer opens a product.

## Data and cross-module handoff

Primary affected database domain(s): `catalog`, `search`, `pricing`, `marketplace`. Representative existing tables: `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/catalog/categories`, `GET /v1/catalog/products`, `GET /v1/catalog/products/{product_id}`. All endpoints are **Proposed**, not implemented.

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

## S02 — Understand the item

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Product_Catalog. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S02`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Before buying, the customer checks the exact brand, strength, size, quantity and price. Product type is checked again before it enters the cart.

**User sees:** Product details and delivery availability. P shows Prescription required; M shows No prescription needed; O shows normal shopping information.

**Service responsibility:** Keep different strengths and pack sizes separate. Never quietly replace one medicine with another.

**Completion condition:** The customer adds an available item to the cart.

## Data and cross-module handoff

Primary affected database domain(s): `catalog`, `search`, `pricing`, `marketplace`. Representative existing tables: `catalog.brands`, `catalog.categories`, `catalog.product_classification_history`, `catalog.products`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/catalog/categories`, `GET /v1/catalog/products`, `GET /v1/catalog/products/{product_id}`. All endpoints are **Proposed**, not implemented.

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

## S03 — Build one shopping cart

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Cart_Checkout. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S03`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The customer adds P, M and O items together, changes quantities or removes products. The cart clearly identifies which lines need a prescription.

**User sees:** Items, quantities, prices and an easy-to-see notice beside each P item.

**Service responsibility:** Keep cart changes consistent; if all P items are removed, the prescription step must disappear.

**Completion condition:** The customer chooses Checkout.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `pricing`, `customer`, `warehouse`. Representative existing tables: `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/me/cart`, `PUT /v1/me/cart/items`, `POST /v1/checkouts/quotes`. All endpoints are **Proposed**, not implemented.

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

## S04 — Check the delivery address

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Customer_Accounts. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S04`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The customer chooses or enters the exact delivery location. A valid PIN code by itself does not guarantee that a particular building is serviceable.

**User sees:** Supported/not-supported delivery result, fees and an estimated window.

**Service responsibility:** Confirm coverage and whether an eligible store can deliver to that address.

**Completion condition:** A valid serviceable address is chosen.

## Data and cross-module handoff

Primary affected database domain(s): `customer`, `clinical`, `identity`. Representative existing tables: `clinical.patient_profiles`, `customer.addresses`, `customer.consent_events`, `customer.consents`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/auth/customer/otp/request`, `POST /v1/auth/customer/otp/verify`, `GET /v1/me`. All endpoints are **Proposed**, not implemented.

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

## S05 — Log in and choose patient when needed

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Customer_Accounts. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S05`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

The customer signs in using an OTP. Patient selection appears only if the cart contains P products. One order containing P items must refer to one patient under the proposed launch rule.

**User sees:** OTP screen and, only for P, a self/family-member choice.

**Service responsibility:** Keep patient details private and make sure the uploaded prescription belongs to the selected person.

**Completion condition:** Sign-in and any required patient selection are complete.

## Data and cross-module handoff

Primary affected database domain(s): `customer`, `clinical`, `identity`. Representative existing tables: `clinical.patient_profiles`, `customer.addresses`, `customer.consent_events`, `customer.consents`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `POST /v1/auth/customer/otp/request`, `POST /v1/auth/customer/otp/verify`, `GET /v1/me`. All endpoints are **Proposed**, not implemented.

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

## S06 — Confirm what will actually be ordered

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Cart_Checkout. **Actor:** Customer / checkout team.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S06`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Before creating the order, Pharmville checks prices, stock information, product category, quantities, fees and the delivery promise again.

**User sees:** A full order summary with final charges and notices about changed items or prices.

**Service responsibility:** Do not use an old price, delivery estimate or product category from a previous browser page.

**Completion condition:** The customer accepts the current summary; P moves to upload, M/O skips it.

## Data and cross-module handoff

Primary affected database domain(s): `commerce`, `pricing`, `customer`, `warehouse`. Representative existing tables: `commerce.cart_items`, `commerce.carts`, `commerce.checkouts`, `commerce.order_revisions`. The owning service must use a transaction for linked writes and record the current accepted order revision when applicable. Related APIs: `GET /v1/me/cart`, `PUT /v1/me/cart/items`, `POST /v1/checkouts/quotes`. All endpoints are **Proposed**, not implemented.

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

## S07 — Upload prescription only for P

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Prescription_Upload. **Actor:** Customer.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S07`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

If at least one P item is still in the cart, the customer attaches a prescription for the selected patient. M and O items do not ask for a file.

**User sees:** Upload button, file preview, selected patient and P item list.

**Service responsibility:** Accept approved file types, check that the file opens safely, then link it to the correct patient.

**Completion condition:** The file is ready for pharmacist review, or P items are removed.

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

## S08 — Record the order request once

**Source classification:** the documented draft requirements — documented desired workflow; individual recovery details may still require business approval. **Owning module:** Cart_Checkout. **Actor:** Pharmville system.

## Trigger and preconditions

A customer, staff member, or committed prior stage causes this stage to begin. The caller must have a valid session and the preceding clinical, payment, stock and authorization gates appropriate to `S08`. Preconditions are rechecked server-side; UI status is not authority.

## Normal path and on-screen behavior

Pharmville creates a single order request using the final cart, address and price. This step does not mean the medicines are approved, paid for or packed.

**User sees:** For P: Order received - prescription review next. For M/O: Continue to payment.

**Service responsibility:** Save the request even if the customer closes the browser. Repeated taps must not create new orders.

**Completion condition:** P goes to pharmacist; a basket without P goes straight toward payment.

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
