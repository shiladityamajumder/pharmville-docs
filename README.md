# Pharmville

Product and engineering documentation for a location-aware pharmacy commerce platform: discover health products, review prescriptions where required, fulfill from eligible stock, deliver through assigned riders and reconcile money.

Pharmville connects a customer web experience, protected staff/admin workspaces and a proposed rider Android app. Its 18 draft module groups cover accounts, catalog, checkout, prescriptions, orders, stores/warehouse, inventory, delivery, payments, reporting, audit, access and notifications.

## Choose your starting point

- **Business owners:** read [the complete business flow](00-Business-Guide/Pharmville-Complete-Business-Flow.md), then the domain guides for normal work, exceptions and responsible teams.
- **Product and QA:** use [requirements](01-Project/Requirements-and-Scope.md), the [feature register](09-References/Coverage-and-Traceability.md) and feature-specific failure assertions.
- **Developers:** start with HLD, ownership/recovery contracts and the relevant module LLD.

| Area | Purpose | Document |
| --- | --- | --- |
| 📘 Business Guide | Understand people, steps, problems and recovery | [Business Guide](00-Business-Guide/README.md) |
| 🏗️ HLD | Understand components, trust and boundaries | [System architecture](02-Architecture/System-HLD.md) |
| ⚙️ LLD | Review module responsibilities and implementation | [Module designs](03-Modules/README.md) |
| 🗄️ Database | Inspect validated schema, ownership and parity evidence | [Database reference](04-Database/README.md) |
| 🔗 APIs | Review proposed operations and remaining contract gaps | [API contracts](05-APIs/README.md) |
| 🧪 Testing | Follow normal, adverse and recovery assertions | [Testing strategy](07-Engineering/Testing.md) |
| 📋 Requirements | Find stable feature IDs and scope | [Features and modules](01-Project/Features-and-Modules.md) |
| 🔄 Technical workflows | Follow cross-module orchestration | [14 workflows](06-Workflows/README.md) |
| 🔐 Security and reliability | Review permissions, transactions and recovery | [Engineering](07-Engineering/README.md) |
| 🗓️ Development | Turn reviewed requirements into delivery slices | [Implementation plan](08-Development-Plan/Implementation-Plan.md) |

<!-- ERD-INDEX-LINK -->
**Database ER diagrams:** [browse the verified domain maps and complete FK catalog](04-Database/ER-Diagrams/README.md). The diagrams derive from the validated standalone SQL/catalog; all 1,476 physical foreign keys are accounted for.

## Product flow

The current detailed journey records a request, reviews P medicines, obtains customer acceptance of any revision, secures eligible stock and proceeds to payment. M/O-only baskets skip prescription review. Deferred upload and payment capture details remain owner decisions.

A request, a confirmed payment and a dispatched parcel are different milestones; the [business flow](00-Business-Guide/Pharmville-Complete-Business-Flow.md) explains the branches and failures.

## Documentation status

The repository retains **110 draft feature IDs, 18 module groups and 14 technical workflows**. Business approval, proposed design, inspected database evidence and executed product tests are separate statuses. Feature-specific tests are **Designed / NOT RUN**; the [coverage report](09-References/Coverage-Report.md) records measured documentation results and remaining gaps.

The [standalone SQL](pharmville-database/pharmville_schema.sql) installs the effective V0030 structure plus the explicit Proposed / Unapproved D-028 unified-Identity extension without historical tooling. Isolated PostgreSQL 18.6 comparisons found zero differences across 23 catalog dimensions. All 268 table pages match the validated catalog. The original sources, local files and nested Git history remain private and intact outside this deliverable. [Installation](04-Database/Installation.md) separates empty-schema setup from runtime provisioning and approved bootstrap data.

## Detailed API and master-data blueprint

[API planning coverage](05-APIs/API-Contract-Coverage.md) records 114/122 documentation-complete proposals (93.44%), 8 incomplete and 0 approved; all original 107 operations are preserved and 15 additions are explicit Identity proposals. The [API/database/feature matrix](05-APIs/API-Database-Feature-Matrix.md), [master inventory](04-Database/Master-Data-Inventory.md), [owner decisions](05-APIs/Planning-Decisions.md) and [current authentication validation](09-References/Unified-Authentication-Validation.md) explain the build contract and remaining gaps across all modules.

## Start development and maintain documentation

1. Select a feature in the [master register](09-References/Coverage-and-Traceability.md), then read its Business Flow, HLD, LLD and edge cases.
2. Resolve the decisions affecting that slice, including exact operation schemas and [command/data ownership](07-Engineering/State-and-Recovery-Contracts.md). Use the [critical contracts](05-APIs/Critical-Operation-Contracts.md) as proposals requiring review.
3. Verify canonical SQL/catalog hashes, install only into an explicitly empty isolated database, and validate restricted runtime permissions. Follow [setup and operations](07-Engineering/Development-Setup-and-Operations.md) and attach actual test evidence to the feature task.
4. Use Node.js 24, run `npm ci`, then `npm run validate`. `npm run validate:render` also writes SVG/PNG diagrams locally. See [documentation conventions](09-References/Documentation-Conventions.md) for existing-browser setup, validator checks and CI.

Changes remain local for review. Documentation checks do not establish production clinical, financial or deployment readiness.

## 🎨 Interactive Low-Fidelity Wireframes

Explore the connected customer, staff and rider experiences through local grayscale HTML/CSS/JavaScript wireframes, including forms, role handoffs and failure scenarios. Run `node 10-Low-Fidelity-Wireframes/server.mjs`, then open `http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/`; the prototype uses synthetic browser-local data and requires no backend.

[Wireframe Explorer](10-Low-Fidelity-Wireframes/index.html) · [Screen Inventory](10-Low-Fidelity-Wireframes/documentation/Screen-Inventory.md) · [User Flows](10-Low-Fidelity-Wireframes/documentation/User-Flows.md) · [Edge-Case Coverage](10-Low-Fidelity-Wireframes/documentation/Edge-Case-Coverage.md) · [Local Preview Instructions](10-Low-Fidelity-Wireframes/documentation/How-to-Run.md)

## Repository blueprint

```text
00-Business-Guide/        Overall business journey and shared actor context
01-Project/              Stable requirements and phased capability decisions
02-Architecture/         System, module boundaries and interactions
03-Modules/              18 canonical business-module blueprints
04-Database/             Catalog, 268 table references, masters and parity
05-APIs/                 Shared conventions, OpenAPI, coverage and indexes
06-Workflows/            14 cross-module orchestration contracts
07-Engineering/          Security, testing, reliability and operations
08-Development-Plan/     Existing implementation task IDs and sequencing
09-References/           Decisions, traceability, execution evidence
10-Low-Fidelity-Wireframes/  Protected; byte-for-byte preserved
pharmville-database/     pharmville_schema.sql only
scripts/                Documentation/catalog generation and validation
```

Use [the module index](03-Modules/README.md) as the primary module source. Compatibility pages preserve old paths/anchors. [Capability scope](01-Project/Capability-Scope.md), [module ownership](02-Architecture/Module-Boundaries.md) and [requirement-to-delivery trace](09-References/Feature-Delivery-Traceability.md) identify what to build, who owns it and which decisions remain open. [Execution ledger](09-References/Architecture-Rework-Plan.md) records verified outcomes and remaining gates.

## Unified authentication planning

[One Identity architecture](03-Modules/Authentication_Access/Unified-Identity-Architecture.md) serves every person with multiple scoped assignments, backend-derived workspaces and step-up authentication. [Role/workspace matrix](01-Project/User-Roles.md) and [API compatibility](03-Modules/Authentication_Access/API-Compatibility.md) preserve Customer/Rider OTP and privileged password/authenticator rules. [Current review record](09-References/Unified-Authentication-Validation.md) distinguishes passed SQL/documentation checks from the unavailable formal OpenAPI validator and open D-003/D-023/D-024/D-028 decisions. No application implementation or approved grants are claimed.
