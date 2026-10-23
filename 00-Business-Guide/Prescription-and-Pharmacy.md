# Prescription and pharmacy

**Status:** Intended behavior from the existing draft design; pending approvals are listed below. This is not evidence of a running product.

## What is this process?

Prescription review checks supply of P medicines against suitable evidence for the right patient. Uploading a file starts review; it is not approval to dispense.

## Who is involved?

The customer or authorized family-account holder, authorized pharmacists, pharmacy operations and support.

## How does it normally work?

1. For P medicines the customer chooses the patient and uploads JPG, PNG or PDF prescriptions. M/O-only baskets skip upload and review.
2. Pharmville checks that the private upload is complete and safe to open. Only permitted customers and reviewers can access it.
3. The pharmacist opens the waiting queue and compares each P line with the patient, prescription, exact product, strength, form and quantity.
4. The pharmacist approves lines or records correction/rejection reasons. Reviewer identity, registration and decision time are retained.
5. The customer sees the reason and can upload again, remove affected items or contact support. Changed evidence or a changed medicine requires current review.
6. If some lines are rejected, the customer accepts a revised basket and total before payment. Eligible M/O lines are not automatically rejected. Saved-prescription reuse needs fresh validity and patient checks.

## What happens next?

Approved remaining lines return to [checkout](Cart-and-Checkout.md). Staff recheck current evidence before packing.

## What can go wrong, and what does the system do?

### The file is unclear, unsafe or incomplete

A poor photo, failed scan or interrupted upload can prevent review. Pharmville keeps it unavailable for approval and requests replacement or retry. Support resolves technical problems, the customer corrects evidence, and P lines stay held.

### The patient or medicine does not match

A wrong family file or strength can cause rejection. Pharmville requests correction without exposing other patients. Only the pharmacist makes the clinical decision; customer/support cannot override it. Unaffected eligible lines wait for an accepted revision.

### No pharmacist is available

A shift gap or backlog delays review. P lines remain waiting, with an honest review status. Pharmacy operations find an authorized reviewer; no timeout creates automatic approval.

### Reviewers race or the order changes

Two reviewers may read an old basket. Only a current evidence/version decision takes effect; stale reviewers reload. Decision history remains, and stale approval cannot unlock payment or packing.

### The customer wants to upload later

RX-02 proposes a 24-hour window and auto-cancellation; the detailed journey requires review before payment. Product, Finance and Pharmacy must approve the deferred route, stock treatment and refund consequences. Until then staff must not promise that timer or charge through an invented route.

## What does the user see?

Customers see waiting review, the pharmacist’s decision/reason and upload/correction or revision choices. Pharmacists see scoped patient evidence and current P lines.

## What still needs approval?

D-004 (payment), D-006 (clinical rules), D-010 (partial approval), D-013 (privacy); RX-02 deferred upload is disputed. The [decision register](../09-References/Sources-and-Decisions.md#open-decisions) names owners and blocked actions.

## Related technical documentation

[System HLD](../02-Architecture/System-HLD.md) · [feature register](../09-References/Coverage-and-Traceability.md) · [testing](../07-Engineering/Testing.md) · [development tasks](../08-Development-Plan/Implementation-Plan.md)

| Module | Architecture | Implementation | API | Data | Edge cases and tests |
| --- | --- | --- | --- | --- | --- |
| Prescription Upload | [HLD](../03-Modules/Prescription_Upload/HLD.md) | [LLD](../03-Modules/Prescription_Upload/LLD.md) | [API](../05-APIs/Prescription_Upload.md) | [Mapping](../04-Database/Module-Mapping.md#prescription-upload) | [Cases](../03-Modules/Prescription_Upload/Edge-Cases.md) |
| Pharmacist Review | [HLD](../03-Modules/Pharmacist_Review/HLD.md) | [LLD](../03-Modules/Pharmacist_Review/LLD.md) | [API](../05-APIs/Pharmacist_Review.md) | [Mapping](../04-Database/Module-Mapping.md#pharmacist-review) | [Cases](../03-Modules/Pharmacist_Review/Edge-Cases.md) |

Technical workflows: [WF-004](../06-Workflows/WF-004-Prescription-Intake-and-Review.md).

Feature references: `RX-01`, `RX-02`, `RX-03`, `RX-04`, `RX-05`, `PHM-01`, `PHM-02`, `PHM-03`, `PHM-04`, `PHM-05`.

[Business Guide](README.md) · [Complete journey](Pharmville-Complete-Business-Flow.md)
