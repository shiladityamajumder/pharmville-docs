# Prototype test plan

## What these checks establish

Browser tests execute the local HTML, CSS and JavaScript through actual forms, buttons, dialogs and routes using existing development-only Puppeteer and local Chrome. They validate prototype interaction and layout; no application, clinical, provider or production database acceptance is claimed.

Start the [local preview](How-to-Run.md), then run from repository root:

```text
node 10-Low-Fidelity-Wireframes/tools/generate-documentation.mjs
node 10-Low-Fidelity-Wireframes/tests/browser.mjs
node scripts/validate-docs.mjs
```

The browser test reuses the repository’s existing `node_modules/puppeteer`; no runtime dependencies are needed for the prototype. Set `PUPPETEER_EXECUTABLE_PATH` if Chrome is not at its detected platform path. Browser automation requires local process permissions. The results and PNGs are written under ignored `10-Low-Fidelity-Wireframes/artifacts/`.

## Automated checks

1. **BR-01 — Route smoke:** load all registered screens and verify unique IDs/routes and rendered hash links.
2. **BR-02 — Scenario rendering:** load every declared applicable scenario and detect browser errors/external requests. A rendered scenario is not an interaction assertion.
3. **BR-03 — Responsive sweep:** visit all screens at 360 × 800, 390 × 844, 430 × 932, 768 × 1024, 1280 × 800 and 1440 × 900; compare document/viewport width and capture representative customer, pharmacy and rider screenshots. Separately switch the internal Mobile, Tablet and Desktop previews.
4. **BR-04 — Core interactions and safeguards:** submit incorrect/valid OTP, profile/email errors, search, cart and accepted checkout through their actual forms; test payment pending/recovery/idempotency, cancellation/refund, prescription review gates, exact batch pick/pack, rider proof/offline recovery, COD and stock receipt, access denial/MFA and report export.
5. **BR-05 — Basic accessibility and navigation:** check labels and duplicate IDs on each normal screen, route links, keyboard dialog dismissal, browser history and saved form recovery.

The [Complete Screen Matrix](Complete-Screen-Matrix.md) maps each route to the test groups that exercise it. BR-02 is screen/state rendering coverage; only rows that list BR-04 have named direct interaction assertions for that route. Core journeys also cross roles, so assertions are not isolated to a single screen.

## Manual review checklist

- Use only the keyboard to select workspace/role/scenario, submit forms, open/cancel confirmation and follow cross-role links. Confirm labels, focus visibility and announced errors.
- Check that each failure explains what happened, who acts next and which record remains pending. Do not treat a scenario panel label as a completed business action.
- Review partial rejection, wrong-patient correction, expired batches, stale assignments and cash mismatch with the responsible product specialists.
- Confirm the responsive card reading order and mobile tap targets are useful to actual staff/riders. Automated overflow checks do not prove full usability or screen-reader conformance.
- Confirm synthetic filename, masked contact, placeholder maps and TSV/CSV approximations are clearly distinguished from future real integrations.

## Evidence and gaps

Actual results are recorded after execution in the local browser-results JSON and [validation results](Validation-Results.md). Review screenshots and Git diff before accepting a pass. Production API/provider/security tests, real device GPS/background behavior, native Excel formats, clinical/legal approval and hosted GitHub Pages testing are outside this prototype.
