# Reporting and audit

> [!NOTE]
> **Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Reports compare sales, stock, delivery and financial exceptions. Audit history explains protected views and changes and must remain trustworthy.

## Who is involved?

Authorized owners, managers, Finance, inventory controllers, auditors and Security.

## How does it normally work?

1. The user chooses an approved report, period and permitted location. Draft reports cover sales, GST, stock/expiry, COD/riders, refunds/cancellations/failures and replenishment.
2. Pharmville shows filters and data time so a pending order or unresolved balance is not mistaken for a completed sale.
3. Authorized Excel exports include only permitted fields. Access is checked again before download.
4. Audit records retain logins, important changes, stock movement and prescription views with actor, time and safe references.
5. Auditors search/export without editing original history. Corrections add new actions rather than rewriting past evidence.

## What happens next?

Owners request Operations/Finance action. [Reconciliation](Finance-and-Reconciliation.md) resolves money differences; exports do not mutate source transactions.

## What can go wrong, and what does the system do?

### The report is old or incomplete

A failed query or lagging job produces pending/failed status or a stated data time. Reporting staff rerun safely; the owner assesses the limitation instead of treating incomplete totals as final.

### Access changes before download

A user may lose location/Finance permission while a job runs. Pharmville denies the file after a fresh check. Security/management resolves access; the export is not made public to bypass denial.

### A report requests protected clinical data

A broad query must not reveal prescriptions through ordinary sales access. Fields are limited and unapproved disclosure denied. Reporting/Security correct scope; original records are unchanged.

### Someone edits history or repeats an export

Historical audit changes are denied and investigated. Repeated export clicks refer to a preparation job/result and never reapply business actions. Users see preparation/failure status; reporting staff resolve the job.

## What does the user see?

Authorized users see report scope/data time, preparation/failure/completion and protected download access. Auditors see immutable evidence with safe actor/action references.

## What still needs approval?

D-008/D-012 (financial definitions), D-013 (export/retention), D-022 (access). The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Reporting | [HLD](../03-Modules/Reporting/HLD.md) | [LLD](../03-Modules/Reporting/LLD.md) | [API](../05-APIs/Reporting.md) | [Mapping](../04-Database/Module-Mapping.md#reporting) | [Cases](../03-Modules/Reporting/Edge-Cases.md) |
| Audit | [HLD](../03-Modules/Audit/HLD.md) | [LLD](../03-Modules/Audit/LLD.md) | [API](../05-APIs/Audit.md) | [Mapping](../04-Database/Module-Mapping.md#audit) | [Cases](../03-Modules/Audit/Edge-Cases.md) |

Technical workflows: [WF-012](../06-Workflows/WF-012-Report-Export-and-Audit.md).

Feature references: `REP-01`, `REP-02`, `REP-03`, `REP-04`, `REP-05`, `REP-06`, `REP-07`, `AUD-01`, `AUD-02`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
