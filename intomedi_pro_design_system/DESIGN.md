---
name: Intomedi Pro Design System
colors:
  surface: '#fbf9f9'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e3e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#494551'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#5e5e5e'
  primary: '#474747'
  on-primary: '#ffffff'
  primary-container: '#5e5e5e'
  on-primary-container: '#d9d9d9'
  inverse-primary: '#c6c6c6'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e3e2e2'
  on-secondary-container: '#646464'
  tertiary: '#464646'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e5e5e'
  on-tertiary-container: '#d8d8d8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#fbf9f9'
  on-background: '#1b1c1c'
  surface-variant: '#e3e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  section-padding-desktop: 80px
  section-padding-mobile: 24px
  grid-gutter: 1px
  container-max-width: 1440px
---

## Brand & Style

The brand identity bridges the gap between clinical dermatology and high-end luxury cosmetics. It is designed for a B2B audience that values both scientific precision and aesthetic excellence. The visual language is defined as **Minimalist Luxury with Architectural Rigor**, characterized by an obsession with whitespace, precise alignment, and a sophisticated color rhythm.

The UI should evoke a sense of "Luminous Authority"—it is professional, trustworthy, and efficient, yet feels expensive and curated. Unlike standard corporate portals, this design system uses structural grid lines to organize complex data, transforming a sales interface into a high-end gallery experience.

## Colors

The palette is strictly monochromatic and high-contrast to emphasize the "Architectural Rigor" of the brand.

- **Primary Background:** Pure white (#FFFFFF) is used to create a clinical, sterile, and premium environment.
- **Primary & Tertiary:** True Black (#000000) is the dominant color for structural elements, primary actions, and key branding, providing a stark, high-fashion editorial feel.
- **Secondary & Neutral:** A mid-tone Professional Gray (#777777) serves as the supporting shade for secondary information, muted states, and neutral backgrounds.
- **Borders & Grids:** A consistent 1px Professional Gray (#777777) is used for hair-line borders, providing a structured "blueprint" feel that ensures data reliability.

## Typography

The typography system prioritizes clarity and modern elegance. While **Hanken Grotesk** serves as the primary typeface for its sharp, contemporary professional feel, **Inter** is utilized for functional labels and data-heavy tables to ensure maximum utilitarian reliability.

For the Korean implementation, **Pretendard** must be used, as its metrics perfectly align with the sans-serif English counterparts, maintaining the "Modern Sans" aesthetic across bilingual content.

- **Headlines:** Use tight letter-spacing and medium weights to create a "printed editorial" look.
- **Caps Labels:** Small, uppercase labels with generous tracking (letter-spacing) should be used for category headers and table headers to evoke a luxury fashion metadata style.

## Layout & Spacing

The layout is governed by a **Rigid Modular Grid**. Unlike fluid layouts that rely on floating cards, this design system uses 1px hair-line borders to divide the screen into logical modules, resembling a technical drawing or a luxury ledger.

- **Desktop:** A 12-column grid with 0px gutters, where elements are separated by 1px "Professional Gray" lines. This maximizes the use of space for B2B data while maintaining a clean aesthetic.
- **Margins:** Generous outer margins (80px on desktop) ensure the content feels like it is "floating" in a luxury space.
- **Rhythm:** All spacing (padding/margins) must be multiples of 8px. Use large internal padding within grid modules (e.g., 32px or 48px) to prevent the "data-heavy" interface from feeling cramped.

## Elevation & Depth

This design system eschews traditional shadows in favor of **Low-Contrast Outlines** and **Tonal Layering**. 

- **Depth through Lines:** Visual hierarchy is created by the thickness and nesting of 1px borders. Primary containers use the `Professional Gray` (#777777), while secondary dividers within those containers may use lower opacities.
- **Surface Tiers:** Use #FFFFFF for the primary work surface. Secondary panels (like sidebars or filter drawers) use a subtle neutral tint to create separation without the need for heavy shadows.
- **Active State:** The only exception for elevation is the "Active Hover" on products or data rows, which may use a very soft, diffused ambient shadow (0px 4px 20px rgba(0,0,0,0.05)) to suggest "lifting" the item for inspection.

## Shapes

To maintain a "Clinical/Medical" and "Architectural" feel, the shape language is predominantly sharp. 

- **Containers:** All primary grid modules and layout containers have a **0px radius**. Sharp corners reinforce the precision of the brand.
- **Interactive Elements:** Buttons, input fields, and tags use a subtle **Soft (4px)** radius. This small amount of rounding provides just enough tactile affordance to distinguish interactive components from the static layout grid.
- **Product Imagery:** Should always be rectangular or square, fitting perfectly into the grid modules.

## Components

- **Buttons:** Primary buttons are solid black (#000000) with white text. Secondary buttons are "Ghost" style: 1px border with black text. No gradients.
- **Input Fields:** Minimalist design—bottom-border only or 1px all-around border. Focused states use a bold 2px black border.
- **Data Tables:** The core of the portal. Use the 1px grid system for all cells. Table headers use `label-caps` typography with a subtle gray background.
- **Chips/Status:** Small, sharp-cornered tags. Status indicators use grayscale tones (black or gray) with high-contrast text to maintain the monochromatic aesthetic.
- **Product Cards:** Integrated into the grid. The image occupies the top portion, separated by a 1px line from the product metadata (Name, SKU, Wholesale Price) below. 
- **Inventory Indicators:** High-contrast bar charts or numerical data using the `data-mono` font for precision.