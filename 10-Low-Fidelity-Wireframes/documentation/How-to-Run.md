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

The prototype opens in **Experience mode** with three primary choices: **Explore Mobile App**, **Explore Website**, and **Explore Complete Journeys**. The first two open the same synthetic customer records in phone and desktop layouts. **Explore by user** and the collapsed **Browse all screens** directory remain available for role-based and advanced exploration. The first visit starts with an empty shopping demo.

On an app screen, **Review tools** opens a separate keyboard-accessible side panel. It contains the screen ID, feature IDs, current role, relevant scenarios, expected result, recovery guidance and requirement links. Choose a scenario in the panel to see its effect on the app screen. Close the panel to return to the product view. Use **Continue as [role]** at a guided handoff to change the simulated role while keeping the same order.

To start a guided journey, choose whether to keep the current demo data or load its prepared fictional starting state. Replacing existing progress requires confirmation. Mobile, tablet and desktop previews apply responsive rules to the selected app frame, even inside a desktop browser. **Responsive** follows the actual browser width; resizing the browser directly also changes that layout.

Use browser Back/Forward or refresh. A direct example is [pending-payment recovery](../index.html#/customer/payment-recovery?scenario=confirmation-lost). Choose **Reset demo data** in Review tools, then confirm in the dialog, to restore the fresh shopping state across roles. Escape cancels the reset.

The browser stores only the demonstration state under `pharmville-wireframe-demo-v1`. Storage is shared between tabs on this origin, not between real devices. If storage is unavailable the app continues in memory and warns that refresh resets data. Use synthetic inputs; do not enter real contact, patient, payment or medical information.

## Later static hosting

All app assets and hash routes use relative paths, so a GitHub Pages project path can host them later. This task does not publish or configure hosting. Documentation backlinks require the surrounding repository to be served. GitHub’s normal repository/Markdown interface does not run HTML/JavaScript; use the local URL above for interaction.

## Roles and access

Use **Explore by user** to explicitly enter a role's demonstration. Opening another workspace URL preserves the current persona and may show **Access restricted**. Open **Review tools → Screen information** to choose an illustrative role or select **Use this workspace role**. Guided cross-role handoffs switch only when you activate their continuation button. Device switching and returning to Explore retain the current records.

Run additional behavioral and visual checks with `node 10-Low-Fidelity-Wireframes/tests/product-ux.mjs` while the preview server is running. Results and 30 mobile/desktop images are written to the ignored `artifacts/product-ux/` directory.
