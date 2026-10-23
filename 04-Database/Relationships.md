# Database relationships

## Relationships

## Database relationships by business flow

**Identity:** `identity.users` connects to customer/family, clinical, order and staff actor references. Numeric paired FKs mirror UUID aliases for entities; keep both scope relationships consistent.

**Commerce:** `commerce.carts` + `cart_items` → `checkouts` → `orders`, `order_items`, `order_revisions` and `order_status_history`. A revised order cannot reuse a past clinic approval without the matching current revision.

**Clinical:** `clinical.patient_profiles` → `prescriptions`/`prescription_documents` → `order_reviews`/`order_review_items`. Each P-line outcome points to exact active order-item/prescription evidence. Non-P cart lines bypass review.

**Stock:** `warehouse.inventory_lots`, `stock_balances` and `stock_holds` underpin `commerce.order_allocations`, `fulfillment.pick_tasks` and `fulfillment.packages`. Scope/lot/approval are rechecked before dispatch.

**Money and delivery:** `payment.payment_intents`/`payment_transactions`/`payment_webhooks`/`refunds` → `finance.invoices`/`settlement_runs` → `logistics.shipments`/`delivery_attempts`/`cod_collections`. These are related but distinct facts; a delivered parcel is not settlement proof.

For exact FK columns and delete actions, open the per-table contracts; this overview is a readable path, not a substitute for migration DDL.

## Data lifecycle

## Data lifecycle, retention and lawful changes

Account/consent → catalogue publication → cart/quote → immutable order revision → clinical/payment/stock/fulfillment/delivery evidence → invoice/returns/refunds/closure. The database implements row timestamps, version fields, audit and selected soft-delete patterns, but a consistent legal retention schedule is not supplied.

Identity/contact, dependent patients, prescriptions, diagnostics, location samples, payment provider references, and audit/export files have different sensitivity and minimum-necessary access. Do not turn a soft-delete flag into a claim that lawful erasure is complete. Hold exceptions, delayed deletion, provider data retention, backup expiry, pseudonymization and export access must be approved by owner/legal/pharmacist before production.

Preserve immutable order/clinical/financial history and make corrections through new accepted revisions or compensating records. A pending deletion must be reconciled against legal holds and business records. Avoid hard-coded number of years, GPS retention days or medical licensing assertions; document approval D-013.

See Privacy and Compliance Considerations.

## Transactions

## Transaction boundaries and concurrency

**Checkout:** create intent under idempotency key with versioned accepted basket, address/patient and charges; never create duplicate orders from repeated clicks. For P carts, a clinical decision transaction writes exact P-line results plus audit and produces a new revision requiring customer acceptance when changes occur.

**Allocation:** acquire locks for the specific order and eligible stock/lot/site rows in a deterministic order, verify fresh POS evidence, scope/license and availability, then create one reservation. The final database report's ten competing last-unit transactions allowed exactly one allocation; the app must preserve that contract.

**Payment:** persist provider intent/event ledger and authoritative signed result; repeated callbacks produce one effect. A refund is a separate durable compensating record; never update an old transaction to hide it.

**Fulfillment/delivery:** pick/pack checks exact approved items and reserved lot; dispatch gates require approved finance/COD fact plus completed fulfillment. OTP, COD collection and final delivery evidence are distinct transactions with bounded replay handling.

Avoid performing SMS, payment gateway or S3 requests while holding PostgreSQL locks; use outbox/reconciliation. See Order Workflow and Testing.
