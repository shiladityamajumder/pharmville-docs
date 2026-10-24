# API and master-data planning validation

Validation evidence for the 2026-10-24 planning revision. All application scenarios remain **Designed / NOT RUN**; no implementation, migration, seed, commit or deployment is claimed.

## Executed checks

| Check | Result and evidence |
| --- | --- |
| OpenAPI 3.1 conformance | PASS: `OpenAPIV31SpecValidator` (openapi-spec-validator 0.9.0), zero meta-schema errors. Tooling was isolated under `/tmp`; repository dependencies were unchanged. |
| JSON Schema examples and Markdown synchronization | PASS: 1,828 example/default checks with JSON Schema Draft 2020-12 and format validation, including request/success/error JSON in Markdown, OpenAPI examples and parameters. No schema/example mismatches. |
| API inventory preservation | PASS: exact method/path/operationId/API-ID comparison against the starting specification: 107 unchanged operations, 97 historical IDs and ten account references. No new operation promoted; 16 journey command candidates remain outside the inventory. |
| Repository API validator | PASS: `npm run validate:api -- --strict`; 62/62 typed body schemas and request examples, 104 concrete JSON-success DTOs/examples, three bodyless 204 responses; zero structural incompleteness findings. The ten explicit contract exclusions remain excluded from planning completeness. |
| Documented columns and mappings | PASS: 2,873 operation column uses and 300 declared schema column mappings checked against the checked-in table pages; nonexistent columns/public BIGINT projections rejected. Referenced master pages exist. This does not establish live SQL parity. |
| Authentication/authorization declarations | PASS: every operation has explicit security, mechanism, permission, owner and separate documentation/approval/implementation statuses. Public OTP/login/MFA, body-credential refresh and signed-provider paths do not require bearer JWT; the three internal routes require service identity. Cashfree signature details remain incomplete, not invented. |
| Feature/master coverage | PASS: all 110 feature IDs accounted for, all 266 tables classified, 44 master plans, eleven explicit initial-value lists and 33 Open owner datasets. Missing commands and incomplete contracts are labeled separately from textual references. |
| Markdown, links and Mermaid in planning review copy | PASS: repository `npm run validate` against an isolated copy of tracked planning files plus the five new planning documents: 530 Markdown files, 15,700 relative links, 2,979 tables, all 96 Mermaid blocks parsed, zero link/feature/test-reference errors. The final repeat check also reports zero errors. |
| Full workspace documentation validator | FAIL outside planning scope: all 96 diagrams parsed, but the untracked `heathcare_db/` copy has four errors: missing/skipped H1 in its PostgreSQL README and two empty Python init files. Those supplied source files were preserved. The isolated planning check excludes that untracked copy. |
| Validator regression smoke test | PASS: `npm run test:validator`; real negative fixtures rejected malformed links, headings, tables, fences and Mermaid. Its fixture was removed before the full check. |
| Database source verifier tests | PASS: `npm run test:database-source`, 13 source-selection/identity/tamper/missing-file checks; no SQL executed. |
| ERD consistency | PASS: `npm run validate:erd`, 24 schemas, 42 diagrams and 1,461 diagram FK labels/catalog rows. |
| Current authoritative database source | UNAVAILABLE: `npm run validate:database` exits 2 because selected `healthcare_db/` is absent. The similarly named untracked `heathcare_db/` catalog hash differs and 26 recorded SQL files have mismatched hashes, so it was not substituted as authority. |
| Git boundaries and whitespace | Reviewed: only planning Markdown/OpenAPI changed by this task; the pre-existing package-lock diff and untracked database copy were preserved. `git diff --check` passed after formatting. No application/migration/seed/dependency/validator code changed; no commit or push. |

Node 22.23.4 was available for the executed repository checks; the repository still recommends Node 24. The sandbox blocked the browser/child processes, so the local documentation browser and validator smoke test ran with reviewed execution outside the sandbox. No application server, provider sandbox or database was executed. Rendered image review was not repeated because no diagrams changed; actual Mermaid parsing did run.

## Planning measures and limits

Documentation-complete proposals: **97/107 = 90.65%**. Approved contracts: **0/107 = 0%**. Implemented Pharmville routes and executed application contract tests: **0**. The structural API validator cannot establish business approval or detect every conceptual blocker; the ten exclusions in the coverage ledger remain the semantic planning gaps.

The reviewed invariants retain P-only pharmacist review for P, P+M, P+O and P+M+O; M, O and M+O skip that review. Unknown classification blocks checkout. Current patient/evidence/revision binding, explicit revised-basket acceptance, one-site allocation, exact eligible stock, trusted provider money evidence, mandatory recipient OTP/photo, Excel report export and authenticated invoice download remain explicit. Deferred RX-02 timing and regulated/financial values were not invented.

Pending production evidence includes provider wire/signature/acknowledgment, reviewed role grants and MFA replay, contact proof, stock authority/freshness, COD/deposit/refund policies, clinical/legal/tax master sources, retention and target runtime owner grants/guards. See the linked decision register; documentation checks do not close these approvals.

[Coverage](API-Contract-Coverage.md) · [decisions](Planning-Decisions.md) · [master inventory](../04-Database/Master-Data-Inventory.md).
