# Pharmville interactive low-fidelity wireframes

A local, connected HTML/CSS/vanilla JavaScript prototype for exploring Pharmville as a customer, staff member or rider. It contains 91 reusable screens, 35 scenarios, 13 guided journeys and mappings for all 110 existing draft feature IDs across the 18 documented module groups.

## Open the prototype

From the repository root, run:

```bash
node 10-Low-Fidelity-Wireframes/server.mjs
```

Open [Choose Experience](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/). No install or backend is required to run the prototype. ES modules need the local server; GitHub’s Markdown view does not execute this app. The Node server serves only local static files on loopback. Stop it with Ctrl+C.

## Explore Pharmville

The first screen is **Choose how to explore Pharmville**. **Choose Mobile App** opens its own searchable customer/rider screen selector; **Choose Website** opens a separate customer/staff selector. **Explore Journeys** opens 13 guided tasks. The complete directory is secondary.

Screen URLs carry their experience, for example `#/mobile/customer/cart` and `#/website/customer/cart`; refresh, Back/Forward and internal navigation retain it. Both experiences share the same fictional records. Mobile uses bottom navigation and stacked tasks; Website uses header navigation, desktop summaries and staff sidebars.

On product screens, expand **What if something goes wrong?** to try relevant situations and read what happened, what happens next and how to recover. Payment examples execute the existing guarded payment command; other situations preview the relevant condition and retain command checks.

A pending attempt cannot be charged again; a confirmed payment cannot be relabelled pending. **Load a valid fictional checkout** explicitly confirms replacement of shared example records before preparing an eligible order. **Review tools** retains technical IDs, persona controls, preview sizes and reset.

Starting a journey or selecting a screen explicitly chooses a demonstration persona; opening a protected URL does not grant that role. The Access workspace demonstrates one local identity session, derived workspace choices, staff password plus authenticator, customer/rider OTP adapters, session revocation and a proposed step-up challenge for selected elevated workspaces. It is a browser simulation, not a security control or permission grant.

The shared mock domain now connects supplier proposals and purchase-order drafts to receiving, warehouse-to-store transfers and customer availability. Reverse logistics connects the customer request, pending owner eligibility, dispatch, rider custody, quarantine inspection and a separate Finance refund decision. A support case retains its own lifecycle and notification event. Procurement depth and return eligibility remain proposed; the demo does not contact suppliers, infer a return policy or restock quarantined items.

The default example is an empty shopping state with no submitted order, payment, approval or stock movement. A guided journey can load a prepared fictional starting state; the app asks before replacing existing progress. Completed actions in a fixture are labelled as historical demo state.

Use **Reset demo data** to restore the fresh shopping state for every role in this browser.

## Documentation

- [Screen inventory](documentation/Screen-Inventory.md)
- [Complete screen matrix](documentation/Complete-Screen-Matrix.md)
- [Platform and screen verification](documentation/Platform-and-Screen-Coverage.md)
- [Per-platform scenario verification](documentation/UX-State-Coverage.md)
- [Feature coverage and blocked work](documentation/Feature-Coverage.md)
- [Connected user flows](documentation/User-Flows.md)
- [Role-to-workspace matrix](documentation/Role-Workspace-Matrix.md)
- [Prototype completion ledger](documentation/Prototype-Completion-Ledger.md)
- [Scenarios and recovery](documentation/Edge-Case-Coverage.md)
- [Design decisions and limits](documentation/Design-Decisions.md)
- [Prototype test plan](documentation/Prototype-Test-Plan.md)
- [Final UX review](documentation/Final-UX-Review.md)
- [Detailed preview instructions](documentation/How-to-Run.md)

## Files and verification

`customer/`, `staff/` and `operations/` export screen metadata, renderers and action handlers. `shared/` supplies controls and staff access. `assets/js/` owns the router, Experience/Review shell, guided journeys, scenarios, generated feature catalog and synthetic state; CSS is shared and responsive. `tools/generate-documentation.mjs` regenerates inventories from the implemented registry and authoritative feature source.

Browser QA reuses the repository’s existing development-only Puppeteer dependency; the prototype itself has no dependencies. With the preview running, run `node 10-Low-Fidelity-Wireframes/tests/browser.mjs`. Screenshots and actual results are written to ignored `artifacts/` inside this folder. See the test plan for the precise evidence boundary.

No real authentication, clinical validation, provider request, file upload, message, map, tracking stream or financial transaction occurs. Use only fictional input. CSV import and Excel-readable TSV export demonstrate tabular UX; native XLSX processing is not implemented.

Real security and clinical/financial policy remain the existing engineering and owner work.

## Product UX redesign

Customer navigation is shell-owned. Product discovery includes working type/price filters; desktop cart and checkout use side summaries while phones use a stacked flow. Native input errors appear beside fields. Opening a different workspace URL preserves the current persona; switch explicitly through Explore by user, Review tools, or a guided role handoff.

Run `node 10-Low-Fidelity-Wireframes/tests/product-ux.mjs` for product regressions, `node 10-Low-Fidelity-Wireframes/tests/experience-flows.mjs` for experience selection and end-to-end shopping/fulfillment, `node 10-Low-Fidelity-Wireframes/tests/domain-workflows.mjs` for domain state transitions, and `node 10-Low-Fidelity-Wireframes/tests/extended-workflows.mjs` for procurement, reverse logistics and support through browser forms.

Generate verified coverage after a successful experience run with `node 10-Low-Fidelity-Wireframes/tools/generate-experience-coverage.mjs`. See the [final UX review](documentation/Final-UX-Review.md) for evidence and remaining gaps.
