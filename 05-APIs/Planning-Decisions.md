# API and master-data planning decisions

All proposals are **Unapproved / Not Implemented**. This register refines existing D-001–D-024; it does not fabricate new approvals or alter requirements. [Original decision register](../09-References/Sources-and-Decisions.md) remains authoritative. [Coverage](API-Contract-Coverage.md) separates documentation gaps from owner approval; [candidate commands](Journey-API-Gaps.md) remain outside the preserved inventory.

## Operation-contract exclusions

| Existing decision | Affected contract | Concrete missing evidence | Accountable reviewers |
| --- | --- | --- | --- |
| D-023 | [API-004](../03-Modules/Customer_Accounts/APIs.md) | D-023: exact replacement proof DTO/storage is absent. Profile-only subset proposed, full route incomplete. | Customer_Accounts / Tech lead / QA lead |
| D-019/D-024 | [API-015](../03-Modules/Product_Catalog/APIs.md) | D-019/D-024: spreadsheet columns, row atomicity and durable import result/status model are not documented. | Product_Catalog / Tech lead / QA lead |
| D-005 | [API-051](../03-Modules/Inventory/APIs.md) | D-005: source authentication, exact quantities-to-ledger reconciliation and atomic batch outcome are unspecified; timestamps alone are not sufficient evidence. | Inventory / Tech lead / QA lead |
| D-010/D-011 | [API-066](../03-Modules/Delivery_Operations/APIs.md) | D-010/D-011: reattempt limits, custody and precise action-to-status progression need approved policy. | Delivery_Operations / Tech lead / QA lead |
| D-004/D-016 | [API-075](../03-Modules/Finance_Payments/APIs.md) | D-004/D-016: exact continuation DTO, capture sequence and provider-supported replay contract require evidence. | Finance_Payments / Tech lead / QA lead |
| D-016 | [API-076](../03-Modules/Finance_Payments/APIs.md) | D-016: signature header names, wire schema, canonicalization and acknowledgment status are unknown. Conceptual DTO is explicitly not a provider wire contract. | Finance_Payments / Tech lead / QA lead |
| D-008/D-016 | [API-079](../03-Modules/Finance_Payments/APIs.md) | D-008/D-016: settle-vs-reconcile dataset definition and provider report layout need Finance approval. | Finance_Payments / Tech lead / QA lead |
| D-007/D-008 | [API-080](../03-Modules/Finance_Payments/APIs.md) | D-007/D-008: exact handover/deposit evidence and independent approval model are missing. | Finance_Payments / Tech lead / QA lead |
| D-003 | [API-089](../03-Modules/Authentication_Access/APIs.md) | D-003: challenge replay prevention and exact MFA enrollment/recovery/session-limits policy require reviewed persistence/credential design. | Authentication_Access / Tech lead / QA lead |
| D-003 | [API-090](../03-Modules/Authentication_Access/APIs.md) | D-003: exact single-use authenticator/challenge persistence is absent in schema documentation. | Authentication_Access / Tech lead / QA lead |

## Complete proposals still requiring approval

| Decision | Proposal / evidence required | Owner | Blocked enablement |
| --- | --- | --- | --- |
| D-024 | Approve every operation field/type/constraint/example, scoped permission, exact table owner/write columns, transaction interface, state guard, technical rate/deadline proposal and designed CT assertions. Typed documentation is not a runtime grant. | Tech lead, each module owner, QA lead | Implementation acceptance of that contract. |
| D-003 | Approve JWT/session/refresh token transports and lifetimes; purpose-bound OTP/lockout limits; 16 suggested role codes and per-operation permissions. Define least-privilege role_permissions, delegated grant ceilings and session revocation propagation. No role automatically gets every permission. | Security / Product owner | Production identity and all privileged access. |
| D-023 | Proven replacement contact must remain separate from current verified contact until atomic replacement; exact proof/storage absent. No pending-contact columns are invented. | Security / Product owner | API-004 contact replacement. |
| D-004/D-006 | Preserve detailed review-before-payment P flow; decide deferred RX-02 conflict, late payment compensation, cancellation-before-packed and refund approvals without new clinical rules. | Product / Pharmacy / Finance / Legal | Clinical/money-dependent transitions. |
| D-005/D-009 | Name stock authority; approve freshness, FEFO/expiry eligibility and hold TTL. Define exact reserved-to-committed physical movement and back-office adjustment approval command. No numeric freshness or shelf-life value invented. | Operations / Pharmacy / POS vendor | Real reservations and fulfillment. |
| D-007/D-008 | Approve COD cap/refusal rule, order-stage authorization persistence, actual collection/deposit/remittance evidence, independent refund approvals and accounting chart. | Finance / Product / Legal | COD selection, handover, reconciliation and COD refund destination. |
| D-010/D-011 | Approve no-split launch boundary, fallback/reassignment compensation, failed-attempt next actions, proof requirements, GPS cadence/privacy/retention and OTP recipient challenge trigger. | Operations / Product / Privacy | Delivery/return exceptions and rider tracking. |
| D-012/D-019 | Supply authoritative dated product/brand/manufacturer/medicine/HSN/tax datasets. Approve category proposal, dosage/salt sources and import columns/atomicity. Numeric invoice/tax examples are synthetic amounts, not legal rates. | Catalog / Pharmacy / Finance / CA | Catalog seed/publication, import and tax/report enablement. |
| D-013 | Supply policy purpose/version list, legal holds, data deletion exceptions, retention and file/export grant TTL; no legal SLA inferred. | Privacy / Legal | Consents, privacy requests, clinical files and exports. |
| D-014/D-016 | Supply exact provider accounts, signed sandbox payload/header/canonicalization/ack/retry contracts and template registration; Cashfree/FCM/SMS/WhatsApp choices are not live account evidence. | Provider owner / Security / Product | Payment/provider integrations. |
| D-015/D-017 | Standalone SQL/catalog parity is verified in isolated PostgreSQL. Verify independently provisioned runtime login memberships, actual restricted permissions/RLS/guards and application data-access parity before activation. | DBA / Tech lead / DevOps | Deployment/runtime parity and operational readiness. |
| D-001/D-002/D-018/D-020/D-021 | Resolve receiving/fallback/rider phase scope, advanced support and future modules. An available table is not launch scope. | Product / Operations / Engineering | New scope and candidate routes. |

## Database compatibility findings — no schema changes

| Finding | Proposed compatible treatment | Separate schema proposal if required |
| --- | --- | --- |
| logistics.rider_shifts.id is BIGINT and there is no row_version | Use signed opaque shiftToken bound to actor/start identity; row lock and ended_at predicate. Never expose numeric ID or invent UUID/version. | A public UUID/version could be a later approved migration; not required or modified here. |
| commerce.order_revisions has revision_number but no row_version | API-063 uses expectedRevisionNumber plus expectedOrderVersion, locks revision status and accepted order aggregate. | No migration needed for the proposed interface. |
| warehouse.stock_reservations has per-item/lot rows, not an aggregate parent | Return reservations[] of exact persisted rows; release accepts one public row ID/version. Decrement reserved only; physical on_hand remains unchanged on unused release. | Do not invent reservation parent/reason columns. Optional reason in audit metadata, future physical movement reason only if a ledger movement actually exists. |
| customer.wishlist_items has no is_deleted/deleted_at/deleted_by | DELETE removes only the association using ID/version and records safe removal audit. | Soft deletion would require a separate migration decision; not assumed. |
| payment.cod_collections/refunds have no currency column | Derive currency from order/linked payment intent. | No duplicate currency field added. |
| logistics.delivery_attempts has one proof_file_id | API-073 accepts a singular proofFileId. | Multiple proofs require an approved junction/evidence design; no schema change made. |
| Required customer.profiles.first_name is not part of OTP input | OTP creates/resolves identity/session only, restrict onboarding until actual first name supplied; do not manufacture profile name. | Profile-completion/create-if-missing branch is candidate JAPI-15; D-024. |
| Provider/MFA/import/COD proof concepts lack exact storage or wire model | Keep affected operations incomplete; conceptual fields are not claimed as actual provider schema or stored columns. | Potential dedicated import result, MFA replay, contact verification and order-stage COD authorization records require owner/DBA design; migrations untouched. |
| Location/license eligibility and immutable fulfillment site identity | Location creation starts inactive; reassignment creates new work through owner compensation. Existing completed package/dispatch guard semantics retained. | No license bypass, split order or mutation of existing fulfillment site identity. |

## Review deliverable

Owners can approve small vertical slices using the operation contract, typed OpenAPI, exact mapping, master prerequisites and CT scenarios together. Record approver/date/evidence per operation before changing approval status. Real provider sandbox, database-backed application tests and production seed execution remain separate evidence; no test result is asserted here.


## Unified authentication reconciliation

D-028 explicitly proposes durable challenge/refresh persistence and session context, resolving the *documentation/persistence design* gaps in API-089/090. Those two contracts can be complete proposed without D-003/D-024/D-028 approval; no security policy or implementation is approved. API-098–112 add the minimum separated credential, context and grant commands traced to ACC-01/AUTH-01–04/ADM-03. D-023 profile/contact replacement remains incomplete. Authenticator-loss assisted recovery remains a blocked procedure under D-003; these proposals do not manufacture a reset API.
