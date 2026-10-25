# User roles and authorized workspaces

**Proposed defaults, not approved grants.** The [unified Identity architecture](../03-Modules/Authentication_Access/Unified-Identity-Architecture.md) owns authentication and backend authorization for every person. Role names are not login databases, identities, app-specific accounts or PostgreSQL runtime roles. D-003/D-024 must approve permissions and method policy; D-020 covers Support.

## Role-to-workspace access matrix

| Role / proposed code | Workspace / navigation permission | Login Method | MFA | Permission Scope | Restrictions |
| --- | --- | --- | --- | --- | --- |
| Customer / `customer` | Customer website/app / `workspace.customer.enter` | Verified phone OTP | No mandatory MFA in inherited customer flow | Own customer/patient/address/order resources only | No staff powers; private evidence needs ownership/consent |
| Super Admin / `super_admin` | Administration / `workspace.administration.enter` | Password + authenticator | Required by AUTH-01 | Explicit global IAM/admin permissions | No clinical/finance bypass; cannot edit own role to escalate |
| Central Admin / `central_admin` | Administration / `workspace.administration.enter` | Password + authenticator | Required by AUTH-01 | Approved organization/global administrative scope | Global role edits require global IAM policy authority |
| Pharmacist / `licensed_pharmacist` | Pharmacist workbench / `workspace.pharmacist.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Assigned licensed site, permitted patient/order/P lines | Reviewer qualification and clinical evidence remain independently required |
| Store Manager / `store_manager` | Store operations / `workspace.store.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Assigned store locations and approved supervisor actions | No other store stock or unilateral pharmacy/finance override |
| Store Staff / `store_staff` | Store operations / `workspace.store.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Assigned store and current pick/pack tasks | No manager adjustment approval from staff menu |
| Warehouse Manager / `warehouse_manager` | Warehouse operations / `workspace.warehouse.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Assigned warehouse/location and approved supervisor actions | Resolve warehouse UUID to organization/location; no arbitrary source/destination |
| Warehouse Staff / Receiving Staff / `warehouse_staff` | Warehouse operations / `workspace.warehouse.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Assigned receiving/transfer/picking work | Receiving evidence does not authorize financial settlement |
| Inventory Operator / Controller / `inventory_controller` | Inventory workspace / `workspace.inventory.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Granted organization/location/warehouse stock actions | Reason/approval/lot/POS guards still apply |
| Order Operations / Operations Manager / `ops_manager` | Order operations / `workspace.orders.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Granted organization/site/order queues | No unilateral clinical or money status changes |
| Delivery Dispatcher (capability of Ops Manager) / `ops_manager` | Delivery dispatch / `workspace.delivery.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Granted organization/location shipments and assignment actions | Requires its own entry and dispatch permissions; Orders does not imply Delivery |
| Rider / `delivery_rider` | Rider application / `workspace.rider.enter` | Verified phone OTP, as RID-01 | No new mandatory MFA; stronger actions require reviewed policy | Current assignment/shift and minimal delivery details | Cannot select another rider; mandatory delivery OTP + photo unchanged |
| Finance Manager / `finance_manager` | Finance workspace / `workspace.finance.enter` | Password + authenticator | Required by AUTH-01 | Explicit organization/site finance/refund/settlement grants | No raw prescription access; approval/amount policies remain |
| Finance Executive / `finance_executive` | Finance workspace / `workspace.finance.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Granted finance tasks and scoped reports | No manager override or self-approved refund |
| Catalog Manager / `catalog_manager` | Catalog management / `workspace.catalog.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Granted catalog publication/import/classification actions | P/M/O approval and source validation remain separate |
| CMS Manager / `cms_manager` | CMS/content management / `workspace.cms.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Granted content/template publication scope | No implicit IAM, catalog classification or finance grant |
| Auditor / Security Reviewer / `auditor` | Audit workspace / `workspace.audit.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Read-limited evidence/export purpose and scope | Append-only history; no business corrections or blanket patient access |
| Support (additional candidate; D-003/D-020) / `support_agent` | Support workspace / `workspace.support.enter` | Password + authenticator proposed | Proposed staff default; D-003 approval | Approved case/organization and limited customer projections | Outside the inherited 16-role proposal; no grant until support scope approved |

The existing role master proposes 16 distinct codes. This table adds no live role: Delivery Dispatcher and Order Operations are separate permission-filtered views of the existing Ops Manager candidate, not a forced new role. Inventory Operator aliases Inventory Controller. Pharmacist aliases Licensed Pharmacist; receiving staff aliases Warehouse Staff; Security Reviewer aliases Auditor. Support is an explicit additional candidate requiring D-003/D-020, not an invented seventeenth approved role. Report viewer/exporter and notification template administration are explicit capabilities of approved scoped roles, never automatic new identities. Doctor/lab/insurance/membership roles remain future-scope decisions D-018/D-027; table existence grants no workspace.

## Authentication, authorization and navigation

All roles use one `identity.users.id`. Multiple active `identity.user_roles` rows carry role, scope and validity; role permissions are explicit allowlists. Each context uses one assignment and one workspace. The backend determines eligible panels from navigation AND action permissions; arbitrary role/panel names in a request are rejected. Menus may hide actions for usability, but every API checks authorization independently.

- **Default:** keep the current context only while valid. On a fresh session, exactly one ready choice may be a default hint; otherwise return null and a chooser. No hint authorizes entry.
- **Multiple roles:** show permitted contexts for the same identity. Customer OTP cannot unlock a privileged context; password plus authenticator is mandatory for the documented privileged roles.
- **Switching:** submit the server-issued context selector and current ETag. Recheck assignment, membership, organization/site, method freshness and policy; atomically advance session context generation.
- **Organizations/locations:** reselect an authorized context. A supplied scope UUID is only a target. Do not combine permissions from one assignment with a resource in another assignment's scope.
- **Denied panel:** return 403 `AUTH_WORKSPACE_FORBIDDEN`, no data/grant. Use privacy-safe 404 for hidden business objects.
- **Role removal:** deny the removed context at the next authoritative check after revocation commits; clear it and expose other valid choices. See the exact [consistency/locking policy](../03-Modules/Authentication_Access/Unified-Identity-Architecture.md#authorization-consistency-and-revocation).
- **Suspension/closure:** revoke sessions/proofs, block all protected business operations and reauthentication. Reopening needs the reviewed Identity process.
- **Expiry/replay:** 401 requires fresh authentication; replay revokes the refresh family. Switching old tabs fails with a context-generation conflict.
- **Step-up:** challenge only for an already granted target, bind it to session/assignment/policy, and verify missing password/TOTP proofs. A completed challenge alone does not bypass context activation.
- **No assignment:** remain in account-access state, display no business panel, allow only identity/workspace/credential/step-up/logout controls as eligible. Do not create a default staff/customer grant.

## Resource and database boundaries

Customer access is limited to owned resources and explicitly permitted dependents. Store/Warehouse access requires exact assigned site/task. Pharmacy retains reviewer/site/patient/evidence and P-line constraints; M/O-only orders skip mandatory review. Finance sees scoped money facts and approved reports, not prescriptions. Auditor is read-only; Support cannot refund, dispense or alter evidence. Notifications/Reports use narrowly scoped workloads, not human role impersonation.

Existing SQL uses null/null for global grants and supports a `warehouse` UUID scope in its stock RLS helper. Organization/location/warehouse hierarchies are validated on the backend; polymorphic scope fields are not FKs. PostgreSQL's four NOLOGIN capability groups and three RLS policies are defense in depth, separate from business-role/workspace grants. No menu, role code, membership or integer ID replaces the explicit endpoint permission/resource check.

[Machine-readable proposed policy](../03-Modules/Authentication_Access/Workspace-Access-Policy.json) · [master roles](../04-Database/Tables/identity/roles.md#master-data-planning) · [security](../07-Engineering/Security.md).
