# Product requirements and scope

## Product vision and business problem

Pharmville is a location-aware healthcare-commerce experience for customers who need prescription medicines (P), other medicines (M) and non-medicine products (O). A customer should be able to browse one catalogue, see location-dependent availability, order one combined basket and follow one understandable journey, without unnecessary pharmacist review for M/O items.

For the operations team, the system replaces fragmented phone-order routing and manual stock coordination with order queues, pharmacy review, store/warehouse handling, rider dispatch, financial reconciliation and audit evidence. The September client checklist records one Noida warehouse, 33 stores and own delivery riders as the launch operating model; this supersedes earlier estimates of 3–4 warehouses and 40 stores.

The most valuable promises are safety and correctness: review only P lines, bind decisions to exact item/patient/Rx version, require customer consent for changed baskets, confirm payment rather than trust redirects, ensure licensed and fresh-stock site eligibility, prevent selling the last unit twice, and keep refunds/COD auditable.

**Confirmed intent, not approval of every rule:** Detailed product journeys and draft Phase 1 features are available. Business thresholds, integration access and legal pharmacy requirements remain open. See Scope, Platform inventory and Decisions.

## Scope by phase and evidence level

| Phase | Included or considered | Important status |
| --- | --- | --- |
| Phase 1 — core commerce | Customer web, protected staff/admin web, catalogue, auth, family/patient, P/M/O clinical gate, cart/order/payment, inventory, store, delivery/rider, notification, finance, report, audit | Planned in v0.1 + newer journeys, not full signed business rulebook |
| Phase 1 boundary dispute | Basic warehouse receiving, replenishment, fallback online dispatch; rider Android | Phase 1 draft Must vs other checklist/proposal language conflict; D-002/D-021 |
| Phase 2 — operations | Native customer apps, advanced warehouse, B2B, ERP/procurement depth, CRM, loyalty, promotions | Proposed roadmap, not current launch commitment |
| Phase 3 — healthcare | Doctor/teleconsultation, laboratory, advanced pharmacy | Doctor Phase 1 change request undecided |
| Phase 4 — scale | Seller marketplace, more sophisticated analytics, AI/personalization and enterprise operation | Vision, not design-ready |

**Release principle:** only approved policies and verified integrations may be enabled. The presence of future tables in a 24-schema database does not bring those features into Phase 1. The existing product rule for P/M/O and licensed fulfillment is technically enforced in isolated database tests, but production medical/legal policy requires review.

See Conflicts_and_Gaps, Release_Plan.

## Business objectives

**Inherited product goals (Inferred):** customers should discover suitable health-commerce products, clearly know whether a prescription is required, pay only after valid accepted terms, receive traceable fulfillment, and get fair cancellations/refunds. Store and pharmacy staff need a controlled queue; finance needs one source of money truth; owners need visibility and evidence.

**Do not turn these into invented KPIs:** success metrics such as completed checkout rate, denied unsafe P-item checkouts, missing-stock rate, on-time delivery, duplicate-money rate and order exception aging are *proposed* metrics. Numeric targets require real operational baselines.

**Critical quality property:** an unsafe order blocked with a clear explanation is preferable to an incorrect success status. Internal consistency and patient privacy outweigh uncontrolled conversions.

Analytics metrics

## P/M/O medicine eligibility contract

**Confirmed database-backed invariant; business/legal limits pending.** The commerce class is a controlled, approved product fact: P requires exact per-line pharmacist review; M and O do not pass through that review branch. Unknown/unapproved classifications block checkout.

A separate descriptive `product_type` field must not be mistaken for the controlled P/M/O commerce class.

One mixed basket has up to seven nonempty P/M/O combinations. If P is present, a patient and appropriate prescription evidence are required; each P line receives an individual decision. If any P is rejected or corrected, the customer must explicitly choose an accepted revised basket, provide new evidence or cancel.

Unaffected eligible M/O lines remain unchanged; no silent substitution or charging takes place.

Before picking, packing and dispatch, services must recheck current accepted revision, patient, Rx/version, exact SKU/strength/form/quantity, location license and stock evidence. A previously approved line is no longer approved automatically after any change affecting clinical evidence.

Clinical or financial events are not deleted to conceal a reversal; use immutable history and compensating records.

The pharmacist and legal team must validate Schedule classification, prescription eligibility and storage/retention before production. See Pharmacy LLD and Database Quality.

## Payment, stock and licensed-fulfillment gates

**Source:** unified order journey and the database guard evidence. A web callback or return URL alone does not establish money truth. Signed gateway events, provider reconciliation and durable ledger rows determine online payment status. COD is a future receivable, not cash already collected; its permitted amount, products and eligibility are owner policies.

Reservation needs authoritative location-specific stock observation, approved freshness policy, eligible batch and an authorized location. Missing/stale POS updates cause a safe block; a generic current stock number does not prove that a specific lot can be packed.

One-site per-order is the proposed launch rule. Competing orders for the last safe unit must serialize, reserving at most one.

Pick/pack requires active location-specific license and pharmacist evidence for each P line. Dispatch requires exact committed stock, fulfilment completion evidence and full authoritative payment or approved COD. Order state is composed from distinct clinical, finance, inventory and delivery states; no module may set all statuses by itself.

When funds arrive but stock later fails, inform the customer, obtain any revised consent and reconcile/compensate without duplicate charge or refund. Thresholds and production POS/license catalogs remain open in Decision Register.

## One-site order routing

**Proposed and database-guarded direction:** Assign one approved fulfillment location to each accepted order unless a separately approved future design supports split shipments. Stores are primary; the Noida warehouse is a fallback under the client operating model, subject to exact license, stock, opening hours, routing and business policy.

Recommended selection pipeline: read delivery address and serviceable zone; enumerate authorized eligible sites; revalidate open/close policy; check approved location-specific license, authoritative inventory freshness and exact eligible lots for all accepted items; score available sites by an owner-approved rule; atomically reserve one site and record the assignment. A distance estimate alone must never overrule medical or stock eligibility.

Reassignment requires a reason, a safe release of old reservations and an atomic re-hold at the new site. Two concurrent allocators must not assign different sites for the same order. If no site can fulfill the whole basket, stop and present an approved customer intervention; do not silently split or substitute medicines. See Order Ops and D-010 in Decisions.

## Draft functional requirement source

The inherited feature catalog contains 110 stable feature IDs, with priorities labelled Must/Should/Could in a v0.1 list (92/14/4). The original v0.1 DOCX was not part of the current documentation checkout, so those priorities remain unapproved draft evidence.

Do not silently promote Should/Could functionality to the initial release. The proposed 18 groupings are documented in Module Inventory. Each feature has stable `REQ-###` traceability, a `TEST-<source-ID>-##` proposed case set and a `TASK-###` development slice.

**Critical still-open feature policies:** warehouse Phase 1 vs Phase 2 stretch, rider Android phase, Cashfree capture sequence, stock authority/freshness, licensure/clinical signoff, COD cap and refunds. Review Open Questions before accepting implementation tickets.

## Non-functional requirements

A non-functional requirement describes the quality of a service rather than which button it implements. Source HLDs suggest 99.9% web availability and indicative p95 latency goals; they are **Proposed review targets**, not proven SLA or signed commitments.

- **Correctness:** no double sell, no double charge/refund, no nonapproved P dispatch; unsafe unknown inputs fail closed.
- **Privacy:** no cross-patient documents or unscoped staff exports; all privileged views auditable.
- **Reliability:** safe retry/outbox, provider reconciliation, persistent job delivery logs, controlled rollback and restore rehearsals.
- **Availability:** publish metrics by API and user journey, excluding upstream-provider impact only when reporting explicitly describes the distinction.
- **Performance:** measure checkout/routing/clinical queue p95 latency with representative sizes, PG15/18 query plans and queue lag; do not assume synthetic benchmark equals production throughput.
- **Accessibility:** readable responsive forms, keyboard focus, clear patient/Rx selection and plain-language error/status messages.
- **Recoverability:** backups, point-in-time recovery targets and operational runbooks must be tested in a production-like environment.

Actual load assumptions, user volumes, rate limits, SLOs and accessibility conformance must be approved and recorded before acceptance. See Scalability and Performance Testing.

## Non-functional requirements — proposed acceptance gates

**Security:** reject cross-customer, cross-patient, cross-rider, and cross-location access. Sensitive files must be private, malware screened and accessed only through short-lived grants with rechecked authorization.

**Consistency:** no duplicate charged orders, no accepted stock allocation beyond eligible quantity, no wrong-scope clinical signoff, and no skipped audit outcome. Test concurrent last-unit checkout and webhook replay using the actual target DB version.

**Reliability:** provider timeouts preserve pending statuses; permanent failures produce visible operator queues. Outbox/backfill processes must be replay-safe. Test restoration of money and medical evidence, not only server startup.

**Observability:** correlate API, SQL, provider callbacks, reconciliation and audit with redacted IDs. Set numeric latency and availability targets only after baseline measurements and stakeholder approval.

**Accessibility and UX:** document keyboard use, error messaging, mobile-friendly form validation and screen-reader states in the future design handoff; visual artwork is out of scope.

**Compliance:** no fixed retention duration or regulatory certification is asserted. Specialist legal/healthcare review required.
