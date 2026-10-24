# Engineering and architecture audit

**Review: 24 October 2026.** Scope: effective PostgreSQL reconstruction, all 266 table references, 18 module blueprints, 110 stable features, 107 existing API operations, 14 workflows and protected wireframe preservation. This review validates planning and isolated SQL structure; application/provider/production behavior remains unverified.

## Resolved findings

| Finding | Evidence and result |
| --- | --- |
| Legacy baseline was not the effective schema | V0001–V0030 replayed in private PostgreSQL; effective DDL extracted and independently installed, zero catalog differences. |
| Final deliverable mixed models, migrations and tools | `pharmville-database/` contains one schema-only SQL file. Both original nested checkout and verified copy remain private outside the deliverable. |
| Unclear schema authority/provenance | Canonical SQL, derived full catalog/table register, exact checksums and executed parity evidence now agree. Previous source-name/Git assertions are archived. |
| Supporting security/database objects were scattered | All functions, sequences, role capability attributes, grants/default privileges, RLS, indexes, keys and enabled triggers are cataloged. |
| Module documents and contracts were dispersed | Canonical descriptive module directories hold domain plans and full API contracts. Shared conventions/orchestration remain central; old anchors/paths forward without changing wireframes. |
| Traceability stopped at feature mentions | Every feature links business/module/workflow/API-or-gap/database/tests/existing task; all tables have a proposed writer or an explicitly named future-owner decision. |
| Scope could be inferred from future tables | Capability matrix records MVP/Phase 2/Future/Requires Decision; no extra competitor/regulatory rules or APIs were approved. |

## Remaining implementation gates

- D-003/D-023: reviewed staff MFA replay/session behavior and replacement-contact proof/storage.
- D-004/D-008/D-016: provider request/callback wire contracts, money action transitions and reconciliation rules.
- D-005/D-019/D-024: authoritative POS input/reconciliation, imports and exact incomplete contracts.
- D-006/D-009/D-010/D-011/D-012/D-013: clinical, lot/site, substitution/fulfillment, POD/privacy, tax and retention policy owner signoff.
- D-015/D-017/D-022: actual runtime login memberships/permissions, application data-access parity, CI/restore/load/security and operational release evidence.
- D-027: Product and domain leads must accept phase/accountability for preserved future domains.

No schema/table access is treated as business write permission. No contract is Approved or Implemented from documentation alone. The ten incomplete APIs remain excluded from the 90.65% completeness numerator. Actual application, provider and security behavior requires separate execution evidence.

[Coverage](Coverage-Report.md) · [reconciliation](../04-Database/Reconciliation.md) · [API decisions](../05-APIs/Planning-Decisions.md) · [full decision register](Sources-and-Decisions.md) · [validation](../05-APIs/Planning-Validation.md). Previous audit prose remains intact under [Historical](Historical/README.md).
