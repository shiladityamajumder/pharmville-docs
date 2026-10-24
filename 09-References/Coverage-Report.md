# Documentation coverage and evidence

## Feature and module evidence

The [feature inventory](../01-Project/Features-and-Modules.md) retains **110** stable IDs in **18** module groups. [The primary module index](../03-Modules/README.md) now leads to business flows, HLD, LLD, endpoint contracts, database usage, workflow/security/test navigation, edge cases and pending decisions. Canonical paths are descriptive; stable IDs remain unchanged. Compatibility targets preserve prior paths and anchors.

[Requirement-to-delivery traceability](Feature-Delivery-Traceability.md) connects each feature to module workflows, actual API references where present, exact table dependencies, designed tests and existing TASK IDs. Cross-module [14 workflows](../06-Workflows/README.md) remain central. Textual reference coverage is distinct from working end-to-end journeys.

## API planning

The denominator remains **107 operations**, with no new operation added or removed. **97/107 (90.65%)** have documentation-complete proposed contracts; **10/107** remain semantically incomplete. **0/107 (0%)** are approved; no application implementation or application test success is claimed. All detailed bodies/errors/headers/mappings/examples remain in the canonical module documents and synchronized OpenAPI. [Coverage ledger](../05-APIs/API-Contract-Coverage.md) names each incomplete operation. [16 candidate journey-command groups](../05-APIs/Journey-API-Gaps.md) remain outside the denominator and unapproved.

The independent OpenAPI 3.1/JSON Schema audit passed: **1,828 schema/example validations**, **3,606 exact operation-column uses**, **300 DTO database-column annotations**, zero errors. Structural schema checks can pass while a conceptual/provider contract remains incomplete.

## Database evidence

[Standalone SQL](../pharmville-database/pharmville_schema.sql) is authoritative effective structure through V0030. Executed source replay and separate empty installation agree across **23 catalog dimensions, zero structural differences**. A third independent disposable cluster verified creation of capability roles from scratch and **zero rows in all 266 tables**. No existing database was connected to or modified.

The complete reference accounts for 24 schemas, 266 tables, 4,438 columns, 1,461 FKs, 1,204 indexes, 56 functions, 879 user triggers, 265 identity sequences, three RLS policies, 3,198 key/check constraints and 2,929 NOT NULL constraints. Table-page/catalog parity is verified in both directions; [reconciliation](../04-Database/Reconciliation.md) records zero differences from the historical final register.

All **44 masters** preserve lifecycle/stewardship planning. **11** have explicit confirmed/proposed initial-value lists; **33** await real owner datasets. Confirmed domain/source evidence is separate from proposed values and observed production data. No seed rows are shipped.

## Limits and unresolved gates

Provider wire/signature/acknowledgment, staff MFA/replay design, replacement-contact proof, import persistence/row atomicity, POS evidence and delivery failure progression remain named contract gaps. Clinical/financial/tax/privacy policy, runtime memberships, real master datasets, application/provider execution and release readiness require owner evidence. Future physical domains retain every object and are **Requires Decision / D-027** for ownership/phase; they are not approved launch capabilities.

The earlier missing-source and untracked-copy reports are superseded by inspected legacy history and isolated reconstruction. Their full text is preserved as historical `.txt` evidence under [Historical](Historical/README.md). [Current validation](../05-APIs/Planning-Validation.md) and [execution ledger](Architecture-Rework-Plan.md) record current results.
