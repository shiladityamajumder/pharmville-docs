# Prototype implementation contract

Internal contributor guidance for the local-only prototype. Product policies remain proposals; use synthetic data only.

## Screens and handlers

Each domain exports `screens` (an array) and `handle(action, data, ctx)` from its `screens.js` module. A screen has `id`, `route` (e.g. `customer/login`), `title`, `platform` (`customer`, `staff`, `rider`), `workspace` (e.g. `pharmacy`), `module` (existing module name), `features` (array), `description`, `scenarios` (array of stable scenario keys), and `render(ctx)` returning HTML.

Screen IDs use SCR-CUS/ADM/OMS/PHM/STO/WH/DLV/RID/FIN/REP/AUD-001 style. Domain renderers may import `../shared/ui.js`.

Use `data-action="customer.request-otp"` buttons or `data-form="customer.save-profile"` forms. Namespaced handlers return true when handled, false otherwise. `data` contains form fields and the clicked element’s dataset (strings); checkbox values are boolean. Context provides `state`, `screen`, `scenario` (key, default normal), `go(route)`, `save(message, kind='success')`, `notice(message, kind='info')`, `confirm(title, message, callback)`, `hasScenario(key)`, `record(message)`, `download(name,text,type)`.

Handlers mutate shared state and call save (persist/render), or go (render target). All interpolation of user values uses `h()`.

## Shared UI exports

`h(value)` escapes HTML; `link(label,route,cls='button')`; `button(label,action,extra='')` where extra is literal attributes; `field(label,name,value='',type='text',extra='')`; `select(label,name,options,value='')` where options are `[value,label]`; `form(action,body,submit='Save')`; `table(headers,rows)` where cells may contain escaped HTML; `badge(value)`; `panel(title,body)`; `notice(message,kind='info')`; `money(number)`; `timeline(items)`; `empty(title,body,actionHTML='')`. `field` does not automatically require a value; set `required` in extra. `form` has novalidate; use explicit handler validation and ctx.notice for understandable errors. No invisible placeholder controls.

## Shared state

`customer`: loggedIn, otpRequested, profileComplete, name, email, phone, consent, addresses [{id,label,line,pin,serviceable}], family [{id,name,relation}], wishlist [productId], deletion, contactPending.

`products`: [{id,name,class,category,composition,strength,form,pack,price,stock,image,approved}]. IDs PRD-1 (O), PRD-2 (M), PRD-3 (P), PRD-4 (P), PRD-5 (M/out of stock), PRD-6 (Unknown/unapproved).

`cart`: [{productId,qty}]. `order`: id PV-DEMO-001, items [{productId,qty}], addressId, patientId, status, review, payment, method (online/cod), stock, site, revision, total, history [strings], pack, delivery, riderId, codCollected, refund, returnStatus, note, hold, customerAccepted.

Use string values Pending/Approved/Rejected/Partial for review; Not started/Pending/Paid/Failed for payment; Not held/Active/Committed/Released for stock/hold; Not started/Accepted/Picking/Picked/Packed/Handed over for pack; Unassigned/Assigned/Accepted/Picked up/Out for delivery/Delivered/Failed/Return to store for delivery; Not requested/Requested/Approved/Pending/Completed for refund.

`rx`: uploaded, patientId, status, fileName (metadata only; never read a real file). `riders`: [{id,name,status,site}]. `inventory`: [{id,productId,site,batch,qty,expiry,eligible}]. `warehouse`: receiptStatus, receivedQty, transferStatus, requestedQty, dispatchedQty, receivedTransferQty, shortage, audit. `staff`: [{id,name,role,site,active}]. `settings`: {minimum,deliveryFee,offer,version} (illustrative values only). `cms`: title,body,status,version. `finance`: deposit,settlement,reconciliation,creditNote. `notification`: status,attempts,channel. `reports`: type,status,filter,exportStatus. `audit`: [{time,action,role}]. `duty`, `role`, `location`, `demoOtp` ('246810'), `demoDeliveryOtp` ('135790'), `search`, `category`.

No one domain owns the shared shell. Root implements UI helpers, state, app/router, explorer, scenarios and documentation generation/tests. Customer agent owns customer/screens.js. Operations agent owns operations/screens.js (pharmacy/store/warehouse/delivery/rider).

Staff agent owns staff/screens.js (admin/order operations/inventory/finance/reporting/audit/notification/support). Avoid modifying other agents’ files.
