---
version: alpha
name: Athenaeum Modern
description: Utility-Luxe library-management UI built on Nuxt UI v4 and Tailwind CSS 4 — burnt-orange primary with warm stone neutrals, muted-teal secondary, full light/dark support.
colors:
  primary: "#9f3c11"
  primary-container: "#9f3c11"
  on-primary: "#ffffff"
  on-primary-container: "#ffc9b6"
  primary-fixed: "#ffdbcf"
  primary-fixed-dim: "#ffb59b"

  secondary: "#2f6670"
  on-secondary: "#ffffff"
  secondary-container: "#b2e9f4"
  on-secondary-container: "#346a74"

  surface: "#FFFFFF"
  surface-dim: "#dbdad9"
  surface-bright: "#fbf9f8"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f5f3f2"
  surface-container: "#efedec"
  surface-container-high: "#eae8e7"
  surface-container-highest: "#e4e2e1"

  on-surface: "#1b1c1b"
  on-surface-variant: "#57423b"
  inverse-surface: "#303030"
  inverse-on-surface: "#f2f0ef"

  outline: "#8a7269"
  outline-variant: "#dec0b6"
  surface-tint: "#a23e13"

  border-subtle: "#E5E1E0"
  text-primary: "#1A1A1A"
  text-muted: "#666666"
  active-indicator: "#FCEEE8"

  background: "#fbf9f8"
  on-background: "#1b1c1b"

  success: "#2E7D32"
  warning: "#B7791F"
  error: "#C0392B"

  dark-surface: "#292524"
  dark-canvas: "#1C1917"
  dark-surface-container: "#292524"
  dark-surface-container-high: "#3a3532"
  dark-border: "#3a3532"
  dark-border-muted: "#292524"
  dark-border-strong: "#4a4440"
  dark-ink: "#e7e5e4"
  dark-ink-highlighted: "#faf9f7"
  dark-ink-muted: "#a8a29e"
  dark-ink-faint: "#78716c"

typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: 600
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 600
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px

rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px

spacing:
  grid-unit: 4px
  sidebar-width: 240px
  sidebar-collapsed: 72px
  gutter: 16px
  section-gap: 32px
  table-padding-y: 8px
  table-padding-x: 12px
  margin-desktop: 32px
  margin-mobile: 16px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.DEFAULT}"
  button-secondary:
    backgroundColor: transparent
    borderColor: "{colors.secondary}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.DEFAULT}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.text-muted}"
    rounded: "{rounded.DEFAULT}"
  input:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-subtle}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.DEFAULT}"
    padding: 12px
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-subtle}"
    rounded: "{rounded.lg}"
    padding: 16px–24px
  badge:
    rounded: "{rounded.DEFAULT}"
    note: "Never pill-shaped"
  modal:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    shadow: "0 8px 32px rgba(0,0,0,0.04)"
---

# Athenaeum Modern Design System

## Brand & Style

The design system is engineered for high-utility enterprise environments, specifically tailored for the meticulous needs of library management. It balances high information density with a "Utility-Luxe" aesthetic, drawing inspiration from modern professional workstations rather than traditional administrative software.

The brand personality is **Modern Minimalist with Warm Professionalism**. It utilizes a warm, paper-like canvas to reduce cognitive load and eye strain during long cataloging sessions. The visual language is disciplined and geometric, evoking a sense of curated order and intellectual clarity. It is designed to feel premium yet functional, ensuring that power users feel equipped with a precise tool rather than a generic interface.

## Colors

This design system avoids the clinical "cold" blues common in SaaS, opting instead for a palette that feels academic and grounded.

- **Primary — Burnt Orange (#9F3C11):** Used exclusively for the "Primary Action Path." This includes main CTAs, active navigation states, focus rings, and critical alerts. Full ramp from `#FCEEE8` (50) to `#330F00` (950).
- **Secondary — Muted Teal (#2F6670):** Provides a calm, chromatic contrast for non-critical information visualization and secondary interactive elements.
- **Background — Warm Off-White (#FBF9F8):** A soft, high-quality paper tone that serves as the foundation for the entire UI.
- **Surface — Pure White (#FFFFFF):** Reserved for containers, cards, and input fields to create a clear "layering" effect against the warm background.
- **Surface hierarchy:** A graduated scale from `surface-container-lowest` (#FFFFFF) through `surface-container` (#EFEDEC) to `surface-container-highest` (#E4E2E1) for nuanced depth without shadows.
- **Semantic Colors:** Success (#2E7D32), Warning (#B7791F), and Error (#C0392B) — tuned for high legibility on warm backgrounds while maintaining a professional, slightly desaturated profile.
- **Active nav wash (#FCEEE8 light / #3A2118 dark):** Soft brand tint marking the current sidebar item.

## Typography

The typography strategy leverages the technical, "locked-in" feel of **Geist** for high-level information architecture and the neutral, systematic legibility of **Inter** for functional UI and data.

- **Display / Headlines:** Set in Geist with tight letter-spacing to create a distinctive, editorial professional look. `display-lg` (48px) for hero metrics, `headline-lg` (32px) for page titles, `headline-md` (24px) for section headers.
- **UI & Data:** Inter is the workhorse of the system. The 14px `body-md` is the default for most interface elements to balance density and readability. `body-lg` (18px) for prominent descriptions.
- **Condensed Labels:** `label-sm` (11px, semibold) is specifically designed for table headers and semantic badges, ensuring clarity even at small scales. `label-md` (12px, medium) for metadata and secondary info.

## Layout & Spacing

The layout is built on a strict **4px grid** to ensure mathematical precision across all components.

- **Sidebar:** A fixed 240px sidebar anchors the desktop experience. It collapses to a 72px icon-only rail for increased workspace.
- **Grid System:** Use a 12-column fluid grid for dashboard content. Major sections must maintain at least a 32px vertical gap to ensure the "Luxe" feel remains despite high internal component density.
- **Density:** Information-heavy views (like the book catalog) utilize "Condensed" spacing, with 8px vertical padding in table rows, allowing for maximum data visibility without vertical scrolling.
- **Breakpoints:**
  - **Desktop (1024px+):** 32px margins, 240px sidebar.
  - **Tablet (768px–1023px):** 24px margins, 72px collapsed sidebar.
  - **Mobile (<768px):** 16px margins, single column, bottom or top navigation bar.

## Elevation & Depth

This design system avoids heavy drop shadows, relying instead on **Tonal Layers** and **Micro-Borders** to communicate hierarchy.

- **Level 0 (Base):** The #FBF9F8 background provides the canvas.
- **Level 1 (Cards/Surfaces):** Pure white containers use a 1px #E5E1E0 border. There is no shadow; depth is achieved through the color contrast between the white surface and the off-white background.
- **Level 2 (Modals/Popovers):** Elements that float above the UI use a pure white surface, a 1px border, and a "Subtle-Luxe" shadow: `0 8px 32px rgba(0, 0, 0, 0.04)`.
- **Interactivity:** Elements do not "lift" on hover. Instead, indicate interactivity through subtle color shifts — either darkening the border or applying a light tonal background tint (e.g., #FCEEE8).

## Shapes

The shape language is disciplined and architectural. A standard **4px (Soft)** radius is used for almost all UI elements to maintain a professional, structured aesthetic.

- **Buttons & Inputs:** 4px radius is mandatory.
- **Badges:** 4px radius. **Avoid pill shapes** (rounded-full) as they conflict with the "Utility-Luxe" narrative.
- **Cards & Modals:** 8–12px radius to distinguish container boundaries.
- **Utility Tools:** Global search bars may use an 8px (rounded-lg) radius to distinguish them as high-level utilities.

## Components

### Sidebar & Navigation
The sidebar should feel like a solid architectural element. Active states are indicated by a 2px Burnt Orange vertical bar on the left edge and a subtle #FCEEE8 background fill. Icons should be 20px with a 1.5px stroke weight.

### Data Tables
Tables are the core functional component.
- Use only horizontal borders (1px #E5E1E0).
- Headers use `label-sm` in Muted Gray, uppercase.
- Row hover states use a subtle #F7F5F4 background tint.

### Buttons
- **Primary:** Burnt Orange background, White text. Bold and authoritative.
- **Secondary:** Transparent background, 1px Teal border, Teal text.
- **Ghost:** No border or background, Muted Gray text. Primarily for secondary actions in dense rows.

### Forms & Inputs
Inputs use a 1px #E5E1E0 border and a white surface. On focus, the border transitions to Burnt Orange with a focus ring. Labels must be placed above the field in `label-md` weight 600.

### Badges
Semantic badges use a light background of the state color with high-contrast text. They are never pill-shaped; they must follow the 4px border radius rule.
- **Available / On Time:** Light Green / Dark Green.
- **Borrowed / Due Soon:** Light Teal or Amber / Dark Teal or Amber.
- **Overdue:** Light Red / Dark Red.

### Cards
Cards are flat containers with 1px borders. Use them to group dashboard widgets or book details. Padding within cards should follow the 4px grid (e.g., 16px, 24px, or 32px).

## Do's and Don'ts

- Do use the terracotta accent sparingly — one dominant action per view.
- Don't introduce pure black/white backgrounds; always use the warm stone tints.
- Do keep depth flat — prefer borders over shadows.
- Don't mix radii levels within one component group.
- Don't use pill-shaped badges — use 4px radius.
- Do support both light and dark themes with token swaps, not hard-coded colors.
