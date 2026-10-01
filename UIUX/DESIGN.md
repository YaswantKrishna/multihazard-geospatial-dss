---
name: Apex Incident Command
colors:
  surface: '#0d1322'
  surface-dim: '#0d1322'
  surface-bright: '#33394a'
  surface-container-lowest: '#080e1d'
  surface-container-low: '#151b2b'
  surface-container: '#191f2f'
  surface-container-high: '#242a3a'
  surface-container-highest: '#2f3445'
  on-surface: '#dde2f8'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#dde2f8'
  inverse-on-surface: '#2a3040'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#bbc7de'
  on-secondary: '#253143'
  secondary-container: '#3b475a'
  on-secondary-container: '#a9b6cc'
  tertiary: '#ffc176'
  on-tertiary: '#472a00'
  tertiary-container: '#f1a02b'
  on-tertiary-container: '#613b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#d7e3fb'
  secondary-fixed-dim: '#bbc7de'
  on-secondary-fixed: '#101c2d'
  on-secondary-fixed-variant: '#3b475a'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb960'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0d1322'
  on-background: '#dde2f8'
  surface-variant: '#2f3445'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  label-xs:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style
The design system embodies mission-critical precision, extreme situational awareness, and split-second operational clarity. Built for high-stress crisis response environments, defense telemetry dashboards, and emergency command centers, the aesthetic merges technical minimalism with targeted, high-performance glass overlays. 

Visual hierarchy prioritizes low-cognitive-load data ingestion: dark canvas architecture reduces eye strain over long watch shifts, while vibrant tactical tokens instantly telegraph threat postures. Non-critical decorative fluff is ruthlessly eliminated. High-information density, structural paneled alignment, and crystalline typography create an environment of absolute authority, control, and analytical calm.

## Colors
The color architecture relies on a specialized dark tiering system punctuated by tactical semantic signals:
- **Base Canvas (`#0B1120`)**: Deep void surface providing infinite depth beneath geonavigation and telemetry feeds.
- **Main Panels (`#111827`)**: Foundational structural surfaces with backdrop filtering for primary command zones.
- **Secondary Cards/Overlays (`#172033`)**: High-priority tactical cards, HUD monitors, and telemetry modules.
- **Subtle Structural Strokes (`#263244`)**: Crisp, 1px low-contrast dividers and borders defining spatial zones without visual weight.
- **Primary Operational Accent (`#38BDF8`)**: Sky cyan reserved strictly for active viewport selections, telemetry highlights, crosshairs, and nominal system state indicators.

### Strict Risk Semantics
Chromatic saturation is tightly governed. The following palette must never be used decoratively or for standard UI navigation, only for live incident data:
- **Success (`#22C55E`)**: Nominal operations, resolved incidents, verified asset contact.
- **Warning (`#F59E0B`)**: Developing situations, advisory thresholds, sensor anomalies.
- **Danger (`#EF4444`)**: Direct threat breaches, system failures, active emergency incidents.
- **Critical (`#DC2626`)**: Life-safety threats, catastrophic integrity failures, immediate kinetic escalations.

## Typography
Typographic clarity directly impacts reaction times. The system deploys `Inter` across all structural, telemetry, and interactive touchpoints for its neutral, highly legible grotesque characteristics and robust tabular numeral support (`tnum`).

Headlines are tight, clinical, and subdued. High-level metric readouts, incident coordinates, and telemetry timestamps require monospaced tabular figures (`font-variant-numeric: tabular-nums`) to prevent optical shifting during real-time streaming updates. Micro-labels and telemetry indicators utilize uppercase styling with expanded tracking to ensure immediate identification against dark baselines.

## Layout & Spacing
The layout employs an ultra-dense, full-bleed operational canvas tailored for large situational awareness displays, operations centers, and multi-monitor field desks.

### Layout Model
- **Command Canvas (Desktop & NOC Video Walls)**: Zero outer margin option for situational map engines. Tactical HUD panels, incident lists, and timeline tracks dock into fixed left (320px–400px) and right (360px–480px) drawers flanking a fluid central GIS/tactical map viewport.
- **Micro-Gutter Cadence**: Standard 12px (`0.75rem`) gutters between mission panels allow high screen-real-estate efficiency, preserving operational density without visual collision.
- **Responsive Adaptations**:
  - **Desktop (>= 1280px)**: Persistent multi-pane telemetry, bi-directional side docks, floating bottom-pinned incident log.
  - **Tablet (768px - 1279px)**: Dynamic slide-over drawers; central GIS viewport remains primary with collapsible side inspection sheets.
  - **Mobile (< 768px)**: Stacked operational mode with quick-access bottom sheets, fixed floating incident status bar, and tabbed drawer switches.

## Elevation & Depth
Elevation is realized strictly through surface luminance and tactical glass layers rather than ambient shadows. Dropped shadows are forbidden in core operational grids to prevent edge blur across tightly packed data.

- **Level 0 (Map / Ground Canvas)**: `#0B1120` solid.
- **Level 1 (Docked Shell Panels)**: `#111827` with solid 1px border of `#263244`.
- **Level 2 (Floating Cards / Floating Modals)**: `rgba(23, 32, 51, 0.85)` augmented with `backdrop-filter: blur(12px)` and a crisp perimeter border of `rgba(38, 50, 68, 0.9)`.
- **Level 3 (Tactical Threat Overlays & Flyouts)**: `rgba(17, 24, 39, 0.95)` with high-contrast active borders keyed to incident priority (e.g., 1px stroke of `#EF4444` for active critical hazards).

## Shapes
A technical, compact shape language (`roundedness: 1`) conveys engineering discipline and system rigidity. 

Elements use a subtle 4px (`0.25rem`) default radius, preventing corner clipping inside dense data grids and retaining architectural structure. Cards, dialog boxes, and situational flyouts utilize 8px (`0.5rem`) corner smoothing. Circular shapes are strictly restricted to asset map pins, radar sweeps, and round status beacon blips.

## Components

### Buttons
- **Primary Action**: Background `#38BDF8`, text `#0B1120`, font weight 600. Flat fill, 0.25rem corner radius, hover state `#7DD3FC`. Active click triggers a 1px inner inset glow.
- **Secondary / Tactical**: Background `#172033`, border 1px solid `#263244`, text `#F8FAFC`. Hover state: border color `#38BDF8` with text shifting to `#38BDF8`.
- **Danger Override**: Background `rgba(239, 68, 68, 0.15)`, border 1px solid `#EF4444`, text `#EF4444`. Hover state: background `#EF4444`, text `#FFFFFF`. Reserved solely for emergency override actions (e.g., "Evacuate Sector", "Broadcast Alert").

### Threat & Status Chips
- Height 20px–24px, uppercase text (`label-xs`).
- **Structure**: Low-opacity surface base (`rgba(..., 0.12)`), solid 1px border matched to the semantic token, and a pulsing 6px status dot on the leading edge.
- **Semantic Mappings**:
  - Nominal: Border `#22C55E`, text `#4ADE80`.
  - Advisory: Border `#F59E0B`, text `#FBBF24`.
  - Hazard: Border `#EF4444`, text `#F87171`.
  - Catastrophic: Border `#DC2626`, background `rgba(220, 38, 38, 0.25)`, text `#FCA5A5`.

### Cards & Telemetry Containers
- Background `#111827` or glass `#172033` (85% opacity with blur).
- Border 1px solid `#263244`.
- Header bars within cards feature a 32px height, subtle bottom border `#263244`, monospaced technical identifier on the left (`label-sm`), and live status indicators on the right.

### Input Fields & Search Bars
- Background `#0B1120`, border 1px solid `#263244`, text `#F8FAFC`.
- Focus ring: 1px border glow using `#38BDF8` with no offset diffuse blur.
- Monospaced coordinates or system query placeholder text (`#64748B`).

### Checkboxes & Radios
- Size 16px × 16px. Border 1px solid `#263244`.
- Checked state: `#38BDF8` fill with dark icon `#0B1120`. Sharp 2px radius for checkboxes, 100% circular for radios.

### Specialized Mission-Critical Components
- **GIS Floating Control HUD**: Glass container with vertical tool stack (`#172033` with blur), 1px `#263244` borders, housing layer toggles, perimeter measure tools, and infrared switches.
- **Incident Feed Item**: Interactive list cell with high-contrast threat indicator bar along the absolute left edge (3px width), tabular timestamp (`body-sm`), and threat classification title (`headline-md`).
- **Telemetry Readout Block**: Stacked value card featuring prominent numeric counters (`headline-xl`, tabular figures) above a tracked micro-label (`label-xs`).