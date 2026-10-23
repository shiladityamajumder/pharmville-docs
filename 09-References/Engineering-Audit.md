# Engineering and documentation audit

Audit date: 2026-10-23. Scope: all product documentation Markdown, the 110-feature inventory, 18 module groups, 14 workflow files, and the available database source and schema catalog. This is a static review; no deployed service or live database was accessed. Findings below describe the state before corrections; the disposition section records subsequent changes.

## Critical

No Critical defect in an implemented service was established: application source and a running application are absent. The High findings below block treating the affected documents as approved implementation contracts.

## High

| ID | Exact location and section | Finding and effect | Required action |
| --- | --- | --- | --- |
| H-01 | [Authentication API](../05-APIs/Authentication_Access.md), API-089–API-091; [identity workflow](../06-Workflows/WF-001-Identity-and-Session.md), Preconditions | Login, MFA completion, and refresh inherit an authenticated-session requirement. Login payload contains no credentials. This prevents a valid pre-login flow. | State credential/challenge/refresh-token trust separately and remove generic session examples. |
| H-02 | [Finance API](../05-APIs/Finance_Payments.md), API-076 Caller and HTTP request | Cashfree webhook inherits a bearer-session requirement and a generic request body. A provider callback needs provider authentication and raw-body verification, not a customer session. | Define signature, deduplication, commit/acknowledgement, out-of-order handling, and reconciliation boundaries. |
| H-03 | [API index](../05-APIs/README.md), Shared API standards; module API files, HTTP request contract and Success response | Most contracts use the same request_id/version/reason body and generic accepted response for unrelated operations. The index claims a degree of completeness the schemas do not provide. | Remove misleading executable examples, label unresolved schemas accurately, and require operation-specific contracts before affected implementation. |
| H-04 | [Traceability](Coverage-and-Traceability.md), Mapping status; [Testing](../07-Engineering/Testing.md), module scenarios; module Edge-Cases.md tables | All 110 IDs have navigation links, but 24 initially lacked a direct same-owner API reference. Generic edge and test rows repeat unrelated failure behavior. Mere ID mentions do not verify coverage. | Publish measured feature-level evidence and explicit gaps; do not count generic rows as complete coverage. |
| H-05 | [Customer LLD](../03-Modules/Customer_Accounts/LLD.md), ACC-01 Flow, ACC-02 validation and Data mapping; [Customer API](../05-APIs/Customer_Accounts.md), OTP and profile | New signup says to create a profile although first_name is required and absent from OTP input. Contact-change text assumes pending-contact storage not defined in the schema. Two table versions are represented as a single profile version. | Separate identity/session creation from profile completion; preserve verified contacts until an approved verification flow; check both row versions when updating both records. |
| H-06 | [Migration evidence](../04-Database/Migrations.md), Source of truth; [Decisions](Sources-and-Decisions.md), Confirmed facts; [database table pages](../04-Database/Tables/README.md), introductory text | Documents assert no Git metadata and attribute a specific V0030 removal to the current task without available supporting evidence. These claims can cause a developer to select an incorrect migration baseline. | Describe only the available SQL directory and repository state; distinguish local evidence from deployment history. |
| H-07 | [System HLD](../02-Architecture/System-HLD.md), Decided technology direction and Growth; [Decisions](Sources-and-Decisions.md), Proposed decisions | Technology direction is called both accepted and proposed. Module read candidates are not table write ownership. Clinical, stock and money policies remain unapproved. | Use consistent proposed status and connect unresolved ownership/policy to a central decision with an owner and blocked action. |

## Medium

| ID | Exact location and section | Finding | Required action |
| --- | --- | --- | --- |
| M-01 | Database table pages, Existing constraints / Existing indexes; module design/API tables | 2,628 detected table starts lack an adjacent separator; blank lines split headers from rows. Tables often render as plain text. | Repair separator rows without changing cell content. |
| M-02 | [Testing](../07-Engineering/Testing.md), Current evidence; [Setup](../07-Engineering/Development-Setup-and-Operations.md), Verified repo; [Models](../04-Database/Models-and-Parity.md), Source | Old ZIP names and document-generation language remain. | Replace with clean repository links and accurate evidence wording. |
| M-03 | [Customer HLD](../03-Modules/Customer_Accounts/HLD.md), Developer navigation; other module README/HLD/LLD pages | Many navigation labels are plain text; pseudo-links such as API_Conventions and Error_Handling are not resolvable documents. Repeated headings and prose add little detail. | Link existing shared references; preserve useful content. |
| M-04 | [Workflows](../06-Workflows/README.md), individual workflow Normal path / Sequence sections | Workflow diagrams and normal steps reuse one template; policy/retry numbers and detailed compensation contracts are incomplete. | Treat diagrams as orchestration sketches; require named owner, command outcome and recovery test for each affected vertical slice. |

## Low

| ID | Location | Finding | Action |
| --- | --- | --- | --- |
| L-01 | API files, Requirement links | Repeated phrase “documented draft requirements and the documented draft requirements”. | Replace with one link to the feature inventory. |
| L-02 | Throughout consolidated files | Acronyms such as IDOR and DTO are used without consistent explanations; redundant adjacent headings reduce scanning. | Expand terms in shared engineering guidance and avoid adding more duplicate sections. |

## Database verification method

The local final table register contains 266 tables. Table-page field inventories are compared to that register; schema-qualified table and column references are scanned across all product Markdown. Source SQL and model declarations are inspected for material account and payment claims. The register is a recorded catalog, not a fresh database introspection. No database tests or migrations are executed by this audit. Numeric fields containing digits must be included by the validator (line1, line2, card_last4, account_number_last4 and sha256 are legitimate columns).

## Corrections and development readiness

H-01/H-02: corrected login, MFA, refresh and signed-provider trust boundaries and their identity/payment workflow contracts. H-05: corrected required profile-name handling, separate identity/profile concurrency tokens, and unsupported pending-contact storage assumptions. H-06: removed unsupported migration-removal and missing-Git claims throughout product documentation; retained valid local migration evidence. H-07: aligned the master architecture status as proposed and added decision recommendations, owners and blocked actions.

H-03/H-04 remain partially open: misleading generic payload examples and completeness claims were removed, but full operation schemas, explicit table write ownership and concrete per-feature failure/test specifications still require engineering work under D-024. This work cannot be resolved by a product signoff alone. The register now records a review status on each of the 110 features and lists 23 remaining direct same-owner API reference gaps after AUTH-03 was corrected. Supporting cross-module candidates are recorded separately. Do not interpret these corrections as complete feature readiness.

M-01/M-02 and clear M-03/L-01 instances were corrected: table separators/spacing, old file/provenance language, navigation links and duplicated source phrases. M-04 and L-02 remain review work where content-specific rewriting is needed. Existing structure and feature descriptions were preserved.

### Validation results

- 429 Markdown files scanned; each has one H1; no empty files, heading-level jumps or unclosed fences detected.
- Relative file paths and heading anchors checked by a local static validator: no detected broken targets. Anchor checking uses a GitHub-style slug approximation, not a renderer.
- Markdown table header separators and row widths checked after repair: no detected errors. Initially 2,628 table starts lacked an adjacent separator; this count included detached fragments within the same intended table.
- All 266 table-page field inventories match the available final table register, including field names containing digits. No missing explicitly backticked schema-qualified table or column references detected. Prose semantics and a live deployed schema are not proven by this check.
- The 110 original feature IDs remain unique and all appear in the register, HLD, LLD, edge-case and testing artifacts. API mentions in owning module documents: 87/110. Mention counts do not establish completeness.
- 51 Mermaid fences checked for closure and manually reviewed for obvious structural issues in changed diagrams. Mermaid CLI and Markdown lint executables were unavailable; full Mermaid parsing/rendering was not performed.
- Database file hashes compared before/after: no changes. No application, migration, ORM, database execution or provider test changes.

### Development readiness

Ready for architecture review, isolated infrastructure and explicitly approved exploratory slices. Full feature development is blocked where D-024 contracts remain incomplete. Clinical, stock, financial, consent and security flows also require the specific decisions D-003–D-013, provider evidence D-016 and contact-change decision D-023. No feature is certified fully implementable by navigation or historical database tests alone.

See [Sources and decisions](Sources-and-Decisions.md) for recommendations and owners and [traceability](Coverage-and-Traceability.md) for each feature's current evidence and gaps.
