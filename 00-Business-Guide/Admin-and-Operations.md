# Administration and operations

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Administration maintains people, locations, content and settings. Administrator access alone does not approve prescriptions, refunds or legal policies.

## Who is involved?

Administrators, location managers, catalog/content editors, Security, Operations, Pharmacy and Finance.

## How does it normally work?

1. Staff open role/location dashboards with relevant queues, pending prescriptions and alerts.
2. Permitted managers invite staff, assign approved roles/locations and deactivate or revoke access. Roles are not blanket authority for every action.
3. Catalog editors maintain products, categories, brands, composition, prices and approved tax references. Bulk imports provide row error reports.
4. Location staff maintain addresses, hours and service areas. License/tax data need responsible professional approval before supporting real orders.
5. Editors draft and publish banners, FAQs and policy pages with version history. Restricted settings and offers activate only after required Product/Finance/Pharmacy approvals.

## What happens next?

Published content supports discovery. Approved settings govern eligible actions; accepted orders keep their terms unless the approved revision process changes them.

## What can go wrong, and what does the system do?

### A user tries to grant themselves authority

Incorrect configuration or misuse cannot bypass server permission checks. Pharmville denies self-authorized privilege changes and retains evidence. Security/authorized management reviews access; no clinical or money permission is acquired by UI manipulation.

### An import has invalid data

Missing identifiers or unsupported codes produce specific row errors and an explicit accepted/rejected result. Catalog/Finance correct and resubmit; invalid rows are not silently published. Exact whole-file/partial import behavior remains a contract decision.

### Two editors publish conflicting drafts

Concurrent editing requires the stale editor to reload or resolve. One accepted version and its history remain; customers do not see a mixture. The editor owns correction.

### A site/setting changes during active work

Closure or a new fee can conflict with orders. Operations reviews affected tasks using approved reassignment/revision; accepted baskets are not silently repriced. Customers see an explained action/delay if their order is affected.

### A deactivated user keeps an old credential

Cached access must obey the approved revocation policy on protected requests. The staff member sees access/sign-in failure; Security verifies enforcement. Restricted work cannot continue merely because an old screen is open.

## What does the user see?

Staff see scoped dashboards, permitted controls, import row errors and draft/published versions. Customers see only published content and accepted order terms.

## What still needs approval?

D-001/D-002 (scope), D-003/D-022 (permissions), D-006/D-012 (clinical/tax data), D-019 (catalog). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Admin CMS | [HLD](../03-Modules/Admin/HLD.md) | [LLD](../03-Modules/Admin/LLD.md) | [API](../03-Modules/Admin/APIs.md) | [Mapping](../04-Database/Module-Mapping.md#admin-cms) | [Cases](../03-Modules/Admin/Edge-Cases.md) |

Technical workflows: [WF-006](../06-Workflows/WF-006-Licensed-Site-Allocation.md) · [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md) · [WF-013](../06-Workflows/WF-013-Customer-Support-Triage.md).

Feature references: `ADM-01`, `ADM-02`, `ADM-03`, `ADM-04`, `ADM-05`, `ADM-06`, `ADM-07`, `ADM-08`, `ADM-09`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
