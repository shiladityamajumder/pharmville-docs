# Pharmville — Documented Journey Map

These are the **existing** guided journeys from the offline prototype. Steps and screen routes have not been redesigned.

> [!IMPORTANT]
> Every listed role is the persona for a demonstration step. These arrows represent documented screen-to-screen handoffs, not an assertion of production authorization or implementation.

## 01. Create an account

**Goal:** See how a customer verifies a mobile number and completes a profile.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Enter a mobile number | `customer/login` | As defined by workspace |
| 2 | Verify the code | `customer/otp` | As defined by workspace |
| 3 | Complete your profile | `customer/profile` | As defined by workspace |

## 02. Find and order a product

**Goal:** Follow product discovery, checkout checks, payment and order tracking.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Find a product | `customer/home` | As defined by workspace |
| 2 | Review your cart | `customer/cart` | As defined by workspace |
| 3 | Choose a delivery address | `customer/checkout-address` | As defined by workspace |
| 4 | Review your order | `customer/checkout-summary` | As defined by workspace |
| 5 | Choose how to pay | `customer/payment` | As defined by workspace |
| 6 | Check the payment result | `customer/payment-result` | As defined by workspace |
| 7 | Follow your order | `customer/tracking` | As defined by workspace |

## 03. Order a prescription medicine

**Goal:** See customer submission, pharmacist review and the customer’s next step.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Choose a medicine | `customer/home` | As defined by workspace |
| 2 | Review your cart | `customer/cart` | As defined by workspace |
| 3 | Choose a delivery address | `customer/checkout-address` | As defined by workspace |
| 4 | Choose the patient | `customer/checkout-patient` | As defined by workspace |
| 5 | Accept the order details | `customer/checkout-summary` | As defined by workspace |
| 6 | Provide prescription details | `customer/prescription-upload` | As defined by workspace |
| 7 | Pharmacist receives the request | `pharmacy/queue` | Pharmacist |
| 8 | Review the submitted evidence | `pharmacy/review` | Pharmacist |
| 9 | Record a decision | `pharmacy/decision` | Pharmacist |
| 10 | Customer reviews the result | `customer/prescription-status` | Customer |
| 11 | Complete the payment step | `customer/payment` | As defined by workspace |
| 12 | Check the payment result | `customer/payment-result` | As defined by workspace |
| 13 | Follow the order | `customer/tracking` | As defined by workspace |

## 04. Pay for an order

**Goal:** Follow a valid order through payment and safe recovery on the same reference.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Choose products | `customer/home` | As defined by workspace |
| 2 | Review your cart | `customer/cart` | As defined by workspace |
| 3 | Choose a delivery address | `customer/checkout-address` | As defined by workspace |
| 4 | Review the accepted order | `customer/checkout-summary` | As defined by workspace |
| 5 | Choose a payment method | `customer/payment` | As defined by workspace |
| 6 | Check the result | `customer/payment-result` | As defined by workspace |
| 7 | Recover the existing payment | `customer/payment-recovery` | As defined by workspace |

## 05. Prepare an order at a store

**Goal:** Follow order acceptance, exact item picking, packing and custody checks.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Open incoming orders | `store/queue` | Store staff |
| 2 | Pick the listed items | `store/pick` | Store staff |
| 3 | Pack and hand off the order | `store/pack` | Store staff |

## 06. Deliver an order

**Goal:** Follow assignment, rider pickup, delivery proof and customer tracking.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Assign a ready parcel | `delivery/assignment` | Delivery manager |
| 2 | Sign in as the rider | `rider/login` | Delivery rider |
| 3 | Accept the delivery task | `rider/tasks` | Delivery rider |
| 4 | Verify parcel handoff | `store/pack` | Store staff |
| 5 | Confirm pickup | `rider/pickup` | Delivery rider |
| 6 | Confirm delivery | `rider/completion` | Delivery rider |
| 7 | Check the customer timeline | `customer/tracking` | As defined by workspace |

## 07. Request a return

**Goal:** See a delivered order, a customer return request and separate refund review.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Find the order | `customer/orders` | As defined by workspace |
| 2 | Request a return | `customer/return` | As defined by workspace |
| 3 | Check refund progress | `customer/refund` | As defined by workspace |

## 08. Process a refund

**Goal:** Follow the finance instruction and show the same reference to the customer.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Review refund work | `staff/refunds` | Finance team |
| 2 | Check the customer status | `customer/refund` | As defined by workspace |

## 09. Receive stock at a warehouse

**Goal:** Record accepted quantity, investigate discrepancies and prepare a store transfer.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Record the delivery | `warehouse/receiving` | Warehouse staff |
| 2 | Review the store request | `warehouse/replenishment` | Warehouse staff |
| 3 | Dispatch a transfer | `warehouse/dispatch` | Warehouse staff |
| 4 | Confirm what arrived | `store/receipt` | Store staff |

## 10. Replenish stock through procurement

**Goal:** Connect a store request to a proposed purchase order and receiving record using the same synthetic supplier and stock state.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Review stock demand | `warehouse/replenishment` | Warehouse staff |
| 2 | Create and approve a purchase order | `procurement/orders` | Procurement |
| 3 | Receive approved goods | `warehouse/receiving` | Warehouse staff |
| 4 | Dispatch to the requesting store | `warehouse/dispatch` | Warehouse staff |
| 5 | Confirm store receipt | `store/receipt` | Store staff |
| 6 | Review warehouse stock | `staff/inventory` | Store worker |

## 11. Recover from an unavailable product

**Goal:** Review an unavailable item, request stock, link a purchase order and update shared warehouse inventory.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Review current availability | `staff/inventory` | Store worker |
| 2 | Submit store demand | `store/replenishment` | Store staff |
| 3 | Create and approve replenishment PO | `procurement/orders` | Procurement |
| 4 | Receive supplier stock | `warehouse/receiving` | Warehouse staff |
| 5 | Dispatch stock to the store | `warehouse/dispatch` | Warehouse staff |
| 6 | Confirm accepted store quantity | `store/receipt` | Store staff |
| 7 | Confirm catalog availability | `customer/search` | As defined by workspace |

## 12. Return and reverse logistics

**Goal:** Carry a delivered order through owner eligibility, pickup, quarantine inspection and separate Finance review.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Submit an item-specific request | `customer/return` | As defined by workspace |
| 2 | Record owner eligibility outcome | `staff/returns` | Order operator |
| 3 | Assign a reverse pickup | `delivery/returns` | Delivery manager |
| 4 | Sign in as the assigned rider | `rider/login` | Delivery rider |
| 5 | Confirm pickup custody | `rider/returns` | Delivery rider |
| 6 | Receive and quarantine | `warehouse/returns` | Warehouse staff |
| 7 | Record Finance review | `staff/refunds` | Finance team |
| 8 | Follow refund status | `customer/refund` | As defined by workspace |

## 13. Resolve a customer support case

**Goal:** Create an order-linked case, route it, record operational history and show the updated status to the customer.

| Step | Screen | Screen route | Persona / handoff |
| ---: | --- | --- | --- |
| 1 | Start a customer session | `customer/login` | As defined by workspace |
| 2 | Verify the demo code | `customer/otp` | As defined by workspace |
| 3 | Contact support | `customer/help` | As defined by workspace |
| 4 | Assign and update the case | `staff/support` | Support |
| 5 | Check case history | `customer/help` | As defined by workspace |
