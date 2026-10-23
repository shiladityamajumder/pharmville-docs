# Security and healthcare data handling

## Immutable evidence and privileged audit views

Record who performed the action, when, which authorized site/resource/revision was targeted, outcome and reason, and a correlation/provider event ID when applicable. Required events: login attempts, role/permission changes, product class/publish, Rx view and decision, order revision/customer consent, stock move/hold, license rejection, payment/refund/COD reconciliation, rider OTP result, export/download and incident override.

The database contains `platform.audit_logs`, related compliance and file-access event tables, and trigger-based guards; application events must preserve their expected schema contract. Never log raw clinical files, OTP values, secrets, full payment tokens or unnecessary rider GPS trails. An audit record must not be silently updated to make a correction; add a new compensating event.

Auditors need read-only, scoped, purpose-based export and access logging. Retention and deletion exceptions are unresolved and require legal signoff. See Audit Module and Runbook.

## Customer, staff and rider authentication

**Customer:** request OTP to verified number, enforce per-phone/IP rate limits, validate single-use short-lived challenge, issue short access plus rotating refresh session, store login history and allow safe device revocation. UI should not reveal whether a number exists before verification.

**Routine staff and rider:** proposed OTP to registered device, bound to scope, role and current shift where required. **Privileged Super Admin/Central Admin/Finance Manager:** checklist specifies password + authenticator TOTP with different session/lockout protections, despite an earlier blanket OTP-only statement. Do not silently implement both schemes without D-003 signoff.

The documented policy mentions 15-minute access, 30-day refresh, 8-hour staff sessions, 2-hour admin sessions, staff one-active-session rule and escalating lockouts. Reconcile which session limits apply to mobile/rider use before coding. Never store OTP plaintext, disclose auth status in logs or let a valid token bypass ownership tests. See API Auth and User Roles.

## Compliance and legal signoff boundaries

Source checklists request retail drug licenses per store, warehouse license checks where relevant, registered pharmacists, product Schedule classification, lawful prescribing/dispensing, invoice/HSN/GST handling, DLT/MSG91 sender/template approval, customer privacy/consent, deletion and retention, grievance contact, refund/return policy and terms. These are project requirements for owner/legal/pharmacist review, **not a legal opinion or independently verified legal mandate**.

Keep a signoff artifact per operating location, master classification, controlled product category, pharmacy decision policy, identity notice, approved SMS/WhatsApp template, GST invoice rules, COD/refund policy and prescription retention. A database license row or GSTIN field is not evidence of current legal validity. Record approving professional, date, effective version, applicable territory and escalation if withdrawn.

No fixed retention period, patient right exception, Schedule regulation, GST tax rate or compliance score is invented here. Production must wait for written review and testable operating procedures. See Decisions, Data Lifecycle and Release Plan.

## India healthcare-commerce compliance review — approval needed

The platform appears intended for Indian pharmacies, but **no legal finding, license certificate, regulator review or data protection impact assessment is included in the uploads**. Specialist counsel and a qualified pharmacy operations reviewer must decide which current laws, prescription handling rules, billing obligations, medical record retention/deletion limits, consent texts and license/site restrictions apply to actual launch territories and products.

Before release, obtain written decisions on P-classified medicine sale gates, professional signoff, prescription authenticity/eligibility, tax invoicing, protected data requests, marketing communication consent, age/family accounts, retention and legal holds, and access to personal health records. Do not set legal retention periods or claim certified compliance based on the current DB schema.

**Engineering fail-closed requirement:** unknown product classification, site license, inventory authority or legal access policy must block the sensitive action rather than assume permission.

## Healthcare-specific application safeguards

Software P/M/O category is a client business classification, not independent medical/legal permission to sell a specific product. Clinical review is applied only to current P lines in the cart, each against the exact patient, item, quantity and prescription version. M/O lines do not enter pharmacist review. Unknown class, missing patient, unapproved prescription or changed accepted revision blocks affected fulfillment.

Require restricted pharmacist workbench access, access logs, file scanning, reason-coded approvals and re-review after relevant patient/SKU/Rx changes. A store/warehouse also needs current site-specific license and approved stock freshness policy; the database's synthetic test policies are not production legal licenses.

Schedule categories, telemedicine rules, prescription validity, cold-chain, retention, pharmacist registration and supply restrictions require a specialist legal/pharmacy review. The client checklist says Schedule X is not sold in Phase 1 but further scope is not independently certified. See Clinical Rules, Open Decisions.

## Proposed role-to-module access matrix

**Not an approved grant list.** Names are business roles inferred from inherited user journeys and database schemas. The exact identity.roles/user_roles/role_permissions seeded values and live runtime grants must be reviewed separately. Do not grant these based on this table alone.

| Module | Potential actors | Authorization invariant |
| --- | --- | --- |
| Customer_Accounts | Customer; delegated family account under approved consent | Customer sees own account only; family permission explicit |
| Product_Catalog | Public/customer browse; catalog manager publishes | Anonymous published reads only; staff can modify after approval |
| Cart_Checkout | Customer | Only own cart and patient/address scope; server calculates price |
| Prescription_Upload | Customer/patient; pharmacist permitted reviewer | Private object grants + scan/consent, never public URL |
| Customer_Orders | Customer; service operator | Customer own order; staff scoped by support/store permissions |
| Admin_CMS | Platform admin; catalog/content manager | Explicit privileged write; site/organization scope |
| Order_Operations | Order operator; authorized store dispatcher | Org/site/order queue permission; no unilateral clinical override |
| Store_Operations | Store picker/packer; authorized supervisor | Only assigned site/task and eligible lot |
| Inventory | Inventory operator; scoped system integration | Store/site scoped write; trusted POS correlation; no stale observation |
| Warehouse | Warehouse supervisor; receiving staff | Source/destination warehouse and lot access |
| Pharmacist_Review | Qualified pharmacist with approved site role | Prescriptions and decisions limited to patient, line and licensed location |
| Delivery_Operations | Dispatcher; operations manager | Only authorized shipment and route assignment |
| Rider_App | Assigned rider | Only assigned shipment, limited address; cannot mark arbitrary delivery |
| Finance_Payments | Customer payment intent; finance officer; verified gateway adapter | Provider callbacks signature/replay checked; staff refunds separately approved |
| Reporting | Authorized report viewer/exporter | Rows and exports scoped to role/organization |
| Audit | Auditor/security reviewer | Read-only restricted evidence; investigators need accountable access |
| Authentication_Access | Customer/staff/rider/identity administrator | Sessions and roles managed through trusted, audited authority |
| Notifications | Customer preferences; staff template manager; integration worker | Consented channels; send after commit only |

**Database evidence:** the final snapshot contains four restricted capability groups and three RLS policies; actual service DB credentials and privilege grants need a target-runtime validation.

Existing row-level policies

## Role and object-level authorization

Role-based access control (RBAC) grants only actions relevant to a staff/customer role; object-level authorization further verifies that the exact record belongs to that actor's patient, store, assigned rider task or finance scope.

| Role category | Permitted examples | Explicit denial |
| --- | --- | --- |
| Customer | Own cart/order/address/dependent patient and own invoice | Other customers' prescriptions/orders |
| Store or warehouse staff | Assigned site queue, stocked batches, pick/pack with approval gates | Other site inventory or pharmacist decisions |
| Pharmacist | Authorized P-line review and private Rx read with access log | M/O clinical decisions, unrelated patient evidence |
| Ops/delivery | Eligible site/rider assignment and delivery exceptions | Unilateral refund, P-line approval |
| Finance | Assigned settlement/refund/COD tasks and scoped finance reports | Raw Rx documents or unapproved high-value overrides |
| Catalog/CMS | Draft/import/publish through explicit approval | Unapproved P/M/O class or hidden policy changes |
| Auditor/support | Read-limited cases and compliant exports | Mutating immutable history or arbitrary finance access |
| Workers | Narrow provider/webhook/notification/report capabilities | Migration owner / unrestricted SQL |

Current DB roles are separate NOLOGIN runtime capabilities and have only selective RLS. Build a reviewed explicit `(role, action, resource_scope)` matrix with owner decision D-003 before production; never authorize solely from an internal integer ID. See Source Role List.

## Pharmville security controls and trust

The source master checklist calls for JWT/OTP/MFA, least privilege, at-rest encryption with AWS KMS for RDS/S3/ElastiCache, HTTPS/TLS, API rate limiting, secrets management and independent audit. Database migrations V0025/V0029 establish restricted NOLOGIN roles, selected RLS policies and future routine default denial. Production deployment evidence, WAF policy and legal retention remain incomplete.

Defend the most important assets: prescriptions and patient identities, store/warehouse stock and inventory movement, gateway/COD/refund financial facts, rider GPS/OTP traces, sensitive exports, staff role grants and signing secrets. Enforce user and location scopes in application *and* within approved DB capabilities where possible. Never accept browser-provided actor context or use migration-owner credentials at runtime.

Production gate: threat-model signoff, cloud IAM review, provider secret/signature validation, clinical-file scanning/private access, breach/incident runbooks, rate-limit tests and role-based penetration tests. A SQL table alone is not a security control. Related Threat Model, Healthcare Data and Audit Logging.

## Sensitive records and private file handling

Protect patient identifiers, prescriptions, clinical documents, account sessions, payment references, invoices, staff credentials, rider location traces, ID/export documents and provider secrets. Use TLS and KMS-managed encryption for AWS data stores as selected; secrets must come from a controlled secret manager rather than `.env` committed to Git.

Prescriptions and reports live in private object storage; the database records metadata and access evidence. On upload: authenticate, verify allowed size/format, create short-lived scoped upload intent, scan, validate ownership and mark available only after trusted checks. On download: recheck actor and patient/order authorization **at read time**, issue short-lived URL and audit clinical access. Do not embed Rx content in messages, jobs, logs or support exports.

Tokenize or mask provider references and phone/GPS details in telemetry. Retention, lawful holds, deletion and customer consent need legal approval; do not guess fixed duration. See Healthcare Handling and Database Privacy.

## Priority security threat model

| Threat | Most important entry point | Proposed mitigation / negative test |
| --- | --- | --- |
| IDOR cross-patient or store access | Predictable UUID resource paths, filters | Server-side ownership check and DB scope, `403/404` |
| Unauthorized P approval | Pharmacy workbench impersonation | Verified licensed role, exact Rx version and audit |
| Unapproved dispatch | Picking endpoint or stock override | Database license, line, lot and finance gates |
| Webhook spoof/replay | Cashfree callback | Signature/raw payload, event dedupe and reconciliation |
| Duplicate charge/refund | Retry/timeout | Scoped idempotency + authoritative ledger |
| Stale stock oversell | POS lag, race | Fresh observations, lock and reservation guard |
| Rx/document exfiltration | Signed URL or report export | Short TTL, access recheck, private storage and purpose logs |
| OTP/login brute force | Public auth endpoints | Rate limits, escalating delay/alerts and session revocation |
| Insider privilege escalation | Staff role edit, migration owner | No self-grant, separation of duties, runtime NOLOGIN roles |

Test abuse against a synthetic staging database. Do not consider a passed local SQL test equivalent to a deployed WAF, token lifecycle or penetration test. See Security Testing.

## Trust boundaries and database capability design

**Recorded implemented DB protection:** four restricted NOLOGIN PostgreSQL capability groups (`pharmville_customer_api`, `pharmville_staff_api`, `pharmville_reporting_worker`, `pharmville_integration_worker`) and three row-level security policies in the final catalog. The migration owner is privileged and must **never** be an application runtime account.

**Application design gate:** NestJS authenticates and scopes a request, checks roles, patient and site memberships, and uses a restricted DB role. An arbitrary browser actor ID or transaction setting must not be accepted as trusted context. Unknown seller/provider/service kinds must be denied.

**Patient/documents:** files are private, signed access is short-lived, permissions rechecked on download, and access events recorded. Do not place prescription bytes or medical details in telemetry.

**Payments:** accept provider callbacks only after signature, replay and amount/reference validation; settle ledgers once. Keep COD and online payment accounting separate.

**Audit:** record who, action, resource, time, allowed/denied outcome and correlation ID, with minimal protected data. Do not claim the current SQL-only controls by themselves provide a compliant healthcare application.

Exact RLS policies · database security
