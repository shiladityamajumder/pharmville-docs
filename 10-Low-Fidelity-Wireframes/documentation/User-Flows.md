# Connected user flows

All links below open the same local Explorer application and persistent fictional records. The initial order is `PV-DEMO-001`, with P item A and a wellness product waiting for review. Reset between independent demonstrations. A new submitted customer basket replaces this example; clinical/payment/stock gates are reset when its evidence changes.

## New customer, profile and delivery address

1. [Sign in](../index.html#/customer/login), enter `0000000000`, acknowledge the demo privacy notice and request a code.
2. Verify `246810`. Wrong/expired/delivery-failure/fallback/rate-limit scenarios show distinct outcomes; no real code is sent.
3. [Complete the profile](../index.html#/customer/profile), then save an [address and schematic pin](../index.html#/customer/addresses). PIN `000000` is the serviceable synthetic fixture.
4. Add an authorized [dependent](../index.html#/customer/family), inspect [consent](../index.html#/customer/privacy) or submit a [deletion review](../index.html#/customer/deletion).

## Non-prescription purchase and uncertain payment

1. [Browse](../index.html#/customer/home), search or open an exact product. Add a wellness/ordinary medicine item to the cart; edit quantity or remove it before submission.
2. [Select the address](../index.html#/customer/checkout-address) and [accept the current summary](../index.html#/customer/checkout-summary). M/O-only baskets skip prescription review. A stale price needs explicit acceptance.
3. [Choose payment](../index.html#/customer/payment). Online options are synthetic UPI/card/net banking. COD requires its explicitly labelled eligible demo fixture; no production cap is invented.
4. Choose the **Paid, confirmation lost** scenario before submitting online payment. The result stays pending on one reference. Repeated Pay must not create another attempt.
5. [Recover the payment](../index.html#/customer/payment-recovery) under Normal to check the existing captured fixture. Do not request another charge. The order then appears in all relevant staff views.

## Prescription medicines, partial approval and acceptance

1. Start a fresh basket with a P item and a wellness item. Select the authorized patient, accept summary and [supply fictional filenames](../index.html#/customer/prescription-upload), confirming the patient association.
2. The customer waits at [review status](../index.html#/customer/prescription-status). Payment is blocked while current P approval is missing.
3. Switch to [pharmacist decisions](../index.html#/pharmacy/decision). Record reviewer/registration, check exact-line evidence and choose outcomes with rejection reasons. This records a reviewer’s fictional choice; no medical logic approves a real prescription.
4. With all remaining P approved, customer **Continue** obtains current eligible stock and reaches payment. With rejection/partial approval, [accept the proposed revised basket](../index.html#/customer/revised-order), replace evidence or cancel. No silent substitution or price change occurs.
5. Deferred post-order upload remains visibly blocked under RX-02 until its conflicting policy is approved.

## Fulfillment, dispatch and rider delivery

1. With current clinical approval and paid/eligible COD plus stock, [accept the store order](../index.html#/store/queue).
2. [Pick exact batches](../index.html#/store/pick): `LOT-2` for PRD-3 and `LOT-1` for PRD-1 in the starting example. Complete exact quantities, then [pack](../index.html#/store/pack) with package reference and checklist. Repeated packing does not deduct stock twice.
3. [Assign available rider A](../index.html#/delivery/assignment) with a reason. Sign in as [RID-1](../index.html#/rider/login), using `246810`, set duty and accept the assigned task.
4. Store verifies [custody handoff](../index.html#/store/pack); rider then confirms [pickup](../index.html#/rider/pickup). Each step requires the current record/version.
5. [Complete delivery](../index.html#/rider/completion) with `135790`, synthetic proof and actual COD (zero for prepaid). Wrong proof cannot complete delivery. Offline completion remains queued until reconnect validates current assignment and evidence.
6. Reopen [customer tracking](../index.html#/customer/tracking) to see the same outcome. Maps and calls are schematic; no provider is contacted.

## Failed delivery and customer aftercare

The rider records a fixed illustrative [failure reason](../index.html#/rider/failure). Dispatch chooses [reattempt, reschedule or return-to-store](../index.html#/delivery/failures), retaining custody, stock and actual cash separately. No automatic refund, stock credit or cash clearance is implied.

Before packed, a paid customer can [request cancellation](../index.html#/customer/cancellation) and confirm the dialog. Finance separately [creates/approves/checks a refund intent](../index.html#/staff/refunds); the customer sees that state in [refund tracking](../index.html#/customer/refund). A delivered item can have an item/quantity-specific [return request](../index.html#/customer/return), which waits for policy/inspection rather than issuing money or saleable stock automatically.

## Warehouse receipt and replenishment

1. [Receive a supplier batch](../index.html#/warehouse/receiving), including invoice, batch, manufacturing/expiry, accepted quantity and quality. A short receipt needs a reason and credits only accepted packs.
2. [Approve the seeded replenishment](../index.html#/warehouse/replenishment). [Dispatch](../index.html#/warehouse/dispatch) five packs from warehouse `LOT-3` using a unique transfer reference. Source stock decreases; destination stock does not increase yet.
3. The store [records actual receipt](../index.html#/store/receipt). Four accepted packs from five dispatched leaves a shortage of one. Duplicate receipt/dispatch references cannot apply the movement twice.
4. Inspect [scoped batches](../index.html#/staff/inventory) and [movement ledger](../index.html#/staff/ledger). Warehouse fallback/urgent capacity remain policy review requests.

## COD, deposit and reconciliation

For a completed COD demo order, [record actual cash handover](../index.html#/delivery/riders) or Finance’s cash receipt, then [compare COD collected/deposited](../index.html#/staff/reconciliation). A shortage stays an open exception. Provider settlement comparison checks reference/amount/currency and never overwrites an unpaid order to make totals match.

## Staff, permissions, reporting and audit

[Invite fictional staff](../index.html#/staff/staff), inspect the [draft permission matrix](../index.html#/staff/permissions) and try the Permission denied scenario. A role proposal cannot grant its own privileges. [Password plus authenticator](../index.html#/access/login) demonstrates staff access; [revocation](../index.html#/access/sessions) blocks protected forms until another demo sign-in.

Select a [report](../index.html#/staff/reports), filters and dates, generate results, sort them, prepare an export and download the local TSV. Access-revoked and failed-generation states block output. [Audit](../index.html#/staff/audit) filters/exports read-only events; historical mutation has no control. Notifications retry only their event, while [support](../index.html#/staff/support) routes exceptions to the responsible domain without setting paid or clinically approved.
