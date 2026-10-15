# Architecture & System Design — PixelFoundry

## 1. System Overview

**PixelFoundry** is an enterprise-grade React 19 component library and interactive design engineering workbench. It is engineered with two parallel deliverables:
1. **Reusable Headless & Styled Component System** exported via `src/lib/index.ts` for consumption as an npm package.
2. **Interactive Component Playground & Props Workbench** rendered by `src/App.tsx` and compiled into a static documentation deployment for Netlify.

```
+-----------------------------------------------------------------------------------------+
|                                    PixelFoundry Library                                 |
|                                                                                         |
|  +--------------------+   +---------------------------------+   +--------------------+  |
|  |   CommandPalette   |   |           ModalDialog           |   |     Accordion      |  |
|  | (Cmd+K, Fuzzy, ARIA|   | (Focus Trap, Scroll Lock, Esc)  |   | (Up/Down/Home/End) |  |
|  +---------+----------+   +----------------+----------------+   +---------+----------+  |
|            |                               |                              |             |
|  +---------+----------+   +----------------+----------------+   +---------+----------+  |
|  |     DataTable      |   |           ToastSystem           |   |  SegmentedControl  |  |
|  | (Sort, Select, Pag)|   | (Queue, Countdown, aria-live)   |   |   & TagInput       |  |
|  +---------+----------+   +----------------+----------------+   +---------+----------+  |
|            |                               |                              |             |
|            +-------------------------------+------------------------------+             |
|                                            |                                            |
|                                            v                                            |
|                           src/lib/index.ts (Library Export)                             |
|                                            &                                            |
|                   Interactive Design Workbench (Catalog & Playground)                   |
+-----------------------------------------------------------------------------------------+
```

---

## 2. WAI-ARIA APG Accessibility Patterns

All primitives strictly adhere to the **W3C WAI-ARIA Authoring Practices Guide (APG)**:

### A. Command Palette (`src/components/primitives/CommandPalette/`)
- Root element has `role="dialog"`, `aria-modal="true"`, and `aria-label="Command palette"`.
- Input has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded="true"`, and `aria-controls="command-listbox"`.
- Listbox items have `role="option"` with `aria-selected="true"` on the actively highlighted index.
- Global keyboard shortcut handler: <kbd>Cmd</kbd>+<kbd>K</kbd> / <kbd>Ctrl</kbd>+<kbd>K</kbd>.
- Arrow keys (<kbd>ArrowDown</kbd>, <kbd>ArrowUp</kbd>) cycle cyclically through visible filtered options.
- On open, focus is shifted into the search input; on close, focus returns to the initiating trigger element.

### B. Accordion (`src/components/primitives/Accordion/`)
- Headers contain buttons with `aria-expanded="true|false"` and `aria-controls="panel-id"`.
- Collapsible content panels have `id="panel-id"` and `role="region"`, `aria-labelledby="button-id"`.
- Keyboard navigation:
  - <kbd>ArrowDown</kbd>: Moves focus to the next accordion header (wraps around).
  - <kbd>ArrowUp</kbd>: Moves focus to previous accordion header (wraps around).
  - <kbd>Home</kbd>: Jumps directly to first accordion header.
  - <kbd>End</kbd>: Jumps directly to last accordion header.
  - <kbd>Enter</kbd> / <kbd>Space</kbd>: Toggles expansion state.

### C. Modal Dialog (`src/components/primitives/Modal/`)
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-title-id"`, `aria-describedby="modal-desc-id"`.
- Focus Trap: On open, finds all focusable elements (`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`) and loops <kbd>Tab</kbd> / <kbd>Shift+Tab</kbd> within the boundary.
- Scroll lock prevents body bounce.
- <kbd>Escape</kbd> key dismisses the dialog.

### D. Interactive Data Table (`src/components/primitives/DataTable/`)
- Semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.
- Column header sort buttons specify `aria-sort="ascending|descending|none"`.
- Select-all checkbox supports indeterminate state (`ref.indeterminate = true`).

### E. Toast Notification Queue (`src/components/primitives/Toast/`)
- Container has `role="region"` and `aria-live="polite"`.
- Individual toasts have `role="status"` with progress bar indicating remaining milliseconds before auto-dismissal.

---

## 3. Component Architecture & Props Contracts

Every component follows a clean three-file structure:
1. `ComponentName.types.ts`: Strongly typed interfaces, variant unions, and callback signatures.
2. `ComponentName.tsx`: Implementation with explicit keyboard handlers and ARIA attributes.
3. Unit test suite in `tests/`: Testing rendering, keyboard navigation, and event propagation.
