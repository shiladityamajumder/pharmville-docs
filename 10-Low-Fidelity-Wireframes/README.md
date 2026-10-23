# Pharmville interactive low-fidelity wireframes

A local, connected HTML/CSS/vanilla JavaScript prototype for exploring Pharmville as a customer, staff member or rider. It contains 83 reusable screens, 35 scenarios and mappings for all 110 existing draft feature IDs.

## Open the prototype

From the repository root, run:

```text
node 10-Low-Fidelity-Wireframes/server.mjs
```

Open [the local Explorer](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/). No install or backend is required to run the prototype. ES modules need the local server; GitHub’s Markdown view does not execute this app. The Node server serves only local static files on loopback. Stop it with Ctrl+C.

## Explore Pharmville

The first screen recommends **Start with a customer order**, with **Explore by user**, **Choose another journey**, and **Browse all screens** available as secondary paths. Product screens open in Experience mode without technical IDs or QA controls. Select **Review tools** to inspect IDs, choose a role or scenario, view expected/recovery details, change the preview size, or reset the shared fictional data. Guided journeys preserve the current record, stop at business gates that still need a user action, and can load clearly labelled prepared demo data after confirmation.

The default example is an empty shopping state with no submitted order, payment, approval or stock movement. A guided journey can load a prepared fictional starting state; the app asks before replacing existing progress. Completed actions in a fixture are labelled as historical demo state. Use **Reset demo data** to restore the fresh shopping state for every role in this browser.

## Documentation

- [Screen inventory](documentation/Screen-Inventory.md)
- [Feature coverage and blocked work](documentation/Feature-Coverage.md)
- [Connected user flows](documentation/User-Flows.md)
- [Scenarios and recovery](documentation/Edge-Case-Coverage.md)
- [Design decisions and limits](documentation/Design-Decisions.md)
- [Prototype test plan](documentation/Prototype-Test-Plan.md)
- [Detailed preview instructions](documentation/How-to-Run.md)

## Files and verification

`customer/`, `staff/` and `operations/` export screen metadata, renderers and action handlers. `shared/` supplies controls and staff access. `assets/js/` owns the router, Experience/Review shell, guided journeys, scenarios, generated feature catalog and synthetic state; CSS is shared and responsive. `tools/generate-documentation.mjs` regenerates inventories from the implemented registry and authoritative feature source.

Browser QA reuses the repository’s existing development-only Puppeteer dependency; the prototype itself has no dependencies. With the preview running, run `node 10-Low-Fidelity-Wireframes/tests/browser.mjs`. Screenshots and actual results are written to ignored `artifacts/` inside this folder. See the test plan for the precise evidence boundary.

No real authentication, clinical validation, provider request, file upload, message, map, tracking stream or financial transaction occurs. Use only fictional input. CSV import and Excel-readable TSV export demonstrate tabular UX; native XLSX processing is not implemented. Real security and clinical/financial policy remain the existing engineering and owner work.
