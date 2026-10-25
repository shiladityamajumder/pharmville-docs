# Architecture and API planning validation

> [!NOTE]
> The dated results below are historical architecture-rework evidence. Current unified-authentication validation is recorded in [Unified Authentication Validation](../09-References/Unified-Authentication-Validation.md).

**Executed checks: 24 October 2026.** Tests of application/provider/production behavior remain Designed / NOT RUN. Historical validation narratives are retained under [Historical](../09-References/Historical/README.md).

| Check | Evidence / result |
| --- | --- |
| Source-chain reconstruction versus standalone install | PASS: 30 source migrations applied privately; zero differences across 23 effective catalog dimensions. |
| Independent clean PostgreSQL cluster | PASS: SQL-only install creates capabilities from scratch; zero catalog differences, 266 tables empty. |
| SQL/table documentation parity | PASS: 266 table pages, all 4,438 columns/types/defaults/nullability, constraints/indexes/triggers and named NOT NULL constraints. |
| Historical final register versus effective catalog | PASS: zero differences across columns, keys/checks, indexes and triggers. |
| ERD generation/consistency | PASS: 24 schemas, 42 ER diagrams and all 1,461 physical FK labels/catalog rows. |
| API structural validator, strict | PASS: 107 operations, 107 unique operationIds, 62/62 typed body DTOs/examples and 104 JSON success DTOs/examples; three bodyless 204 results. |
| OpenAPI 3.1 formal validator and JSON Schema 2020-12 examples | PASS: zero errors; 1,828 schema/example validations, 3,606 column uses and 300 DTO-column annotations checked. |
| Module/feature/inventory/protected-wireframe check | PASS: 18 modules, 110 features, all 107 API identities, all 266 table owners, 44 masters, 70 compatibility targets and 46 protected files unchanged. |
| Markdown/links/anchors/tables and actual Mermaid | PASS: 679 Markdown pages and all relative links/anchors/tables; all 97 Mermaid diagrams parsed and rendered. |
| Validator negative-fixture regression checks | PASS: documentation malformed-fixture regression and canonical SQL/catalog tamper tests. |
| Git boundaries and whitespace | PASS: final diff inspected; whitespace clean; root and nested source Git revisions unchanged; no commit/push. |

[Machine-readable API proof](../09-References/API-Contract-Validation-Result.json), [database proof](../09-References/Database-Parity-Result.json) and [execution ledger](../09-References/Architecture-Rework-Plan.md) distinguish results from remaining gates. Formal API validation used `openapi-spec-validator` 0.9.0 and `jsonschema` 4.26 with temporary validation tools; project/application dependencies were not changed. Repository commands use the available Node 22.23.4 binary; Node 24 remains the recommended development version. Actual Mermaid parsing requires a local Chromium browser.

## Completeness and limits

**97/107 = 90.65%** documentation-complete proposals; **10** conceptual contract gaps; **0/107 = 0%** approved. A structural validator passing does not close missing provider contracts, persistence or action-to-state mapping. No production database, application server, provider sandbox or product tests were executed. The database checks used only newly created disposable clusters and synthetic empty databases, with TCP disabled and no `.env` credentials.

P/M/O, patient/evidence/revision binding, explicit revised-basket acceptance, one-site allocation, exact lot/license gates, trusted payment evidence, mandatory RID-04 OTP plus photo, REP-07 Excel `.xlsx` and owned invoice JSON/PDF behavior remain intact. Deferred Rx timing and external legal/clinical/financial policy remain pending named owner decisions.
