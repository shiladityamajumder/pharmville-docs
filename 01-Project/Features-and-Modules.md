# Feature inventory

**Scope status:** 110 feature IDs are recorded as draft requirements. No signed product approval source is present in this workspace. Priorities are retained as draft.

| Feature ID | Module | Draft priority | Description |
| --- | --- | --- | --- |
| `ACC-01` | Customer_Accounts | Must (draft) | Sign up and log in with mobile OTP (WhatsApp first, SMS fallback) |
| `ACC-02` | Customer_Accounts | Must (draft) | Profile: name, email, phone |
| `ACC-03` | Customer_Accounts | Must (draft) | Saved addresses with map pin; serviceability checked when the address is entered |
| `ACC-04` | Customer_Accounts | Must (draft) | Family profiles for dependents (name, age, relation) |
| `ACC-05` | Customer_Accounts | Must (draft) | Privacy notice and consent at signup |
| `ACC-06` | Customer_Accounts | Should (draft) | Account deletion request |
| `ACC-07` | Customer_Accounts | Should (draft) | Wishlist |
| `CAT-01` | Product_Catalog | Must (draft) | Browse by category and sub-category |
| `CAT-02` | Product_Catalog | Must (draft) | Product page: brand, manufacturer, composition, pack size, MRP, price, images, "Prescription required" label |
| `CAT-03` | Product_Catalog | Must (draft) | Search by name, brand and composition, with typo tolerance and autosuggest |
| `CAT-04` | Product_Catalog | Must (draft) | Availability for the customer's pin code (in stock / out of stock) |
| `CAT-05` | Product_Catalog | Should (draft) | Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule |
| `CAT-06` | Product_Catalog | Must (draft) | Placeholder image when a product has none |
| `CHK-01` | Cart_Checkout | Must (draft) | Cart saved across devices for logged-in customers |
| `CHK-02` | Cart_Checkout | Must (draft) | Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying |
| `CHK-03` | Cart_Checkout | Must (draft) | Online payment via Cashfree: UPI, cards, net banking |
| `CHK-04` | Cart_Checkout | Must (draft) | Cash on delivery, with a maximum order value and a block after repeated refusals |
| `CHK-05` | Cart_Checkout | Must (draft) | Minimum order value and delivery fee applied from settings |
| `CHK-06` | Cart_Checkout | Must (draft) | Price or stock change detected before payment; customer confirms |
| `CHK-07` | Cart_Checkout | Must (draft) | No duplicate orders or charges (double tap, refresh, closed browser after payment) |
| `CHK-08` | Cart_Checkout | Must (draft) | Stock reserved during checkout, released automatically if payment does not finish |
| `RX-01` | Prescription_Upload | Must (draft) | Upload one or more prescriptions (JPG, PNG, PDF) at checkout |
| `RX-02` | Prescription_Upload | Should (draft) | Upload within 24 hours after ordering; auto-cancel after that |
| `RX-03` | Prescription_Upload | Should (draft) | Reuse a saved, still-valid prescription |
| `RX-04` | Prescription_Upload | Must (draft) | Link each prescription to the patient (self or family member) |
| `RX-05` | Prescription_Upload | Must (draft) | See the pharmacist's decision and reason; re-upload after rejection |
| `ORD-01` | Customer_Orders | Must (draft) | Order confirmation on screen, WhatsApp and email |
| `ORD-02` | Customer_Orders | Must (draft) | Status timeline (placed → packed → out for delivery → delivered) |
| `ORD-03` | Customer_Orders | Must (draft) | Order history with GST invoice download |
| `ORD-04` | Customer_Orders | Must (draft) | Cancel before the order is packed |
| `ORD-05` | Customer_Orders | Should (draft) | Return request within the return window |
| `ORD-06` | Customer_Orders | Must (draft) | Refund status for cancelled and returned orders |
| `ORD-07` | Customer_Orders | Must (draft) | Live rider location on a map, estimated arrival, masked call button |
| `ORD-08` | Customer_Orders | Must (draft) | Delivery OTP shown to the customer |
| `ORD-09` | Customer_Orders | Could (draft) | Change items or address after placing an order |
| `ADM-01` | Admin_CMS | Must (draft) | Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress |
| `ADM-02` | Admin_CMS | Must (draft) | Staff users: invite, assign role and location, deactivate, log out sessions |
| `ADM-03` | Admin_CMS | Must (draft) | Roles and permissions for 16 roles, limited to own store or warehouse |
| `ADM-04` | Admin_CMS | Must (draft) | CMS: home banners, FAQs, policy pages, with draft and publish |
| `ADM-05` | Admin_CMS | Must (draft) | System settings (PRD section 8) |
| `ADM-06` | Admin_CMS | Must (draft) | Catalogue admin: products, categories, brands, salt master, prices, GST and HSN |
| `ADM-07` | Admin_CMS | Must (draft) | Bulk product import from Excel, with error report |
| `ADM-08` | Admin_CMS | Must (draft) | Store and warehouse master: address, hours, GSTIN, service areas |
| `ADM-09` | Admin_CMS | Should (draft) | Offer settings: start and end dates, maximum discount, first-order offer |
| `OMS-01` | Order_Operations | Must (draft) | Order list with filters (status, location, date, payment, Rx) and search by order number or phone |
| `OMS-02` | Order_Operations | Must (draft) | Order detail: items, batches, prescription, payment, delivery, full history |
| `OMS-03` | Order_Operations | Must (draft) | Automatic routing to the nearest open store with every item; warehouse as fallback |
| `OMS-04` | Order_Operations | Must (draft) | Reassign an order to another location, with a reason |
| `OMS-05` | Order_Operations | Must (draft) | Cancel, partly fulfil, raise return, add internal note |
| `OMS-06` | Order_Operations | Must (draft) | Attention queue: payment pending, stuck orders, failed deliveries |
| `OMS-07` | Order_Operations | Could (draft) | Assisted order entry for phone orders |
| `STO-01` | Store_Operations | Must (draft) | Incoming order queue for my store, with sound alert |
| `STO-02` | Store_Operations | Must (draft) | Accept order, pick list, mark packed, hand over to rider |
| `STO-03` | Store_Operations | Must (draft) | Raise replenishment request (normal or urgent) |
| `STO-04` | Store_Operations | Must (draft) | Confirm receipt of a transfer; record shortages |
| `STO-05` | Store_Operations | Must (draft) | My store's stock, with low-stock and near-expiry alerts |
| `INV-01` | Inventory | Must (draft) | Stock per location and batch, with manufacturing and expiry dates |
| `INV-02` | Inventory | Must (draft) | Stock ledger: every movement recorded; stock is the sum of the ledger |
| `INV-03` | Inventory | Must (draft) | Allocate nearest-expiry batch first; block batches below minimum shelf life |
| `INV-04` | Inventory | Must (draft) | Stock adjustments with reason; manager approval above a threshold |
| `INV-05` | Inventory | Must (draft) | Low-stock and near-expiry alerts |
| `INV-06` | Inventory | Must (draft) | Opening stock import per location |
| `INV-07` | Inventory | Must (draft) | Stock sync with Techsmith |
| `WH-01` | Warehouse | Must (draft) | Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice |
| `WH-02` | Warehouse | Must (draft) | Replenishment queue: approve, dispatch with note, stock "in transit" |
| `WH-03` | Warehouse | Must (draft) | Urgent runs, up to two extra a day |
| `WH-04` | Warehouse | Must (draft) | Pick, pack and dispatch fallback online orders |
| `WH-05` | Warehouse | Could (draft) | Basic stock audit |
| `PHM-01` | Pharmacist_Review | Must (draft) | Review queue, oldest first, with waiting time |
| `PHM-02` | Pharmacist_Review | Must (draft) | Side-by-side view: zoomable prescription and order items |
| `PHM-03` | Pharmacist_Review | Must (draft) | Approve all, approve some, or reject with a reason |
| `PHM-04` | Pharmacist_Review | Should (draft) | Confirm a chosen alternative matches the prescription |
| `PHM-05` | Pharmacist_Review | Must (draft) | Pharmacist name, registration number and time on every decision |
| `DLV-01` | Delivery_Operations | Must (draft) | Live map of riders (available, on delivery, offline) and orders ready for pickup |
| `DLV-02` | Delivery_Operations | Must (draft) | Suggest the nearest available rider; staff confirm or choose another |
| `DLV-03` | Delivery_Operations | Must (draft) | Failed-delivery queue: reattempt, reschedule or return to store |
| `DLV-04` | Delivery_Operations | Must (draft) | COD handover: cash collected vs deposited per rider per day |
| `DLV-05` | Delivery_Operations | Must (draft) | Rider management: onboard, assign location, shifts |
| `RID-01` | Rider_App | Must (draft) | OTP login; on duty, off duty and break |
| `RID-02` | Rider_App | Must (draft) | Task list; accept; open Google Maps to navigate; mark picked up |
| `RID-03` | Rider_App | Must (draft) | Background location: every 5–10 s on delivery, 15–30 s idle |
| `RID-04` | Rider_App | Must (draft) | Complete delivery with customer OTP and photo; record COD collected |
| `RID-05` | Rider_App | Should (draft) | Door checks for prescription medicines |
| `RID-06` | Rider_App | Must (draft) | Failed attempt with a reason from a fixed list |
| `RID-07` | Rider_App | Should (draft) | Daily deliveries and incentive earned |
| `FIN-01` | Finance_Payments | Must (draft) | Payment records from Cashfree webhooks and COD collections |
| `FIN-02` | Finance_Payments | Must (draft) | GST invoice per order, from the right GSTIN |
| `FIN-03` | Finance_Payments | Must (draft) | Automatic refunds; manual refunds need approval above a set amount |
| `FIN-04` | Finance_Payments | Should (draft) | COD refunds by bank transfer or UPI |
| `FIN-05` | Finance_Payments | Must (draft) | Daily reconciliation: Cashfree settlements vs orders |
| `FIN-06` | Finance_Payments | Must (draft) | COD reconciliation: collected vs deposited |
| `FIN-07` | Finance_Payments | Should (draft) | Credit notes for refunds and returns |
| `REP-01` | Reporting | Must (draft) | Sales and orders, by date, store and product |
| `REP-02` | Reporting | Must (draft) | GST report for filing |
| `REP-03` | Reporting | Must (draft) | Stock, low stock and near-expiry |
| `REP-04` | Reporting | Must (draft) | COD, rider collections and deliveries per rider |
| `REP-05` | Reporting | Should (draft) | Refunds, cancellations and failed deliveries |
| `REP-06` | Reporting | Should (draft) | Replenishment transfers |
| `REP-07` | Reporting | Must (draft) | Excel export for every report |
| `AUD-01` | Audit | Must (draft) | Log logins, changes, stock movements and prescription views |
| `AUD-02` | Audit | Must (draft) | Search and export the audit log; read-only for everyone |
| `AUTH-01` | Authentication_Access | Must (draft) | Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager |
| `AUTH-02` | Authentication_Access | Must (draft) | Lockout rules, session limits, one session per staff account |
| `AUTH-03` | Authentication_Access | Must (draft) | OTP rate limits per number and IP |
| `AUTH-04` | Authentication_Access | Must (draft) | Permissions checked on the server for every request |
| `NOT-01` | Notifications | Must (draft) | One notification service: templates, WhatsApp first, SMS fallback, email |
| `NOT-02` | Notifications | Must (draft) | Delivery log with retries |
| `NOT-03` | Notifications | Must (draft) | Rider push notifications (FCM) |
| `NOT-04` | Notifications | Must (draft) | Staff alerts in the admin panel |
| `NOT-05` | Notifications | Could (draft) | Customer browser push notifications |

## Module inventory

**18 module groupings** derived from the 110 inherited feature IDs (not a newly signed launch scope). Database schemas are cross-product and do not each imply a Phase 1 module.

| Module | Features | HLD | LLD | API contracts | DB mapping | Test plan |
| --- | --- | --- | --- | --- | --- | --- |
| Customer_Accounts | 7 | [HLD](../03-Modules/Customer-Accounts/HLD.md) | [LLD](../03-Modules/Customer-Accounts/LLD.md) | [Contracts](../03-Modules/Customer-Accounts/APIs.md) | [DB](../04-Database/Module-Mapping.md#customer-accounts) | [Tests](../03-Modules/Customer-Accounts/Edge-Cases.md) |
| Product_Catalog | 6 | [HLD](../03-Modules/Product-Catalog/HLD.md) | [LLD](../03-Modules/Product-Catalog/LLD.md) | [Contracts](../03-Modules/Product-Catalog/APIs.md) | [DB](../04-Database/Module-Mapping.md#product-catalog) | [Tests](../03-Modules/Product-Catalog/Edge-Cases.md) |
| Cart_Checkout | 8 | [HLD](../03-Modules/Cart-Checkout/HLD.md) | [LLD](../03-Modules/Cart-Checkout/LLD.md) | [Contracts](../03-Modules/Cart-Checkout/APIs.md) | [DB](../04-Database/Module-Mapping.md#cart-checkout) | [Tests](../03-Modules/Cart-Checkout/Edge-Cases.md) |
| Prescription_Upload | 5 | [HLD](../03-Modules/Prescription-Management/HLD.md) | [LLD](../03-Modules/Prescription-Management/LLD.md) | [Contracts](../03-Modules/Prescription-Management/APIs.md) | [DB](../04-Database/Module-Mapping.md#prescription-upload) | [Tests](../03-Modules/Prescription-Management/Edge-Cases.md) |
| Customer_Orders | 9 | [HLD](../03-Modules/Customer-Orders/HLD.md) | [LLD](../03-Modules/Customer-Orders/LLD.md) | [Contracts](../03-Modules/Customer-Orders/APIs.md) | [DB](../04-Database/Module-Mapping.md#customer-orders) | [Tests](../03-Modules/Customer-Orders/Edge-Cases.md) |
| Admin_CMS | 9 | [HLD](../03-Modules/Admin/HLD.md) | [LLD](../03-Modules/Admin/LLD.md) | [Contracts](../03-Modules/Admin/APIs.md) | [DB](../04-Database/Module-Mapping.md#admin-cms) | [Tests](../03-Modules/Admin/Edge-Cases.md) |
| Order_Operations | 7 | [HLD](../03-Modules/Order-Management/HLD.md) | [LLD](../03-Modules/Order-Management/LLD.md) | [Contracts](../03-Modules/Order-Management/APIs.md) | [DB](../04-Database/Module-Mapping.md#order-operations) | [Tests](../03-Modules/Order-Management/Edge-Cases.md) |
| Store_Operations | 5 | [HLD](../03-Modules/Store-Operations/HLD.md) | [LLD](../03-Modules/Store-Operations/LLD.md) | [Contracts](../03-Modules/Store-Operations/APIs.md) | [DB](../04-Database/Module-Mapping.md#store-operations) | [Tests](../03-Modules/Store-Operations/Edge-Cases.md) |
| Inventory | 7 | [HLD](../03-Modules/Inventory/HLD.md) | [LLD](../03-Modules/Inventory/LLD.md) | [Contracts](../03-Modules/Inventory/APIs.md) | [DB](../04-Database/Module-Mapping.md#inventory) | [Tests](../03-Modules/Inventory/Edge-Cases.md) |
| Warehouse | 5 | [HLD](../03-Modules/Warehouse/HLD.md) | [LLD](../03-Modules/Warehouse/LLD.md) | [Contracts](../03-Modules/Warehouse/APIs.md) | [DB](../04-Database/Module-Mapping.md#warehouse) | [Tests](../03-Modules/Warehouse/Edge-Cases.md) |
| Pharmacist_Review | 5 | [HLD](../03-Modules/Pharmacist-Review/HLD.md) | [LLD](../03-Modules/Pharmacist-Review/LLD.md) | [Contracts](../03-Modules/Pharmacist-Review/APIs.md) | [DB](../04-Database/Module-Mapping.md#pharmacist-review) | [Tests](../03-Modules/Pharmacist-Review/Edge-Cases.md) |
| Delivery_Operations | 5 | [HLD](../03-Modules/Delivery/HLD.md) | [LLD](../03-Modules/Delivery/LLD.md) | [Contracts](../03-Modules/Delivery/APIs.md) | [DB](../04-Database/Module-Mapping.md#delivery-operations) | [Tests](../03-Modules/Delivery/Edge-Cases.md) |
| Rider_App | 7 | [HLD](../03-Modules/Rider-Operations/HLD.md) | [LLD](../03-Modules/Rider-Operations/LLD.md) | [Contracts](../03-Modules/Rider-Operations/APIs.md) | [DB](../04-Database/Module-Mapping.md#rider-app) | [Tests](../03-Modules/Rider-Operations/Edge-Cases.md) |
| Finance_Payments | 7 | [HLD](../03-Modules/Payments/HLD.md) | [LLD](../03-Modules/Payments/LLD.md) | [Contracts](../03-Modules/Payments/APIs.md) | [DB](../04-Database/Module-Mapping.md#finance-payments) | [Tests](../03-Modules/Payments/Edge-Cases.md) |
| Reporting | 7 | [HLD](../03-Modules/Reporting/HLD.md) | [LLD](../03-Modules/Reporting/LLD.md) | [Contracts](../03-Modules/Reporting/APIs.md) | [DB](../04-Database/Module-Mapping.md#reporting) | [Tests](../03-Modules/Reporting/Edge-Cases.md) |
| Audit | 2 | [HLD](../03-Modules/Audit/HLD.md) | [LLD](../03-Modules/Audit/LLD.md) | [Contracts](../03-Modules/Audit/APIs.md) | [DB](../04-Database/Module-Mapping.md#audit) | [Tests](../03-Modules/Audit/Edge-Cases.md) |
| Authentication_Access | 4 | [HLD](../03-Modules/Authentication/HLD.md) | [LLD](../03-Modules/Authentication/LLD.md) | [Contracts](../03-Modules/Authentication/APIs.md) | [DB](../04-Database/Module-Mapping.md#authentication-access) | [Tests](../03-Modules/Authentication/Edge-Cases.md) |
| Notifications | 5 | [HLD](../03-Modules/Notifications/HLD.md) | [LLD](../03-Modules/Notifications/LLD.md) | [Contracts](../03-Modules/Notifications/APIs.md) | [DB](../04-Database/Module-Mapping.md#notifications) | [Tests](../03-Modules/Notifications/Edge-Cases.md) |

**Phase note:** Warehouse core tasks appear as Must in one inherited v0.1 feature list but as Phase 2/stretch in later secondary narrative. Rider Android phase timing also requires signoff; see open decisions.

## Module design links

- [Admin CMS](../03-Modules/Admin/README.md)
- [Audit](../03-Modules/Audit/README.md)
- [Authentication Access](../03-Modules/Authentication/README.md)
- [Cart Checkout](../03-Modules/Cart-Checkout/README.md)
- [Customer Accounts](../03-Modules/Customer-Accounts/README.md)
- [Customer Orders](../03-Modules/Customer-Orders/README.md)
- [Delivery Operations](../03-Modules/Delivery/README.md)
- [Finance Payments](../03-Modules/Payments/README.md)
- [Inventory](../03-Modules/Inventory/README.md)
- [Notifications](../03-Modules/Notifications/README.md)
- [Order Operations](../03-Modules/Order-Management/README.md)
- [Pharmacist Review](../03-Modules/Pharmacist-Review/README.md)
- [Prescription Upload](../03-Modules/Prescription-Management/README.md)
- [Product Catalog](../03-Modules/Product-Catalog/README.md)
- [Reporting](../03-Modules/Reporting/README.md)
- [Rider App](../03-Modules/Rider-Operations/README.md)
- [Store Operations](../03-Modules/Store-Operations/README.md)
- [Warehouse](../03-Modules/Warehouse/README.md)
