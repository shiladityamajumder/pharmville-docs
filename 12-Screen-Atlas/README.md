# Pharmville — Screen Atlas

> [!NOTE]
> This folder is a **standalone, offline, read-only design atlas** of the existing Pharmville low-fidelity wireframe prototype. It does not modify the original project or connect to Figma.

## Quick start

1. Extract this entire folder into the Pharmville repository root (or anywhere on your computer).
2. Open **`12-Screen-Atlas/index.html`** in Chrome, Edge, or Firefox.
3. Use **Modules** to see grouped screen previews or **Journeys** to see ordered workflow steps and handoffs.
4. Click a card to inspect its screen ID, features and states; **double-click**, or use **Open interactive screen**, to launch the real existing wireframe in an embedded preview.
5. Open the **Prototype** shortcut to explore the original app directly.

**No Node.js, npm, web server, Figma account, CDN, or internet connection is required.**

## Navigation

| Action | How |
| --- | --- |
| Find a screen | Search title, route, feature ID, module, or screen ID (`/` focuses search) |
| Jump to a group | Select it in the left sidebar |
| Pan the canvas | Drag empty canvas, mouse wheel, or hold Space + drag |
| Zoom | Toolbar `+` / `−`; Ctrl/⌘ + mouse wheel |
| Fit the whole board | **Fit all** or press `0` |
| Inspect screen | Click its card |
| Open a working screen | Double-click, green arrow, or inspector button |
| Explore a full business journey | Switch to **Journeys** and select a journey |

## Coverage

- **91 actual screen previews** captured from the original offline wireframe application.
- **18 source-aligned module groups**.
- **13 documented business journeys**, preserving the source step order and role handoffs.

## Contents

```text
12-Screen-Atlas/
├── index.html                 # Open this file
├── assets/
│   ├── css/atlas.css          # Board styling
│   ├── js/atlas.js            # Canvas, pan/zoom, search, inspector
│   ├── js/data.js             # Metadata extracted from the original wireframes
│   └── previews/              # 91 actual screen previews (WebP)
├── prototype/                 # Complete original standalone interactive wireframe
├── SCREEN-INDEX.md            # Screens listed by source module
├── JOURNEY-MAP.md            # Ordered workflow steps and role handoffs
└── README.md
```

## Accuracy and limitations

- Previews are captures of the **real existing screens**, not redesigns or approximations. They show each screen in its initial fictional demonstration state.
- The interactive preview opens the included standalone prototype directly. Some screens deliberately enforce simulated workflow prerequisites and require earlier steps to be completed.
- The journey map lists **documented step sequences**. It does not claim that every operation is approved, production-implemented, or fully tested.
- The source prototype is copied intact into `prototype/`; `10-Low-Fidelity-Wireframes/` is untouched.
- Browser sandbox restrictions or privacy settings can restrict `file://` iframe storage. If that happens, use the **Open in new tab** option.
- All screenshots and data are synthetic demonstration content. No real health, payment, or customer data is included.
