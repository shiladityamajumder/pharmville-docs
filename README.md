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
| 🗄️ Database | Inspect available schema and migration evidence | [Database reference](04-Database/README.md) |
| 🔗 APIs | Review proposed operations and remaining contract gaps | [API contracts](05-APIs/README.md) |
| 🧪 Testing | Follow normal, adverse and recovery assertions | [Testing strategy](07-Engineering/Testing.md) |
| 📋 Requirements | Find stable feature IDs and scope | [Features and modules](01-Project/Features-and-Modules.md) |
| 🔄 Technical workflows | Follow cross-module orchestration | [14 workflows](06-Workflows/README.md) |
| 🔐 Security and reliability | Review permissions, transactions and recovery | [Engineering](07-Engineering/README.md) |
| 🗓️ Development | Turn reviewed requirements into delivery slices | [Implementation plan](08-Development-Plan/Implementation-Plan.md) |

<!-- ERD-INDEX-LINK -->
**Database ER diagrams:** [browse the verified domain maps and complete FK catalog](04-Database/ER-Diagrams/README.md). The diagrams use the catalog in the user-supplied `healthcare_db/` folder; see the migration evidence for provenance.

## Product flow

The current detailed journey records a request, reviews P medicines, obtains customer acceptance of any revision, secures eligible stock and proceeds to payment. M/O-only baskets skip prescription review. Deferred upload and payment capture details remain owner decisions.

A request, a confirmed payment and a dispatched parcel are different milestones; the [business flow](00-Business-Guide/Pharmville-Complete-Business-Flow.md) explains the branches and failures.

## Documentation status

The repository retains **110 draft feature IDs, 18 module groups and 14 technical workflows**. Business approval, proposed design, inspected database evidence and executed product tests are separate statuses. Feature-specific tests are **Designed / NOT RUN**; the [coverage report](09-References/Coverage-Report.md) records measured documentation results and remaining gaps.

The user-supplied `healthcare_db` folder is the database reference for this repository. [Migration evidence](04-Database/Migrations.md) records its verified source checksums and schema counts. Live deployment and runtime parity remain separate checks. Review [open decisions](09-References/Sources-and-Decisions.md) and the [engineering audit](09-References/Engineering-Audit.md) for remaining readiness work.

## Start development and maintain documentation

1. Select a feature in the [master register](09-References/Coverage-and-Traceability.md), then read its Business Flow, HLD, LLD and edge cases.
2. Resolve the decisions affecting that slice, including exact operation schemas and [command/data ownership](07-Engineering/State-and-Recovery-Contracts.md). Use the [critical contracts](05-APIs/Critical-Operation-Contracts.md) as proposals requiring review.
3. Verify the supplied SQL source against the target database ledger and restricted runtime permissions. Follow [setup and operations](07-Engineering/Development-Setup-and-Operations.md) and attach actual test evidence to the feature task.
4. Use Node.js 24, run `npm ci`, then `npm run validate`. `npm run validate:render` also writes SVG/PNG diagrams locally. See [documentation conventions](09-References/Documentation-Conventions.md) for existing-browser setup, validator checks and CI.

Changes remain local for review. Documentation checks do not establish production clinical, financial or deployment readiness.

## 🎨 Interactive Low-Fidelity Wireframes

Explore the connected customer, staff and rider experiences through local grayscale HTML/CSS/JavaScript wireframes, including forms, role handoffs and failure scenarios. Run `node 10-Low-Fidelity-Wireframes/server.mjs`, then open `http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/`; the prototype uses synthetic browser-local data and requires no backend.

[Wireframe Explorer](10-Low-Fidelity-Wireframes/index.html) · [Screen Inventory](10-Low-Fidelity-Wireframes/documentation/Screen-Inventory.md) · [User Flows](10-Low-Fidelity-Wireframes/documentation/User-Flows.md) · [Edge-Case Coverage](10-Low-Fidelity-Wireframes/documentation/Edge-Case-Coverage.md) · [Local Preview Instructions](10-Low-Fidelity-Wireframes/documentation/How-to-Run.md)
