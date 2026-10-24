# Payments database contract

**Structure validated; business write assignment Proposed.** Money, refunds, invoices, accounting and reconciliation; no direct clinical or stock approval. Read access or a contract surface does not confer write ownership. Exact operation transactions/DTO columns are in [APIs](APIs.md); shared audit/outbox/idempotency writes are owner-coordinated infrastructure.

## Proposed owned tables

| Table | Classification | Write-owner approval |
| --- | --- | --- |
| [`finance.accounts`](../../04-Database/Tables/finance/accounts.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`finance.credit_notes`](../../04-Database/Tables/finance/credit_notes.md) | Transactional | D-024; SQL grants reviewed independently |
| [`finance.invoice_items`](../../04-Database/Tables/finance/invoice_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`finance.invoices`](../../04-Database/Tables/finance/invoices.md) | Transactional | D-024; SQL grants reviewed independently |
| [`finance.journal_entries`](../../04-Database/Tables/finance/journal_entries.md) | Transactional | D-024; SQL grants reviewed independently |
| [`finance.journal_lines`](../../04-Database/Tables/finance/journal_lines.md) | Transactional | D-024; SQL grants reviewed independently |
| [`finance.settlement_items`](../../04-Database/Tables/finance/settlement_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`finance.settlement_runs`](../../04-Database/Tables/finance/settlement_runs.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.chargebacks`](../../04-Database/Tables/payment/chargebacks.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.customer_payment_methods`](../../04-Database/Tables/payment/customer_payment_methods.md) | Configuration | D-024; SQL grants reviewed independently |
| [`payment.payment_attempts`](../../04-Database/Tables/payment/payment_attempts.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.payment_transactions`](../../04-Database/Tables/payment/payment_transactions.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.payment_webhooks`](../../04-Database/Tables/payment/payment_webhooks.md) | Audit / History | D-024; SQL grants reviewed independently |
| [`payment.provider_accounts`](../../04-Database/Tables/payment/provider_accounts.md) | Configuration | D-024; SQL grants reviewed independently |
| [`payment.reconciliation_items`](../../04-Database/Tables/payment/reconciliation_items.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.reconciliation_runs`](../../04-Database/Tables/payment/reconciliation_runs.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.refund_allocations`](../../04-Database/Tables/payment/refund_allocations.md) | Transactional | D-024; SQL grants reviewed independently |
| [`payment.refund_reason_codes`](../../04-Database/Tables/payment/refund_reason_codes.md) | Master / Reference | D-024; SQL grants reviewed independently |
| [`payment.refunds`](../../04-Database/Tables/payment/refunds.md) | Transactional | D-024; SQL grants reviewed independently |
| [`pricing.tax_rules`](../../04-Database/Tables/pricing/tax_rules.md) | Configuration | D-024; SQL grants reviewed independently |

## Contract reads and writes

| Table | Exact read columns | Exact proposed write columns | Proposed data owner | API IDs |
| --- | --- | --- | --- | --- |
| [`clinical.order_review_items`](../../04-Database/Tables/clinical/order_review_items.md) | `approved_quantity`, `decided_at`, `decision`, `id`, `order_id`, `order_item_id`, `prescription_id`, `review_id`, `row_version` | None | Pharmacist_Review | API-075 |
| [`clinical.order_reviews`](../../04-Database/Tables/clinical/order_reviews.md) | `assigned_to_user_id`, `id`, `order_id`, `patient_profile_id`, `prescription_document_id`, `prescription_id`, `review_version`, `reviewed_by_user_id`, `row_version`, `status` | None | Pharmacist_Review | API-075 |
| [`commerce.order_revisions`](../../04-Database/Tables/commerce/order_revisions.md) | `id`, `order_id`, `status` | None | Order_Operations | API-075, API-076, API-078 |
| [`commerce.orders`](../../04-Database/Tables/commerce/orders.md) | `currency`, `current_revision_id`, `id`, `internal_id`, `patient_profile_id`, `row_version`, `status`, `user_id` | None | Order_Operations | API-029, API-030, API-075, API-076, API-077, API-078, API-081 |
| [`finance.invoice_items`](../../04-Database/Tables/finance/invoice_items.md) | `description`, `hsn_code`, `id`, `invoice_id`, `line_total`, `order_item_id`, `quantity`, `row_version`, `tax_amount`, `unit_price` | None | Finance_Payments | API-029, API-081 |
| [`finance.invoices`](../../04-Database/Tables/finance/invoices.md) | `currency`, `document_file_id`, `grand_total`, `id`, `invoice_number`, `issued_at`, `order_id`, `row_version`, `status`, `subtotal`, `tax_total` | None | Finance_Payments | API-029, API-081 |
| [`payment.cod_collections`](../../04-Database/Tables/payment/cod_collections.md) | `id`, `order_id`, `order_revision_id`, `row_version`, `status` | None | Finance_Payments | API-080 |
| [`payment.payment_attempts`](../../04-Database/Tables/payment/payment_attempts.md) | None | `amount`, `attempt_number`, `completed_at`, `initiated_at`, `payment_intent_id`, `status` | Finance_Payments | API-075, API-076 |
| [`payment.payment_intents`](../../04-Database/Tables/payment/payment_intents.md) | `amount`, `currency`, `expires_at`, `id`, `method`, `order_id`, `order_revision_id`, `provider_account_id`, `row_version`, `status` | `amount`, `currency`, `idempotency_key`, `method`, `order_id`, `order_revision_id`, `provider`, `provider_account_id`, `status` | Finance_Payments | API-075, API-076, API-077, API-078 |
| [`payment.payment_transactions`](../../04-Database/Tables/payment/payment_transactions.md) | `id`, `payment_attempt_id`, `payment_intent_id`, `status` | `amount`, `payment_attempt_id`, `payment_intent_id`, `processed_at`, `provider`, `provider_response`, `provider_transaction_id`, `status`, `transaction_type` | Finance_Payments | API-076, API-077, API-078 |
| [`payment.payment_webhooks`](../../04-Database/Tables/payment/payment_webhooks.md) | `id`, `provider_event_id`, `row_version` | `payload`, `processed_at`, `processing_status`, `provider`, `provider_event_id`, `signature_valid` | Finance_Payments | API-076 |
| [`payment.provider_accounts`](../../04-Database/Tables/payment/provider_accounts.md) | `id`, `is_deleted`, `row_version`, `status` | None | Finance_Payments | API-075, API-079 |
| [`payment.reconciliation_items`](../../04-Database/Tables/payment/reconciliation_items.md) | `id`, `row_version`, `run_id`, `status` | `actual_amount`, `expected_amount`, `internal_reference`, `provider_reference`, `run_id`, `status` | Finance_Payments | API-079, API-080 |
| [`payment.reconciliation_runs`](../../04-Database/Tables/payment/reconciliation_runs.md) | `account_id`, `completed_at`, `id`, `provider`, `row_version`, `run_date`, `source_file_id`, `status` | `provider`, `run_date`, `source_file_id`, `started_at`, `status`, `summary` | Finance_Payments | API-079, API-080 |
| [`payment.refund_allocations`](../../04-Database/Tables/payment/refund_allocations.md) | `id`, `order_item_id`, `order_revision_id`, `reason_code`, `reason_code_id`, `refund_id` | `amount`, `order_item_id`, `refund_id` | Finance_Payments | API-078 |
| [`payment.refund_reason_codes`](../../04-Database/Tables/payment/refund_reason_codes.md) | `id`, `is_active`, `row_version` | None | Finance_Payments | API-078 |
| [`payment.refunds`](../../04-Database/Tables/payment/refunds.md) | `amount`, `created_at`, `id`, `order_id`, `order_revision_id`, `payment_transaction_id`, `reason_code`, `reason_code_id`, `row_version`, `status` | `amount`, `idempotency_key`, `order_id`, `order_revision_id`, `payment_transaction_id`, `reason_code`, `refund_number`, `status` | Finance_Payments | API-030, API-078 |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | `expires_at`, `file_object_id`, `id`, `row_version` | None | Shared platform file service — engineering owner; no clinical write grant | API-029, API-081 |
| [`platform.file_objects`](../../04-Database/Tables/platform/file_objects.md) | `access_type`, `classification`, `id`, `is_deleted`, `malware_scan_status`, `owner_id`, `owner_type`, `row_version`, `sha256`, `size_bytes`, `status` | None | Shared platform file service — engineering owner; no clinical write grant | API-029, API-080, API-081 |
| [`warehouse.stock_reservations`](../../04-Database/Tables/warehouse/stock_reservations.md) | `expires_at`, `id`, `order_id`, `order_item_id`, `order_revision_id`, `row_version`, `status`, `warehouse_id` | None | Inventory | API-075 |

## Master and transaction dependencies

| Controlled table | Classification | Lifecycle and initial data |
| --- | --- | --- |
| [`payment.provider_accounts`](../../04-Database/Tables/payment/provider_accounts.md) | Configuration | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`payment.refund_reason_codes`](../../04-Database/Tables/payment/refund_reason_codes.md) | Master / Reference | [Master planning](../../04-Database/Master-Data-Inventory.md) |
| [`platform.file_access_grants`](../../04-Database/Tables/platform/file_access_grants.md) | Mapping / Junction | [Master planning](../../04-Database/Master-Data-Inventory.md) |

Every mutation must enter the authoritative owner command with explicit scope/version, apply only that command’s invariant, and commit aggregate/audit/outbox together. External provider/file/message effects occur after commit; idempotency and recovery are per endpoint. Shared-table audit/outbox infrastructure does not acquire domain ownership. Physical SQL guards are recorded on each linked table page; application authorization remains additional.
