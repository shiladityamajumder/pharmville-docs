# Pharmville — Client Clarifications & Decision Register

> **Client-facing working draft · Planning / unapproved · Prepared 25 October 2026**  
> **Source:** *Pharmville Phase 1.1 — Open Questions for Client* (24 October 2026). Items **Q-001–Q-058** are faithfully carried over from that document; items **Q-059–Q-094** are **additional questions proposed for confirmation** after review of the current Pharmville planning repository.

## Purpose and decision rules

Use this register to obtain written client decisions **before** updating the PRD, contracts, workflows, APIs, SQL/master data or implementation tasks. A suggested value, proposal or design documented in the repository is **not** the same as a client-approved requirement.

- **Source questions (Q-001–Q-058):** Preserve the original wording, rationale, answer owner and stated priority. Their supplied *Status* fields were blank; **Open — not recorded in source** does not imply that no answer exists elsewhere.
- **Additional proposals (Q-059–Q-094):** New questions informed by repository planning gaps. Their suggested decision owners and priorities must be confirmed with the client.
- **When needed:** `Before kickoff` = blocks the foundation or causes major rework; `During development` = resolve before the affected capability is built; `Before go-live` = resolve and verify before release. `Phase 1.2 planning` = defer until that phase is scoped. `Suggested` means the original Word file did not assign a priority.
- **Decision record:** After each meeting, replace `Open` with the actual **answer/choice, approval state, decision date, accountable approver, and linked evidence**. Record dependencies and update the existing [decision register](../09-References/Sources-and-Decisions.md), [PRD / requirements](../01-Project/Requirements-and-Scope.md) and the impacted module contracts. Do not treat verbal discussion as approval without an agreed confirmation process.
- **Separate requests:** The source says account access, documents and datasets are managed through a separate **Client Data Collection Checklist**; this register focuses on decisions and confirmations, not credential collection.

## Meeting sequence — recommended

| Session | Meeting focus | Questions to prioritize | Participants |
| --- | --- | --- | --- |
| 1 | Scope, governance, licences and launch boundary | Q-001, Q-006, Q-014, Q-015, Q-020, Q-021, Q-027, Q-046, Q-052–Q-054, Q-057, Q-059–Q-061, Q-075 | Owner, Finance, Pharmacist, Legal, Product |
| 2 | Identity, customer accounts and clinical policy | Q-003–Q-004, Q-006, Q-022–Q-024, Q-063–Q-074 | Owner, Security, Pharmacist, Privacy/Legal, Operations |
| 3 | Checkout, payments, Techsmith and stock truth | Q-007–Q-009, Q-014–Q-019, Q-027, Q-032, Q-036–Q-037, Q-075–Q-084 | Owner, Finance, Operations, POS vendor |
| 4 | Stores, riders, refunds, customer support and logistics | Q-010–Q-013, Q-018, Q-033–Q-041, Q-055–Q-056, Q-085–Q-088 | Operations, Store, Riders, Finance, Support |
| 5 | Delivery readiness, vendors, reporting and sign-off | Q-005, Q-025–Q-026, Q-029–Q-031, Q-043–Q-045, Q-058, Q-089–Q-094 | Owner, Security, Engineering, QA, Finance |
| 6 | Phase 1.2 inventory and warehouse workshop | Q-002, Q-047–Q-051 plus remaining Phase 1.2 follow-ups | Owner, Warehouse, Store, Pharmacist, Product |

> [!IMPORTANT]
> **First decision gate:** Obtain explicit client approval on launch scope and responsibilities, staff authentication, licensed dispensing, prescription-before/after-payment order sequencing, Techsmith pricing/stock authority, and order/payment/refund policy. The source document contains conflicting earlier answers and proposed replacements (Q-052–Q-057); these must not be silently treated as agreed.

## Part A — Existing team questions (verbatim; Q-001–Q-058)

The headings follow the source document’s subject areas. Original question IDs are retained for traceability; proposed changes Q-052–Q-058 are placed last to keep IDs in ascending sequence.

### A1. Scope, timeline and roles

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-001 | Phase 1.2 (inventory and warehouse) starts after Phase 1.1, about 4 months in. When should it finish, and will the client extend beyond the 7-month Phase 1 deadline? | Phase 1.2 is a large module; the contract fixes 7 months | Owner | Before kickoff | Open — answer/date not recorded |
| Q-002 | Doctor consultations moved from Phase 3 to Phase 2. Do you accept the timeline and cost impact on Phase 2? | Change to the signed proposal | Owner | During development | Open — answer/date not recorded |
| Q-003 | We propose 9 roles: Customer, Super Admin, Operations Manager, Store Manager, Pharmacist, Finance Manager, Catalog Manager, Customer Support Executive and Delivery Rider. This merges Central Admin with Delivery/Ops Manager, Finance Executive with Finance Manager, and CMS Manager with Catalog Manager, and drops Auditor. Can one person cover each merged role? | Fewer roles to build and manage; merged roles can be split later | Owner | During development | Open — answer/date not recorded |
| Q-004 | Do stores need a Store Staff role in addition to the Store Manager? | Who can accept and pack orders at a store | Owner | During development | Open — answer/date not recorded |
| Q-005 | What targets should we set for the launch metrics: order success rate, average delivery time, prescription review time, store acceptance time and online payment success rate? Uptime is proposed at 99.5% a month. | How launch success is judged | Owner | Before go-live | Open — answer/date not recorded |

### A2. Security

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-006 | You asked for password-only staff login. We recommend OTP login for staff, and password plus authenticator-app 2FA for Super Admin, Operations Manager and Finance Manager. Do you agree? | A single password on owner and finance accounts that can see health data is a real risk | Owner | Before kickoff | Open — answer/date not recorded |

### A3. Orders, stores and delivery

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-007 | Each new order needs a store to accept it in the admin panel. If a store doesn't accept within 10 minutes (proposed), the order passes to the next nearest open store. Do you agree, and what should happen when a store declines? | Without it, an order can sit unattended in a store queue | Owner + Operations | During development | Open — answer/date not recorded |
| Q-008 | When every store is closed, should we accept orders and queue them for opening, or block checkout? What are the pharmacist's working hours? | Night orders and prescription review time | Owner | During development | Open — answer/date not recorded |
| Q-009 | What delivery time do we promise at checkout? When a store has to get an item from the warehouse first, what do we show, and how is the customer told about the delay? | The delivery fee shown is exact; the delivery time may not be | Owner + Operations | During development | Open — answer/date not recorded |
| Q-010 | Does each rider work from one store, or are riders shared across nearby stores? | Rider assignment and delivery planning | Operations | During development | Open — answer/date not recorded |
| Q-011 | Should the rider check anything at the door for prescription medicines, such as the patient's name or the original prescription? | The rider app flow before the delivery OTP | Pharmacist + Operations | During development | Open — answer/date not recorded |
| Q-012 | COD cash handover: which store does the rider hand cash to, how often, and who verifies it? Who reconciles COD with Finance, how often, and how are shortages handled? | The COD handover and reconciliation screens | Operations + Finance | During development | Open — answer/date not recorded |
| Q-013 | Customer support: tickets inside our admin panel, or an existing tool (Zoho Desk, Freshdesk)? What is the escalation route for wrong medicine, payment taken but no order, refund delay, COD dispute, delivery delay, prescription issue and privacy complaint? | Complaint handling and the legal grievance timelines | Owner | During development | Open — answer/date not recorded |

### A4. Pricing, billing and payments

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-014 | Prices live in two places: our app and the store billing software (Techsmith). Who keeps them the same, and what happens when the store's bill differs from what the customer paid online? | The bill in the package must match the payment | Owner + Finance | Before kickoff | Open — answer/date not recorded |
| Q-015 | In Phase 1.1 the store bills the order in Techsmith, as it does for phone orders, and packs the printed GST invoice with it. Is that acceptable? Will customers need to download an invoice in the app later? | Scope of the finance module | Owner + Finance | Before kickoff | Open — answer/date not recorded |
| Q-016 | Is COD available at launch? Any PIN code or product restrictions? | Checkout rules | Owner | During development | Open — answer/date not recorded |
| Q-017 | Which payment methods at launch: UPI, cards, net banking, wallets? | Cashfree setup | Owner | During development | Open — answer/date not recorded |
| Q-018 | Refund rules: who approves, partial refunds, failed refunds, and the refund timeline we promise customers. How are COD orders refunded: bank transfer or UPI? | Refund flows and customer messages | Owner + Finance | During development | Open — answer/date not recorded |
| Q-019 | What is the Cashfree settlement cycle: T+1 or T+2? | Daily payment reconciliation | Finance | During development | Open — answer/date not recorded |

### A5. Pharmacy, legal and compliance

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-020 | Do the current drug licences cover online sale and home delivery from each store? | We can only sell what the licences allow | Pharmacist + lawyer | Before kickoff | Open — answer/date not recorded |
| Q-021 | Schedule H and H1: what must Phase 1 record for H1 sales, and what can wait for Phase 3? | Most prescription medicines are Schedule H or H1 | Pharmacist + lawyer | Before kickoff | Open — answer/date not recorded |
| Q-022 | How long must prescriptions be kept? | Automatic deletion or archiving after the legal period | Pharmacist + lawyer | During development | Open — answer/date not recorded |
| Q-023 | Family profiles can hold children's health data. How do we capture verifiable parental consent for under-18s? | DPDP Act requirement | Lawyer | During development | Open — answer/date not recorded |
| Q-024 | Customer data deletion: earlier the answer was "no deletion", but the DPDP Act gives a right to erasure, except data the law requires you to keep. What is the process? | Account deletion flow | Lawyer | During development | Open — answer/date not recorded |
| Q-025 | Do we need a cookie consent banner? | Website build | Lawyer | Before go-live | Open — answer/date not recorded |
| Q-026 | Should the customer site meet the WCAG 2.1 AA accessibility standard? (Recommended.) | Design and testing effort | Owner | Before go-live | Open — answer/date not recorded |

### A6. Catalogue, reports and technical inputs

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-027 | Where is the product catalogue kept today (Techsmith, Excel, Tally, other), and can it be exported? Who cleans the data, and who verifies composition and schedule? (Proposed: a freelancer plus the pharmacist.) | The catalogue import blocks testing and launch | Owner | Before kickoff | Open — answer/date not recorded |
| Q-028 | Is there historical data to import, such as customers or past orders? | Migration effort | Owner | During development | Open — answer/date not recorded |
| Q-029 | How many orders per minute come in during the busiest hour? | Our load-testing target | Owner + Operations | During development | Open — answer/date not recorded |
| Q-030 | Riders and customers will call each other through masked numbers at launch, so neither sees the other's real number. Please approve a telephony provider and its cost (a monthly fee plus a small charge per call). | Privacy of riders and customers | Owner | Before go-live | Open — answer/date not recorded |
| Q-031 | Which reports do you need at launch, who sees each, how often (daily, weekly, monthly) and with which filters? Proposed: sales, orders by status, store acceptance times, customers, revenue, refunds, deliveries per rider, COD reconciliation. | Reports module scope | Owner | During development | Open — answer/date not recorded |

### A7. Configurable business settings — client confirmation

The source lists these as proposed administrator-configurable values, **not approved defaults**. The Word document did not assign priorities; the due points below are *suggested* to support sequencing.

| ID | Setting to confirm — original | Proposed value — source, unapproved | Who answers — source | Suggested due point | Status / final client value |
| --- | --- | --- | --- | --- | --- |
| Q-032 | Customer response window for a revised order or a new prescription | 2 hours, then the order is cancelled and refunded in full | Owner | Before kickoff (suggested) | Open — final value/date not recorded |
| Q-033 | Block COD after this many refused COD deliveries | 2 | Owner | During development (suggested) | Open — final value/date not recorded |
| Q-034 | Delivery attempts before the order returns to the store | 2 | Owner | During development (suggested) | Open — final value/date not recorded |
| Q-035 | Re-delivery fee after a customer-caused failed attempt | To set | Owner | During development (suggested) | Open — final value/date not recorded |
| Q-036 | Minimum order value | None until set | Owner | During development (suggested) | Open — final value/date not recorded |
| Q-037 | Delivery fee: free above ₹X, and slabs by distance or order value | To set | Owner | Before kickoff (suggested) | Open — final value/date not recorded |
| Q-038 | Peak-hour delivery rules (longer estimate or extra fee) | No change until set | Operations | During development (suggested) | Open — final value/date not recorded |
| Q-039 | Maximum orders a rider carries at once | To set | Operations | During development (suggested) | Open — final value/date not recorded |
| Q-040 | Return window after delivery, and which items can be returned | To set; typically unopened, not temperature-controlled | Lawyer + pharmacist | Before kickoff (suggested) | Open — final value/date not recorded |
| Q-041 | Manual refund amount that needs Super Admin approval | To set | Finance | During development (suggested) | Open — final value/date not recorded |
| Q-042 | Target time for pharmacist review | To set | Owner + pharmacist | During development (suggested) | Open — final value/date not recorded |

### A8. Project and launch

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed — source | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-043 | Running budget: for each service (payment gateway, messaging, email, maps, monitoring, AWS), who owns the account, how is it billed, and what is the approved monthly limit? Our estimate at 1,500 orders a day is ₹40,000–62,000 a month for services, plus ₹1.2–4.4 lakh in payment gateway fees depending on negotiated Cashfree rates. | Running costs after launch | Owner | Before go-live | Open — answer/date not recorded |
| Q-044 | Which store or stores go live first, and in what order do the rest follow? | Rollout plan | Owner | During development | Open — answer/date not recorded |
| Q-045 | Who from your side tests the product in UAT, and how much time can they give? | UAT plan for Phase 1.1 | Owner | During development | Open — answer/date not recorded |
| Q-046 | Who is the one decision-maker for scope, design and UAT sign-off, and who is the backup? | Approvals don't stall | Owner | Before kickoff | Open — answer/date not recorded |

### A9. Phase 1.2 — later inventory and warehouse decisions

Original source explicitly defers these items until Phase 1.2 planning. Do not bring their implementation into Phase 1.1 without a change approval.

| ID | Question — original wording | Why it matters — source | Who answers — source | When needed | Status / client decision |
| --- | --- | --- | --- | --- | --- |
| Q-047 | How will opening stock be counted in every store and the warehouse before inventory goes live? | Stock accuracy on day one | Owner + Store Managers | Phase 1.2 planning (source) | Open — answer/date not recorded |
| Q-048 | Will phone orders continue after launch? How will over-the-counter sales reach the platform once stock is tracked there? | Stock stays correct only if every sale is recorded | Owner | Phase 1.2 planning (source) | Open — answer/date not recorded |
| Q-049 | For a prescription order, should stock be held until the pharmacist decides or the upload window ends? | Paid orders shouldn't lose their stock during review | Owner | Phase 1.2 planning (source) | Open — answer/date not recorded |
| Q-050 | Replenishment: which products can each store request (full catalogue or a set list), and who at the warehouse approves requests? | Replenishment flow | Owner + Warehouse Manager | Phase 1.2 planning (source) | Open — answer/date not recorded |
| Q-051 | How are returned, expired and damaged stock handled, and who approves stock adjustments? | Stock adjustment rules | Owner + Warehouse Manager | Phase 1.2 planning (source) | Open — answer/date not recorded |

### A10. Proposed changes to earlier client answers — explicit approval required

These seven source proposals are **not** new approved policies. Review both the *proposed change* and *what it replaces* before any module/API/workflow is updated.

| ID | Proposed replacement / question — original | Earlier answer it would replace | Why proposed — source | Who answers — source | When needed — source | Approval / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-052 | Customers upload the prescription at checkout, before paying, as most Indian e-pharmacies do | Upload after payment, within 24 hours | Fewer paid orders waiting for a prescription; fewer automatic cancellations | Owner | Before kickoff | Unapproved — confirm/date |
| Q-053 | If the store can't supply an item, the customer agrees before the order continues (continue without it and get it refunded, or cancel) | Ship the rest and refund automatically | The customer may not want a partial order | Owner | Before kickoff | Unapproved — confirm/date |
| Q-054 | If the pharmacist rejects some prescription items, the customer chooses: continue without them (refunded), upload a new prescription, or cancel. Non-prescription items are kept unless they cancel | Whole order refunded or cancelled | The customer keeps the rest of the order if they want it | Owner + pharmacist | Before kickoff | Unapproved — confirm/date |
| Q-055 | Rider assignment is fully automatic: nearest available rider first, up to 3 riders, then the Operations Manager assigns. How long should each rider have to accept? | Staff confirm each rider | Faster dispatch, less manual work | Owner + Operations | During development | Unapproved — confirm/date |
| Q-056 | If the delivery OTP can't be used, the Operations Manager calls the customer and approves a fallback; the rider photographs the parcel at the door | OTP only | Deliveries don't fail because of a phone or network problem | Owner + Operations | During development | Unapproved — confirm/date |
| Q-057 | Products are typed P (prescription), M (medicine, no prescription) or O (other). Does Pharmville sell non-medicine products? Can the pharmacist give each product's type with the catalogue? | A prescription-required flag only | Only P items need a pharmacist; returns and licences differ for O items | Owner + pharmacist | Before kickoff | Unapproved — confirm/date |
| Q-058 | Until Phase 1.2, how are recalls, quality complaints and returned medicines handled in the store and Techsmith? | — | We need to describe the process for staff and support | Pharmacist + Operations | Before go-live | Unapproved — confirm/date |

## Part B — Additional recommended client questions (Q-059–Q-094)

> [!NOTE]
> **New suggestions, not from the Word document.** Questions below are proposed because the current repository still marks affected designs or decisions as **Proposed / Open** in its [source decision register](../09-References/Sources-and-Decisions.md), [API planning decisions](../05-APIs/Planning-Decisions.md) or [unified identity blueprint](../03-Modules/Authentication_Access/Unified-Identity-Architecture.md). The `D-xxx` labels indicate related internal decision topics, **not client approvals**. Owners and due points are suggested.

### B1. Product scope, legal operating model and serviceability

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-059 | Which capabilities are contractually required in the first Phase 1.1 launch, and which must be deferred (for example diagnostics, doctor consultations, appointments, memberships, subscriptions, insurance or marketplace functions)? Please approve a signed in-scope/out-of-scope list by phase. | Prevents the database and future module inventory from being mistaken for committed launch scope. | Product Owner + Business Sponsor | Before kickoff | D-001, D-018, D-027 | Proposed — awaiting client answer |
| Q-060 | Which registered legal entity is the seller/merchant of record for online orders, and how does that entity relate to each licensed dispensing store and the party issuing the GST invoice? | Determines payment onboarding, tax invoicing, refunds and legal ownership. | Owner + Finance + Legal | Before kickoff | D-006, D-008, D-012 | Proposed — awaiting client answer |
| Q-061 | Which cities, PIN codes, stores, delivery radii and any state-border restrictions are in the initial service area, and which products or order types are excluded from each area? | Determines checkout serviceability and compliant store assignment. | Owner + Operations + Legal/Pharmacist | Before kickoff | D-001, D-006, D-010 | Proposed — awaiting client answer |
| Q-062 | At launch, which tasks are customer self-service versus assisted by store staff, the call centre or operations (for example placing an order, editing it, requesting a prescription clarification and raising a return)? | Establishes the actual role workload and screens to build. | Owner + Operations + Support Lead | Before kickoff | D-001, D-020 | Proposed — awaiting client answer |

### B2. Unified identity, roles and secure access

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-063 | Do you approve one identity/account per person across customer, pharmacy, admin, warehouse and rider roles, with a unified sign-in entry point but stronger verification for privileged roles? | Confirms the proposed unified identity model rather than separate staff/customer accounts. | Owner + Security Lead | Before kickoff | D-003, D-028 | Proposed — awaiting client answer |
| Q-064 | Can one employee have multiple roles and assignments across stores/warehouses, and who may grant, change or revoke those access assignments? | Controls workspace selection, segregation of duties and location-scoped authorization. | Owner + Operations + Security Lead | Before kickoff | D-003, D-028 | Proposed — awaiting client answer |
| Q-065 | After a customer proves their phone number, which profile details and consents are mandatory before their first order? May a family member order for another adult or patient, and what proof is needed? | Resolves first-login onboarding and patient-versus-account-holder access. | Owner + Privacy/Legal + Pharmacist | Before kickoff | D-013, D-024 | Proposed — awaiting client answer |
| Q-066 | Who creates and verifies new staff, pharmacist and rider accounts, and what evidence or manager approval is required before the first privileged login? | Prevents self-registration into privileged operational roles. | Owner + HR/Operations + Security Lead | During development | D-003, D-028 | Proposed — awaiting client answer |
| Q-067 | What is the approved identity-recovery process when a staff member loses their authenticator or phone, and who can authorize an emergency reset without bypassing audit controls? | Defines safe account recovery and continuity of pharmacy/finance operations. | Owner + Security Lead + Operations | Before kickoff | D-003, D-023 | Proposed — awaiting client answer |
| Q-068 | What are the permitted devices, concurrent sessions, inactivity timeouts, logout/revocation expectations and response time after staff departure or role removal? | Sets enforceable session security and offboarding requirements. | Security Lead + Owner | During development | D-003, D-028 | Proposed — awaiting client answer |

### B3. Prescriptions, pharmacist approvals and product eligibility

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-069 | What exact checks make an uploaded prescription acceptable or unacceptable (patient details, date, signature, medicine/quantity, legibility, validity), and which standardized rejection or clarification reasons may pharmacists use? | Needed for a testable prescription-review policy, without developers deciding clinical rules. | Lead Pharmacist + Legal | Before kickoff | D-006, D-024 | Proposed — awaiting client answer |
| Q-070 | Which pharmacist or licensed store is responsible for reviewing each order, and what happens if the assigned pharmacist is unavailable, off shift or cannot resolve a prescription in time? | Defines clinical accountability and escalation beyond nominal working hours. | Lead Pharmacist + Operations | Before kickoff | D-006, D-010 | Proposed — awaiting client answer |
| Q-071 | Are medicine brand, strength, pack-size or quantity substitutions ever allowed? If yes, who approves them, what customer consent is required and how is the invoice/order updated? | Prevents unsafe or unauthorized substitutions and incorrect billing. | Lead Pharmacist + Owner + Legal | Before kickoff | D-006, D-010 | Proposed — awaiting client answer |
| Q-072 | Can one checkout include prescriptions for different family patients, and must those prescriptions, reviewer decisions and patient-visible records remain separated within the same order? | Determines patient privacy and clinical review boundaries. | Lead Pharmacist + Privacy/Legal | During development | D-006, D-013 | Proposed — awaiting client answer |
| Q-073 | Which product categories are intentionally excluded from online sale or home delivery at launch (for example special handling, temperature-sensitive, controlled or restricted items), pending verified licences and logistics capability? | Prevents accidental activation of products requiring special policy or handling. | Lead Pharmacist + Legal + Operations | Before kickoff | D-006, D-009 | Proposed — awaiting client answer |
| Q-074 | At what point is a prescription item legally cleared for picking, billing and rider handover, and what proof of the dispensing decision must be retained? | Connects the clinical decision to operational release without assuming a legal rule. | Lead Pharmacist + Legal + Store Operations | Before kickoff | D-006, D-024 | Proposed — awaiting client answer |

### B4. Checkout, finance, pricing and exception outcomes

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-075 | For prescription orders, which sequence is approved: upload/review before taking payment or payment followed by a time-limited review? When may money be captured and stock reserved, and what happens on expiry? | Resolves the documented conflict between the detailed journey and a deferred-upload branch; complements question 52. | Owner + Pharmacist + Finance | Before kickoff | D-004, D-006 | Proposed — awaiting client answer |
| Q-076 | What customer-facing outcome and automatic/manual reconciliation are required if a payment succeeds after a timeout, succeeds twice, or succeeds when no order was created? | Avoids duplicate charges or lost-money cases during provider retries. | Finance + Owner + Support | Before kickoff | D-004, D-008, D-016 | Proposed — awaiting client answer |
| Q-077 | When an item is removed or an order is partially accepted, should offers, tax, delivery fees, COD eligibility and minimum-order rules be recalculated? Must the customer approve the revised payable amount? | Defines price correctness for partial orders and customer acceptance. | Owner + Finance + Operations | Before kickoff | D-004, D-010, D-012 | Proposed — awaiting client answer |
| Q-078 | Who approves the exact product HSN/tax classification, tax-inclusive or tax-exclusive display, invoice numbering and rounding rules, and which billing system is final if figures disagree? | Makes tax and invoice behavior auditable, beyond simple synchronization. | Finance + Chartered Accountant + POS Owner | Before kickoff | D-008, D-012 | Proposed — awaiting client answer |
| Q-079 | Which promotion types (coupons, item/store discounts, first-order offers, free delivery) are authorized at launch, and what restrictions apply to medicines, COD, refunds and combined offers? | Prevents unapproved discount and reversal behavior. | Owner + Finance + Catalog Lead | During development | D-001, D-004 | Proposed — awaiting client answer |
| Q-080 | For a wrong, damaged, missing or short-shipped item, when should the customer receive a refund, replacement or support-led resolution? Is re-dispatch allowed and who pays the additional delivery cost? | Distinguishes operational remediation from the general refund-policy question. | Owner + Support + Finance + Operations | During development | D-004, D-010, D-020 | Proposed — awaiting client answer |

### B5. POS, inventory and master-data ownership

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-081 | Until Phase 1.2 inventory is active, which system is the authoritative store-level stock source at checkout, how frequently is it refreshed, and what maximum age/mismatch is acceptable? | Determines whether stock claims can be trusted before real-time inventory rollout. | Operations + Store Managers + Techsmith/POS Owner | Before kickoff | D-005, D-009 | Proposed — awaiting client answer |
| Q-082 | Will Techsmith exchange prices, inventory, invoices and order status through an API, scheduled file export/import or staff entry? What is the agreed fallback and reconciliation procedure during an outage? | Determines actual integration scope, manual workload and financial accuracy. | Owner + Techsmith/POS Vendor + Finance + Operations | Before kickoff | D-005, D-012, D-019 | Proposed — awaiting client answer |
| Q-083 | Who owns and signs off the initial values and ongoing maintenance of catalog, brand, product classification, units, store, delivery, role and finance master data? Which values are global versus store-specific? | The database has proposed master tables whose actual data and stewardship remain unapproved. | Owner + Catalog + Pharmacist + Operations + Finance | During development | D-019, D-027 | Proposed — awaiting client answer |
| Q-084 | What stock eligibility policy should apply to batch, expiry, minimum remaining shelf life, site licence, recalled stock and customer allocation, and who can authorize exceptions? | Determines safe allocation beyond a simple quantity-on-hand check. | Lead Pharmacist + Inventory/Operations | Before kickoff | D-009, D-010 | Proposed — awaiting client answer |

### B6. Rider, delivery and returns operations

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-085 | Is the rider application required to ship as Android at Phase 1.1 launch, or may a mobile web/PWA experience be used initially? Who owns Play Store publishing and managed devices? | Fixes delivery-app launch scope and release ownership. | Owner + Operations + Engineering | During development | D-021 | Proposed — awaiting client answer |
| Q-086 | Will deliveries use only Pharmville riders or also third-party logistics partners? What is the fallback if no rider or delivery partner accepts, including distant stores and returns? | Controls dispatch strategy, customer promise and partner integration scope. | Owner + Operations | During development | D-010, D-011 | Proposed — awaiting client answer |
| Q-087 | What proof-of-pickup and proof-of-delivery records are required (OTP, customer confirmation, photo, timestamp or location), who may see them and how long are they retained? | Defines evidence, privacy and dispute handling for normal and fallback deliveries. | Operations + Privacy/Legal + Support | During development | D-011, D-013 | Proposed — awaiting client answer |
| Q-088 | For a returned item, who authorizes pickup, who inspects and quarantines it, what disposition options exist, and at which confirmed step may Finance release the refund? | Links reverse logistics, medicine safety, inventory correction and refund finality. | Operations + Pharmacist + Warehouse + Finance | During development | D-004, D-009, D-010 | Proposed — awaiting client answer |

### B7. Vendors, privacy, resilience and go-live governance

| ID | Question to ask client — recommended | Why decision is needed | Suggested respondent(s) | Suggested due point | Related decision(s) | Status / client decision |
| --- | --- | --- | --- | --- | --- | --- |
| Q-089 | Who is authorized to select and sign contracts for Cashfree, OTP/WhatsApp/SMS, masked calling, maps, storage and email providers, and who signs off sandbox access, webhook/security requirements and production ownership? | Separates provider selection and sign-off from estimated recurring cost. | Owner + Finance + Security/Tech Lead | Before kickoff | D-014, D-016 | Proposed — awaiting client answer |
| Q-090 | Which order, prescription, payment, delivery, refund and support events require customer or staff notifications, through which channels, and what are the consent or opt-out rules? | Defines actionable communication triggers without leaking sensitive medical information. | Owner + Support + Privacy/Legal + Operations | During development | D-013, D-014 | Proposed — awaiting client answer |
| Q-091 | Which business users may view, download, export or share prescriptions, patient details, financial records and audit logs? What retention, incident-reporting and data-location requirements need formal legal approval? | Establishes least-privilege handling of sensitive data and legal review points. | Privacy/Legal + Pharmacist + Security Lead | Before kickoff | D-006, D-013, D-022 | Proposed — awaiting client answer |
| Q-092 | What recovery time (RTO), acceptable data-loss window (RPO), backup/restore responsibilities and incident escalation are required if checkout, Techsmith, a payment provider or the whole platform fails? | Defines operational continuity beyond the proposed uptime percentage. | Owner + Operations + Finance + Tech/DevOps Lead | Before go-live | D-017 | Proposed — awaiting client answer |
| Q-093 | What are the formal Phase 1.1 UAT exit criteria, severity-based go/no-go rules, decision owners and required proof for a launch sign-off? | Makes acceptance measurable rather than depending only on available testers. | Owner + UAT Lead + QA + Operations | During development | D-017, D-018 | Proposed — awaiting client answer |
| Q-094 | Who owns after-hours incidents, daily payment/COD reconciliation, prescription-review escalation, support complaints and master-data changes after launch, including named deputies? | Closes day-two operational ownership gaps across departments. | Owner + Operations + Finance + Pharmacist + Support | Before go-live | D-002, D-008, D-020 | Proposed — awaiting client answer |

## Decision recording and follow-up

### Required answer format

When a client responds, update the row and transfer the approved result into the canonical project decision log using this structure:

```text
Question ID: Q-___
Decision / selected option:
Scope / impacted phase and modules:
Exceptions or limits:
Decision-maker / approver:
Approval evidence or meeting note:
Decision date (YYYY-MM-DD):
Status: Open | Proposed | Approved | Deferred | Rejected
Next owner / action / due date:
Linked repository decision IDs / documents:
```

### Update dependent project documents after approval

1. Update [Sources and Decisions](../09-References/Sources-and-Decisions.md) with the actual owner-approved outcome; add new D-IDs only when required by repository convention.
2. Update [Requirements and Scope](../01-Project/Requirements-and-Scope.md), [Capability Scope](../01-Project/Capability-Scope.md), and affected [modules](../03-Modules/README.md) and [cross-module workflows](../06-Workflows/README.md).
3. Update [API contracts](../05-APIs/README.md), [database/master planning](../04-Database/README.md) and [implementation plan](../08-Development-Plan/Implementation-Plan.md) only where the client decision changes their contract.
4. Review the [wireframe prototype](../10-Low-Fidelity-Wireframes/README.md) in a separate follow-up task; client responses alone do not silently authorize modifying screens or code.
5. Keep the [source questionnaire](#part-a--existing-team-questions-verbatim-q-001q-058) intact for evidence; record subsequent answers instead of rewriting what was originally asked.

### Version notes

- **Reference questionnaire:** *Pharmville Phase 1.1 — Open Questions for Client*, dated 24 October 2026; 58 original numbered items, including 11 settings (Q-032–Q-042), five Phase 1.2 questions (Q-047–Q-051), and seven proposed revisions (Q-052–Q-058).
- **Repository context:** The uploaded `pharmville-docs(3).zip`; planning and database schema documentation are not proof of product-owner approval or production readiness.
- **Prepared register:** 25 October 2026; 36 newly recommended questions; **94 total numbered client-decision prompts**. No client responses were present in the supplied questionnaire, so none are marked approved here.

