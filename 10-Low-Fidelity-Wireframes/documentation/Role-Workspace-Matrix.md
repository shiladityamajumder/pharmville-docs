# Role-to-workspace access matrix

**Status: Prototype illustration of proposed defaults. No permissions are approved or granted by this document or the demo.** The canonical [User Roles](../../01-Project/User-Roles.md) and [Unified Identity architecture](../../03-Modules/Authentication_Access/Unified-Identity-Architecture.md) remain authoritative. The access controls here are local fixtures, not a production authorization service.

## Proposed role and workspace mapping

The role names and scope below follow the inherited role inventory where possible. Login/MFA notes preserve documented customer OTP, rider OTP and AUTH-01 requirements. Staff MFA beyond the specifically named privileged roles remains a proposal pending D-003/D-024. Workspace access requires a role assignment and explicit endpoint permission; a navigation card never grants either.

| Role / candidate | Workspace | Login method | MFA | Permission scope | Restrictions and status |
|---|---|---|---|---|---|
| Customer | Customer app and website | Verified phone OTP | None mandatory in inherited flow | Own profile, consent, patient/dependent, address, cart and orders | No staff access; private evidence remains owner/consent scoped. Confirmed inherited flow. |
| Super Admin | Administration | Password + authenticator | Required by AUTH-01 | Explicit global identity/admin grants | Cannot self-escalate; no clinical or finance bypass. Existing proposed role. |
| Central Admin | Administration | Password + authenticator | Required by AUTH-01 | Explicit central organization/location administration grants | Scope depends on approved organization membership. Existing proposed role. |
| Pharmacist / Licensed Pharmacist | Pharmacist workbench | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Assigned licensed site, patient, evidence and exact P-lines | Clinical qualification and reviewer rules remain independent. Existing role alias. |
| Store Manager | Store operations | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Assigned store and manager-only approved actions | No other store, pharmacy or finance override. Existing proposed role. |
| Store Staff / Store Worker | Store operations | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Assigned store and current pick, pack and receipt tasks | No manager-only adjustments. Existing role alias. |
| Warehouse Manager | Warehouse operations | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Assigned warehouse and approved supervisor actions | No arbitrary source/destination scope or finance settlement. Existing proposed role. |
| Warehouse Staff / Receiving Staff | Warehouse operations | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Assigned receiving, transfer and picking work | Receiving does not authorize supplier payment. Existing role alias. |
| Inventory Operator / Controller | Inventory workspace | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Granted organization/location/warehouse stock actions | Lot, reason, POS and approval rules remain. Existing alias. |
| Order Operations / Operations Manager | Order operations | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Granted organization/site order queues and named operations | Cannot independently change clinical or money state. Existing role. |
| Delivery Dispatcher | Delivery dispatch | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Explicitly granted shipment assignment and location scope | Separate permission-filtered capability of Ops Manager in the existing matrix; Orders does not imply Delivery. |
| Rider / Delivery Rider | Rider mobile app | Verified phone OTP per RID-01 | No new mandatory MFA | Current shift and assigned task only | Cannot choose another rider's work; customer delivery OTP and photo proof remain. Confirmed inherited method. |
| Finance Manager | Finance workspace | Password + authenticator | Required by AUTH-01 | Explicit organization/site finance and refund permissions | No prescription evidence; amount and approval rules remain. Existing proposed role. |
| Finance Executive | Finance workspace | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Assigned finance tasks and scoped reports | No manager override or self-approved refund. Existing role. |
| Catalog Manager | Catalog workspace within Administration | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Granted catalog import, classification and publication actions | Product classification approvals remain separate. Existing proposed role. |
| CMS Manager | CMS workspace within Administration | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Granted content and template publication | No implicit IAM, clinical, catalog-classification or finance access. Existing proposed role. |
| Support Agent | Support workspace | Staff password; authenticator proposed | Proposed staff default; D-003/D-020 approval | Approved case scope and minimal customer projections | No refund, dispensing, evidence alteration or cross-organization access. Candidate role, approval pending. |
| Auditor / Security Reviewer | Audit workspace | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Read-only audit evidence and purpose-scoped exports | No business mutations or blanket patient access. Existing alias. |
| Report Viewer / Exporter | Reporting workspace | Staff method from assigned role | Inherited role policy | Named report, date and location scope | A capability on an assigned role, not an automatic identity or new grant. |
| Notification Operator | Notification workspace | Staff method from assigned role | Inherited role policy | Event attempts and only explicitly granted template operations | A capability, not a separate identity; no secret/template leakage. |
| Procurement (candidate) | Procurement workspace | Staff password; authenticator proposed | Proposed staff default; D-003 approval | Proposed supplier/PO work within an approved organization | New demo persona only; no approved procurement role or supplier integration. |

See the canonical [role inventory](../../01-Project/User-Roles.md) for the 16 proposed role codes and source status. The prototype also exposes candidate workspace cards to demonstrate task flow; candidate entries do not extend the approved role inventory.

## Workspace selection and session behavior

| Situation | Expected behavior |
|---|---|
| First sign-in with one eligible workspace | The backend may suggest that workspace; the client still enters only through an authorized context. |
| More than one assignment | Show only backend-derived eligible workspaces, with organization/location labels; the person chooses one. |
| Context switch | Recheck assignment, status, target permissions and resource scope before changing the active workspace. Keep one identity and session. |
| Higher-security workspace | Require step-up bound to the session and authorized assignment before activation. The demo marks Administration, Pharmacist and Finance as illustrative targets; exact policy and freshness remain pending security approval. |
| Unauthorized workspace | Deny with no context or data. A typed role/panel value cannot create a grant. |
| Assignment revoked | Deny on the next authoritative authorization check after revocation; clear invalid active context and offer other valid assignments. Production propagation/locking is still governed by the canonical revocation decision. |
| Account suspended or session expired | Deny protected actions, revoke the session/proofs and return to eligible identity recovery. |
| No workspace assigned | Keep the identity in account-access state; do not show or invent a business workspace. |
| Frontend menu hidden | Treat only as navigation. Every API independently checks action permission and resource scope. |

The browser prototype demonstrates a single synthetic identity session, staff password plus authenticator, customer/rider OTP adapters, assigned-workspace selection, denial of arbitrary contexts, per-workspace step-up prompts and revocation. It does not implement credential storage, token rotation, concurrent-session limits, distributed revocation, session-cookie/CSRF controls or real-time assignment changes.

## Workspace demonstration personas

For a repeatable local review, the browser-only fixture includes `demo.admin@example.test` (Admin), `pharmacist@example.test` (Pharmacist), `store@example.test` (Store Worker), `warehouse@example.test` (Warehouse Worker), `finance@example.test` (Finance), and `support@example.test` (Support). Staff sign-in uses the displayed fictional password/MFA flow; customer and rider flows use the displayed synthetic OTP. These are fake identifiers and must not be used as real credentials. Unknown identifiers receive the same generic sign-in response.

The separate Review Mode persona selector can inspect screens and scenarios. It does not create an identity session, role assignment, location membership or permission grant. To demonstrate protected-workspace selection, use Access → sign in → Authorized workspaces.

## Decisions that remain open

- D-003 / D-024: approve the role/permission catalogue, staff authentication policy, assignment scope and access-review process.
- D-023: approve authorization consistency, revocation propagation and cache behavior.
- D-020: approve Support role, customer projection and case access boundaries.
- Security owner: approve which workspaces require step-up and the proof freshness/reuse window. The demo's three elevated destinations are proposed UX examples only.
- Product/IAM owner: decide whether Procurement is an existing capability assignment or a separately named role; this prototype only uses a candidate fixture.

