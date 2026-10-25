# Pharmville — Screen Index

A source-derived index of every screen displayed on the offline Screen Atlas board.

**Screens:** 91 · **Modules:** 18

## 01. Customer Accounts (8 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-CUS-001` | Sign in with your mobile | `customer/login` | customer | `ACC-01`, `ACC-05`, `AUTH-03` |
| `SCR-CUS-002` | Verify your code | `customer/otp` | customer | `ACC-01`, `AUTH-03` |
| `SCR-CUS-003` | My profile | `customer/profile` | customer | `ACC-02` |
| `SCR-CUS-004` | Saved delivery addresses | `customer/addresses` | customer | `ACC-03` |
| `SCR-CUS-005` | Family and patient profiles | `customer/family` | customer | `ACC-04`, `RX-04` |
| `SCR-CUS-006` | Privacy notice and consent | `customer/privacy` | customer | `ACC-05` |
| `SCR-CUS-007` | Request account deletion | `customer/deletion` | customer | `ACC-06` |
| `SCR-CUS-008` | My wishlist | `customer/wishlist` | customer | `ACC-07` |

## 02. Product Catalog (5 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-CUS-009` | Pharmville shop | `customer/home` | customer | `CAT-01`, `CAT-04`, `CAT-06` |
| `SCR-CUS-010` | Categories and subcategories | `customer/categories` | customer | `CAT-01` |
| `SCR-CUS-011` | Search results and suggestions | `customer/search` | customer | `CAT-03` |
| `SCR-CUS-012` | Product details | `customer/product` | customer | `CAT-02`, `CAT-04`, `CAT-06`, `ACC-07` |
| `SCR-CUS-013` | Compare exact alternatives | `customer/alternatives` | customer | `CAT-05` |

## 03. Cart Checkout (7 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-CUS-014` | Your cart | `customer/cart` | customer | `CHK-01`, `CHK-05`, `CHK-06` |
| `SCR-CUS-015` | Checkout · delivery address | `customer/checkout-address` | customer | `CHK-02`, `ACC-03` |
| `SCR-CUS-016` | Checkout · choose patient | `customer/checkout-patient` | customer | `CHK-02`, `RX-04`, `ACC-04` |
| `SCR-CUS-017` | Checkout · accept current summary | `customer/checkout-summary` | customer | `CHK-02`, `CHK-05`, `CHK-06`, `CHK-07`, `CHK-08` |
| `SCR-CUS-021` | Choose a payment method | `customer/payment` | customer | `CHK-03`, `CHK-04`, `CHK-07`, `CHK-08` |
| `SCR-CUS-022` | Payment and order result | `customer/payment-result` | customer | `CHK-03`, `CHK-07`, `ORD-01` |
| `SCR-CUS-023` | Recover existing payment | `customer/payment-recovery` | customer | `CHK-07`, `CHK-08`, `FIN-01` |

## 04. Prescription Upload (3 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-CUS-018` | Prescription upload | `customer/prescription-upload` | customer | `RX-01`, `RX-02`, `RX-03`, `RX-04` |
| `SCR-CUS-019` | Pharmacist review status | `customer/prescription-status` | customer | `RX-05`, `RX-04` |
| `SCR-CUS-020` | Accept a revised order | `customer/revised-order` | customer | `RX-05`, `CHK-06` |

## 05. Customer Orders (9 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-CUS-024` | My orders | `customer/orders` | customer | `ORD-01`, `ORD-02`, `ORD-03` |
| `SCR-CUS-025` | Order details and confirmation | `customer/order-detail` | customer | `ORD-01`, `ORD-02`, `ORD-03`, `ORD-04`, `ORD-05`, `ORD-06`, `ORD-09` |
| `SCR-CUS-026` | Delivery tracking and handover code | `customer/tracking` | customer | `ORD-02`, `ORD-07`, `ORD-08` |
| `SCR-CUS-027` | Request cancellation | `customer/cancellation` | customer | `ORD-04`, `ORD-06` |
| `SCR-CUS-028` | Return or quality complaint | `customer/return` | customer | `ORD-05`, `ORD-06` |
| `SCR-CUS-029` | Refund progress | `customer/refund` | customer | `ORD-06` |
| `SCR-CUS-030` | Invoice and billing evidence | `customer/invoice` | customer | `ORD-03`, `FIN-02` |
| `SCR-RET-001` | Return eligibility and owner review queue | `staff/returns` | returns | `ORD-05`, `ORD-06` |
| `SCR-CUS-HELP-001` | Customer help and case history | `customer/help` | customer | `ORD-05` |

## 06. Admin CMS (7 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-ADM-001` | Role and location dashboard | `staff/dashboard` | admin | `ADM-01` |
| `SCR-ADM-002` | Staff invitations and session revocation | `staff/staff` | admin | `ADM-02` |
| `SCR-ADM-003` | Roles and permissions | `staff/permissions` | admin | `ADM-03` |
| `SCR-ADM-004` | CMS draft and publication | `staff/cms` | admin | `ADM-04` |
| `SCR-ADM-005` | System settings and offer proposals | `staff/settings` | admin | `ADM-05`, `ADM-09` |
| `SCR-ADM-006` | Product masters and bulk import | `staff/catalog` | admin | `ADM-06`, `ADM-07` |
| `SCR-ADM-007` | Store and warehouse masters | `staff/locations` | admin | `ADM-08` |

## 07. Order Operations (4 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-OMS-001` | Order and attention queue | `staff/orders` | orders | `OMS-01`, `OMS-06` |
| `SCR-OMS-002` | Order detail, revision and recovery | `staff/order-detail` | orders | `OMS-02`, `OMS-05` |
| `SCR-OMS-003` | Licensed allocation and reassignment | `staff/allocation` | orders | `OMS-03`, `OMS-04` |
| `SCR-OMS-004` | Assisted phone-order intake — blocked contract | `staff/assisted-order` | orders | `OMS-07` |

## 08. Inventory (4 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-INV-001` | Batch stock and FEFO eligibility | `staff/inventory` | inventory | `INV-01`, `INV-03`, `INV-05` |
| `SCR-INV-002` | Read-only stock movement ledger | `staff/ledger` | inventory | `INV-02` |
| `SCR-INV-003` | Stock adjustment and manager review | `staff/adjustment` | inventory | `INV-04` |
| `SCR-INV-004` | Opening stock import and Techsmith sync | `staff/inventory-integration` | inventory | `INV-06`, `INV-07` |

## 09. Finance Payments (5 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-FIN-001` | Payment records and uncertain outcome recovery | `staff/payments` | finance | `FIN-01` |
| `SCR-FIN-002` | Invoice evidence and blocked tax setup | `staff/invoice` | finance | `FIN-02` |
| `SCR-FIN-003` | Refund request, approval and tracking | `staff/refunds` | finance | `FIN-03`, `FIN-04` |
| `SCR-FIN-004` | Settlement and COD reconciliation | `staff/reconciliation` | finance | `FIN-05`, `FIN-06` |
| `SCR-FIN-005` | Credit-note proposal and original invoice | `staff/credit-note` | finance | `FIN-07` |

## 10. Reporting (2 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-REP-001` | Report selection and filters | `staff/reports` | reporting | `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-05`, `REP-06` |
| `SCR-REP-002` | Report results and export job | `staff/report-results` | reporting | `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-05`, `REP-06`, `REP-07` |

## 11. Audit (1 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-AUD-001` | Read-only audit search and export | `staff/audit` | audit | `AUD-01`, `AUD-02` |

## 12. Notifications (3 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-NOT-001` | Notification attempts and staff alerts | `staff/notifications` | notifications | `NOT-01`, `NOT-02`, `NOT-04` |
| `SCR-NOT-002` | Channel preferences and optional push simulation | `staff/notification-preferences` | notifications | `NOT-01`, `NOT-03`, `NOT-05` |
| `SCR-SUP-001` | Identity-aware support triage | `staff/support` | support | `NOT-04` |

## 13. Pharmacist Review (4 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-PHM-001` | Prescription review queue | `pharmacy/queue` | pharmacy | `PHM-01` |
| `SCR-PHM-002` | Compare prescription and order | `pharmacy/review` | pharmacy | `PHM-02`, `PHM-04` |
| `SCR-PHM-003` | Record pharmacist decisions | `pharmacy/decision` | pharmacy | `PHM-03`, `PHM-04`, `PHM-05` |
| `SCR-PHM-004` | Pharmacist decision history | `pharmacy/history` | pharmacy | `PHM-05` |

## 14. Store Operations (5 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-STO-001` | My store incoming orders | `store/queue` | store | `STO-01`, `STO-02` |
| `SCR-STO-002` | Exact batch pick list | `store/pick` | store | `STO-02` |
| `SCR-STO-003` | Packing and custody handoff | `store/pack` | store | `STO-02` |
| `SCR-STO-004` | Store stock and replenishment | `store/replenishment` | store | `STO-03`, `STO-05` |
| `SCR-STO-005` | Receive warehouse transfer | `store/receipt` | store | `STO-04` |

## 15. Warehouse (7 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-WH-001` | Supplier receiving | `warehouse/receiving` | warehouse | `WH-01` |
| `SCR-WH-002` | Replenishment and urgent-run queue | `warehouse/replenishment` | warehouse | `WH-02`, `WH-03` |
| `SCR-WH-003` | Warehouse transfer dispatch | `warehouse/dispatch` | warehouse | `WH-02`, `WH-03` |
| `SCR-WH-004` | Warehouse counts and fallback orders | `warehouse/audit` | warehouse | `WH-04`, `WH-05` |
| `SCR-PRO-001` | Supplier directory and proposals | `procurement/suppliers` | procurement | `WH-01` |
| `SCR-PRO-002` | Replenishment demand and purchase orders | `procurement/orders` | procurement | `WH-02`, `WH-01` |
| `SCR-RET-004` | Returned item receipt and inspection | `warehouse/returns` | warehouse | `WH-05` |

## 16. Delivery Operations (5 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-DLV-001` | Delivery dispatch dashboard | `delivery/dashboard` | delivery | `DLV-01`, `DLV-04` |
| `SCR-DLV-002` | Confirm rider assignment | `delivery/assignment` | delivery | `DLV-02`, `DLV-05` |
| `SCR-DLV-003` | Failed delivery resolution | `delivery/failures` | delivery | `DLV-03` |
| `SCR-DLV-004` | Rider management and COD handover | `delivery/riders` | delivery | `DLV-04`, `DLV-05` |
| `SCR-RET-002` | Reverse pickup dispatch | `delivery/returns` | delivery | `DLV-03`, `DLV-05` |

## 17. Rider App (8 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-RID-001` | Rider OTP sign in | `rider/login` | rider | `RID-01` |
| `SCR-RID-002` | Duty and assigned tasks | `rider/tasks` | rider | `RID-01`, `RID-02` |
| `SCR-RID-003` | Rider pickup checklist | `rider/pickup` | rider | `RID-02` |
| `SCR-RID-004` | Navigation and last-known location | `rider/navigation` | rider | `RID-02`, `RID-03` |
| `SCR-RID-005` | Doorstep proof and completion | `rider/completion` | rider | `RID-04`, `RID-05` |
| `SCR-RID-006` | Failed attempt and rider history | `rider/failure` | rider | `RID-06`, `RID-07` |
| `SCR-RID-007` | Daily deliveries and earnings status | `rider/history` | rider | `RID-07`, `RID-04` |
| `SCR-RET-003` | Rider return pickup task | `rider/returns` | rider | `RID-02`, `RID-06` |

## 18. Authentication Access (4 screens)

| Screen ID | Screen | Route | Workspace | Related features |
| --- | --- | --- | --- | --- |
| `SCR-ACC-001` | Unified staff identity sign-in | `access/login` | access | `AUTH-01`, `AUTH-03` |
| `SCR-ACC-002` | Privileged authenticator challenge | `access/mfa` | access | `AUTH-01`, `AUTH-02` |
| `SCR-ACC-003` | Identity session and access checks | `access/sessions` | access | `AUTH-02`, `AUTH-03`, `AUTH-04` |
| `SCR-ACC-004` | Authorized workspace selection | `access/workspaces` | access | `AUTH-04` |
