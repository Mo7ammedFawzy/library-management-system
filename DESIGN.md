---
version: alpha
name: Athenaeum Navy
description: Navy + gold library-management UI built on Nuxt UI v4 and Tailwind CSS 4 — deep navy primary with cool slate neutrals, soft blue washes, rounded-2xl cards with soft shadows, light theme.
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
  search-surface: "#f9fbfe"

  border: "#e4ebf3"
  border-muted: "#edf1f6"
  border-accented: "#cdd9e8"
  focus-ring: "#8ca9ce"

  text-primary: "#263f5f"
  text-highlighted: "#132f57"
  text-muted: "#667896"
  text-dimmed: "#8a99ae"
  nav-inactive: "#60728e"
  nav-hover-bg: "#f5f8fc"

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
  header-height: 80px
  margin-desktop: 32px
  margin-mobile: 16px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
  sidebar:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    activeBackground: "{colors.primary-wash}"
    activeText: "{colors.primary}"
    activeIndicator: "{colors.active-indicator}"
    inactiveText: "{colors.nav-inactive}"
    hoverBackground: "{colors.nav-hover-bg}"
  header:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    height: "{spacing.header-height}"
  input-search:
    backgroundColor: "{colors.search-surface}"
    borderColor: "{colors.border}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.xl}"
    focusBorder: "{colors.focus-ring}"
    focusRing: "{colors.primary-wash}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.2xl}"
    padding: 20px
    shadow: "0 8px 24px rgba(27,59,102,0.04)"
  badge:
    rounded: "{rounded.full}"
    note: "Pill-shaped status dots and count badges"
  chart-line:
    color: "{colors.primary}"
    areaFrom: "rgba(43,101,173,0.18)"
    areaTo: "rgba(43,101,173,0.015)"
    tooltip: "{colors.primary-deep}"
  chart-donut:
    colors: ["#173b70", "#4d9b8b", "#e49b12", "#7661b9", "#ef7565", "#97a4b7"]
    titleFont: "Georgia, serif"
---

# Athenaeum Navy Design System

## Brand & Style

Navy + gold workstation aesthetic for library management. Deep navy (`#173B70`) carries brand, headings, and primary actions; gold (`#E5A214`) is reserved for the active-nav indicator, greeting rule, and notification badge. Cool slate surfaces (`#F7F9FC`) keep dense dashboard content calm. Cards float with soft navy-tinted shadows rather than flat borders alone.

Brand personality is **Classic Institutional with Modern Softness** — serif headlines and numbers (Georgia) over an Inter UI body, pill badges and rounded-2xl cards.

## Colors

- **Primary — Deep Navy (#173B70):** Brand mark background, active nav text, headings, chart line. Ramp `50 #EDF4FF → 500 #2B65AD → 700 #173B70 → 800 #132F57 → 950 #0B1B31`.
- **Accent — Gold (#E5A214):** Active-nav left indicator bar, greeting rule, notification count badge. Soft brand text `#F5C54A` on the navy mark; muted gold `#B47A0D` for the "Library manager" eyebrow.
- **Background — Cool Off-White (#F7F9FC):** App canvas. Elevated `#F1F5FA`, accented `#EAF0F7`, search field `#F9FBFE`.
- **Surface — White (#FFFFFF):** Sidebar, header, cards, inputs.
- **Borders:** `#E4EBF3` default, `#EDF1F6` muted dividers, `#CDD9E8` hover emphasis. Focus ring `#8CA9CE` + wash `#EDF4FF`.
- **Text:** Primary `#263F5F`, highlighted/headline `#132F57`, muted `#667896`, dimmed `#8A99AE`, nav inactive `#60728E`.
- **Active nav wash (#EDF4FF):** Soft blue fill marking the current sidebar item.
- **Semantic:** Success `#20876E` (bg `#EAF7F2`), Warning `#B7791F`/`#D98B00` (bg `#FFF6E5`), Error `#D84332`/`#E34B38` (bg `#FFF0EE`). Info blue `#2161BF` (bg `#EDF4FF`).
- **Charts:** Donut palette `#173B70, #4D9B8B, #E49B12, #7661B9, #EF7565, #97A4B7`. Line chart navy with blue area fade. Tooltips deep navy `#132F57` with white text.

## Typography

- **Brand:** Geist Variable (`font-display`), semibold, for the ATHENAEUM wordmark.
- **Headlines & numbers:** Georgia serif — page greeting (30–32px, bold, `-0.035em`), card titles (18px bold), stat values (28px bold, `-0.04em`).
- **UI & Data:** Inter Variable 14px default; 12px medium labels; 11px semibold eyebrows and badges.
- **Section eyebrows:** 10px bold uppercase, wide tracking, dimmed slate.

## Layout & Spacing

- **Sidebar:** Fixed 256px (16rem), collapses to 72px icon rail. White with right `#E4EBF3` border.
- **Header:** 80px white bar with bottom border; search max-xl, user menu right.
- **Content:** Max 1400px centered, 20px section gaps, `px-4 / lg:px-8`, `py-5 / lg:py-7`.
- **Cards:** 20px padding, 16–20px gaps in grids (`gap-4/5`), stat icon 56px.
- **Breakpoints:** Desktop 1024px+ full sidebar; tablet collapsed rail; mobile single column.

## Elevation & Depth

Soft navy-tinted shadows throughout — this system **does** use depth:

- **Level 0:** `#F7F9FC` canvas.
- **Level 1 (Cards):** White + 1px `#E4EBF3` border + `0 8px 24px rgba(27,59,102,0.04~0.05)`.
- **Level 2 (Brand mark):** Navy tile + `0 8px 16px rgba(23,59,112,0.18)`.
- **Hover:** Cards shift border to `#CDD9E8`; nav items wash `#F5F8FC`.

## Shapes

Soft and rounded:

- **Cards:** `rounded-2xl` (16px).
- **Stat icons, search, buttons, menus:** `rounded-xl` (12px).
- **Badges, dots, notification count, avatars:** pill / `rounded-full`.
- **Active nav indicator:** 4px-wide rounded-r-full gold bar.
- **Scrollbar:** 8px pill thumb `#A7B6C9`, hover `#7E91A9`.

## Components

### Sidebar & Navigation
White architectural rail. Active item: `#EDF4FF` fill + navy text + 4px gold left bar. Inactive: `#60728E`, hover wash `#F5F8FC` + navy text. Icons 18px. Section eyebrows 10px dimmed. Footer library mini-card on `#F6F8FC`.

### Header
White 80px bar. Search: `h-10 rounded-xl`, `#F9FBFE` fill, left icon, focus border `#8CA9CE` + 4px `#EDF4FF` ring. Bell with gold pill count badge. User button with avatar ringed `#EDF4FF`, name + role, chevron.

### Dashboard
Greeting block with gold rule + serif headline + muted sub; date chip (white, bordered). 4 stat cards (navy/blue/gold/red icon washes with dot + detail line). Two-chart row (7-day loan line + category donut with legend list), then recent-activity + needs-attention split. Overdue banner `#FFF5F3` with red icon tile. Muted centered footer.

### Data Viz
- **Activity line:** Navy `#173B70` 3px smooth line, white-ringed dots, blue gradient area, slate axes, navy tooltip.
- **Category donut:** 62–84% radius, 6-color navy-led palette, Georgia 30px total in center, navy tooltips.

## Do's and Don'ts

- Do use navy for headings, active states, and primary data ink.
- Do reserve gold for the active indicator, greeting rule, and count badge only.
- Do keep cards soft — rounded-2xl with the navy-tinted shadow.
- Do use pill badges and dots for status/counts.
- Don't introduce burnt-orange or warm stone tokens; this system is cool slate + navy.
- Don't flatten shadows — depth is part of the look.
