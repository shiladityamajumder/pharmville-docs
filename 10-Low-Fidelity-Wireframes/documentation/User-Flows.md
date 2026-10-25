# Connected user flows

The prototype opens at [Choose Experience](../index.html#/choose). [Mobile App](../index.html#/mobile), [Website](../index.html#/website) and [Complete Journeys](../index.html#/journeys) are distinct pages. Each platform has its own searchable screen selector.

Journey progress follows the current route and shared mock data; required business actions remain explicit.

The Journeys page offers 13 guided tasks: **Create an account**, **Find and order a product**, **Order a prescription medicine**, **Pay for an order**, **Prepare an order at a store**, **Deliver an order**, **Request a return**, **Process a refund**, **Receive stock at a warehouse**, **Replenish stock through procurement**, **Recover from an unavailable product**, **Return and reverse logistics**, and **Resolve a customer support case**. The [role/workspace matrix](Role-Workspace-Matrix.md) explains proposed access boundaries; the [completion ledger](Prototype-Completion-Ledger.md) records current coverage and limitations.

At each journey start, keep the current data or load that journey’s prepared demo fixture. Replacing existing progress requires confirmation. Cross-role handoffs offer **Continue as [role]** in the journey itself, preserve the same record, and retain permission and business gates.

Staff handoffs open Website; Rider handoffs open Mobile. Entering the destination URL does not grant its role. The local Access workspace illustrates a single session with backend-derived demo workspaces and permission checks; demo reviewer persona controls remain separate from authenticated workspace selection.

All links below open the same local application and persistent fictional records. The first visit is a fresh shopping state with an empty cart and no order or payment. Prepared fixtures are visibly labelled as demo data; any prior completed action they contain is historical. Reset between independent demonstrations.

## Mobile and Website shopping demonstrations

Choose the experience, select Search medicines, search for “wellness”, open the exact product and add it. Open Cart, continue through delivery address, patient confirmation and summary, then choose payment. Mobile has bottom navigation and stacked summaries; Website has header navigation and a side summary.

Both experiences retain the same item, quantity, price and order reference when switching. Sign in and complete the profile if the next action requests them.

On Payment, expand **What if something goes wrong?** and choose **Payment completed but confirmation was lost**. The result shows the original pending payment. **Check payment status** reconciles the captured fictional result without another charge. **Payment is still pending** demonstrates an unknown result that stays pending after a check.

To compare outcomes on fresh records, explicitly load a new checkout example and confirm replacement. Returning to normal retains actual operations. See [How to Run](How-to-Run.md) for exact URLs and a quick manual check.

The task links in the detailed reference below retain legacy compatibility. Within an explicit experience, screen navigation preserves its URL prefix.

## New customer, profile and delivery address

1. [Sign in](../index.html#/customer/login), enter `0000000000`, acknowledge the demo privacy notice and request a code.
2. Verify `246810`. Wrong/expired/delivery-failure/fallback/rate-limit scenarios show distinct outcomes; no real code is sent.
3. [Complete the profile](../index.html#/customer/profile), then save an [address and schematic pin](../index.html#/customer/addresses). PIN `000000` is the serviceable synthetic fixture.
4. Add an authorized [dependent](../index.html#/customer/family), inspect [consent](../index.html#/customer/privacy) or submit a [deletion review](../index.html#/customer/deletion).

## Non-prescription purchase and uncertain payment

1. [Browse](../index.html#/customer/home), search or open an exact product. Add a wellness/ordinary medicine item to the cart; edit quantity or remove it before submission.
2. [Select the address](../index.html#/customer/checkout-address) and [accept the current summary](../index.html#/customer/checkout-summary). M/O-only baskets skip prescription review. A stale price needs explicit acceptance.
3. [Choose payment](../index.html#/customer/payment). Online options are synthetic UPI/card/net banking. COD requires its explicitly labelled eligible demo fixture; no production cap is invented.
4. On the payment screen, choose **Payment completed but confirmation was lost** in the on-screen situation control. This performs the guarded fictional payment attempt. The result stays pending on one reference; repeated attempts cannot create another charge.
5. [Recover the payment](../index.html#/customer/payment-recovery) under Normal to check the existing captured fixture. Do not request another charge. The order then appears in all relevant staff views.

## Prescription medicines, partial approval and acceptance

1. Start a fresh basket with a P item and a wellness item. Select the authorized patient, accept summary and [supply fictional filenames](../index.html#/customer/prescription-upload), confirming the patient association.
2. The customer waits at [review status](../index.html#/customer/prescription-status). Payment is blocked while current P approval is missing.
3. In the prescription journey, choose **Continue as Pharmacist**, then open [pharmacist decisions](../index.html#/website/pharmacy/decision). Record reviewer/registration, check exact-line evidence and choose outcomes with rejection reasons. Select the Customer prescription-status card to view the recorded reason. This records a reviewer’s fictional choice; no medical logic approves a real prescription.
4. With all remaining P approved, customer **Continue** obtains current eligible stock and reaches payment. A partial decision can offer a permitted [revised basket](../index.html#/customer/revised-order) for explicit acceptance. A fully rejected prescription instead requires corrected evidence or cancellation; payment stays blocked. No silent substitution or price change occurs.
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

Before packed, a paid customer can [request cancellation](../index.html#/customer/cancellation) and confirm the dialog. Finance separately [creates/approves/checks a refund intent](../index.html#/staff/refunds); the customer sees that state in [refund tracking](../index.html#/customer/refund).

A delivered item can have an item/quantity-specific [return request](../index.html#/customer/return), which waits for policy/inspection rather than issuing money or saleable stock automatically.

## Warehouse receipt and replenishment

1. [Receive a supplier batch](../index.html#/warehouse/receiving), including invoice, batch, manufacturing/expiry, accepted quantity and quality. A short receipt needs a reason and credits only accepted packs.
2. [Approve the seeded replenishment](../index.html#/warehouse/replenishment). [Dispatch](../index.html#/warehouse/dispatch) five packs from warehouse `LOT-3` using a unique transfer reference. Source stock decreases; destination stock does not increase yet.
3. The store [records actual receipt](../index.html#/store/receipt). Four accepted packs from five dispatched leaves a shortage of one. Duplicate receipt/dispatch references cannot apply the movement twice.
4. Inspect [scoped batches](../index.html#/staff/inventory) and [movement ledger](../index.html#/staff/ledger). Warehouse fallback/urgent capacity remain policy review requests.

## Procurement and unavailable-item recovery

Use **Replenish stock through procurement** for the PO-linked path, or **Recover from an unavailable product** to start at the current store stock view. The store raises one unique replenishment request, Procurement creates and locally approves a PO against the synthetic unverified supplier, and Warehouse records actual accepted quantity against that PO. Warehouse receipt increases only warehouse stock. A separate transfer and actual store receipt are required before the customer catalog reflects the indicative availability.

This is a proposed procurement interaction because the inherited warehouse flow starts from receiving and replenishment approval but does not approve supplier commercial terms, ordering integration, or procurement authority. No supplier is contacted. Existing product and warehouse invariants still apply: replay does not credit twice, unreceived transfers remain in transit, and stock becomes available at the destination only after receipt.

## Return, reverse pickup and support

The basic return journey records a delivered-item request and leaves eligibility pending. **Return and reverse logistics** continues through an owner-entered eligibility outcome with a policy reference, dispatcher assignment, current rider pickup, warehouse physical receipt and quarantine, then an independent Finance decision before a refund intent can be created. The prototype does not infer return windows or condition rules, issue refunds automatically, or place returned goods back into saleable inventory.

For support, sign in through the customer OTP fixture, open [Customer Help](../index.html#/customer/help), and create a minimal case linked to the current order. A support persona assigns and updates the case through its lifecycle; the customer sees the same status/history and a shared synthetic notification event. Keep personal, prescription and payment secrets out of demo text.

## COD, deposit and reconciliation

For a completed COD demo order, [record actual cash handover](../index.html#/delivery/riders) or Finance’s cash receipt, then [compare COD collected/deposited](../index.html#/staff/reconciliation). A shortage stays an open exception. Provider settlement comparison checks reference/amount/currency and never overwrites an unpaid order to make totals match.

## Staff, permissions, reporting and audit

[Invite fictional staff](../index.html#/staff/staff), inspect the [draft permission matrix](../index.html#/staff/permissions) and try the Permission denied scenario. A role proposal cannot grant its own privileges. [Password plus authenticator](../index.html#/access/login) demonstrates the shared staff identity session. [Authorized workspaces](../index.html#/access/workspaces) are derived from the session fixture; Administration, Pharmacist and Finance entries show a proposed step-up authenticator challenge before context activation. [Revocation](../index.html#/access/sessions) blocks protected forms until another demo sign-in. No UI role selection acts as production authorization.

Select a [report](../index.html#/staff/reports), filters and dates, generate results, sort them, prepare an export and download the local TSV. Access-revoked and failed-generation states block output. [Audit](../index.html#/staff/audit) filters/exports read-only events; historical mutation has no control.

Notifications retry only their event, while [support](../index.html#/staff/support) routes exceptions to the responsible domain without setting paid or clinically approved.
