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
| Browser assertions | 62 passed |
| Registered interactive action/form names | 109; all resolve to a handler in static review |
| Normal-screen responsive sweep | All 83 at 390 × 844, 768 × 1024 and 1440 × 900; no document overflow |
| Browser errors / external dependencies | Zero detected JavaScript errors; zero external requests required |
| Rendered hash links | Zero unresolved screen targets |
| Basic accessibility | Normal-screen inputs have labels; no duplicate HTML IDs; dialog Escape, reset confirmation and browser history tested |
| Final shared-style review | 12 representative layout checks and skip-link focus/hash check passed |
| Repository Markdown validation | 459 Markdown files; zero link, table, heading, fence, feature-reference or Mermaid parse errors |
| Existing documentation preservation | All 448 source pages under 00–09 retain their starting hashes; root README only gains the requested wireframe section |
| Git review | Whitespace check passed; no commit or push |

## Executed journeys

The browser suite completed signup/OTP/profile and replacement-contact proof, search/product/cart, M/O checkout, payment pending/captured-response-loss recovery, separate cancellation/refund and duplicate/cumulative refund protection. It then completed P evidence upload, payment denial before current review, pharmacist approval, eligible COD checkout, exact pick/pack, dispatch, rider acceptance, store handoff, pickup, incorrect OTP, offline queue/reconnect and shared customer delivery tracking.

Aftercare and operations checks covered delivered-item return requests, COD short-deposit exceptions, supplier accepted/short receipt and replay, in-transit transfer, actual destination receipt/shortage, and duplicate stock protection. Reports/exports, revoked download access, denied staff forms, revoked session plus MFA recovery, browser refresh/Back/Forward, Explorer filtering and native reset dialog were exercised.

## Screenshots and visual review

Local PNGs and JSON results are in ignored `artifacts/` within this folder. They include customer/pharmacy/rider views at all three requested sizes, an assigned rider task, and Explorer views. The Explorer desktop, customer home mobile, checkout desktop, prescription review mobile and assigned-rider mobile images were visually inspected. This is representative visual review, not a claim of exhaustive human review of every screen/state.

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
