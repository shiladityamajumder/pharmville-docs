# Prototype validation results

Validated locally on **23 October 2026** using the implemented HTML/CSS/JavaScript, local static server and headless Chrome. These are prototype checks, not production application/provider/clinical acceptance.

## Measured results

| Check | Actual result |
| --- | --- |
| Implemented screens | 83; unique IDs and routes |
| Source features mapped | 110 across 18 existing module groups |
| Coverage classification | 70 screen, 23 interaction/state, 16 blocked by owner decision, 1 backend-only |
| Stable scenario definitions | 35, including Normal |
| Screen/scenario combinations visited | 718 |
| Browser assertions | 100 passed |
| Registered interactive action/form names | 104; all resolve to a handler in static review |
| Normal-screen responsive sweep | All 83 at 390 × 844, 768 × 1024 and 1440 × 900; no document overflow |
| Browser errors / external dependencies | Zero detected JavaScript errors; zero external requests required |
| Rendered hash links | Zero unresolved screen targets |
| Basic accessibility | Normal-screen inputs have labels; no duplicate HTML IDs; dialog Escape, reset confirmation and browser history tested |
| Selected-device preview | Mobile, tablet and desktop layouts verified inside a desktop browser; responsive mode and browser resizing also verified |
| Repository Markdown validation | 459 Markdown files, 4,388 links, 1,598 tables and 52 Mermaid diagrams parsed; zero validation errors or missing feature mappings |
| Existing documentation preservation | This UX pass edits the wireframe prototype and its documentation only; the existing business requirements and scenario definitions remain in place |
| Git review | `git diff --check` passed; no commit or push |

## Executed journeys

The browser suite completed signup/OTP/profile and replacement-contact proof, search/product/cart, M/O checkout, payment pending/captured-response-loss recovery, separate cancellation/refund and duplicate/cumulative refund protection. It checked payment failure and prescription rejection recovery, then exercised a direct guided customer-to-pharmacist handoff while preserving the pending order. It completed P evidence upload, payment denial before current review, pharmacist approval, eligible COD checkout, exact pick/pack, dispatch, rider acceptance, store handoff, pickup, incorrect OTP, offline queue/reconnect and shared customer delivery tracking.

Aftercare and operations checks covered delivered-item return requests, COD short-deposit exceptions, supplier accepted/short receipt and replay, in-transit transfer, actual destination receipt/shortage, and duplicate stock protection. Reports/exports, revoked download access, denied staff forms, revoked session plus MFA recovery, browser refresh/Back/Forward, Explorer filtering and native reset dialog were exercised.

## Screenshots and visual review

Local PNGs and JSON results are in ignored `artifacts/` within this folder. They include customer/pharmacy/rider views at all three requested sizes, selected mobile/tablet/desktop previews, an assigned rider task, and the default Explorer. The Explorer, customer home at 390px and 1440px, selected previews inside the desktop browser, and assigned rider at 390px were visually inspected after the final responsive adjustment. This is representative visual review, not a claim of exhaustive human review of every screen/state.

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
