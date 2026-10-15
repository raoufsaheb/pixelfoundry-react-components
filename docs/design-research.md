# Design Research & Aesthetic Direction — PixelFoundry

## 1. Aesthetic Concept: Swiss Modernism & Bauhaus Design Engineering

PixelFoundry is modeled on the visual rigor and functional precision of the Swiss International Typographic Style (Max Bill, Josef Müller-Brockmann) merged with Bauhaus industrial functionalism:
- **Visual Tenets**:
  - Grid-governed layouts with crisp 1px borders (`#22252A`).
  - Strict hierarchical scale using mathematical type ratios.
  - Absence of superfluous decorations or decorative gradients.
  - High-visibility focus indicators designed for accessibility and keyboard-first power users.

---

## 2. Color Palette & Optical Tokens

| Token | Hex Value | Semantic Purpose |
|---|---|---|
| `canvas-base` | `#0C0D0E` | Deep graphite architectural backdrop |
| `surface-raised` | `#141618` | Primary component card and modal surface |
| `surface-elevated` | `#1C1F23` | Active item highlight, hover states |
| `border-subtle` | `#22252A` | Geometric separation lines |
| `border-active` | `#3A414B` | Input borders, hovered containers |
| `text-primary` | `#F3F4F6` | High-contrast header and body typography |
| `text-muted` | `#9CA3AF` | Supporting descriptions, keyboard shortcuts |
| `accent-blue` | `#3B82F6` | Focus rings, active selection, primary actions |
| `accent-orange` | `#FF5722` | Safety warning, destructive triggers |
| `accent-emerald` | `#10B981` | Success toast, validation indicators |

---

## 3. Typography Hierarchy

- **UI & Controls**: **Plus Jakarta Sans** (SemiBold 600, Medium 500, Regular 400).
- **Code & Attributes**: **JetBrains Mono** with tabular figures (`tnum` 1) and crisp punctuation rendering for props, interfaces, and terminal keys.
- **Micro-Interactions**:
  - Focus outlines use high-contrast dual ring styling (`outline-none ring-2 ring-[#3B82F6] ring-offset-2 ring-offset-[#0C0D0E]`).
  - Keyboard badges use crisp monospaced tags (`<kbd className="px-1.5 py-0.5 rounded bg-[#1C1F23] border border-[#22252A] font-mono text-[10px]">`).
