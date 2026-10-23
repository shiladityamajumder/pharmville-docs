# Pharmville interactive low-fidelity wireframes

A local, connected HTML/CSS/vanilla JavaScript prototype for reviewing screen structure, role handoffs, forms and failure recovery. The Explorer contains 83 reusable screens across customer, shared staff and rider experiences. All 110 existing draft feature IDs are mapped; blocked policy-dependent work is explicitly distinguished from demonstrated UX.

## Open the prototype

From the repository root, run:

```text
node 10-Low-Fidelity-Wireframes/server.mjs
```

Open [the local Explorer](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/). No install or backend is required to run the prototype. ES modules need the local server; GitHub’s Markdown view does not execute this app. The Node server serves only local static files on loopback. Stop it with Ctrl+C.

## Review a journey

Choose a workspace or search the directory by screen name/feature ID. Screen links preserve the route in the URL; use browser Back/Forward or copy a URL containing a scenario. The role selector and scenario panel are reviewer controls, separate from the user’s domain action. Moving to a new workspace selects its illustrative role; selecting a different role deliberately shows access denial.

The starting example has a fictional P/M/O order awaiting pharmacy review and an empty shopping cart. A new accepted customer checkout replaces that example’s contents. Do not add products to a submitted order as an implicit post-order edit. Use **Reset demo data** to restore the starting records for every role in this browser.

## Documentation

- [Screen inventory](documentation/Screen-Inventory.md)
- [Feature coverage and blocked work](documentation/Feature-Coverage.md)
- [Connected user flows](documentation/User-Flows.md)
- [Scenarios and recovery](documentation/Edge-Case-Coverage.md)
- [Design decisions and limits](documentation/Design-Decisions.md)
- [Prototype test plan](documentation/Prototype-Test-Plan.md)
- [Detailed preview instructions](documentation/How-to-Run.md)

## Files and verification

`customer/`, `staff/` and `operations/` export screen metadata, renderers and action handlers. `shared/` supplies controls and staff access. `assets/js/` owns the router, shell, scenarios, generated feature catalog and synthetic state; CSS is shared and responsive. `tools/generate-documentation.mjs` regenerates inventories from the implemented registry and authoritative feature source.

Browser QA reuses the repository’s existing development-only Puppeteer dependency; the prototype itself has no dependencies. With the preview running, run `node 10-Low-Fidelity-Wireframes/tests/browser.mjs`. Screenshots and actual results are written to ignored `artifacts/` inside this folder. See the test plan for the precise evidence boundary.

No real authentication, clinical validation, provider request, file upload, message, map, tracking stream or financial transaction occurs. Use only fictional input. CSV import and Excel-readable TSV export demonstrate tabular UX; native XLSX processing is not implemented. Real security and clinical/financial policy remain the existing engineering and owner work.
