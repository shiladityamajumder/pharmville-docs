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

1. Load every registered screen and verify unique IDs/routes and rendered hash links.
2. Load every declared applicable scenario and detect browser errors/external requests.
3. Visit all screens at 390 × 844, 768 × 1024 and 1440 × 900; compare document/viewport width and capture representative customer, pharmacy and rider screenshots.
4. Submit incorrect/valid OTP, profile/email errors, search, cart and accepted checkout through their actual forms.
5. Test pending captured-payment recovery and repeated Pay with the same reference; cancellation dialog and separate capped/duplicate-safe refund.
6. Submit synthetic prescription metadata, refuse payment before review, then complete pharmacy, customer acceptance, exact picking/packing, dispatch assignment, rider acceptance, store handoff, pickup, wrong OTP and offline/reconnect completion.
7. Verify the customer sees the same delivery/refund state, and return requests do not imply inspection/refund completion.
8. Test supplier short receipt, replay, source transfer dispatch, actual destination receipt/shortage and duplicate guards.
9. Generate/sort/export scoped reports; access revoked before download, denied staff form, staff session revocation/MFA recovery, refresh and Escape in reset dialog.
10. Audit source feature IDs, mapping classes, actual action-bearing views, scenario IDs, asset paths and relative documentation links.

## Manual review checklist

- Use only the keyboard to select workspace/role/scenario, submit forms, open/cancel confirmation and follow cross-role links. Confirm labels, focus visibility and announced errors.
- Check that each failure explains what happened, who acts next and which record remains pending. Do not treat a scenario panel label as a completed business action.
- Review partial rejection, wrong-patient correction, expired batches, stale assignments and cash mismatch with the responsible product specialists.
- Confirm the responsive card reading order and mobile tap targets are useful to actual staff/riders. Automated overflow checks do not prove full usability or screen-reader conformance.
- Confirm synthetic filename, masked contact, placeholder maps and TSV/CSV approximations are clearly distinguished from future real integrations.

## Evidence and gaps

Actual results are recorded after execution in the local browser-results JSON and [validation results](Validation-Results.md). Review screenshots and Git diff before accepting a pass. Production API/provider/security tests, real device GPS/background behavior, native Excel formats, clinical/legal approval and hosted GitHub Pages testing are outside this prototype.
