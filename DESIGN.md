---
version: alpha
name: Athenaeum Navy
description: Navy + gold library-management UI built on Nuxt UI v4 and Tailwind CSS 4 — deep navy workstation navigation, cool slate neutrals, soft blue washes, rounded cards with soft shadows, and a light content canvas.
colors:
  primary: "#173b70"
  primary-deep: "#132f57"
  primary-ink: "#102743"
  on-primary: "#ffffff"
  primary-accent: "#e5a214"
  primary-accent-soft: "#f5c54a"
  primary-wash: "#edf4ff"

  secondary: "#2f8e78"
  on-secondary: "#ffffff"
  secondary-container: "#eaf7f2"

  surface: "#FFFFFF"
  background: "#f7f9fc"
  background-elevated: "#f1f5fa"
  background-accented: "#eaf0f7"
  search-surface: "#f7f9fc"

  border: "#e4ebf3"
  border-strong: "#dce5ef"
  border-muted: "#edf1f6"
  border-accented: "#cdd9e8"
  focus-ring: "#8ca9ce"

  text-primary: "#263f5f"
  text-highlighted: "#132f57"
  text-muted: "#667896"
  text-dimmed: "#8a99ae"
  nav-inactive: "#aabbd0"
  nav-hover-bg: "rgba(255,255,255,0.08)"

  active-indicator: "#e5a214"

  success: "#20876e"
  warning: "#b9790b"
  error: "#d84332"

typography:
  display:
    fontFamily: Geist Variable
    note: "font-display for brand wordmark"
  headline:
    fontFamily: Georgia, serif
    fontSize: 32px
    fontWeight: 700
    letterSpacing: -0.035em
  headline-card:
    fontFamily: Georgia, serif
    fontSize: 18px
    fontWeight: 700
  stat-value:
    fontFamily: Georgia, serif
    fontSize: 28px
    fontWeight: 700
    letterSpacing: -0.04em
  body-md:
    fontFamily: Inter Variable
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  label-md:
    fontFamily: Inter Variable
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  label-sm:
    fontFamily: Inter Variable
    fontSize: 11px
    fontWeight: 600
    lineHeight: 14px

rounded:
  sm: 0.375rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 0.75rem
  xl: 0.75rem
  2xl: 1rem
  full: 9999px

spacing:
  grid-unit: 4px
  sidebar-width: 256px
  sidebar-collapsed: 72px
  content-max: 1400px
  section-gap: 20px
  card-padding: 20px
  stat-icon: 56px
  header-height: 72px
  margin-desktop: 32px
  margin-mobile: 16px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
  sidebar:
    backgroundColor: "{colors.primary-deep}"
    borderColor: "rgba(255,255,255,0.10)"
    activeBackground: "rgba(255,255,255,0.12)"
    activeText: "{colors.surface}"
    activeIndicator: "{colors.active-indicator}"
    inactiveText: "#aabbd0"
    hoverBackground: "rgba(255,255,255,0.08)"
  breadcrumb:
    currentBackground: "{colors.primary-wash}"
    currentText: "{colors.primary}"
    linkText: "{colors.text-muted}"
    linkHoverBackground: "{colors.primary-wash}"
  header:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-strong}"
    height: "{spacing.header-height}"
  input-search:
    backgroundColor: "{colors.search-surface}"
    borderColor: "{colors.border-strong}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    focusBorder: "{colors.focus-ring}"
    focusRing: "{colors.primary-wash}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.2xl}"
    padding: 20px
    shadow: "0 8px 24px rgba(27,59,102,0.05)"
  badge:
    rounded: "{rounded.full}"
    note: "Pill-shaped status dots and count badges"
  chart-line:
    color: "#2b65ad"
    areaFrom: "rgba(43,101,173,0.18)"
    areaTo: "rgba(43,101,173,0.015)"
    tooltip: "{colors.primary-deep}"
  chart-donut:
    colors: ["#2b65ad", "#4d9b8b", "#e49b12", "#7661b9", "#ef7565", "#97a4b7"]
    titleFont: "Georgia, serif"
---

# Athenaeum Navy Design System

## Brand & Style

Navy + gold workstation aesthetic for library management. Deep navy (`#132F57`) anchors the persistent sidebar, while blue (`#173B70`) carries headings and primary actions. Gold (`#E5A214`) is reserved for the active-nav indicator, greeting rule, and notification badge. Cool slate surfaces (`#F7F9FC`) keep dense dashboard content calm. Cards float with soft navy-tinted shadows rather than flat borders alone.

Brand personality is **Classic Institutional with Modern Softness** — serif headlines and numbers (Georgia) over an Inter UI body, pill badges and rounded-2xl cards.

## Colors

- **Primary — Deep Navy (#173B70):** Brand actions, headings, and primary data ink. Ramp `50 #EDF4FF → 500 #2B65AD → 700 #173B70 → 800 #132F57 → 950 #0B1B31`. The sidebar uses the `800` value.
- **Accent — Gold (#E5A214):** Active-nav left indicator bar, greeting rule, notification count badge. Soft brand text `#F5C54A` on the navy mark; muted gold `#B47A0D` for the "Library manager" eyebrow.
- **Background — Cool Off-White (#F7F9FC):** App canvas. Elevated `#F1F5FA`, accented `#EAF0F7`, search field `#F7F9FC`.
- **Surface — White (#FFFFFF):** Header, cards, inputs, and light content panels. The persistent sidebar uses deep navy instead.
- **Borders:** `#DCE5EF` for cards, controls, and header emphasis; `#E4EBF3` default; `#EDF1F6` muted dividers. Focus ring `#8CA9CE` + wash `#EDF4FF`.
- **Text:** Primary `#263F5F`, highlighted/headline `#132F57`, muted `#667896`, dimmed `#8A99AE`, navy-sidebar inactive `#AABBD0`.
- **Active navigation:** Translucent white fill and white text on the navy sidebar, marked by the gold left bar.
- **Semantic:** Success `#20876E` (bg `#EAF7F2`), Warning `#B7791F`/`#D98B00` (bg `#FFF6E5`), Error `#D84332`/`#E34B38` (bg `#FFF0EE`). Info blue `#2161BF` (bg `#EDF4FF`).
- **Charts:** Donut palette `#2B65AD, #4D9B8B, #E49B12, #7661B9, #EF7565, #97A4B7`. Line chart uses `#2B65AD` with a blue area fade. Tooltips are deep navy `#132F57` with white text.

## Typography

- **Brand:** Geist Variable (`font-display`), semibold, for the ATHENAEUM wordmark.
- **Headlines & numbers:** Georgia serif — page greeting (30–32px, bold, `-0.035em`), card titles (18px bold), stat values (28px bold, `-0.04em`).
- **UI & Data:** Inter Variable 14px default; 12px medium labels; 11px semibold eyebrows and badges.
- **Section eyebrows:** 10px bold uppercase, wide tracking, dimmed slate.

## Layout & Spacing

- **Sidebar:** Fixed 256px (16rem), collapses to 72px icon rail. Deep navy (`#132F57`) with subtle white dividers and a soft exterior shadow.
- **Header:** 72px white bar with bottom border; search max-xl, user menu right.
- **Content:** Max 1400px centered, 20px section gaps, `px-4 / lg:px-8`, `py-5 / lg:py-7`.
- **Cards:** 20px padding, 16–20px gaps in grids (`gap-4/5`), stat icon 56px.
- **Breakpoints:** Desktop 1024px+ full sidebar; tablet collapsed rail; mobile single column.

## Elevation & Depth

Soft navy-tinted shadows throughout — this system **does** use depth:

- **Level 0:** `#F7F9FC` canvas.
- **Level 1 (Cards):** White + 1px `#DCE5EF` border + `0 8px 24px rgba(27,59,102,0.05~0.06)`.
- **Level 2 (Brand mark):** Translucent white tile with a subtle white ring on the navy sidebar.
- **Hover:** Cards shift border to `#BFCFE1`; sidebar items use a translucent white wash.

## Shapes

Soft and rounded:

- **Cards:** `rounded-2xl` (16px).
- **Stat icons, search, buttons, menus:** `rounded-xl` (12px).
- **Badges, dots, notification count, avatars:** pill / `rounded-full`.
- **Active nav indicator:** 4px-wide rounded-r-full gold bar.
- **Scrollbar:** 8px pill thumb `#A7B6C9`, hover `#7E91A9`.

## Components

### Sidebar & Navigation
Deep navy architectural rail. Active item: translucent white fill, white text, and a 4px gold left bar. Inactive items use muted blue-gray (`#AABBD0`) and brighten on hover. Icons are 18px. Section eyebrows are 10px and subdued; the footer library card remains a light surface for contrast.

### Header
White 72px bar. Search: `h-10 rounded-xl`, `#F7F9FC` fill, left icon, focus border `#8CA9CE` + 4px `#EDF4FF` ring. Bell with gold pill count badge. User button with avatar ringed `#EDF4FF`, name + role, and chevron.

### Page Breadcrumbs
A shared breadcrumb sits above page content. The current page is marked by a soft-blue pill; ancestor pages are compact links with an icon, hover wash, and keyboard focus ring.

### Dashboard
A bordered greeting card with gold rule, serif headline, muted subtitle, and date chip. Four stat cards follow, then a two-chart row (7-day loan line + category donut with legend list), recent activity, and loans needing attention. Overdue items use a red icon tile. Muted centered footer.

### Data Viz
- **Activity line:** Blue `#2B65AD` 3px smooth line, white-ringed dots, blue gradient area, slate axes, navy tooltip.
- **Category donut:** 62–84% radius, 6-color navy-led palette, Georgia 30px total in center, navy tooltips.

## Do's and Don'ts

- Do use navy for headings, active states, and primary data ink.
- Do reserve gold for the active indicator, greeting rule, and count badge only.
- Do keep cards soft — rounded-2xl with the navy-tinted shadow.
- Do use pill badges and dots for status/counts.
- Don't introduce burnt-orange or warm stone tokens; this system is cool slate + navy.
- Don't flatten shadows — depth is part of the look.
