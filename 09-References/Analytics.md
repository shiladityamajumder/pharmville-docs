# Analytics and tracking

## Proposed analytics event contracts

**Design only:** event definitions and numerical business targets are not approved; no analytics SDK or collection has been deployed. Events must avoid patient names, medical details, raw addresses, GPS paths, OTPs or payment credentials.

| Event | Owner | Emission trigger | Allowed properties | Metric |
| --- | --- | --- | --- | --- |
| `session_started` | `Authentication_Access` | session verified | `channel,role_group,outcome` | active users |
| `login_denied` | `Authentication_Access` | login refused | `reason_bucket,channel` | login fail rate |
| `product_viewed` | `Product_Catalog` | product detail shown | `product_public_id,category` | product engagement |
| `search_submitted` | `Product_Catalog` | search requested | `query_length,result_count` | search effectiveness |
| `availability_checked` | `Product_Catalog` | delivery availability query | `serviceability_code,stock_state` | stock data quality |
| `cart_item_changed` | `Cart_Checkout` | cart accepted line update | `sku_public_id,quantity` | cart additions |
| `quote_created` | `Cart_Checkout` | quote persisted | `revision,amount_currency` | checkout funnel |
| `quote_rejected` | `Cart_Checkout` | policy/version rejection | `reason_code` | checkout failure |
| `prescription_uploaded` | `Prescription_Upload` | scanned file reference linked | `document_public_id,scan_state` | upload completion |
| `review_completed` | `Pharmacist_Review` | pharmacist stores decision | `review_reason_code,outcome` | review turnaround |
| `checkout_submitted` | `Cart_Checkout` | accepted order intent | `order_public_id,revision` | conversion |
| `payment_initiated` | `Finance_Payments` | payment intent created | `payment_public_id,provider_type` | pay starts |
| `payment_confirmed` | `Finance_Payments` | authoritative confirmation applied | `payment_public_id,outcome` | payment success |
| `payment_unknown` | `Finance_Payments` | provider result unresolved | `payment_public_id,age_bucket` | reconciliation backlog |
| `stock_reserved` | `Inventory` | stock hold committed | `location_public_id,sku_public_id` | stock allocation |
| `stock_reservation_denied` | `Inventory` | lot/site/freshness failure | `reason_code,site_bucket` | stock error rate |
| `order_placed` | `Customer_Orders` | order accepted | `order_public_id,order_type` | orders |
| `order_cancelled` | `Customer_Orders` | cancellation accepted | `reason_code,order_public_id` | cancellations |
| `pack_completed` | `Store_Operations` | package approved | `shipment_public_id,location_public_id` | packing throughput |
| `rider_assigned` | `Delivery_Operations` | delivery rider selected | `shipment_public_id,carrier_type` | dispatch throughput |
| `delivery_attempted` | `Delivery_Operations` | delivery attempt recorded | `shipment_public_id,result` | first-attempt rate |
| `cod_collected` | `Finance_Payments` | COD receipt recorded | `shipment_public_id,amount_currency` | cash reconciliation |
| `refund_recorded` | `Finance_Payments` | authoritative refund result | `refund_public_id,status` | refund cycle |
| `export_denied` | `Reporting` | report export forbidden | `reason_code,role_group` | permission denial |
| `notification_failed` | `Notifications` | provider send failed | `channel,error_bucket` | delivery rate |

## Proposed analytics event dictionary

| Event name | Trigger from server truth | Minimal safe payload |
| --- | --- | --- |
| `catalog_product_viewed` | Authorized published product read | Public product ID, approved class version |
| `checkout_quote_accepted` | Customer accepts current quote | Public checkout/order reference, revision |
| `rx_review_decided` | Pharmacist decision committed | Review reference, outcome code, latency bucket |
| `order_revision_accepted` | Explicit customer change approval | Order reference, accepted revision |
| `stock_reservation_confirmed` | Eligible lot/site hold stored | Order/site opaque ref, outcome |
| `payment_status_verified` | Signed/reconciled payment truth | Order reference, sanitized provider state |
| `delivery_confirmed` | Recipient proof, accepted package outcome | Order/delivery reference |
| `refund_reconciled` | Verified refund ledger and provider outcome | Refund reference and status |

These event names are **Proposed** and do not automatically exist in the checked-in database schema or HTTP service. Minimize data, dedupe events and obey consent/retention policy. Tracking Plan.

## Technical and staff workflow metrics

Collect order/request dedupe count, P review queue age, stock freshness by location, expired/unknown license blocks, last-unit reservation conflicts, payment webhook signature/replay/settlement backlog, COD collected-vs-deposited exceptions, refund aging, rider missed/late handoff, GPS sample latency, OTP denial, provider timeout, outbox retry/dead-letter queue and audit/report export denials.

On the service side capture API p50/p95/p99, error-class rates, DB slow plans/lock wait, connection pool saturation, notification provider delivery and object-scan/storage failures. CloudWatch, Sentry and OpenTelemetry/New Relic are selected in the project notes; define actual alert thresholds and on-call owner before go-live.

No precision claims or production availability are supported by the source. Track only purpose-limited rider/customer fields and keep clinical details out of generic telemetry. See Monitoring.

## Business/product metrics requiring target approval

Track product search success and zero-results, add-to-cart, checkout started/completed, patient/P basket proportion, clinical review turnaround/rework, mixed-basket revision acceptance, safe order fulfillment rate, failed delivery, refund completion, COD eligibility refusal and repeat customer retention. Always distinguish numerator/denominator and filtered segments; separate stock/legal block from infrastructure failure.

No baseline conversion, target revenue, SLA or real-user traffic was supplied. The proposed HLD targets are not confirmed performance promises. Define owner-approved targets after staging and launch instrumentation, with privacy filters so clinical reasons cannot appear in broad marketing reports.

For operational debugging prefer business entity/audit events over generic frontend analytics; customer-visible order success must be reconciled to financial, clinical and delivery sources of truth. See Operational Metrics.

## Proposed business success metrics

Do not fabricate targets, denominators, attribution windows or current values. Define the reporting period with the product owner and verify event delivery first.

| Metric | Proposed numerator / denominator | Reconciliation guard |
| --- | --- | --- |
| Checkout completion | unique accepted orders / unique checkout starts | Count by durable order ID, never page redirects |
| Payment confirmed | unique provider-confirmed payments / initiated payment intents | Ignore duplicate callbacks |
| Eligible order fulfillment | eligible dispatched orders / accepted orders | Exclude invalidly licensed sites |
| Delivery success | successfully completed shipments / first eligible attempts | distinguish retry attempts |
| Inventory mismatch | count of POS/physical discrepancies / checked SKU-site pairs | preserve snapshot age |
| Patient safety guard | blocked unsafe P-classified review cases / attempted P-classified orders | Do not treat unsafe bypass as conversion win |

Analytics retention, sampling and marketing permissions require privacy approval.

## Product analytics tracking plan

Measure customer discovery/search, product view and P/M/O classification mix, checkout started/quote changed, Rx requested/submitted/correction, accepted revision, payment verified/pending, eligible stock hold, exact pick/dispatch, delivery/failed attempt, return/refund and support contact. Record business-safe event names, public correlation IDs, accepted version and anonymized category/status only.

Do not send patient names, prescription images, OTPs, medical diagnosis, detailed bank references or rider precise GPS to general analytics. Event generation must follow committed domain state; a click or client callback is not successful payment, approval or delivery. Marketing analytics/consent policy requires owner privacy review. Source feature and workflow IDs provide the reference taxonomy; actual tag SDK and BI provider are unselected.

See Analytics Events and Audit.
