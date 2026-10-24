# Critical operation contracts

**Status: Proposed and incomplete pending review.** These operation-specific schemas replace generic request/accepted-envelope assumptions for the most safety-sensitive commands. They are not implemented routes or approved provider contracts. D-024 still blocks implementation until exact persistence, DTO limits, runtime grants and decisions are reviewed.

Existing numbered module contracts remain the route index; these sections refine their intent.

**Casing reconciliation:** this earlier critical-contract draft uses snake_case request names. The package-wide public JSON convention is now camelCase, consistent with the verified authentication-service envelope. The OpenAPI schemas show the proposed camelCase names for new Pharmville DTOs; the snake_case spellings below are retained as historical design evidence, not a confirmed deployed wire contract.

D-024 must approve the mapping before implementation. No deployed compatibility is claimed because no Pharmville HTTP route was found.

## Database-first DTO boundary

The checked-in [table catalog](../04-Database/Tables/README.md) is the primary available schema reference for this package; [Module Mapping](../04-Database/Module-Mapping.md) and each owning module LLD identify candidate read/write ownership, not grants. Public DTO properties below are use-case projections, not direct ORM serialization.

Public UUID `id` references may be exposed when ownership allows; `internal_id`, `*_internal_id`, audit actors, hashes, provider secrets, and raw clinical/patient fields stay internal. A computed or token field with no persisted column is explicitly labeled as such.

The field-level column mappings and table constraints for these operations are recorded in [Database-to-DTO mapping](Database-DTO-Mapping.md). The exact Pharmville database source folder is absent; these mappings rely on checked-in table documentation and remain subject to migration-source/runtime verification.

## Common typed boundary

Public resource references below are UUIDs unless described as opaque tokens. Version values are positive integers referring to the named aggregate, not a universal version shared by unrelated tables. Quantities are positive decimal strings at the actual product unit precision; money is an amount/currency pair calculated by the server.

Unknown fields, caller actor IDs, prices, clinical approvals and internal BIGINT keys must be rejected or explicitly excluded by the reviewed DTO.

Mutations use a scoped `Idempotency-Key` plus request fingerprint. Match replays the saved result; mismatched reuse returns `409`. A domain failure rolls back local business changes. `401` is missing trust, `403/404` scope denial, `409` stale/incompatible state and `422` invalid/ineligible input.

The exact standard machine-code catalog remains proposed. Pending external work is not represented as completed success.

## Quote: API-020

`POST /v1/checkouts/quotes` — **features CHK-02, CHK-05, CHK-06**. Customer session; own active cart, address and patient where P is present. Checkout commands its own quote; Catalog/Pricing, Inventory and customer domains provide validated read results.

| Request field | Type / requirement | Server rule |
| --- | --- | --- |
| `cartId` | UUID, required | Public `commerce.carts.id`; authenticated customer must own the active cart |
| `cartVersion` | Positive integer, required | Matches `commerce.carts.row_version`; stale cart is rejected |
| `addressId` | UUID, required | Public `customer.addresses.id`; caller ownership is checked and serviceability is evaluated separately |
| `patientId` | UUID, conditionally required for P lines | Public `clinical.patient_profiles.id`; verify association through `customer.family_members` and do not persist it to a cart if the documented schema has no such field |

Proposed `200` response: `quoteToken` is a short-lived opaque signed token, not a database column or persisted quote entity. The server binds it to the cart public ID/version, address, patient scope when applicable, and a canonical quote hash. Token format, expiry, signing and replay/acceptance policy remain D-009/D-024 decisions. `lines` are derived from `commerce.cart_items` plus published catalog/classification and server price results; fields include public `productId`, `quantity` (decimal string at supported precision), `commerceClass`, and `unitPrice` (decimal string). `totals` project `subtotal`, `discountTotal`, `taxTotal`, `shippingTotal`, `otherChargesTotal`, `grandTotal`, and `currency`, matching `commerce.order_revisions` amount semantics.

These totals are computed for the quote and are not written to a quote table by API-020. `deliveryEstimate`, changed-line notices, and `nextAction` are proposed derived fields with policy still requiring D-024. No stock hold or provider charge occurs when a quote is returned.

Stale cart returns `409`; unsupported address, unknown class or missing policy blocks quote acceptance. No provider-derived availability is invented after timeout. TC-CHK-02-DENY, TC-CHK-05-DENY and TC-CHK-06-DENY check the distinct outcomes.

## One request: API-021

`POST /v1/checkouts` — **features CHK-07, CHK-08**, with Cart Checkout accountable for entry and Order Operations for the order aggregate. Customer session with a valid owned quote token. Required proposed fields: `quoteToken` (opaque), `cartVersion` (positive integer matching `commerce.carts.row_version`) and `accepted: true` (explicit customer action).

Any prescription association is supplied through the separately authorized intake operation, not a caller assertion of approval.

Proposed first-result `201`: `checkoutId` maps to `commerce.checkouts.id`; `orderId` maps to `commerce.orders.id`; `acceptedRevisionId` maps to `commerce.order_revisions.id`; `revisionNumber` maps to its positive `revision_number`; `checkoutStatus` uses the documented checkout status (`open`, `validating`, `ready`, `completed`, `failed`, or `expired`); `orderStatus` is a separate order fact. `nextAction` is a derived API field, not a database column. `commerce.checkouts` contains the cart, address, user, idempotency key, snapshots, expiry and status, but no `order_id`; `commerce.orders.checkout_id` links the order back to the checkout.

A signed quote token is consumed and its values are persisted into checkout/order snapshots; it is not itself stored as a quote row. Safe replay returns the stored reference/outcome using the documented replay status; the exact mapping of cross-owner commits remains D-024 review.

This records a request, not payment confirmation. P goes to review; M/O skips it. API-052 supplies the later hold before payment. If the response is lost after commit, replay finds the same request. Failure before commit leaves no partial checkout/order pair. TC-CHK-07-DENY verifies same intent/body versus conflicting body; TC-CHK-08-DENY verifies the later hold expiry/payment race.

## Reserve and release: API-052 / API-053

`POST /v1/internal/inventory/reservations` — **features CHK-08, INV-01, INV-03**. This is an authenticated internal command with reviewed Inventory capability, not a route authorized by a customer-supplied service name. Required proposed fields: `orderId`, `orderRevisionId`, `warehouseId` (public UUIDs), and `expectedOrderVersion`. `warehouseId` maps to `warehouse.stock_reservations.warehouse_id`; Inventory separately verifies the warehouse’s linked location/license and derives item quantities and eligible lots from the accepted revision.

Callers cannot supply trusted available quantities or self-approve a lot. The holding table has one public reservation row per held order item/lot; it has no aggregate reservation parent row.

Proposed `201` result: `reservations[]`, where each entry maps to one `warehouse.stock_reservations` row and includes public `reservationId` (`id`), `orderItemId`, `lotId`, `warehouseId`, `quantity`, `status`, `expiresAt`, and `rowVersion`. Quantity maps to positive `numeric(16,3)` and expiry must be later than creation.

Do not return internal IDs or copy raw database rows. No fixed TTL is defined. Lock eligible balance/reservation rows in deterministic order; verify approved license, fresh inventory evidence, lot quality/recall/expiry and shelf-life rules; persist every eligible row or no new reservation. `warehouse.stock_holds` is a distinct table with its own reason/status semantics and is not assumed to be a duplicate reservation record. The exact ledger/inventory effects and transaction boundary remain D-024 review.

`POST /v1/internal/inventory/reservations/{reservation_id}/release` requires the trusted owning workflow/expiry worker and `reservationVersion` matching `warehouse.stock_reservations.row_version`. A proposed `reasonCode` is not a column on `stock_reservations`; if approved, it belongs to the corresponding controlled `warehouse.stock_ledger` movement evidence, whose idempotency key/reference must prevent duplicate release quantity.

Proposed `200` returns the current reservation row state (`released`) and its new row version. Active unused reservation may transition to released under approved policy; replay does not release twice; committed or changed state conflicts rather than restoring stock twice.

TC-INV-03-DENY and TC-CHK-08-DENY must include last-unit contention, expiry versus commitment and stale-source evidence.

## Review decision: API-062

`POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` — **features PHM-03, PHM-05, supporting RX-05**. Requires current authenticated pharmacist permission and authorized clinical scope; administrative status alone is insufficient.

Required proposed body: `expectedReviewVersion` (positive integer matching `clinical.order_reviews.review_version`), `expectedLineVersion` (positive integer matching `clinical.order_review_items.row_version`), `orderRevisionId` (current `commerce.orders.current_revision_id` precondition), `prescriptionId` (matches review and item evidence), and `decision` (`approve`, `reject`, or `request_new_prescription`).

Map these public actions to the database allowlist `approved`, `rejected`, or `needs_new_rx`; do not write unsupported values. `approvedQuantity` is required and positive when approving because `ck_clinical_order_review_items_approval_quantity_required` enforces it. `reasonCode` is required for rejection/new-prescription decisions under `ck_clinical_order_review_items_rejection_reason`; its code must be from the approved reason catalog.

Reviewer identity and decision time map to server-owned fields (`reviewed_by_user_id`, `reviewed_at`, `decided_at`). Validate patient, order item, prescription item and currently accepted revision before writing.

Proposed `200` returns public `reviewId`, `lineId` (the public `clinical.order_review_items.id`), the public decision, nullable `approvedQuantity`, safe `reasonCode`, `reviewVersion`, and `decidedAt`. The database persists decision/reason/quantity on the review item and reviewer/status/version on the review; the operation must update both under the owning Pharmacy transaction.

Do not return prescription bytes, private clinical notes, or reviewer credentials. Intake owns document/patient linkage; no clinician command silently rewrites the order or payment. Wrong patient/unauthorized reviewer is denied; stale review, line or accepted revision returns `409`. TC-PHM-03-DENY and TC-PHM-05-DENY assert one valid decision and no stale approval bypass.

## Money initiation and provider evidence: API-075 / API-076

`POST /v1/payments/intents` — **feature FIN-01, supporting CHK-03**. Customer session and owned accepted revision with required current clinical approval/hold. Proposed required fields: `order_id`, `order_revision_id`, expected order version and a permitted payment-method choice.

The server derives amount/currency. Proposed `201/202` distinguishes a persisted intent from pending adapter work and returns `payment_intent_id`, current status and only the approved provider continuation token/link. Exact provider token fields are blocked by D-016.

Persist one `payment.payment_intents`/`payment.payment_attempts` operation with local audit/outbox; network creation runs outside the transaction under the provider’s evidenced idempotency support. Timeout leaves an identifiable pending/unknown result. No client `paid=true`, screenshot or redirect can complete it.

`POST /v1/webhooks/cashfree` is authenticated by the exact approved provider raw-body signature/timestamp/event contract, never a customer bearer session. Provider-specific header names, canonicalization, retries and acknowledgment status remain blocked by D-016.

Retain source event identity in `payment.payment_webhooks`, verify amount/currency/order/revision, deduplicate, and commit trusted money effects before the adapter’s agreed acknowledgment. A contradictory or out-of-order event is reconciled, not applied as a blind backward transition.

The [Finance contract](Finance_Payments.md) gives the trust boundary. TC-FIN-01-DENY and TC-CHK-03-DENY require signed sandbox evidence before provider readiness.

COD eligibility belongs to the reviewed checkout/order command and Finance’s approved policy, not the Cashfree callback. A complete COD selection/approval command and DTO remain missing; API-080 is reconciliation, not an invented COD approval endpoint. See CHK-04 and D-007.

## Cancellation and return: API-027 / API-028

`POST /v1/me/orders/{order_id}/cancel` — **ORD-04**. Customer session and owned order; proposed body `order_version` plus approved `reason_code`. Serialize against current packing state and apply the approved before-packed rule. Proposed `200/202` returns cancellation reference, accepted/current state and separate refund status.

Delegate order change to Operations, unused hold release to Inventory and refund eligibility to Finance. Tables include `commerce.cancellations`, `commerce.cancellation_items`, order/history and owner-managed hold/refund evidence; exact atomic orchestration remains D-024. No refund is complete merely because cancellation is accepted.

`POST /v1/me/orders/{order_id}/returns` — **ORD-05**. Proposed required fields: current `order_version`, item references/positive requested quantities and approved return reason. Check actual eligible delivered quantities and prior accepted returns under approved policy; return reference/status rather than stock credit or payout. `commerce.returns`/`commerce.return_items` record the request through Operations; receiving and disposition are later authorized work.

D-004/D-006 must supply item/window rules. TC-ORD-04-DENY serializes packing/cancellation; TC-ORD-05-DENY confirms no automatic money/stock effect.

## Refund instruction: API-078

`POST /v1/admin/finance/refunds` — **FIN-03**. Scoped Finance permission, reason and required approval; no administrator/support bypass. Proposed required fields: `paymentTransactionId`, `orderId`, `orderRevisionId`, positive decimal-string `amount`, approved `reasonCode`, and `expectedPaymentIntentVersion`. `paymentTransactionId` maps to `payment.refunds.payment_transaction_id`, not directly to an intent; the owning Finance service resolves its `payment_intent_id` and currency through `payment.payment_transactions`. `orderId` and revision map to public UUID columns on `payment.refunds`.

Currency is derived from the linked payment intent and is not stored on `payment.refunds`; reject any currency mismatch at the provider boundary. The amount maps to positive `numeric(16,2)`. Approval references/thresholds require D-004/D-008/D-024; no approval column is inferred on the refund row.

Proposed `202` returns public `refundId` (`payment.refunds.id`), `paymentTransactionId`, `amount`, derived `currency`, and the persisted refund status. The initial state maps to database value `requested`; later persisted values are `approved`, `processing`, `succeeded`, `failed`, or `cancelled`.

Do not introduce API-only states as though they were stored values; any presentation projection must be separately named. Finance locks the relevant transaction/intent and existing refund evidence, then writes one `payment.refunds` row and any item-level `payment.refund_allocations` rows.

Provider IO follows commit; trusted result completes a later transition. Timeout does not free the refundable balance for a duplicate instruction or falsely mark the refund completed. COD refund destination verification remains a separate blocked FIN-04 contract.

TC-FIN-03-DENY verifies duplicate and concurrent cumulative refund limits; TC-FIN-04-DENY verifies no payment to unverified details.

## Delivery proof: API-073

`POST /v1/rider/tasks/{task_id}/complete` — **RID-04**, with Delivery Operations as command/data owner and Rider App as client. Current authenticated assigned rider only. `{task_id}` is an API alias for public `logistics.delivery_assignments.id`; verify it is current and owned by the caller.

Proposed required body: `assignmentVersion` (maps to assignment `row_version`), `otpChallengeId` (public `logistics.delivery_otp_challenges.id`), `otp` (write-only secret, checked against `otp_digest` and never stored/logged in cleartext), optional conditional `proofFileId` (single public `platform.file_objects.id`, matching `logistics.delivery_attempts.proof_file_id`), and actual COD amount only when COD applies.

Proof is singular because `delivery_attempts` has one `proof_file_id`; multiple files require a separate evidence mapping decision. `payment.cod_collections` stores amount but no currency, so currency is derived from the order/payment evidence. Approved proof requirements, file grant policy and task-to-shipment mapping remain D-011/D-024.

Proposed `200/202` response distinguishes accepted completion from pending dependent processing and returns task/shipment reference, recorded delivery outcome and separate collection outcome. Validate proof, scope, current assignment and eligible shipment state before atomically consuming OTP/recording accepted delivery evidence under Delivery; Finance coordinates one COD fact.

Tables: `logistics.delivery_assignments`, `logistics.delivery_otp_challenges`, `logistics.delivery_attempts`, `logistics.shipments` and owner-managed `payment.cod_collections`. A cross-module atomicity review is required; a split commit may not be described as all-or-nothing without its interface.

Incorrect OTP leaves completion unaccepted. Lost successful response replays the same recorded result; offline captured time does not override expiry or a changed assignment. TC-RID-04-DENY and TC-DLV-03-DENY cover invalid proof, replay and stale reassignment.

## Remaining operation review

For all other proposed routes, the [owning API document](API-Contract-Coverage.md) remains the source of current readiness. Missing request/response fields, input bounds, transition mappings or write-field lists are blocked under D-024, not implicitly filled by this document.

The [feature register](../09-References/Coverage-and-Traceability.md) distinguishes direct references, cross-module support and unresolved feature operations. Full OpenAPI and provider contracts remain development prerequisites, not documentation validation results.
