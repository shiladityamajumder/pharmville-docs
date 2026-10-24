# Capability scope and product decisions

**Phase labels are architecture/product planning recommendations, not new business approvals.** Existing approved decisions and all 110 inherited feature IDs remain intact. No competitor capability is added solely because another platform offers it. Requirements retain their existing draft priority and require the named owner signoffs.

| Capability | Planning phase | Evidence / boundary | Decision gates | Accountable domain |
| --- | --- | --- | --- | --- |
| Authentication, accounts, patient/address/consent | MVP | Inherited ACC/AUTH requirements; role, proof, retention policies open | D-003/D-013/D-023 | Authentication / Customer Accounts |
| Catalog/search/category/product detail and P/M/O | MVP | Inherited CAT and checkout features; import contract incomplete | D-019/D-024 | Product Catalog |
| Cart/quote/checkout and order history/cancellation | MVP | Inherited CHK/ORD/OPS; accepted revisions and one-site guard | D-004/D-010 | Checkout / Order Management |
| Prescription upload and exact P-line pharmacist review | MVP | Inherited RX/PHR, conditional on P; M/O-only skip | D-004/D-006/D-013 | Prescription Management / Pharmacist Review |
| Lot/expiry/ledger/holds and approved stock correction | MVP | Inherited INV and SQL reservation invariants | D-005/D-009 | Inventory |
| Store picking/packing and custody handoff | MVP | Inherited STO; exact license/clinical/stock/payment guards | D-002/D-006/D-009 | Store Operations |
| Warehouse receiving/transfer and Noida fallback extent | Requires Decision | Inherited WH operational need; launch depth unresolved | D-002/D-010 | Warehouse / Operations |
| Online payments, COD, refunds, invoices, reconciliation | MVP | Inherited FIN/CHK/ORD; 4 payment contracts remain incomplete | D-004/D-007/D-008/D-012/D-016 | Payments / Finance |
| Delivery assignment and mandatory OTP plus photo POD | MVP | Inherited DLV/RID; failed-attempt action mapping incomplete | D-010/D-011/D-021 | Delivery / Rider Operations |
| Transactional notifications and delivery retries | MVP | Inherited NTF; provider and consent contracts need approval | D-013/D-014/D-016 | Notifications |
| Admin/CMS, role controls, reports, audit, Excel export | MVP | Inherited ADM/REP/AUD; masters/permissions unapproved | D-003/D-012/D-013/D-024 | Admin / Reporting / Audit |
| Customer support triage/ticket ownership | Requires Decision | WF-013 plus support schema; no approved additional support API inventory | D-020/D-027 | Support lead / Product |
| Rider Android implementation and release ownership | Requires Decision | Inherited rider app; framework/store ownership not approved | D-021 | Product / Engineering |
| Opening stock/catalog bulk import and POS adapter | Requires Decision | Existing INV/CAT features; precise formats/recovery absent | D-005/D-019/D-024 | Inventory / Catalog / POS owner |
| Advanced procurement automation and replenishment | Phase 2 | Proposed depth beyond minimal received/transfer workflows; retain existing tables | D-002/D-027 | Warehouse / Procurement lead |
| Diagnostics bookings/reports and appointments/teleconsultation | Future | Existing DB domains; no launch feature/API approval inferred | D-001/D-018/D-027 | Product / Clinical and Diagnostics leads |
| Membership, insurance and marketplace expansion | Future | Existing schema only; commercial/provider models unapproved | D-018/D-027 | Product / Finance / partner-domain owners |
| Split shipments, automatic substitution or new clinical rules | Requires Decision | No scope expansion authorized; current single-site/no-silent-change rules retained | D-006/D-010 | Product / Pharmacy / Operations |

## Preserved product rules

- **P:** prescription-required, with exact patient/evidence/revision-bound pharmacist review. **M:** medicine without mandatory review. **O:** other products without mandatory review. M/O-only orders skip that review unless an independently documented rule applies; unknown classification blocks progression.
- Revised products, quantities, price or substitution require explicit customer acceptance. No silent substitution, P-line removal, split fulfillment or invented clinical validation rule.
- One eligible site serves an order; stock/lot, active location-specific licensing, clinical approval, authoritative payment or approved COD, preparation and custody are independent progression gates.
- RID-04 retains mandatory OTP **and photo** proof. REP-07 exports Excel `.xlsx`. Owned invoice responses retain the PDF representation as well as JSON.

## Missing journeys and proposals

The existing [16 candidate command groups](../05-APIs/Journey-API-Gaps.md) cover missing user-journey support without inflating the preserved 107 operations. They remain Proposed / Unapproved / outside the denominator. Account proof, imports, POS reconciliation, payment/provider wire contracts, staff MFA and delivery failure progression remain named contract gaps rather than generic completion claims.

[Decision register](../09-References/Sources-and-Decisions.md) remains authoritative. [Module boundaries](../02-Architecture/Module-Boundaries.md) explain domain ownership; physical future tables are retained without speculative schemas, sample data, APIs or regulatory approvals.
