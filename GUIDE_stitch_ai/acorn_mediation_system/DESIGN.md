---
name: Acorn Mediation System
colors:
  surface: '#fff8f5'
  surface-dim: '#e2d8d2'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf2eb'
  surface-container: '#f6ece6'
  surface-container-high: '#f0e6e0'
  surface-container-highest: '#eae1da'
  on-surface: '#1f1b17'
  on-surface-variant: '#554336'
  inverse-surface: '#342f2b'
  inverse-on-surface: '#f9efe8'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#904d00'
  primary: '#8d4b00'
  on-primary: '#ffffff'
  primary-container: '#b15f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb77d'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#4648d4'
  on-tertiary: '#ffffff'
  tertiary-container: '#6063ee'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#fff8f5'
  on-background: '#1f1b17'
  surface-variant: '#eae1da'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 19px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code-sm:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves an AI-assisted team project collaboration and mediation platform tailored for university students. The brand personality balances academic focus, high operational efficiency, and gentle interpersonal mediation. It merges the focused craft of modern project software (Linear) with the flexible, organic workspace of editorial document tools (Notion) and the immediate clarity of asynchronous chat applications (Slack).

### Aesthetic Philosophy: Warm Minimalist Workspace
- **Personality:** Empathetic, orderly, reassuring, and productive. Group assignments often introduce interpersonal tension and unequal workloads; the interface counters this anxiety through warm, balanced tones, clear structural hierarchy, and calm feedback states.
- **Design Style:** Warm Minimalist with tactile paper-like depth. Interfaces rely on disciplined typographic proportion, delicate structural strokes, soft acorn-inspired honey accents, and balanced surface layering rather than intense saturated fields or rigid corporate grayness.
- **Visual Tone:** Productive without being sterile; approachable without becoming juvenile. Accents draw inspiration from autumn forest floors, ripe acorns, clean paper stock, and quiet study halls.

## Colors

The palette establishes an organic, warm-neutral foundation calibrated for low eye strain across lengthy student work sessions, with deliberate semantic accents representing mediation states, positive task momentum, and cognitive alerts.

### Surface and Canvas Palette
- **Canvas Base (`bg-canvas`):** `#FBFBFA` — A soft, warm off-white inspired by heavy book stock. Avoids pure cool `#FFFFFF` on full-screen displays.
- **Surface Elevation (`bg-surface`):** `#FFFFFF` — Used for functional cards, active modals, and distinct document blocks.
- **Surface Muted (`bg-muted`):** `#F5F5F4` (Warm Stone 100) — Employed for sidebars, inactive list rails, and non-selected input backdrops.
- **Surface Subdued (`bg-subdued`):** `#E7E5E4` (Warm Stone 200) — For secondary tags, table headers, and nested code or quote containers.

### Brand & Accent Architecture
- **Primary (Acorn Amber - `#D97706`):** Drives principal interactive controls, AI mediation highlights, focused badges, and major progress triggers.
  - Hover: `#B45309`
  - Subtle Surface: `#FEF3C7` (Amber 100)
  - Ghost Highlight: `#FFFBEB` (Amber 50)
- **Secondary (Forest Spruce - `#10B981`):** Represents completed tasks, harmonious team balance, consensus affirmations, and verified checklist milestones.
  - Subtle Surface: `#ECFDF5`
  - Deep Text: `#047857`
- **Tertiary (Deep Iris - `#6366F1`):** Represents AI mediation prompts, synthesis operations, automated meeting summaries, and neutral sentiment insight.
  - Subtle Surface: `#EEF2FF`
  - Deep Text: `#4338CA`
- **Attention & Conflict Warning (`#F43F5E`):** Reserved for unassigned workload discrepancies, delayed deliverables, and escalation alerts.
  - Subtle Surface: `#FFF1F2`

### Structural Borders & Text Neutral
- **Hairline Border:** `#F3F4F6` and `#FEF3C7` (for highlighted cards).
- **Default Divider:** `#E7E5E4` (Stone 200).
- **Strong Structural Border:** `#D6D3D1` (Stone 300).
- **Text Primary:** `#1C1917` (Stone 900) — Deep warm black for maximum contrast and legibility in both Korean and Latin scripts.
- **Text Secondary:** `#57534E` (Stone 600) — Contextual helper text, timestamps, and table headers.
- **Text Tertiary / Disabled:** `#A8A29E` (Stone 400).

## Typography

The typography couples geometric clarity in headings with high-density neutral body fonts configured to support dual-script environments (English & Korean). Font stacks cascade seamlessly to system fallbacks (`Pretendard, -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", sans-serif`) to ensure optimal Korean rendering across all native operating systems.

### Type Roles and Structure
- **Display & Headings (Plus Jakarta Sans / Pretendard):** Softly rounded geometry gives a human, welcoming presence to team project rooms, task headers, and AI synthesis banners.
- **Body & Data Grid (Inter / Pretendard):** Optimized for data density, checklists, thread comments, and status rollups. Tightly controlled tracking ensures Korean characters sit alongside Latin alphanumeric dates and IDs without visual drift.
- **Mediation & Log Code (Space Mono):** Used sparingly for sprint tokens, timestamp markers, metric counters, and export receipts.

## Layout & Spacing

The layout model adopts a fluid-responsive structure anchored by a 12-column desktop grid for core project views (Kanban board, Gantt overview, and AI mediation dashboard), folding into an ergonomic single-column view on mobile screens.

### Spatial Rhythm
- **Core Unit:** Built strictly on a 4px/8px modular base. Micro-padding adheres to 4px increments; card gaps, panel sections, and column gutters use multiples of 8px or 16px.
- **Section Margins:** Desktop displays utilize a maximum canvas constraint of `1440px` with dynamic fluid horizontal padding (`margin-desktop: 2rem`), preventing task boards from stretching beyond natural peripheral scanning lines.
- **Desktop Sidebar Architecture:** Fixed collapsible left sidebar (`240px` expanded, `64px` icon-only) containing project spaces, teams, and acorn scorecards; main area fluidly manages task rows and split-pane AI mediation threads.
- **Breakpoints:**
  - `Mobile (< 768px)`: 4-column flow, full-bleed modals, edge margin `1rem`, vertical bottom navigation bar.
  - `Tablet (768px - 1024px)`: 8-column layout, compact sidebar drawer, card gutters `1rem`.
  - `Desktop (> 1024px)`: 12-column layout, persistent navigation, multi-pane mediation drawers.

## Elevation & Depth

Visual hierarchy uses a refined hybrid approach: **tactile paper-layering combined with ambient warm-tinted shadows and crisp ghost borders**. High-contrast drops and blur-heavy neon glows are eliminated in favor of clean separation.

### Surface Tiers
- **Tier 0 (Backdrop Canvas):** Solid `#FBFBFA`. Carries no shadow.
- **Tier 1 (Resting Cards & Containers):** Solid `#FFFFFF`, bordered by `1px solid #E7E5E4`. Elevated with an ambient warm shadow: `box-shadow: 0 1px 3px rgba(120, 113, 108, 0.06), 0 1px 2px rgba(120, 113, 108, 0.04)`.
- **Tier 2 (Interactive Hover / Dragged Cards):** Cards in motion or active checklists receive elevated warmth: `box-shadow: 0 8px 20px -4px rgba(180, 83, 9, 0.08), 0 4px 6px -2px rgba(28, 25, 23, 0.03)`. Border shifts to `#FDE68A` (Amber 200).
- **Tier 3 (Floating Popovers, Dropdowns & Mediation Prompts):** `#FFFFFF` paired with crisp stroke `1px solid #D6D3D1` and deep diffused shadow: `box-shadow: 0 16px 32px -8px rgba(28, 25, 23, 0.1), 0 4px 8px -2px rgba(28, 25, 23, 0.04)`.
- **Tier 4 (System Modal):** Centered modal with soft warm-black scrim: `backdrop-filter: blur(4px); background-color: rgba(28, 25, 23, 0.4)`.

### Ghost Outlines & Accents
To maintain Notion-like editorial discipline, components rely first on interior contrast and `1px` crisp hairline borders rather than heavy elevation. AI-focused mediation containers use a distinct double-layer outline: an interior `#FEF3C7` subtle glow wrapped in a stone-200 boundary.

## Shapes

The design system embraces balanced geometric curvature (Scale 2 - Rounded) with contextual escalations. Rounded corners visually soften academic pressures while keeping data grids compact and neat.

### Curvature Guidelines
- **Core Elements (Inputs, Buttons, Badges):** Standardized on `0.5rem` (`8px`) for immediate precision.
- **Cards, Panels & Task Containers:** Standardized on `rounded-xl` (`0.75rem` / `12px`) or `rounded-2xl` (`1rem` / `16px`) for large canvas surfaces.
- **Badges, Avatar Markers, Pill Actions:** Full curvature (`rounded-full` / `9999px`) to distinguish actionable metadata tags from rectangular content containers.
- **Iconography Geometry:** Soft acorn geometry (curved bottom bowl, flat micro-cap with organic stem lines) acts as the iconographic foundation for custom team satisfaction ratings and peer nudges.

## Components

### Buttons
- **Primary (Action / Resolve / Submit):** Background `#D97706`, text `#FFFFFF`, radius `8px`, typography `label-md`. Hover shifts to `#B45309`. Active micro-press transition `scale(0.98)`. Focused ring: `2px solid #F59E0B` with `2px` offset.
- **Secondary (Sub-action / Add Task):** Background `#FFFFFF`, border `1px solid #E7E5E4`, text `#1C1917`. Hover: `#F5F5F4` background and `#D6D3D1` border.
- **Tertiary (Ghost):** Background transparent, text `#57534E`. Hover: `#F5F5F4` background, text `#1C1917`.
- **AI Mediation Action:** Background `#EEF2FF`, border `1px solid #C7D2FE`, text `#4338CA`. Accompanied by a spark/acorn dual-tone glyph.

### Status Badges & Chips
- **Neutral / Draft:** Background `#F5F5F4`, border `#E7E5E4`, text `#57534E`.
- **In Mediation (AI Active):** Background `#FFFBEB`, border `#FDE68A`, text `#B45309`. Includes pulsing amber dot indicator.
- **Resolved / Done:** Background `#ECFDF5`, border `#A7F3D0`, text `#047857`.
- **Overdue / Discrepancy:** Background `#FFF1F2`, border `#FECDD3`, text `#BE123C`.
- **Dimensions:** Height `24px`, padding `0 8px`, border-radius `9999px`, typography `label-sm`.

### Checklists & Task Cards
- **Card Surface:** Background `#FFFFFF`, border `1px solid #E7E5E4`, radius `12px`, padding `12px 16px`.
- **Interactive Checkbox:** Custom `18px x 18px` square with `4px` corner radius. Unchecked: `1.5px solid #D6D3D1`, hover `border-amber-500`. Checked: Background `#D97706`, stroke checkmark `#FFFFFF`. Completed checklist labels automatically transition to `line-through` with `#A8A29E` coloration.
- **Member Assignment Pill:** Small stacked avatar group (`24px` circles) with trailing task load counter.

### Input Fields & Search Bars
- **Container:** Background `#FFFFFF`, border `1px solid #E7E5E4`, radius `8px`, padding `10px 14px`, typography `body-md`.
- **Placeholder:** Text `#A8A29E`.
- **Focus State:** Border `#D97706`, ring `3px solid rgba(217, 119, 6, 0.15)`, background `#FFFFFF`.

### Team Member Health & Contribution Indicator
- **Acorn Meter (도토리 게이지):** A segmented progress component tracking healthy workload balance. Displays individual contribution percentages alongside a gentle mood tag ("균형 유지 중", "지원 필요").
- **Avatar Rings:** Color-coded status stroke around profile images (`#10B981` for balanced progress, `#F59E0B` for active mediation, `#6366F1` for AI reviewing).

### AI Mediation Summary Card
- **Dedicated Container:** Tinted gradient surface transitioning from `#FFFDF7` to `#FBFBFA`, bordered with a refined `1px solid #FDE68A`.
- **Header:** Features an acorn-seed icon with badge "AI 소통 리포트", timestamp, and quick consensus confirmation buttons ("동의하기", "조율 요청").