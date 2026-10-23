# Local preview instructions

## Start

Use a recent Node.js installation (Node 24 is available in this workspace). Open a terminal in the `pharmville-docs` repository and run:

```text
node 10-Low-Fidelity-Wireframes/server.mjs
```

Open [http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/). Keep that terminal running and stop it with Ctrl+C when finished. No `npm install`, build, provider account or database connection is needed for the prototype.

If port 4173 is in use, PowerShell supports a different port:

```powershell
$env:PORT = '4174'
node 10-Low-Fidelity-Wireframes/server.mjs
```

Then use `http://127.0.0.1:4174/10-Low-Fidelity-Wireframes/`. The server binds only to your machine. It serves relative local assets and documentation; it blocks hidden folders, node_modules and artifacts. Serve from the repository root so links back to the source documentation resolve.

## Explore Pharmville

The root opens **Choose how to explore Pharmville**. Open these exact destinations:

- [Experience chooser](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/#/choose)
- [Mobile App screen selector](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/#/mobile)
- [Website screen selector](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/#/website)
- [Complete journeys](http://127.0.0.1:4173/10-Low-Fidelity-Wireframes/#/journeys)

Mobile App offers Customer and Rider screens; Website offers Customer and staff workspaces. Search by task, or expand a group for the full inventory. A screen card explicitly selects its demonstration persona. Internal links retain the experience in the URL. Legacy links remain available through the secondary directory.

On an app screen, **Review tools** opens a separate keyboard-accessible side panel. It contains the screen ID, feature IDs, current role, relevant scenarios, expected result, recovery guidance and requirement links. Choose a scenario in the panel to see its effect on the app screen. Close the panel to return to the product view. Use **Continue as [role]** at a guided handoff to change the simulated role while keeping the same order.

To start a guided journey, choose whether to keep the current demo data or load its prepared fictional starting state. Replacing existing progress requires confirmation. Mobile, tablet and desktop previews apply responsive rules to the selected app frame, even inside a desktop browser. **Responsive** follows the actual browser width; resizing the browser directly also changes that layout.

Use browser Back/Forward or refresh. Direct examples are [Mobile checkout](../index.html#/mobile/customer/checkout-summary) and [Website checkout](../index.html#/website/customer/checkout-summary). Choose **Reset demo data** in Review tools, then confirm in the dialog, to restore the fresh shopping state across roles. Escape cancels the reset.

To quickly verify the change:

1. Choose Mobile App, search for Checkout and open it. Refresh: the URL still contains `/mobile/`, with phone navigation and stacked content.
2. Expand **What if something goes wrong?**, choose **Load a valid fictional checkout**, and confirm. Choose **Payment is still pending**. Open **Check payment status**; the same reference remains pending and no new payment form appears.
3. Return to Choose experience, select Website, and open Cart. The same item and quantity remain. Open Checkout to see the wide table and side summary, then refresh and use Back/Forward.
4. Open Journeys, start **Order a prescription medicine**, and choose the data option deliberately. Submit fictional evidence. **Continue as Pharmacist** explicitly changes the demonstration role and experience while preserving the order. Record a rejection reason, then choose Customer prescription status to see that reason.

For a full fresh purchase, sign in with fictional phone `0000000000` and code `246810`, complete the profile, then Search → Product → Cart → Address → Patient → Summary → Payment → Order tracking. PIN `000000` is the serviceable address example. The on-screen failure controls are available without opening Review tools. Returning to normal preserves any actions already recorded; it does not undo a payment or recorded rejection.

The browser stores only the demonstration state under `pharmville-wireframe-demo-v1`. Storage is shared between tabs on this origin, not between real devices. If storage is unavailable the app continues in memory and warns that refresh resets data. Use synthetic inputs; do not enter real contact, patient, payment or medical information.

## Later static hosting

All app assets and hash routes use relative paths, so a GitHub Pages project path can host them later. This task does not publish or configure hosting. Documentation backlinks require the surrounding repository to be served. GitHub’s normal repository/Markdown interface does not run HTML/JavaScript; use the local URL above for interaction.

## Roles and access

Use a screen card or the advanced **Explore by user** directory to explicitly enter a role's demonstration. Opening another workspace URL preserves the current persona and may show **Access restricted**. Open **Review tools → Screen information** to choose an illustrative role or select **Use this workspace role**. Guided cross-role handoffs switch only when you activate their continuation button. Staff Mobile URLs and Rider Website URLs explain the supported experience; they do not grant access.

Run the commands in [Prototype Test Plan](Prototype-Test-Plan.md) while the server is running. The experience suite writes fresh screenshots and named assertions to ignored `artifacts/experiences/`; existing product checks use `artifacts/product-ux/`.
