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

## Explore and share

1. Choose a workspace, use the screen directory or start a listed flow.
2. Read the visible role, screen ID, requirement IDs and record status.
3. Use real local forms/buttons; change the reviewer scenario to inspect a failure.
4. Move to the responsible role to complete a handoff. Reopen the customer order to observe the change.
5. Use browser Back/Forward or refresh. A direct example is [pending-payment recovery](../index.html#/customer/payment-recovery?scenario=confirmation-lost).
6. Choose **Reset demo data**, then confirm in the dialog, to restore all fictional records. Escape cancels the reset.

The browser stores only the demonstration state under `pharmville-wireframe-demo-v1`. Storage is shared between tabs on this origin, not between real devices. If storage is unavailable the app continues in memory and warns that refresh resets data. Use synthetic inputs; do not enter real contact, patient, payment or medical information.

## Later static hosting

All app assets and hash routes use relative paths, so a GitHub Pages project path can host them later. This task does not publish or configure hosting. Documentation backlinks require the surrounding repository to be served. GitHub’s normal repository/Markdown interface does not run HTML/JavaScript; use the local URL above for interaction.
