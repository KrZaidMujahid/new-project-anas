# EQUATION 1 — Minimalist Physics Laboratory UI Redesign

A complete visual and architectural overhaul of the EQUATION 1 Physics Laboratory, transforming it into an ultra-clean, distraction-free scientific instrument. The redesigned UI adopts an Obsidian Pure Black aesthetic, a disciplined Studio Split layout, and strips out all artificial textbook prose and decorative clutter so the simulation, graph, and core formulas remain the undisputed heroes.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following design decisions were established directly from your preferences in Phase 1:

- **Confirmed Aesthetic**: **Obsidian Pure Black** (`#000000` true black canvas, razor-thin `#1E293B` / `#27272A` borders, high-contrast white `#F8FAFC` typography, and single calibrated phosphor cyan `#38BDF8` accent).
- **Confirmed Standard Layout**: **Studio Split Architecture** across all 18 laboratories:
  - Top Region: Dominant simulation viewport on the left (65–70% width), compact essential parameters on the right (30–35% width).
  - Bottom Region: Full-width live mathematical graph and standardized mathematical formula card ($LaTeX$ / KaTeX).
- **Confirmed Information Hierarchy**: **Essential Only**:
  1. Simulation canvas (interactive and uncluttered)
  2. 2 to 4 primary parameter controls with explicit units
  3. Real-time mathematical graph plotting the governing equation
  4. Minimal formula card with the exact governing physics law and concise definition
  - *Completely eliminated*: Verbose AI filler paragraphs, mock verification badges ("11/11 Verified"), non-functional status tags, and redundant telemetry boxes.

---

## 1. Overview & Core Concept

- **What It Does**: A distraction-free, professional physics simulation suite for students, educators, and researchers. Users directly manipulate 2 to 4 core physical quantities, watch real-time deterministic simulations respond instantly, and observe dynamic mathematical graphs linked to fundamental physics formulas.
- **Target Audience & Academic Grade Focus**: High school and university physics classrooms, lab evaluations, and academic demonstrations where clarity, precision, and visual minimalism are prized by grading professors.
- **Key Value**: Zero cognitive overhead. The student opens any module and instantly grasps:
  1. *What am I observing?* (High-fidelity interactive canvas)
  2. *What can I alter?* (2–4 clean sliders/inputs with SI units)
  3. *What is the mathematical behavior?* (Synchronized coordinate graph)
  4. *What formula governs it?* (KaTeX formula card)

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Color Discipline (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Pure Obsidian Black (`#000000`).
  - **30% Structural Panels**: Deep Obsidian Card Surface (`#0A0A0A` / `#0D0E12`), hairline dividers (`#1F2430` / `rgba(255,255,255,0.08)`).
  - **10% Calibrated Accent**: Precision Phosphor Cyan (`#38BDF8`) for active scrubber, slider thumbs, and primary curve lines.
- **Typography & Precision Notation**:
  - **Brand & Headings**: Clean geometric sans (`Plus Jakarta Sans`, 600–700 weight, balanced headings, zero all-caps shouting).
  - **Values, Coordinates & Timestamps**: Monospace tabular numerals (`JetBrains Mono tabular-nums`).
  - **Formulas**: KaTeX mathematical typography with clear symbol definitions.
- **Anti-Slop Discipline**:
  - No pill badge sandwiches or arbitrary colored capsules.
  - No fake version tags (`v2.0-CORE`), fake telemetry strings, or mock verification stamps.
  - No decorative pulsing dots or non-functional status chips.
  - Buttons have 1-line human labels (`Play`, `Pause`, `Reset`, `Step`).

### Consistent Laboratory Template
Every laboratory view adheres to an identical, predictable rhythm:

```
┌────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: EQUATION 1  —  [Module Name]  —  [Presets / Reset]            │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌───────────────────────────────────────┐  ┌───────────────────────┐  │
│  │                                       │  │ PARAMETERS            │  │
│  │                                       │  ├───────────────────────┤  │
│  │       SIMULATION VIEWPORT             │  │ Slider 1 (SI Unit)    │  │
│  │       (Interactive Canvas / SVG)      │  │ Slider 2 (SI Unit)    │  │
│  │                                       │  │ Slider 3 (SI Unit)    │  │
│  │                                       │  ├───────────────────────┤  │
│  │                                       │  │ Playback Controls     │  │
│  └───────────────────────────────────────┘  └───────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ MATHEMATICAL GRAPH (Live Plot: Theory vs Instantaneous State)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ FORMULA & LAW: KaTeX Display Equation + 1-2 Line Law Statement   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Removal of Auxiliary Clutter Panels**:
  - *Chosen Approach*: Remove all long multi-paragraph explanation boxes, secondary assumption accordions that duplicate textbook text, and multi-metric debug readouts.
  - *Why*: The user emphasized that the previous design looked "disgusted" and cluttered. A focused, minimalist design ensures immediate visual clarity and academic appeal.
- **Decision 2: Standardized Parameter Deck (2–4 Controls)**:
  - *Chosen Approach*: Distill controls in each lab down to 2 to 4 fundamental independent variables (e.g. for Double Slit: Wavelength $\lambda$, Slit Separation $d$, Screen Distance $L$; for Collision: Masses $m_1, m_2$, Initial Velocities $v_1, v_2$, Elasticity $e$).
  - *Why*: Reduces cognitive friction and highlights the cause-and-effect relationship between parameters and the resulting simulation and graph.
- **Decision 3: Dedicated Mathematical Graph**:
  - *Chosen Approach*: Replace complex multi-tab telemetry widgets with a single, pristine SVG/Canvas mathematical curve displaying the exact function (e.g. $I(\theta)$ intensity curve, $v(t)$ velocity-time curve, $P(V)$ indicator diagram, or $F(r)$ centripetal force curve).
  - *Why*: Connects physics simulation directly to calculus and analytical geometry.

---

## 4. Technical Architecture & Component Structure

### Component Hierarchy

```
App.tsx (Obsidian Theme Provider & Router)
 ├── Header.tsx (Minimal 3-zone Obsidian Top Bar)
 ├── Sidebar.tsx (Quiet Obsidian Drawer / Collapsible Catalog)
 ├── MobileModuleSelector.tsx (Subtle 1-line Category Bar on Mobile)
 └── [Laboratory View Components] (e.g., CollisionLaboratory, DoubleSlitLaboratory, etc.)
      ├── LabHeader (Module Title, Formula Kicker, Presets Trigger)
      ├── StudioSplit (CSS Grid: 8 cols Canvas / 4 cols Parameters)
      │    ├── SimulationCanvas (Responsive Canvas with ResizeObserver)
      │    └── ParameterDeck (2-4 Sliders + Scrub/Playback Controls)
      ├── MathematicalGraph (Responsive SVG Line Plot with Axis Guides)
      └── FormulaCard (KaTeX Display Equation + Concise Variable Legend)
```

### Plan of Action Across Modules
1. **Global Styles & Theme Palette (`index.css`)**:
   - Establish obsidian color tokens (`--bg-obsidian: #000000`, `--surface-card: #0A0A0A`, `--border-subtle: #1E293B`, `--text-primary: #F8FAFC`, `--text-secondary: #94A3B8`).
2. **Top Navigation (`Header.tsx`) & Catalog (`Sidebar.tsx`)**:
   - Restyle to true obsidian black with hairline borders. Clean up wordmark and navigation buttons.
3. **Core Laboratory Standardization**:
   - Refactor primary laboratories (Double Slit, Collision, Circular Motion, Projectile, Incline, SHM, Newton, Free Fall, Optics, RLC, Lorentz, Doppler, Bohr, Photoelectric, Carnot, Kinetic) into the uniform Studio Split structure.
   - Clean out AI textbook prose and mock telemetry chips.
   - Standardize KaTeX formula cards with SI unit legends.
4. **Validation & Polish**:
   - Ensure pixel-perfect responsiveness from 360px mobile up to 4K displays with zero horizontal scroll and zero layout clipping.
