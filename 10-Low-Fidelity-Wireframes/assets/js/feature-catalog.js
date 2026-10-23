// Generated from the authoritative documentation inventory.
export const featureCatalog=[
  {
    "id": "ACC-01",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Sign up and log in with mobile OTP (WhatsApp first, SMS fallback)"
  },
  {
    "id": "ACC-02",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Profile: name, email, phone"
  },
  {
    "id": "ACC-03",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Saved addresses with map pin; serviceability checked when the address is entered"
  },
  {
    "id": "ACC-04",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Family profiles for dependents (name, age, relation)"
  },
  {
    "id": "ACC-05",
    "module": "Customer_Accounts",
    "priority": "Must (draft)",
    "description": "Privacy notice and consent at signup"
  },
  {
    "id": "ACC-06",
    "module": "Customer_Accounts",
    "priority": "Should (draft)",
    "description": "Account deletion request"
  },
  {
    "id": "ACC-07",
    "module": "Customer_Accounts",
    "priority": "Should (draft)",
    "description": "Wishlist"
  },
  {
    "id": "CAT-01",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Browse by category and sub-category"
  },
  {
    "id": "CAT-02",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Product page: brand, manufacturer, composition, pack size, MRP, price, images, \"Prescription required\" label"
  },
  {
    "id": "CAT-03",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Search by name, brand and composition, with typo tolerance and autosuggest"
  },
  {
    "id": "CAT-04",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Availability for the customer's pin code (in stock / out of stock)"
  },
  {
    "id": "CAT-05",
    "module": "Product_Catalog",
    "priority": "Should (draft)",
    "description": "Alternative medicines: same composition, strength and dosage form, ranked by a configurable rule"
  },
  {
    "id": "CAT-06",
    "module": "Product_Catalog",
    "priority": "Must (draft)",
    "description": "Placeholder image when a product has none"
  },
  {
    "id": "CHK-01",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Cart saved across devices for logged-in customers"
  },
  {
    "id": "CHK-02",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Checkout: address, patient (self or family), payment method, delivery fee and estimated time shown before paying"
  },
  {
    "id": "CHK-03",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Online payment via Cashfree: UPI, cards, net banking"
  },
  {
    "id": "CHK-04",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Cash on delivery, with a maximum order value and a block after repeated refusals"
  },
  {
    "id": "CHK-05",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Minimum order value and delivery fee applied from settings"
  },
  {
    "id": "CHK-06",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Price or stock change detected before payment; customer confirms"
  },
  {
    "id": "CHK-07",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "No duplicate orders or charges (double tap, refresh, closed browser after payment)"
  },
  {
    "id": "CHK-08",
    "module": "Cart_Checkout",
    "priority": "Must (draft)",
    "description": "Stock reserved during checkout, released automatically if payment does not finish"
  },
  {
    "id": "RX-01",
    "module": "Prescription_Upload",
    "priority": "Must (draft)",
    "description": "Upload one or more prescriptions (JPG, PNG, PDF) at checkout"
  },
  {
    "id": "RX-02",
    "module": "Prescription_Upload",
    "priority": "Should (draft)",
    "description": "Upload within 24 hours after ordering; auto-cancel after that"
  },
  {
    "id": "RX-03",
    "module": "Prescription_Upload",
    "priority": "Should (draft)",
    "description": "Reuse a saved, still-valid prescription"
  },
  {
    "id": "RX-04",
    "module": "Prescription_Upload",
    "priority": "Must (draft)",
    "description": "Link each prescription to the patient (self or family member)"
  },
  {
    "id": "RX-05",
    "module": "Prescription_Upload",
    "priority": "Must (draft)",
    "description": "See the pharmacist's decision and reason; re-upload after rejection"
  },
  {
    "id": "ORD-01",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Order confirmation on screen, WhatsApp and email"
  },
  {
    "id": "ORD-02",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Status timeline (placed → packed → out for delivery → delivered)"
  },
  {
    "id": "ORD-03",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Order history with GST invoice download"
  },
  {
    "id": "ORD-04",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Cancel before the order is packed"
  },
  {
    "id": "ORD-05",
    "module": "Customer_Orders",
    "priority": "Should (draft)",
    "description": "Return request within the return window"
  },
  {
    "id": "ORD-06",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Refund status for cancelled and returned orders"
  },
  {
    "id": "ORD-07",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Live rider location on a map, estimated arrival, masked call button"
  },
  {
    "id": "ORD-08",
    "module": "Customer_Orders",
    "priority": "Must (draft)",
    "description": "Delivery OTP shown to the customer"
  },
  {
    "id": "ORD-09",
    "module": "Customer_Orders",
    "priority": "Could (draft)",
    "description": "Change items or address after placing an order"
  },
  {
    "id": "ADM-01",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Dashboard per role: orders by status, pending prescriptions, alerts, deliveries in progress"
  },
  {
    "id": "ADM-02",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Staff users: invite, assign role and location, deactivate, log out sessions"
  },
  {
    "id": "ADM-03",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Roles and permissions for 16 roles, limited to own store or warehouse"
  },
  {
    "id": "ADM-04",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "CMS: home banners, FAQs, policy pages, with draft and publish"
  },
  {
    "id": "ADM-05",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "System settings (PRD section 8)"
  },
  {
    "id": "ADM-06",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Catalogue admin: products, categories, brands, salt master, prices, GST and HSN"
  },
  {
    "id": "ADM-07",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Bulk product import from Excel, with error report"
  },
  {
    "id": "ADM-08",
    "module": "Admin_CMS",
    "priority": "Must (draft)",
    "description": "Store and warehouse master: address, hours, GSTIN, service areas"
  },
  {
    "id": "ADM-09",
    "module": "Admin_CMS",
    "priority": "Should (draft)",
    "description": "Offer settings: start and end dates, maximum discount, first-order offer"
  },
  {
    "id": "OMS-01",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Order list with filters (status, location, date, payment, Rx) and search by order number or phone"
  },
  {
    "id": "OMS-02",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Order detail: items, batches, prescription, payment, delivery, full history"
  },
  {
    "id": "OMS-03",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Automatic routing to the nearest open store with every item; warehouse as fallback"
  },
  {
    "id": "OMS-04",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Reassign an order to another location, with a reason"
  },
  {
    "id": "OMS-05",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Cancel, partly fulfil, raise return, add internal note"
  },
  {
    "id": "OMS-06",
    "module": "Order_Operations",
    "priority": "Must (draft)",
    "description": "Attention queue: payment pending, stuck orders, failed deliveries"
  },
  {
    "id": "OMS-07",
    "module": "Order_Operations",
    "priority": "Could (draft)",
    "description": "Assisted order entry for phone orders"
  },
  {
    "id": "STO-01",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Incoming order queue for my store, with sound alert"
  },
  {
    "id": "STO-02",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Accept order, pick list, mark packed, hand over to rider"
  },
  {
    "id": "STO-03",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Raise replenishment request (normal or urgent)"
  },
  {
    "id": "STO-04",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "Confirm receipt of a transfer; record shortages"
  },
  {
    "id": "STO-05",
    "module": "Store_Operations",
    "priority": "Must (draft)",
    "description": "My store's stock, with low-stock and near-expiry alerts"
  },
  {
    "id": "INV-01",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock per location and batch, with manufacturing and expiry dates"
  },
  {
    "id": "INV-02",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock ledger: every movement recorded; stock is the sum of the ledger"
  },
  {
    "id": "INV-03",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Allocate nearest-expiry batch first; block batches below minimum shelf life"
  },
  {
    "id": "INV-04",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock adjustments with reason; manager approval above a threshold"
  },
  {
    "id": "INV-05",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Low-stock and near-expiry alerts"
  },
  {
    "id": "INV-06",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Opening stock import per location"
  },
  {
    "id": "INV-07",
    "module": "Inventory",
    "priority": "Must (draft)",
    "description": "Stock sync with Techsmith"
  },
  {
    "id": "WH-01",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Receive stock: batch, manufacturing and expiry dates, quantity, supplier invoice"
  },
  {
    "id": "WH-02",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Replenishment queue: approve, dispatch with note, stock \"in transit\""
  },
  {
    "id": "WH-03",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Urgent runs, up to two extra a day"
  },
  {
    "id": "WH-04",
    "module": "Warehouse",
    "priority": "Must (draft)",
    "description": "Pick, pack and dispatch fallback online orders"
  },
  {
    "id": "WH-05",
    "module": "Warehouse",
    "priority": "Could (draft)",
    "description": "Basic stock audit"
  },
  {
    "id": "PHM-01",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Review queue, oldest first, with waiting time"
  },
  {
    "id": "PHM-02",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Side-by-side view: zoomable prescription and order items"
  },
  {
    "id": "PHM-03",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Approve all, approve some, or reject with a reason"
  },
  {
    "id": "PHM-04",
    "module": "Pharmacist_Review",
    "priority": "Should (draft)",
    "description": "Confirm a chosen alternative matches the prescription"
  },
  {
    "id": "PHM-05",
    "module": "Pharmacist_Review",
    "priority": "Must (draft)",
    "description": "Pharmacist name, registration number and time on every decision"
  },
  {
    "id": "DLV-01",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Live map of riders (available, on delivery, offline) and orders ready for pickup"
  },
  {
    "id": "DLV-02",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Suggest the nearest available rider; staff confirm or choose another"
  },
  {
    "id": "DLV-03",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Failed-delivery queue: reattempt, reschedule or return to store"
  },
  {
    "id": "DLV-04",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "COD handover: cash collected vs deposited per rider per day"
  },
  {
    "id": "DLV-05",
    "module": "Delivery_Operations",
    "priority": "Must (draft)",
    "description": "Rider management: onboard, assign location, shifts"
  },
  {
    "id": "RID-01",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "OTP login; on duty, off duty and break"
  },
  {
    "id": "RID-02",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Task list; accept; open Google Maps to navigate; mark picked up"
  },
  {
    "id": "RID-03",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Background location: every 5–10 s on delivery, 15–30 s idle"
  },
  {
    "id": "RID-04",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Complete delivery with customer OTP and photo; record COD collected"
  },
  {
    "id": "RID-05",
    "module": "Rider_App",
    "priority": "Should (draft)",
    "description": "Door checks for prescription medicines"
  },
  {
    "id": "RID-06",
    "module": "Rider_App",
    "priority": "Must (draft)",
    "description": "Failed attempt with a reason from a fixed list"
  },
  {
    "id": "RID-07",
    "module": "Rider_App",
    "priority": "Should (draft)",
    "description": "Daily deliveries and incentive earned"
  },
  {
    "id": "FIN-01",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "Payment records from Cashfree webhooks and COD collections"
  },
  {
    "id": "FIN-02",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "GST invoice per order, from the right GSTIN"
  },
  {
    "id": "FIN-03",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "Automatic refunds; manual refunds need approval above a set amount"
  },
  {
    "id": "FIN-04",
    "module": "Finance_Payments",
    "priority": "Should (draft)",
    "description": "COD refunds by bank transfer or UPI"
  },
  {
    "id": "FIN-05",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "Daily reconciliation: Cashfree settlements vs orders"
  },
  {
    "id": "FIN-06",
    "module": "Finance_Payments",
    "priority": "Must (draft)",
    "description": "COD reconciliation: collected vs deposited"
  },
  {
    "id": "FIN-07",
    "module": "Finance_Payments",
    "priority": "Should (draft)",
    "description": "Credit notes for refunds and returns"
  },
  {
    "id": "REP-01",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "Sales and orders, by date, store and product"
  },
  {
    "id": "REP-02",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "GST report for filing"
  },
  {
    "id": "REP-03",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "Stock, low stock and near-expiry"
  },
  {
    "id": "REP-04",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "COD, rider collections and deliveries per rider"
  },
  {
    "id": "REP-05",
    "module": "Reporting",
    "priority": "Should (draft)",
    "description": "Refunds, cancellations and failed deliveries"
  },
  {
    "id": "REP-06",
    "module": "Reporting",
    "priority": "Should (draft)",
    "description": "Replenishment transfers"
  },
  {
    "id": "REP-07",
    "module": "Reporting",
    "priority": "Must (draft)",
    "description": "Excel export for every report"
  },
  {
    "id": "AUD-01",
    "module": "Audit",
    "priority": "Must (draft)",
    "description": "Log logins, changes, stock movements and prescription views"
  },
  {
    "id": "AUD-02",
    "module": "Audit",
    "priority": "Must (draft)",
    "description": "Search and export the audit log; read-only for everyone"
  },
  {
    "id": "AUTH-01",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "Password + authenticator 2FA for Super Admin, Central Admin, Finance Manager"
  },
  {
    "id": "AUTH-02",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "Lockout rules, session limits, one session per staff account"
  },
  {
    "id": "AUTH-03",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "OTP rate limits per number and IP"
  },
  {
    "id": "AUTH-04",
    "module": "Authentication_Access",
    "priority": "Must (draft)",
    "description": "Permissions checked on the server for every request"
  },
  {
    "id": "NOT-01",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "One notification service: templates, WhatsApp first, SMS fallback, email"
  },
  {
    "id": "NOT-02",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "Delivery log with retries"
  },
  {
    "id": "NOT-03",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "Rider push notifications (FCM)"
  },
  {
    "id": "NOT-04",
    "module": "Notifications",
    "priority": "Must (draft)",
    "description": "Staff alerts in the admin panel"
  },
  {
    "id": "NOT-05",
    "module": "Notifications",
    "priority": "Could (draft)",
    "description": "Customer browser push notifications"
  }
];
