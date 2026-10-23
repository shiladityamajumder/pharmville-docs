# Pharmville: the complete business flow

## What is this process?

Pharmville helps a customer order health products from an eligible location and receive them through a tracked delivery. Pharmacy, store, warehouse, rider and finance staff each record their part so that a customer can understand what has happened and what is still waiting.

This is the intended flow in the current draft documentation. It is not a claim that the application is implemented or that every launch policy has been approved. In particular, prescription review, payment capture, deferred upload, stock policy and warehouse scope need the owners listed below.

## Who is involved?

The customer buys for themselves or an authorized dependent. Catalog staff maintain approved product information. Pharmacists review prescription medicines. Operations chooses the fulfillment site and resolves exceptions. Inventory staff protect batch stock; store and warehouse workers receive, pick and pack goods. Dispatchers and riders deliver parcels. Finance checks payments, refunds, invoices and cash; administrators manage permitted access/settings, and support coordinates help.

## How does it normally work?

### 1. Join, find products and build the basket

1. The customer enters a mobile number, reads the privacy notice and verifies a one-time code. They supply required profile details and can save addresses, map pins and authorized family profiles. Browsing may begin before sign-in; an existing session is not required to request the login code. See [accounts](Accounts-and-Login.md).
2. The customer searches by name, brand or composition, or browses categories. Product pages show the exact pack, composition, price and prescription label. P products need a prescription; M products are other medicines and O products are other goods. Unknown classifications cannot be ordered. See [discovery](Catalog-and-Product-Discovery.md).
3. The customer adds quantities to a saved cart. A mixed P/M/O basket is allowed in the draft design; ordinary M/O items do not need pharmacist review just because P is present.
4. At checkout the customer selects a delivery address. Pharmville checks actual serviceability, not just whether the PIN looks valid. For P products the customer selects the patient; the detailed draft uses one patient per such order.
5. Pharmville rechecks contents, price, fees, minimum value, classification and availability. The customer accepts the current summary. A cart or quote does not by itself mean stock has been reserved. See [checkout](Cart-and-Checkout.md).

### 2. Follow the correct prescription branch

6. **Without P products:** the order request can continue toward stock hold and payment without an upload, patient-specific pharmacy queue or pharmacist decision.
7. **With P products:** the customer attaches private prescription evidence. Pharmville records one request and shows that review is next. The pharmacist compares each P line with the selected patient and prescription, recording approval or a reason for correction/rejection.
8. If review changes the basket, the customer chooses to correct evidence, accept a revised basket/total or cancel under the applicable rule. Eligible M/O lines are retained; a changed medicine is not silently approved or charged.
9. The current detailed journey completes the required review before payment. RX-02 separately proposes uploading within 24 hours after ordering, with automatic cancellation. That deferred route is not approved and does not establish permission to collect money before review. Product, Pharmacy and Finance must settle it before it is enabled. See [prescriptions](Prescription-and-Pharmacy.md).

### 3. Check stock and money

10. Operations and Inventory identify an eligible open licensed location with the whole accepted basket and current usable batches. Stores are primary; warehouse fallback remains subject to approved scope and license. A tentative route can be evaluated earlier, but final stock evidence and assignment must agree.
11. Pharmville obtains a temporary hold on exact eligible stock before payment proceeds. The hold protects against another order taking the same pack; its duration and late-payment recovery require approval. If supply cannot be confirmed, the customer sees a problem before being asked to pay.
12. **Online payment:** the customer chooses a supported method through the proposed provider. Pharmville verifies money through trusted provider evidence rather than a browser return screen. **COD:** only eligible customers/orders can choose it; the recorded amount is due, not cash already collected.
13. The customer sees the recorded order and money status. Confirmation can appear in the app and approved message channels. Failure to send WhatsApp or email does not undo a committed order. See [payments](Payments-and-Billing.md).

### 4. Prepare, dispatch and deliver

14. Store or approved warehouse workers accept the task, pick the exact products/batches and report shortages. Packing checks the accepted basket, current prescription evidence, licensed site and reservation. Unsafe stock or a changed order stops preparation.
15. Dispatch requires completed fulfillment evidence, exact committed stock and authoritative full online payment or approved COD. Staff cannot bypass these gates because the order screen looks ready. See [store and warehouse](Store-and-Warehouse.md).
16. A dispatcher confirms an eligible rider. The rider accepts, records pickup and navigates to the customer. The customer sees out-for-delivery progress, permitted tracking, estimate and masked calling.
17. At the doorstep, Pharmville validates the customer delivery OTP and approved proof. COD actual collection is recorded separately. A location ping or photograph alone does not automatically settle money. See [delivery](Delivery-and-Rider-App.md).
18. The customer sees delivered only after accepted completion evidence. They can revisit order history and download an issued invoice. Finance later compares provider settlement and rider cash handover with the recorded transactions. See [reconciliation](Finance-and-Reconciliation.md).

### 5. Handle after-purchase requests and replenish supply

19. Customer cancellation is a draft before-packed rule. A return is a request subject to approved product/window/safety criteria. Operations checks the current state; receiving verifies actual returned goods, and Pharmacy/Inventory decide whether those goods can ever be saleable again.
20. Finance checks eligibility, previous refunds, approvals and payment evidence before sending one refund. The customer follows refund progress; an accepted request is not proof the bank received money. See [returns and refunds](Returns-and-Refunds.md).
21. In parallel, stores request replenishment. Warehouse staff receive supplier batches and dispatch approved transfers; destinations acknowledge actual receipts and shortages. Inventory updates only evidenced quantities and records reasons for adjustments. See [stock](Inventory-and-Stock.md).
22. Administrators maintain approved users, masters and content. Notifications point people to current protected records. Reports and audit history let authorized staff inspect outcomes without rewriting past evidence.

## What happens next?

Each order either advances through its satisfied gates, waits with a named team, or ends through an approved cancellation/return/refund outcome. A delivered order can still have an unresolved finance exception; closing delivery does not automatically close reconciliation.

## What can go wrong, and what does the system do?

- **Money paid, confirmation missing:** a connection drops after the bank debit. The customer sees checking payment and is not immediately asked to pay again. Finance checks the trusted provider record against the existing order; Operations rechecks any expired stock hold. The order resumes only with valid supply or follows approved compensation. [Payment recovery](Payments-and-Billing.md#what-can-go-wrong-and-what-does-the-system-do).
- **No safe stock, site or pharmacist:** an expiry, closure, stale feed or staffing gap prevents progress. The order stays blocked/waiting with Pharmacy or Operations, and the customer sees the actual outstanding step. No automatic approval, silent site split or unapproved substitution is allowed. [Order exceptions](Orders-and-Fulfillment.md#what-can-go-wrong-and-what-does-the-system-do).
- **Duplicate actions or an interrupted service:** a retry after lost acknowledgment must load the existing recorded result. Relevant owners resolve conflicting versions, pending money and incomplete work. Workers resume from committed facts; they do not restart charges or stock movements blindly. During an outage the screen must not invent success. [Technical recovery](../07-Engineering/State-and-Recovery-Contracts.md).
- **Rider, proof or doorstep failure:** dispatch owns unassigned parcels and failed attempts. Incorrect OTP leaves delivery incomplete; offline actions stay pending until validated. Tracked goods and actual COD remain accountable. [Delivery exceptions](Delivery-and-Rider-App.md#what-can-go-wrong-and-what-does-the-system-do).
- **Privacy or permission failure:** the server denies another patient’s record or another location’s operation. Security reviews suspicious access, support uses verified identity, and protected files stay private. A UI role is not a clinical or financial approval.

## What does the user see?

Customers see their current basket, outstanding prescription/payment step, confirmed order progress, delivery proof action and any eligible after-purchase options. Staff see scoped queues, reasons and recovery work. Notifications explain committed changes; reopening them loads the current record. Exact copy and waiting estimates need UX/Operations approval and must not promise unapproved deadlines.

## What still needs approval?

The [decision register](../09-References/Sources-and-Decisions.md) covers launch boundaries (D-001/D-002/D-021), login/privacy (D-003/D-013/D-023), payment/COD/tax (D-004/D-007/D-008/D-012), stock and clinical rules (D-005/D-006/D-009/D-010), rider proof (D-011), providers (D-014/D-016), operations readiness (D-017/D-022) and feature contracts (D-024). The available database baseline also needs reconciliation under D-015. These are not substituted by the business examples above.

## Related technical documentation

[Requirements and feature IDs](../01-Project/Features-and-Modules.md) · [System HLD](../02-Architecture/System-HLD.md) · [module HLD/LLD](../03-Modules/README.md) · [APIs](../05-APIs/README.md) · [database mappings](../04-Database/Module-Mapping.md) · [technical workflows](../06-Workflows/README.md) · [edge cases/tests by feature](../09-References/Coverage-and-Traceability.md) · [development plan](../08-Development-Plan/Implementation-Plan.md)

[Business Guide](README.md) · [Customer experience](Customer-Experience.md)
