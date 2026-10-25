# Unified authentication rework — validation and review record

**Checked 2026-10-25. Architecture and APIs: Proposed / Unapproved / Not Implemented.** No application, provider or production authentication tests ran. No commit, push, dependency installation or persistent database modification was performed.

## Architecture and access

One identity in identity.users supports multiple assignments, one shared credential/session service and backend-authorized workspace contexts. [Canonical architecture](../03-Modules/Authentication_Access/Unified-Identity-Architecture.md) defines live revocation consistency, method-specific assurance, context switching, credential replay handling and recovery. [Role/workspace matrix](../01-Project/User-Roles.md) covers the 16 inherited role codes plus a separate Support candidate; navigation defaults grant no permissions. Customer/Rider OTP and required privileged password/authenticator remain preserved.

## APIs and planning evidence

| Measure | Before this rework | Current |
| --- | --- | --- |
| Preserved existing operations | 107 | 107 |
| Explicit new unified Identity proposals | 0 | 15 (API-098–112) |
| Documentation-complete proposed contracts | 97 / 107 (90.65%) | 114 / 122 (93.44%) |
| Original cohort complete proposed | 97 / 107 | 99 / 107 (92.52%) |
| Remaining incomplete contracts | 10 | 8 |
| Approved contracts | 0 / 107 | 0 / 122 (0%) |
| Application implementations / executed application contract tests | 0 | 0 |

Updated API-001/002, API-033/034 and API-089–093 preserve IDs, methods, paths and existing DTO compatibility while delegating to shared Identity commands. New API-098–107 cover common proofs, identity, workspaces, context, step-up, factors and credentials; API-108–112 cover existing role/assignment administration including version reads. No runtime endpoint is deprecated. [Compatibility](../03-Modules/Authentication_Access/API-Compatibility.md) records behavior/client rollout impact. [Coverage ledger](../05-APIs/API-Contract-Coverage.md) excludes API-004, API-015, API-051, API-066, API-075, API-076, API-079 and API-080. All 110 feature IDs and 18 modules remain.

## Database evidence

[Current PostgreSQL report](Unified-Authentication-Database-Validation.json) records PostgreSQL 18.6, private Unix socket with TCP disabled, baseline verification and two independent fresh installations of current SQL. Across **23 catalog dimensions**: zero baseline inconsistencies, zero fresh-install differences, zero removed objects and zero unexplained changes. Seven synthetic rolled-back guard checks passed: cross-user active assignment, context generation rollback, TOTP counter rollback, TOTP counter clearing, cross-user challenge session, cross-session refresh parent and duplicate refresh child. These are database checks, not application authentication tests. All **268 tables were empty** afterward; private cluster stopped.

Current structure: **24 schemas; 268 tables; 4,485 columns; 1,476 FKs; 1,222 indexes; 58 functions; 883 user triggers; 267 sequences; 3 RLS policies; 3,241 key/check constraints; 2,951 named NOT NULL constraints**. Existing four NOLOGIN capability roles, 24 grants and default ACL are preserved. The additive D-028 proposal introduces two transactional security tables, session assurance/context fields, factor replay counter, ownership FKs and monotonic guards. [Assessment](../04-Database/Identity-Authentication-Assessment.md) identifies service-enforced checks and unresolved policies. Master tables remain **44**, with 11 explicit confirmed/proposed datasets and 33 Open; navigation/IAM permission values and Support are proposals, not seeds.

## Documentation checks

- Strict API structural/example validator: PASS, 122 operations, 73 typed request schemas/examples, 119 JSON success DTOs/examples; three bodyless 204 operations. The validator now checks anyOf, exact oneOf, conditional/forbidden shapes, string/array/numeric bounds and UUID/date formats used by these contracts.
- Markdown/OpenAPI example synchronization: PASS, 314 JSON blocks parsed and checked against the declared schema subset; success/request payloads match their OpenAPI examples.
- SQL/table documentation: PASS, all 268 pages / 4,485 columns, exact keys/checks/indexes/triggers/NOT NULL definitions and supporting objects.
- ERD catalog: PASS, 24 schemas, 42 diagrams, 1,476 FK labels/catalog rows, preserved historical FK identifiers.
- Markdown/links/anchors/tables and real Mermaid rendering: PASS, 677 pages and all 98 diagrams parsed/rendered.
- Validator negative fixtures: PASS; malformed headings/links/tables/fences/Mermaid rejected. SQL source manifest negative fixtures: PASS; unexpected files, missing sources and SQL/catalog drift rejected.
- DTO shape checks: PASS, eight invalid selector/proof/scope/enrollment/empty-update shapes rejected and four valid shapes accepted by the supported schema subset.
- Module/feature/ownership/protected-byte audit: PASS, 18 modules, 110 features, 122 operations, 268 classified/owned tables, 44 masters, 62 retained compatibility targets and all 46 protected files unchanged. Git diff whitespace check passed; package/dependency manifests are unchanged.

**Formal OpenAPI 3.1 meta-schema and full Draft 2020-12 validation are incomplete.** The optional openapi_spec_validator and jsonschema packages are absent. The existing independent command exits at import; no dependencies were installed. Structural checks and the supported schema/example subset pass, but they are not claimed as a formal specification validation. Historical full-validator results elsewhere predate D-028 and do not validate this extension.

## Cleanup and review decisions

[Cleanup evidence](Unified-Authentication-Cleanup.json) records eight removed compatibility-only files: README/HLD/LLD from Authentication_Access and Customer_Accounts, plus their old shared API wrapper files. They contained only links/anchors and had no required incoming links, script path dependencies or protected prototype references. Both old Edge-Cases.md wrappers remain because wireframes reference them. Canonical content and database tables were retained.

D-003 (security policy, budgets, staff-default change, first enrollment and assisted factor-loss recovery), D-023 (contact replacement), D-024 (per-contract ownership/runtime grants) and new D-028 (unified context/persistence/API design) remain **Open**. Support and proposed navigation grants need the relevant owner review. No new clinical, financial or P/M/O rule is introduced.

## Remaining journey boundaries

The first customer profile/name/consent completion branch remains JAPI-15 / API-004 and requires approval; OTP proof itself does not complete onboarding or manufacture a workspace. Assisted authenticator-loss recovery remains a Security-owned blocked procedure. JAPI-11 is now the explicit API-108/111 proposal; the other 15 historical journey candidates remain unpromoted. These dependencies are not counted as implemented or silently closed.

## Reproduce structural verification

Run existing `npm run validate:api -- --strict`, `npm run validate:database`, `npm run validate:blueprint`, `npm run validate:erd`, `npm run validate:render`, `npm run test:validator` and `npm run test:database-source`. Browser checks and PostgreSQL process creation require the local sandbox permission where restricted. For the additive SQL comparison, save schema/catalog from baseline commit `131fa3d8041e9eb9ab965447f7296cd00baad9a8` to private temporary files and supply both file paths to `node scripts/unified-auth-database.mjs BASELINE_SQL BASELINE_CATALOG`; it accepts no existing database connection. Formal `python3 scripts/validate-openapi.py` additionally requires its absent optional validation packages; it has not passed on this revision.
