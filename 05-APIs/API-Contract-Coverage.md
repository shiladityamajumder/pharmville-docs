# API contract completeness ledger

The inherited baseline is **107 operations** (API-001–097 and ten ACC-ROUTE references), all preserved. D-028 adds **15 explicitly proposed operations API-098–112**, yielding **122**. All contracts remain **Proposed / Unapproved / Not Implemented**. Documentation completeness does not require prior approval; actual approval requires evidence under D-024. [Operation traceability](API-Database-Feature-Matrix.md) · [master data](../04-Database/Master-Data-Inventory.md) · [decisions](Planning-Decisions.md) · [journey gaps](Journey-API-Gaps.md).

## Baseline and final planning measure

| Measure | Baseline | Current proposal |
| --- | --- | --- |
| Inventoried operations | 107 | 122 (107 preserved + 15 proposed) |
| Documentation-complete proposed contracts | 0 / 107 (0%) | 114 / 122 (93.44%); original cohort 99 / 107 (92.52%) |
| Remaining incomplete contracts | 107 | 8 |
| Approved complete contracts, evidenced signoff | 0 / 107 (0%) | 0 / 122 (0%) |
| Verified implementations / executed application contract tests | 0 | 0 |

Baseline evidence was the inherited ledger and OpenAPI: 62 body operations, 24 typed request schemas, 16 request examples, 22 concrete success DTOs/examples. The current spec has typed request DTOs and examples for every body operation and concrete success DTOs/examples for all 119 JSON-success operations; the other three operations are bodyless DELETE 204 responses. Those structural numbers include incomplete conceptual contracts and are **not** the planning-completeness numerator.

The unified-authentication rework started from **97/107 complete proposed**, with 0 approved. API-089/090 now have concrete durable proof/replay persistence designs, making the original cohort 99/107; 15 additional Identity proposals yield 114/122. The zero numerator in the historical baseline column predates that earlier contract-planning work.

## Counting rule

A counted operation has its own identification/purpose/feature/workflow, explicit auth versus authorization, individually classified headers, path/query/body/file applicability and typed nested DTOs, request example (or explicit no body), success status/headers/example, relevant errors and recovery, exact read/write columns and DTO mapping, owner/transaction/audit/outbox/master dependencies, business/concurrency/retry/rate/timeout rules, and designed normal/adverse/replay/recovery tests. Its Markdown and OpenAPI agree. Shared envelope/schema reuse is allowed; generic data objects, candidate table lists or policy-only boilerplate do not qualify.

Unknown external wire payload, missing persistence for a required contract concept, or an unresolved action-to-state mapping excludes the **entire** operation. A policy value awaiting owner approval can remain an explicit configurable dependency of a complete proposal; it must never be reported as approved. Every counted operation has `x-documentation-status: complete-proposed`, `x-approval-status: unapproved` and `x-implementation-status: not-implemented` in OpenAPI. Each CT scenario remains Designed / NOT RUN.

## Coverage by module

| Module | Existing operations | Complete proposed | Incomplete | Approval |
| --- | --- | --- | --- | --- |
| Admin_CMS | 12 | 12 | 0 | 0 approved |
| Audit | 2 | 2 | 0 | 0 approved |
| Authentication_Access | 15 | 15 | 0 | 0 approved |
| Cart_Checkout | 4 | 4 | 0 | 0 approved |
| Customer_Accounts | 19 | 18 | 1 | 0 approved |
| Customer_Orders | 7 | 7 | 0 | 0 approved |
| Delivery_Operations | 5 | 4 | 1 | 0 approved |
| Finance_Payments | 7 | 3 | 4 | 0 approved |
| Inventory | 6 | 5 | 1 | 0 approved |
| Notifications | 4 | 4 | 0 | 0 approved |
| Order_Operations | 5 | 5 | 0 | 0 approved |
| Pharmacist_Review | 4 | 4 | 0 | 0 approved |
| Prescription_Upload | 3 | 3 | 0 | 0 approved |
| Product_Catalog | 8 | 7 | 1 | 0 approved |
| Reporting | 5 | 5 | 0 | 0 approved |
| Rider_App | 6 | 6 | 0 | 0 approved |
| Store_Operations | 6 | 6 | 0 | 0 approved |
| Warehouse | 4 | 4 | 0 | 0 approved |

## Remaining incomplete operations

| API | Endpoint | Concrete gap | Decision owner |
| --- | --- | --- | --- |
| [API-004](../03-Modules/Customer_Accounts/APIs.md) | `PATCH /v1/me` | D-023: exact replacement proof DTO/storage is absent. Profile-only subset proposed, full route incomplete. | Customer_Accounts; Security/provider/Finance where referenced |
| [API-015](../03-Modules/Product_Catalog/APIs.md) | `POST /v1/admin/catalog/imports` | D-019/D-024: spreadsheet columns, row atomicity and durable import result/status model are not documented. | Product_Catalog; Security/provider/Finance where referenced |
| [API-051](../03-Modules/Inventory/APIs.md) | `POST /v1/staff/inventory/observations` | D-005: source authentication, exact quantities-to-ledger reconciliation and atomic batch outcome are unspecified; timestamps alone are not sufficient evidence. | Inventory; Security/provider/Finance where referenced |
| [API-066](../03-Modules/Delivery_Operations/APIs.md) | `POST /v1/staff/delivery/tasks/{task_id}/resolution` | D-010/D-011: reattempt limits, custody and precise action-to-status progression need approved policy. | Delivery_Operations; Security/provider/Finance where referenced |
| [API-075](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/payments/intents` | D-004/D-016: exact continuation DTO, capture sequence and provider-supported replay contract require evidence. | Finance_Payments; Security/provider/Finance where referenced |
| [API-076](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/webhooks/cashfree` | D-016: signature header names, wire schema, canonicalization and acknowledgment status are unknown. Conceptual DTO is explicitly not a provider wire contract. | Finance_Payments; Security/provider/Finance where referenced |
| [API-079](../03-Modules/Finance_Payments/APIs.md) | `GET /v1/admin/finance/settlements` | D-008/D-016: settle-vs-reconcile dataset definition and provider report layout need Finance approval. | Finance_Payments; Security/provider/Finance where referenced |
| [API-080](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/admin/finance/cod-reconciliation` | D-007/D-008: exact handover/deposit evidence and independent approval model are missing. | Finance_Payments; Security/provider/Finance where referenced |

## Operation-level ledger

| API | Method/path | Request DTO | Success DTO/status | Planning | Approval / implementation |
| --- | --- | --- | --- | --- | --- |
| [API-001](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/auth/customer/otp/request` | CustomerOtpRequest | OtpChallengeData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-002](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/auth/customer/otp/verify` | CustomerOtpVerification | SessionData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-003](../03-Modules/Customer_Accounts/APIs.md) | `GET /v1/me` | No request body | ProfileData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-004](../03-Modules/Customer_Accounts/APIs.md) | `PATCH /v1/me` | CustomerProfileUpdate | ProfileData / 200 | Incomplete | Unapproved / Not Implemented |
| [API-005](../03-Modules/Customer_Accounts/APIs.md) | `GET /v1/me/addresses` | No request body | AddressListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-006](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/me/addresses` | CustomerAddressCreate | CustomerAddressData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-007](../03-Modules/Customer_Accounts/APIs.md) | `GET /v1/me/patients` | No request body | PatientListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-008](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/me/patients` | FamilyMemberCreate | FamilyMemberData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-009](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/me/consents` | ConsentCreate | ConsentData / 201 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-005](../03-Modules/Customer_Accounts/APIs.md) | `GET /v1/me/consents` | No request body | ConsentListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-010](../03-Modules/Product_Catalog/APIs.md) | `GET /v1/catalog/categories` | No request body | CatalogCategoryListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-011](../03-Modules/Product_Catalog/APIs.md) | `GET /v1/catalog/products` | No request body | CatalogProductListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-012](../03-Modules/Product_Catalog/APIs.md) | `GET /v1/catalog/products/{product_id}` | No request body | CatalogProductDetailData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-013](../03-Modules/Product_Catalog/APIs.md) | `GET /v1/catalog/search` | No request body | CatalogSearchData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-014](../03-Modules/Product_Catalog/APIs.md) | `GET /v1/catalog/availability` | No request body | CatalogAvailabilityData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-015](../03-Modules/Product_Catalog/APIs.md) | `POST /v1/admin/catalog/imports` | CatalogImportRequest | CatalogImportAcceptedData / 202 | Incomplete | Unapproved / Not Implemented |
| [API-016](../03-Modules/Product_Catalog/APIs.md) | `POST /v1/admin/catalog/products/{product_id}/classification` | CatalogClassificationRequest | CatalogClassificationData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-017](../03-Modules/Product_Catalog/APIs.md) | `POST /v1/admin/catalog/products/{product_id}/publish` | CatalogPublishRequest | CatalogPublishData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-018](../03-Modules/Cart_Checkout/APIs.md) | `GET /v1/me/cart` | No request body | CartItemsData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-019](../03-Modules/Cart_Checkout/APIs.md) | `PUT /v1/me/cart/items` | CartItemsReplaceRequest | CartItemsData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-020](../03-Modules/Cart_Checkout/APIs.md) | `POST /v1/checkouts/quotes` | CheckoutQuoteRequest | CheckoutQuoteData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-021](../03-Modules/Cart_Checkout/APIs.md) | `POST /v1/checkouts` | CheckoutIntentRequest | CheckoutIntentData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-022](../03-Modules/Prescription_Upload/APIs.md) | `POST /v1/prescriptions/upload-intents` | PrescriptionUploadIntentRequest | PrescriptionUploadIntentData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-023](../03-Modules/Prescription_Upload/APIs.md) | `POST /v1/prescriptions/documents/confirm` | PrescriptionUploadConfirmRequest | PrescriptionUploadConfirmData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-024](../03-Modules/Prescription_Upload/APIs.md) | `POST /v1/orders/{order_id}/prescriptions` | PrescriptionAttachRequest | PrescriptionAttachData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-025](../03-Modules/Customer_Orders/APIs.md) | `GET /v1/me/orders` | No request body | OrderListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-026](../03-Modules/Customer_Orders/APIs.md) | `GET /v1/me/orders/{order_id}` | No request body | OrderDetailData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-027](../03-Modules/Customer_Orders/APIs.md) | `POST /v1/me/orders/{order_id}/cancel` | CancellationRequest | CancellationData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-028](../03-Modules/Customer_Orders/APIs.md) | `POST /v1/me/orders/{order_id}/returns` | ReturnRequest | ReturnData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-029](../03-Modules/Customer_Orders/APIs.md) | `GET /v1/me/orders/{order_id}/invoice` | No request body | InvoiceData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-030](../03-Modules/Customer_Orders/APIs.md) | `GET /v1/me/orders/{order_id}/refunds` | No request body | RefundListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-031](../03-Modules/Customer_Orders/APIs.md) | `GET /v1/me/orders/{order_id}/delivery` | No request body | OrderDeliveryData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-032](../03-Modules/Admin_CMS/APIs.md) | `GET /v1/admin/dashboard` | No request body | DashboardData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-033](../03-Modules/Admin_CMS/APIs.md) | `POST /v1/admin/staff` | StaffInviteRequest | StaffData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-034](../03-Modules/Admin_CMS/APIs.md) | `PATCH /v1/admin/staff/{staff_id}` | StaffUpdateRequest | StaffData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-035](../03-Modules/Admin_CMS/APIs.md) | `GET /v1/admin/settings` | No request body | SettingsData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-036](../03-Modules/Admin_CMS/APIs.md) | `PATCH /v1/admin/settings` | SettingsUpdateRequest | SettingsData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-037](../03-Modules/Admin_CMS/APIs.md) | `POST /v1/admin/cms/pages/{page_id}/publish` | CmsPublishRequest | CmsPublishData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-038](../03-Modules/Admin_CMS/APIs.md) | `POST /v1/admin/locations` | LocationCreateRequest | LocationData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-039](../03-Modules/Order_Operations/APIs.md) | `GET /v1/admin/orders` | No request body | OrderListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-040](../03-Modules/Order_Operations/APIs.md) | `GET /v1/admin/orders/{order_id}` | No request body | OrderDetailData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-041](../03-Modules/Order_Operations/APIs.md) | `POST /v1/admin/orders/{order_id}/allocate` | OrderAllocationRequest | AllocationData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-042](../03-Modules/Order_Operations/APIs.md) | `POST /v1/admin/orders/{order_id}/reassign` | OrderReassignmentRequest | AllocationData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-043](../03-Modules/Order_Operations/APIs.md) | `POST /v1/admin/orders/{order_id}/revisions` | OrderRevisionRequest | OrderRevisionData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-044](../03-Modules/Store_Operations/APIs.md) | `GET /v1/staff/store/orders` | No request body | FulfillmentListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-045](../03-Modules/Store_Operations/APIs.md) | `POST /v1/staff/store/orders/{order_id}/accept` | StoreAcceptRequest | FulfillmentData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-046](../03-Modules/Store_Operations/APIs.md) | `POST /v1/staff/store/picks/{pick_id}/scan` | PickScanRequest | PickScanData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-047](../03-Modules/Store_Operations/APIs.md) | `POST /v1/staff/store/packs/{pack_id}/close` | PackCloseRequest | PackCloseData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-048](../03-Modules/Store_Operations/APIs.md) | `POST /v1/staff/store/replenishments` | ReplenishmentRequest | ReplenishmentData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-049](../03-Modules/Store_Operations/APIs.md) | `POST /v1/staff/store/transfers/{transfer_id}/receipt` | TransferReceiptRequest | TransferData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-050](../03-Modules/Inventory/APIs.md) | `GET /v1/staff/inventory` | No request body | StockListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-051](../03-Modules/Inventory/APIs.md) | `POST /v1/staff/inventory/observations` | StockObservationRequest | StockObservationData / 200 | Incomplete | Unapproved / Not Implemented |
| [API-052](../03-Modules/Inventory/APIs.md) | `POST /v1/internal/inventory/reservations` | ReservationRequest | ReservationData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-053](../03-Modules/Inventory/APIs.md) | `POST /v1/internal/inventory/reservations/{reservation_id}/release` | ReservationReleaseRequest | ReservationReleaseData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-054](../03-Modules/Inventory/APIs.md) | `POST /v1/staff/inventory/adjustments` | AdjustmentRequest | AdjustmentData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-055](../03-Modules/Inventory/APIs.md) | `GET /v1/staff/inventory/alerts` | No request body | InventoryAlertListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-056](../03-Modules/Warehouse/APIs.md) | `POST /v1/staff/warehouse/receipts` | GoodsReceiptRequest | GoodsReceiptData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-057](../03-Modules/Warehouse/APIs.md) | `GET /v1/staff/warehouse/replenishments` | No request body | ReplenishmentListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-058](../03-Modules/Warehouse/APIs.md) | `POST /v1/staff/warehouse/transfers/{transfer_id}/dispatch` | TransferDispatchRequest | TransferData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-059](../03-Modules/Warehouse/APIs.md) | `GET /v1/staff/warehouse/fallback-orders` | No request body | OrderListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-060](../03-Modules/Pharmacist_Review/APIs.md) | `GET /v1/pharmacy/reviews` | No request body | ReviewListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-061](../03-Modules/Pharmacist_Review/APIs.md) | `GET /v1/pharmacy/reviews/{review_id}` | No request body | ReviewDetailData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-062](../03-Modules/Pharmacist_Review/APIs.md) | `POST /v1/pharmacy/reviews/{review_id}/lines/{line_id}/decision` | PharmacistDecisionRequest | PharmacistDecisionData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-063](../03-Modules/Pharmacist_Review/APIs.md) | `POST /v1/me/orders/{order_id}/revisions/{revision_id}/accept` | RevisionAcceptanceRequest | OrderRevisionData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-064](../03-Modules/Delivery_Operations/APIs.md) | `GET /v1/staff/delivery/tasks` | No request body | TaskListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-065](../03-Modules/Delivery_Operations/APIs.md) | `POST /v1/staff/delivery/tasks/{task_id}/assign` | AssignmentRequest | AssignmentData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-066](../03-Modules/Delivery_Operations/APIs.md) | `POST /v1/staff/delivery/tasks/{task_id}/resolution` | DeliveryResolutionRequest | DeliveryResolutionData / 200 | Incomplete | Unapproved / Not Implemented |
| [API-067](../03-Modules/Delivery_Operations/APIs.md) | `GET /v1/staff/delivery/cod-handover` | No request body | CodListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-068](../03-Modules/Delivery_Operations/APIs.md) | `POST /v1/staff/delivery/riders` | RiderOnboardingRequest | StaffData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-069](../03-Modules/Rider_App/APIs.md) | `POST /v1/rider/shifts` | RiderShiftRequest | RiderShiftData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-070](../03-Modules/Rider_App/APIs.md) | `GET /v1/rider/tasks` | No request body | TaskListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-071](../03-Modules/Rider_App/APIs.md) | `POST /v1/rider/tasks/{task_id}/pickup` | PickupRequest | AssignmentData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-072](../03-Modules/Rider_App/APIs.md) | `POST /v1/rider/tasks/{task_id}/location` | LocationUpdateRequest | LocationUpdateData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-073](../03-Modules/Rider_App/APIs.md) | `POST /v1/rider/tasks/{task_id}/complete` | DeliveryCompletionRequest | DeliveryCompletionData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-074](../03-Modules/Rider_App/APIs.md) | `POST /v1/rider/tasks/{task_id}/fail` | DeliveryFailureRequest | DeliveryFailureData / 201 | Complete proposed | Unapproved / Not Implemented |
| [API-075](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/payments/intents` | PaymentIntentRequest | PaymentIntentData / 202 | Incomplete | Unapproved / Not Implemented |
| [API-076](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/webhooks/cashfree` | ProviderEventUnresolved | ProviderAckUnresolved / 200 | Incomplete | Unapproved / Not Implemented |
| [API-077](../03-Modules/Finance_Payments/APIs.md) | `GET /v1/admin/finance/payments` | No request body | PaymentListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-078](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/admin/finance/refunds` | RefundInstructionRequest | RefundInstructionData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-079](../03-Modules/Finance_Payments/APIs.md) | `GET /v1/admin/finance/settlements` | No request body | SettlementListData / 200 | Incomplete | Unapproved / Not Implemented |
| [API-080](../03-Modules/Finance_Payments/APIs.md) | `POST /v1/admin/finance/cod-reconciliation` | CodReconciliationRequest | ReconciliationRunData / 202 | Incomplete | Unapproved / Not Implemented |
| [API-081](../03-Modules/Finance_Payments/APIs.md) | `GET /v1/admin/finance/invoices/{order_id}` | No request body | InvoiceData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-082](../03-Modules/Reporting/APIs.md) | `GET /v1/admin/reports/sales` | No request body | SalesReportData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-083](../03-Modules/Reporting/APIs.md) | `GET /v1/admin/reports/tax` | No request body | TaxReportData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-084](../03-Modules/Reporting/APIs.md) | `GET /v1/admin/reports/stock` | No request body | StockReportData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-085](../03-Modules/Reporting/APIs.md) | `GET /v1/admin/reports/deliveries` | No request body | DeliveriesReportData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-086](../03-Modules/Reporting/APIs.md) | `POST /v1/admin/reports/exports` | ReportExportRequest | ReportRunData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-087](../03-Modules/Audit/APIs.md) | `GET /v1/admin/audit/events` | No request body | AuditListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-088](../03-Modules/Audit/APIs.md) | `POST /v1/admin/audit/exports` | AuditExportRequest | ReportRunData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-089](../03-Modules/Authentication_Access/APIs.md) | `POST /v1/auth/staff/login` | StaffLoginRequest | StaffChallengeData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-090](../03-Modules/Authentication_Access/APIs.md) | `POST /v1/auth/staff/mfa/verify` | StaffMfaRequest | SessionData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-091](../03-Modules/Authentication_Access/APIs.md) | `POST /v1/auth/sessions/refresh` | SessionRefreshRequest | SessionData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-092](../03-Modules/Authentication_Access/APIs.md) | `POST /v1/auth/sessions/revoke` | SessionRevocationRequest | SessionRevocationData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-093](../03-Modules/Authentication_Access/APIs.md) | `GET /v1/auth/permissions` | No request body | EffectivePermissionListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-094](../03-Modules/Notifications/APIs.md) | `POST /v1/internal/notifications/jobs` | NotificationJobRequest | NotificationData / 202 | Complete proposed | Unapproved / Not Implemented |
| [API-095](../03-Modules/Notifications/APIs.md) | `GET /v1/admin/notifications/deliveries` | No request body | NotificationListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-096](../03-Modules/Notifications/APIs.md) | `POST /v1/rider/push-tokens` | PushTokenRequest | PushEndpointData / 200 | Complete proposed | Unapproved / Not Implemented |
| [API-097](../03-Modules/Notifications/APIs.md) | `GET /v1/admin/notifications/alerts` | No request body | NotificationAlertListData / 200 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-001](../03-Modules/Customer_Accounts/APIs.md) | `PATCH /v1/me/addresses/{addressId}` | CustomerAddressPatch | CustomerAddressData / 200 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-002](../03-Modules/Customer_Accounts/APIs.md) | `DELETE /v1/me/addresses/{addressId}` | No request body | No response body / 204 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-007](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/me/deletion-requests` | PrivacyDeletionRequest | PrivacyRequestData / 202 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-006](../03-Modules/Customer_Accounts/APIs.md) | `GET /v1/me/deletion-requests/{requestId}` | No request body | PrivacyRequestData / 200 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-003](../03-Modules/Customer_Accounts/APIs.md) | `PATCH /v1/me/patients/{patientId}` | FamilyMemberPatch | FamilyMemberData / 200 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-004](../03-Modules/Customer_Accounts/APIs.md) | `DELETE /v1/me/patients/{patientId}` | No request body | No response body / 204 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-008](../03-Modules/Customer_Accounts/APIs.md) | `GET /v1/me/wishlist/items` | No request body | WishlistData / 200 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-009](../03-Modules/Customer_Accounts/APIs.md) | `POST /v1/me/wishlist/items` | WishlistItemCreate | WishlistItemData / 201 | Complete proposed | Unapproved / Not Implemented |
| [ACC-ROUTE-010](../03-Modules/Customer_Accounts/APIs.md) | `DELETE /v1/me/wishlist/items/{itemId}` | No request body | No response body / 204 | Complete proposed | Unapproved / Not Implemented |

| API | Route | Request | Success | Planning | Approval / implementation |
| --- | --- | --- | --- | --- | --- |
| API-098 | `POST /v1/auth/login/initiate` | Typed operation DTO / example | 202 | Complete proposed | Unapproved / Not Implemented |
| API-099 | `POST /v1/auth/login/verify` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-100 | `GET /v1/auth/identity` | No request body | 200 | Complete proposed | Unapproved / Not Implemented |
| API-101 | `GET /v1/auth/workspaces` | No request body | 200 | Complete proposed | Unapproved / Not Implemented |
| API-102 | `POST /v1/auth/context` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-103 | `POST /v1/auth/step-up` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-104 | `POST /v1/auth/mfa/enrollment` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-105 | `POST /v1/auth/credentials/password` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-106 | `POST /v1/auth/recovery/request` | Typed operation DTO / example | 202 | Complete proposed | Unapproved / Not Implemented |
| API-107 | `POST /v1/auth/recovery/complete` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-108 | `PUT /v1/admin/roles/{role_id}/permissions` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |
| API-109 | `POST /v1/admin/users/{user_id}/role-assignments` | Typed operation DTO / example | 201 | Complete proposed | Unapproved / Not Implemented |
| API-110 | `PATCH /v1/admin/role-assignments/{assignment_id}` | Typed operation DTO / example | 200 | Complete proposed | Unapproved / Not Implemented |

| API | Route | Request | Success | Planning | Approval / implementation |
| --- | --- | --- | --- | --- | --- |
| API-111 | `GET /v1/admin/roles/{role_id}/permissions` | No request body | Typed role/assignment DTO / 200 | Complete proposed | Unapproved / Not Implemented |
| API-112 | `GET /v1/admin/users/{user_id}/role-assignments` | No request body | Typed role/assignment DTO / 200 | Complete proposed | Unapproved / Not Implemented |

## Validation interpretation

[Validation evidence](Planning-Validation.md) records actual commands, schema/example/link/column checks and limits. The repository API validator audits structural DTO coverage; it does not read every `x-documentation-status` blocker and cannot establish semantic planning completion or approval. A passing structural strict mode does not promote the eight explicit exclusions above. Provider-specific signature/acknowledgment evidence, provider/runtime behavior and live application tests remain unverified; isolated schema parity is verified.
