# Critical operation contracts

**Status: Proposed and incomplete pending review.** These operation-specific schemas replace generic request/accepted-envelope assumptions for the most safety-sensitive commands. They are not implemented routes or approved provider contracts. D-024 still blocks implementation until exact persistence, DTO limits, runtime grants and decisions are reviewed. Existing numbered module contracts remain the route index; these sections refine their intent.

## Common typed boundary

Public resource references below are UUIDs unless described as opaque tokens. Version values are positive integers referring to the named aggregate, not a universal version shared by unrelated tables. Quantities are positive decimal strings at the actual product unit precision; money is an amount/currency pair calculated by the server. Unknown fields, caller actor IDs, prices, clinical approvals and internal BIGINT keys must be rejected or explicitly excluded by the reviewed DTO.

Mutations use a scoped `Idempotency-Key` plus request fingerprint. Match replays the saved result; mismatched reuse returns `409`. A domain failure rolls back local business changes. `401` is missing trust, `403/404` scope denial, `409` stale/incompatible state and `422` invalid/ineligible input. The exact standard machine-code catalog remains proposed. Pending external work is not represented as completed success.

## Quote: API-020

`POST /v1/checkouts/quotes` — **features CHK-02, CHK-05, CHK-06**. Customer session; own active cart, address and patient where P is present. Checkout commands its own quote; Catalog/Pricing, Inventory and customer domains provide validated read results.

| Request field | Type / requirement | Server rule |
| --- | --- | --- |
| `cart_id` | UUID, required | Owned active cart |
| `cart_version` | Positive integer, required | Match current cart state |
| `address_id` | UUID, required | Owned and currently serviceable |
| `patient_id` | UUID, required for P, otherwise omitted | Authorized patient; exact field mapping to clinical patient profile needs review |

Proposed `200` response: opaque `quote_ref`, accepted-input version, exact line product/quantity/price/classification summaries, minimum/fee/tax/total/currency, delivery estimate, changed-line notices and required next action. These are explicit response fields for review, not evidence of a quote table. The quote reference’s persistence/expiry contract remains blocked under D-024/D-009. The server reads `commerce.carts`, `commerce.cart_items`, pricing evidence and permitted address/patient/stock results; no stock hold or provider charge occurs just because a quote is returned.

Stale cart returns `409`; unsupported address, unknown class or missing policy blocks quote acceptance. No provider-derived availability is invented after timeout. TC-CHK-02-DENY, TC-CHK-05-DENY and TC-CHK-06-DENY check the distinct outcomes.

## One request: API-021

`POST /v1/checkouts` — **features CHK-07, CHK-08**, with Cart Checkout accountable for entry and Order Operations for the order aggregate. Customer session with own accepted quote. Required proposed fields: `quote_ref` (opaque), `cart_version` (positive integer) and `accepted: true` (explicit customer action). Any prescription association is supplied through the separately authorized intake operation, not a caller assertion of approval.

Proposed first-result `201`: `checkout_id`, `order_id`, accepted revision reference/version and `next_action` indicating review, correction or payment eligibility. Safe replay returns the stored reference/outcome using the documented replay status; status selection needs API review. Creation records one `commerce.checkouts` intent and delegates one `commerce.orders`/`commerce.order_revisions` creation, with idempotency and required history/audit/outbox. The cross-owner local transaction interface and exact columns still require D-024 review.

This records a request, not payment confirmation. P goes to review; M/O skips it. API-052 supplies the later hold before payment. If the response is lost after commit, replay finds the same request. Failure before commit leaves no partial checkout/order pair. TC-CHK-07-DENY verifies same intent/body versus conflicting body; TC-CHK-08-DENY verifies the later hold expiry/payment race.

## Reserve and release: API-052 / API-053

`POST /v1/internal/inventory/reservations` — **features CHK-08, INV-01, INV-03**. This is an authenticated internal command with reviewed Inventory capability, not a route authorized by a customer-supplied service name. Required proposed fields: `order_id`, `order_revision_id`, `site_id` (public UUIDs) and expected order/revision version. Inventory derives exact item quantities and eligible lots from the accepted order and current evidence; callers cannot supply trusted available quantity or self-approve a lot.

Proposed `201` result: reservation references, order/revision/site, actual held item/lot/quantity summary, status and actual `expires_at`. No fixed TTL is defined. Lock the relevant order and eligible balance/reservation rows in deterministic order; verify approved license, fresh source observation, expiry and shelf life; persist the complete eligible set or no new hold. Tables: `warehouse.inventory_lots`, `warehouse.stock_balances`, `warehouse.stock_reservations`, `warehouse.stock_holds`, and the corresponding controlled movement evidence only as required by the actual SQL guard. The exact relationship between hold, reservation and ledger writes is a D-024 field-level review, not permission to duplicate ledger quantity.

`POST /v1/internal/inventory/reservations/{reservation_id}/release` requires the trusted owning workflow/expiry worker, a positive `reservation_version` and approved `reason_code`. Proposed `200` returns the actual current reservation outcome. Active unused hold may become released under approved policy; replay does not release twice; committed or changed state conflicts rather than adding stock back. TC-INV-03-DENY and TC-CHK-08-DENY must include last-unit contention, expiry versus commitment and stale-source evidence.

## Review decision: API-062

`POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` — **features PHM-03, PHM-05, supporting RX-05**. Requires current authenticated pharmacist permission and authorized clinical scope; administrative status alone is insufficient.

Required proposed body: `review_version` (positive integer), `order_revision_id` and `prescription_id` (UUIDs), `decision` (reviewed allowlist of approval/rejection/correction actions), and `reason_code` when that action requires one. The exact action-to-stored-enum mapping remains D-006/D-024; do not introduce unsupported database values. Reviewer identity, registration and time are server-derived. Validate the exact patient, SKU, strength/form/quantity and evidence version.

Proposed `200` returns current line decision, reason safe for the customer, reviewer evidence and review/version. Update only `clinical.order_reviews`/`clinical.order_review_items` through Pharmacy, retaining immutable clinical history and post-commit outcome. Intake owns document/patient linkage; no clinician command silently rewrites the order or payment. Wrong patient/unauthorized reviewer is denied; stale review/revision returns `409`. TC-PHM-03-DENY and TC-PHM-05-DENY assert one valid decision and no stale approval bypass.

## Money initiation and provider evidence: API-075 / API-076

`POST /v1/payments/intents` — **feature FIN-01, supporting CHK-03**. Customer session and owned accepted revision with required current clinical approval/hold. Proposed required fields: `order_id`, `order_revision_id`, expected order version and a permitted payment-method choice. The server derives amount/currency. Proposed `201/202` distinguishes a persisted intent from pending adapter work and returns `payment_intent_id`, current status and only the approved provider continuation token/link. Exact provider token fields are blocked by D-016.

Persist one `payment.payment_intents`/`payment.payment_attempts` operation with local audit/outbox; network creation runs outside the transaction under the provider’s evidenced idempotency support. Timeout leaves an identifiable pending/unknown result. No client `paid=true`, screenshot or redirect can complete it.

`POST /v1/webhooks/cashfree` is authenticated by the exact approved provider raw-body signature/timestamp/event contract, never a customer bearer session. Provider-specific header names, canonicalization, retries and acknowledgment status remain blocked by D-016. Retain source event identity in `payment.payment_webhooks`, verify amount/currency/order/revision, deduplicate, and commit trusted money effects before the adapter’s agreed acknowledgment. A contradictory or out-of-order event is reconciled, not applied as a blind backward transition. The existing [Finance contract](Finance_Payments.md#api-076--post-v1webhookscashfree) gives the trust boundary. TC-FIN-01-DENY and TC-CHK-03-DENY require signed sandbox evidence before provider readiness.

COD eligibility belongs to the reviewed checkout/order command and Finance’s approved policy, not the Cashfree callback. A complete COD selection/approval command and DTO remain missing; API-080 is reconciliation, not an invented COD approval endpoint. See CHK-04 and D-007.

## Cancellation and return: API-027 / API-028

`POST /v1/me/orders/{order_id}/cancel` — **ORD-04**. Customer session and owned order; proposed body `order_version` plus approved `reason_code`. Serialize against current packing state and apply the approved before-packed rule. Proposed `200/202` returns cancellation reference, accepted/current state and separate refund status. Delegate order change to Operations, unused hold release to Inventory and refund eligibility to Finance. Tables include `commerce.cancellations`, `commerce.cancellation_items`, order/history and owner-managed hold/refund evidence; exact atomic orchestration remains D-024. No refund is complete merely because cancellation is accepted.

`POST /v1/me/orders/{order_id}/returns` — **ORD-05**. Proposed required fields: current `order_version`, item references/positive requested quantities and approved return reason. Check actual eligible delivered quantities and prior accepted returns under approved policy; return reference/status rather than stock credit or payout. `commerce.returns`/`commerce.return_items` record the request through Operations; receiving and disposition are later authorized work. D-004/D-006 must supply item/window rules. TC-ORD-04-DENY serializes packing/cancellation; TC-ORD-05-DENY confirms no automatic money/stock effect.

## Refund instruction: API-078

`POST /v1/admin/finance/refunds` — **FIN-03**. Scoped Finance permission, reason and required approval; no administrator/support bypass. Proposed required fields: `payment_intent_id`, `order_id`, accepted revision reference, decimal-string `amount`, currency, approved `reason_code` and expected refund-balance/intent version. Approval references are required where configured policy demands them; exact proof format and threshold remain D-004/D-008/D-024.

Proposed `202` returns `refund_id`, requested amount/currency and pending/approval status. Finance locks the relevant paid/refunded evidence and persists one `payment.refunds`/`payment.refund_allocations` instruction within remaining eligible paid value. Provider IO follows commit; trusted result completes a subsequent transition. Timeout does not free the balance for a duplicate instruction or falsely mark completed. COD refund destination verification remains a separate blocked FIN-04 contract. TC-FIN-03-DENY verifies duplicate and concurrent cumulative refund limits; TC-FIN-04-DENY verifies no payment to unverified details.

## Delivery proof: API-073

`POST /v1/rider/tasks/{task_id}/complete` — **RID-04**, with Delivery Operations as command/data owner and Rider App as client. Current authenticated assigned rider only. Proposed required body: `assignment_version`, `otp_challenge_id` (opaque), `otp` (secret string), permitted private proof-file reference(s), and actual COD amount/currency only for COD. Approved proof policy, file access and exact task-to-shipment mapping remain D-011/D-024.

Proposed `200/202` response distinguishes accepted completion from pending dependent processing and returns task/shipment reference, recorded delivery outcome and separate collection outcome. Validate proof, scope, current assignment and eligible shipment state before atomically consuming OTP/recording accepted delivery evidence under Delivery; Finance coordinates one COD fact. Tables: `logistics.delivery_assignments`, `logistics.delivery_otp_challenges`, `logistics.delivery_attempts`, `logistics.shipments` and owner-managed `payment.cod_collections`. A cross-module atomicity review is required; a split commit may not be described as all-or-nothing without its interface.

Incorrect OTP leaves completion unaccepted. Lost successful response replays the same recorded result; offline captured time does not override expiry or a changed assignment. TC-RID-04-DENY and TC-DLV-03-DENY cover invalid proof, replay and stale reassignment.

## Remaining operation review

For all other proposed routes, the [owning API document](README.md#module-api-documents) remains the source of current readiness. Missing request/response fields, input bounds, transition mappings or write-field lists are blocked under D-024, not implicitly filled by this document. The [feature register](../09-References/Coverage-and-Traceability.md) distinguishes direct references, cross-module support and unresolved feature operations. Full OpenAPI and provider contracts remain development prerequisites, not documentation validation results.
