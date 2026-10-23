# Prototype validation results

Validated locally on **23 October 2026** using the implemented HTML/CSS/JavaScript, local static server and headless Chrome after the product-quality layout, access and recovery redesign. These are prototype checks, not production application/provider/clinical acceptance.

## Measured results

| Check | Actual result |
| --- | --- |
| Implemented screens | 83; unique IDs and routes |
| Source features mapped | 110 across 18 existing module groups |
| Coverage classification | 70 screen, 23 interaction/state, 16 blocked by owner decision, 1 backend-only |
| Stable scenario definitions | 35, including Normal |
| Screen/scenario combinations visited | 718 |
| Browser assertions | 113 full-suite assertions and 13 supplemental product UX assertions passed |
| Registered interactive action/form names | 104; all resolve to a handler in static review |
| Normal-screen responsive sweep | All 83 at 360 × 800, 390 × 844, 430 × 932, 768 × 1024, 1280 × 800 and 1440 × 900; no document overflow |
| Browser errors / external dependencies | Zero detected JavaScript errors; zero external requests required |
| Rendered hash links | Zero unresolved screen targets |
| Basic accessibility | Normal-screen inputs have labels; no duplicate HTML IDs; dialog Escape, reset confirmation and browser history tested |
| Selected-device preview | Mobile, tablet and desktop layouts verified inside a desktop browser; the landing-page Mobile App, Website and Complete Journeys choices are directly asserted |
| Repository Markdown validation | 516 Markdown files, 10,605 links, 1,699 tables, and all 96 Mermaid diagrams parsed; zero documentation errors or missing feature mappings |
| Feature and route mapping | All 110 authoritative feature IDs map to the 83-route screen registry; see [Complete Screen Matrix](Complete-Screen-Matrix.md) |
| UX review | [Final UX Review](Final-UX-Review.md) records the weighted heuristic score and remaining limits |
| Existing documentation preservation | Business rules, authoritative feature IDs, and scenario definitions remain unchanged |
| Git review | `git diff --check` passed; no commit or push |

## Executed journeys

The browser suite completed signup/OTP/profile and replacement-contact proof, search/product/cart, M/O checkout, payment pending/captured-response-loss recovery, separate cancellation/refund and duplicate/cumulative refund protection. It checked payment failure and prescription rejection recovery, then exercised a direct guided customer-to-pharmacist handoff while preserving the pending order. It completed P evidence upload, payment denial before current review, pharmacist approval, eligible COD checkout, exact pick/pack, dispatch, rider acceptance, store handoff, pickup, incorrect OTP, offline queue/reconnect and shared customer delivery tracking.

Aftercare and operations checks covered delivered-item return requests, COD short-deposit exceptions, supplier accepted/short receipt and replay, in-transit transfer, actual destination receipt/shortage, and duplicate stock protection. Reports/exports, revoked download access, denied staff forms, revoked session plus MFA recovery, browser refresh/Back/Forward, Explorer filtering and native reset dialog were exercised.

## Screenshots and visual review

Local PNGs and JSON results are in ignored `artifacts/` within this folder. They include the Explorer, customer/pharmacy/rider views at all six required viewport widths, selected mobile/tablet/desktop previews, and an assigned rider task. Fresh product-ux screenshots cover 15 routes at 390 and 1440 px; customer pages and representative pharmacy, store, warehouse, dispatch, rider and finance views were visually inspected. This is representative visual review, not exhaustive human review of every screen/state.

## Reproduce

With the preview running, execute from repository root:

```text
node 10-Low-Fidelity-Wireframes/tools/generate-documentation.mjs
node 10-Low-Fidelity-Wireframes/tools/validate-prototype.mjs
node 10-Low-Fidelity-Wireframes/tests/browser.mjs
node scripts/validate-docs.mjs
```

The prototype needs no install to run. Browser QA reuses existing development dependencies and local Chrome; configure `PUPPETEER_EXECUTABLE_PATH` on another machine. See [How to Run](How-to-Run.md).

## Remaining gaps and decisions

The 16 policy-dependent features remain explicitly blocked/proposed in [Feature Coverage](Feature-Coverage.md). Exact clinical/payment timing, role grants, stock authority/freshness, warehouse fallback, COD/refund/tax/credit rules, rider tracking/proof/incentives and privacy need their original responsible owners. No numeric prototype fixture grants business approval.

Spreadsheet handling is an intentional UX approximation: pasted CSV import and Excel-readable TSV export, without native XLSX parsing/generation. Files, maps, calls, OTP, provider messages, prescriptions and money are simulated only. No backend, medical decision engine, integration account, production data, database connection or hosted deployment is used. Full assistive-technology, real mobile device/background operation and production security/provider testing remain future work.
