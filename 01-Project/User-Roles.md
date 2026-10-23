# User roles and access

## Proposed Role Module Matrix

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

## Roles and Permissions

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
