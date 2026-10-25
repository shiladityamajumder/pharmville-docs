# Prototype completion ledger

**Scope:** reviewable local UX prototype only. This ledger distinguishes visible and exercised interactions from approved product rules and production implementation. The authoritative source still contains 110 draft feature IDs across 18 module groups and 14 technical workflows; the prototype's 13 guided journeys are a separate UX aid, not a replacement workflow inventory.

## Coverage baseline

| Measure | Current state | Evidence and boundary |
|---|---:|---|
| Registered prototype screens | 91 | Unique route/screen registry; +8 from the prior 83-screen baseline. |
| Existing draft feature IDs mapped | 110 / 110 | Static validation checks every source ID has at least one screen/state mapping. Mapping does not mean the feature is fully interactive. |
| Existing module groups represented | 18 / 18 | The same source module groupings are retained in screen metadata. See [Feature Coverage](Feature-Coverage.md) for per-ID evidence. |
| Scenario definitions | 35 | A scenario's rendered label/state is not by itself a tested interaction. |
| Screen/scenario render associations | 779 | Full browser smoke visits across six viewport widths; no claim that all 779 associations have direct business-action assertions. |
| Guided prototype journeys | 13 | Customer onboarding/order/Rx/payment, store preparation, delivery, return, refund, warehouse receipt, procurement, stockout recovery, reverse logistics and support. |
| Interactive action/form names | 111 | Static registry-to-handler check; action names are not API contracts. |

Feature classifications are retained from the existing coverage inventory: **70 screen-level**, **23 interaction/state**, **16 blocked by owner decisions**, and **1 backend-only**. See [Feature Coverage](Feature-Coverage.md), [UX State Coverage](UX-State-Coverage.md), and [Platform Coverage](Platform-and-Screen-Coverage.md) for the feature- and platform-level evidence. This deliberately does not collapse the classifications into a misleading “percent complete.”

## Module-to-prototype traceability

The 18 existing module groups remain unchanged. Counts below are screen registry entries, not estimates of requirements completion. Shared tasks and proposed extensions map back to the existing module IDs where no approved module boundary exists.

| Existing module group | Screens | Primary prototype routes |
|---|---:|---|
| Customer_Accounts | 8 | `customer/login`, `customer/profile`, `customer/addresses`, `customer/family`, `customer/privacy`, `customer/deletion`, `customer/help` |
| Product_Catalog | 5 | `customer/home`, `customer/categories`, `customer/search`, `customer/product`, `customer/alternatives` |
| Cart_Checkout | 7 | `customer/cart`, `customer/checkout-address`, `customer/checkout-patient`, `customer/checkout-summary`, `customer/payment`, recovery and result |
| Prescription_Upload | 3 | Customer prescription upload, status and revision |
| Customer_Orders | 9 | Order history/detail, cancellation, tracking, invoice, returns and refund status |
| Admin_CMS | 7 | Admin dashboard, staff, permissions, catalog, locations, content and settings |
| Order_Operations | 4 | Order queues/details, allocation, return eligibility and operational support |
| Store_Operations | 5 | Store queue, pick, pack, replenishment and transfer receipt |
| Inventory | 4 | Inventory overview, ledger, adjustment and source-import proposal |
| Warehouse | 7 | Receiving, replenishment, dispatch, audit/count and return quarantine |
| Pharmacist_Review | 4 | Review queue, evidence, line decision and history |
| Delivery_Operations | 5 | Dispatch, assignment, failed delivery, rider management and reverse pickup |
| Rider_App | 8 | Rider sign-in/tasks, pickup, navigation, completion, failure/history and reverse pickup |
| Finance_Payments | 5 | Payments, invoice, refund, reconciliation and credit-note proposal |
| Reporting | 2 | Report selection/results/export |
| Audit | 1 | Audit search/export |
| Notifications | 3 | Event attempts, preferences and staff alerts |
| Authentication_Access | 4 | Shared staff sign-in/MFA, identity session and authorized workspace selector |

The full feature-ID-to-screen mapping remains in [Feature Coverage](Feature-Coverage.md); the screen registry and generated [Complete Screen Matrix](Complete-Screen-Matrix.md) remain the operational indexes.

## Newly connected prototype journeys

| Flow | Connected state changes | Status and limits |
|---|---|---|
| Unified identity and workspace selection | Staff password/MFA and customer/rider OTP adapters create one synthetic session; role grants determine available demo workspaces; selected elevated workspaces require a local second-factor step-up; logout revokes the local session. | Demonstration of proposed architecture only. No real passwords, tokens, backend session, database, role approval or distributed revocation. See [Role-Workspace Matrix](Role-Workspace-Matrix.md). |
| Stockout to store availability | Store replenishment request → synthetic supplier/PO draft → local PO approval → linked warehouse receipt → transfer in transit → actual store receipt → indicative catalog availability. | Exercised through forms in the extended browser regression (11 assertions total across the three new workflows). Procurement workspace, PO lifecycle and supplier records are proposals. No supplier contact, commercial terms, purchase payment or procurement authority is approved. Warehouse stock alone does not make store stock available. |
| Return through reverse logistics | Delivered item request → owner eligibility outcome with policy reference → dispatcher assignment → current rider custody → warehouse quarantine → separate Finance decision/refund lifecycle. | Exercised through forms in the extended browser regression (11 assertions total across the three new workflows). Return eligibility/inspection policy remains pending. No eligibility criteria are invented, quarantine is not saleable stock, and Finance completion is not inferred from pickup. |
| Customer support case | Customer OTP → order-linked case → support assignment/status/history → shared synthetic notification event → customer-visible update. | Exercised through forms in the extended browser regression (11 assertions total across the three new workflows). Local case lifecycle proposal only; D-020 and customer data projection still need owner approval. No external message is sent. |

Existing product rules remain intact: P products require pharmacist review before payment/fulfillment; M/O-only baskets skip that review unless a separately documented rule applies. The extended journeys do not bypass payment, stock, custody, clinical or authorization gates.

## Product scope and omissions

The existing [Capability Scope](../../01-Project/Capability-Scope.md) remains the source for MVP, Phase 2, Future and decision-dependent classification. This prototype prioritizes the inherited customer commerce, prescription, store/warehouse, inventory, delivery, payment, admin, reporting and audit journeys. The procurement sequence is an illustrative Phase 2 depth proposal; it does not change existing warehouse scope. Diagnostics, appointments/teleconsultation, insurance, membership and marketplace expansion remain Future or Requires Decision because their presence in database tables does not establish product scope. No competitor feature list is treated as an approval source.

## Gaps and pending decisions

- The local data store is browser-only and centered on one active demo order. It does not model a persistent multi-customer order service or production concurrency.
- Authentication, JWT/session-cookie handling, MFA enrollment/recovery, refresh rotation, CSRF defense, rate limiting, lockout, session limits, service identities and real assignment-revocation propagation are not implemented.
- Exact step-up target list, freshness window and reuse rule need Security/IAM approval. The demo's Administration, Pharmacist and Finance prompts are labeled examples, not approved policy.
- Procurement owner, supplier onboarding, PO commercial fields, approval segregation and provider integration need product, finance and engineering decisions.
- Return window/eligibility/inspection, custody evidence, disposition authority and refund policy need the existing business owner approvals; the user must supply an explicit policy reference for the demo eligibility choice.
- Notification transport, customer consent, support data visibility and external service behavior remain simulated.
- Many scenario rows have render evidence only. Full accessibility research, real-device GPS/background behavior, real payment/provider contracts and production API/database tests are out of scope.

No root project requirements, APIs, database schema, application code, or wireframe assets outside this directory were changed by this prototype work. The generated UI uses fictional records and has no real external network dependency.

## Reproduce and verify

Run the commands in [Validation Results](Validation-Results.md). The current run must be treated as valid only when the written artifacts under `artifacts/` report success; historic counts below are not substitutes for execution. None of these prototype tests assert production policy approval or application implementation.

