# Alethia.earth Design Specification & Motion Catalogue
> **Target Reference:** [https://www.alethia.earth/](https://www.alethia.earth/)  
> **Extraction Date:** October 2026  
> **Methodology:** Live browser inspection via Chrome DevTools, CSS token dissection, SSR DOM analysis, and Framer animation module reverse-engineering.  
> **Asset Reference Directory:** `/docs/reference/` (Screenshots captured at 1440px, 768px, and 390px, plus full-page slow scroll recordings in `.webp`).

---

## Table of Contents
1. [Typography System](#1-typography-system)
2. [Colour System & Area Proportions](#2-colour-system--area-proportions)
3. [Layout, Grid & Spacing System](#3-layout-grid--spacing-system)
4. [Header & Navigation Anatomy](#4-header--navigation-anatomy)
5. [Motion Catalogue & Interaction Dynamics](#5-motion-catalogue--interaction-dynamics)
6. [Component Interaction States](#6-component-interaction-states)
7. [Responsive Breakpoint Matrix](#7-responsive-breakpoint-matrix)
8. [Performance & SEO Audit](#8-performance--seo-audit)
9. [Reference Archive & Audit Verification](#9-reference-archive--audit-verification)

---

## 1. Typography System

### 1.1 Loaded Fonts & Network Origin
| Font Family | Loaded Weights | File Format | Origin / Host | License Status | Closest Google Font Alternative & Justification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Geist** | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold) | WOFF2 | `fonts.gstatic.com` | Open Source (SIL OFL) | **Geist** (Available directly on Google Fonts). Geometric neo-grotesque with Swiss typography precision. |
| **Geist Mono** | 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 900 (Black) | WOFF2 | `fonts.gstatic.com` | Open Source (SIL OFL) | **Geist Mono** / **JetBrains Mono**. Monospaced companion engineered for tabular data, pill badges, and telemetry numbers. |
| **Fragment Mono** | 400 (Regular) | WOFF2 | `fonts.gstatic.com` | Open Source (SIL OFL) | **Fragment Mono** (Google Fonts). Used for secondary technical callouts and footnotes. |
| **Inter** | 400 (Regular) | WOFF2 | `framerusercontent.com` | Open Source (SIL OFL) | **Inter**. Used as low-level fallback for text engines. |

### 1.2 Devanagari Pairing Recommendation
For Marathi/Devanagari localization in our project, the aesthetic counterpart to Geist and Geist Mono must preserve the architectural tightness and geometric legibility:
1. **Noto Sans Devanagari (Recommended for Body & Subheads)**: Strict vertical alignment, unmodulated strokes, exact x-height match to Geist.
2. **Baloo 2 (Recommended for Display Headings)**: Warm, friendly corporate geometry that complements Geist Medium’s compact line height.
3. **Yantramanav (Technical / Display Alternative)**: Built on the metric grid of Roboto/Geist, providing sharp square terminal endings.

---

### 1.3 Typographic Scale Matrix (Computed Styles)

| Role | Semantic Tag | Font Family | Weight | 1440px (Desktop) | 768px (Tablet) | 390px (Mobile) | Line Height | Letter Spacing | Text Transform |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero H1** | `<h1>` | Geist Medium | 500 | `120px` (or `72px`) | `72px` (or `56px`) | `32px` | `95%` (0.95) | `-0.05em` | None |
| **Section H2 (Large)**| `<h2>` | Geist Medium | 500 | `80px` (or `72px`) | `64px` | `42px` | `95%` (0.95) | `-0.05em` | None |
| **Section H3 / Story**| `<h3>` | Geist Medium | 500 | `56px` | `56px` | `36px` | `95%` (0.95) | `-0.05em` | None |
| **Card H4 / Feature** | `<h4>` | Geist Medium | 500 | `40px` | `40px` | `28px` | `95%` (0.95) | `-0.03em` | None |
| **Subhead / Lead Body**| `<p>` / `<h3>` | Geist Regular | 400 | `36px` / `24px` | `24px` | `16px` | `100%` (1.0) | `-0.04em` | None |
| **Body Standard** | `<p>` | Geist Regular | 400 | `16px` | `16px` | `14px` | `140%` (1.4) | `-0.01em` | None |
| **Eyebrow / Category** | `<p>` / `<span>` | Geist Mono | 600 | `15px` / `14px` | `14px` | `12px` | `90%` (0.9) | `0em` | `uppercase` |
| **Navigation Link** | `<a>` | Geist Mono | 600 | `15px` | `14px` | `16px` (drawer) | `90%` (0.9) | `0em` | `uppercase` |
| **Primary Button CTA**| `<button>`/`<a>`| Geist Mono | 600 | `14px` | `14px` | `14px` | `90%` (0.9) | `0em` | `uppercase` |
| **Stat Big Number** | `<span>` | Geist Mono | 500 | `32px` | `24px` | `20px` | `120%` (1.2) | `-0.02em` | `uppercase` |
| **Caption / Footnote**| `<small>`/`<p>` | Geist Mono | 400 | `12px` | `12px` | `11px` | `120%` (1.2) | `0em` | None |

---

## 2. Colour System & Area Proportions

### 2.1 Color Tokens & Definitions
```css
:root {
  /* Core Brand Tokens extracted from Alethia production bundle */
  --token-dark-pine: #0f1f10;    /* rgb(15, 31, 16) - Deep Forest / Near-black ground */
  --token-lime-accent: #c6f19d;  /* rgb(198, 241, 157) - Spring Bud / Electric Pale Lime */
  --token-bone-bg: #f5f4f2;      /* rgb(245, 244, 242) - Alabaster / Light section background */
  --token-pure-white: #ffffff;   /* rgb(255, 255, 255) - High contrast surfaces & typography */
  --token-charcoal: #0f0f0f;     /* rgb(15, 15, 15) - True carbon for dark mode dividers */
  --token-divider-gray: #e0e0e0; /* rgb(224, 224, 224) - Muted borders & structural rules */

  /* Alpha Variations */
  --token-white-alpha-10: rgba(255, 255, 255, 0.1);
  --token-white-alpha-06: rgba(255, 255, 255, 0.06);
  --token-pine-alpha-80: rgba(15, 31, 16, 0.8);
}
```

### 2.2 Surface Area Distribution on Homepage
Calculated from high-resolution full-page viewport audits:

```
┌─────────────────────────────────────────────────────────────┐
│ Dark Pine (#0f1f10): 62%                                    │
│ [Hero, 3D Canvas / Video loop, Tech Panels, Footer]         │
├─────────────────────────────────────────┬───────────────────┤
│ Bone / Warm Off-White (#f5f4f2): 26%    │ Pure White: 8%    │
│ [Vision & Steps section, Case Studies]  │ [Cards, Tooltips] │
├─────────────────────────────────────────┴───────────────────┤
│ Pale Lime Accent (#c6f19d): 4%                              │
│ [CTA Pills, Active Step Badges, Live Radar, Hover Glows]    │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Strict Accent Usage Rules
1. **Never use accent as a large background fill:** The lime accent `#c6f19d` is exclusively reserved for high-salience micro-surfaces:
   - Primary Header CTA button ("Let's Talk").
   - Numbered pill circles (`01`, `02`, `03`, `04`, `05`) when active.
   - Status indicators (e.g. pulsing radar dots, live verification tags).
   - Text hover highlights (`--extracted-r6o4lv`).
2. **Body copy remains strictly monochrome:** 
   - Over Dark Pine: `#ffffff` for titles, `rgba(255, 255, 255, 0.75)` for secondary copy.
   - Over Bone/Light: `#0f1f10` for titles, `rgba(15, 31, 16, 0.75)` for body copy.
3. **No saturated tertiary colours:** Secondary charts or diagrams use muted technical pastels (cyan, soft amber) strictly as data visualization elements, never decorative page blocks.

---

## 3. Layout, Grid & Spacing System

### 3.1 Breakpoint Definitions & Media Queries
Extracted directly from SSR media rules:
- **Large Desktop (XL):** `>= 1920px` (Max container `1800px`)
- **Desktop (Standard):** `1440px - 1919.98px` (Container max-width `1380px` - `1440px`)
- **Laptop / Small Desktop:** `1000px - 1439.98px` (Container `960px` - `1200px`)
- **Tablet:** `768px - 999.98px` (Padding `32px`, fluid columns)
- **Mobile:** `<= 767.98px` / `390px` (Padding `16px`, full width stacked)

### 3.2 Spacing & Padding Metrics
| Breakpoint | Header Height | Page Margin (X) | Section Vertical Padding (Y) | Grid Columns | Column Gaps | Card Radius |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Desktop (1440px)** | `70px` (fixed) | `48px` - `64px` | `120px` - `160px` | 12 columns | `24px` - `32px` | `24px` |
| **Tablet (768px)** | `70px` (fixed) | `32px` | `80px` - `100px` | 8 columns | `20px` | `20px` |
| **Mobile (390px)** | `80px` (fluid/closed)| `16px` | `56px` - `64px` | 4 columns (or stack)| `16px` | `16px` |

### 3.3 Border Radii Tokens
- **Pill Badges & Buttons:** `border-radius: 99px` or `5px` (for mono tag pills: `border-radius: 5px`).
- **Cards & Content Blocks:** `border-radius: 24px` (Desktop) / `16px` (Mobile).
- **Secondary Modals & Tooltips:** `border-radius: 12px`.
- **Structural Dividers:** `border-width: 1px`, `border-color: rgba(255, 255, 255, 0.1)` on dark or `#e0e0e0` on light.

---

## 4. Header & Navigation Anatomy

### 4.1 Structural Dimensions & Fixed Behavior
- **Default State (Desktop):** `position: fixed; top: 0; left: 0; right: 0; height: 70px; z-index: 9`.
- **Background on Top:** Transparent (`rgba(0, 0, 0, 0)`).
- **Background on Scroll:** Transitions to semi-transparent with backdrop filter (`background: rgba(15, 31, 16, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08)`).
- **Brand Mark:** SVG lockup `138px × 43px`.

### 4.2 Dropdown Navigation Mechanics
- Dropdown triggers: `Solutions`, `Our Tech`, `Resources`.
- Visual signifier: Tiny chevron icon (`15px × 8px`) that flips `180deg` on open.
- Dropdown Panel:
  - Width: `280px` - `320px`.
  - Padding: `16px`.
  - Background: `rgba(15, 31, 16, 0.95)` with `backdrop-filter: blur(16px)`.
  - Border: `1px solid rgba(255, 255, 255, 0.12)`.
  - Border radius: `16px`.
  - Transition: Spring animation (`stiffness: 400, damping: 30`), fading from `opacity: 0, translateY: -8px` to `opacity: 1, translateY: 0`.

### 4.3 Mobile Drawer Menu (390px Viewport)
- **Closed State:** Height `80px`, displaying Logo + Lime Accent pill menu trigger ("MENU").
- **Trigger Click:** Expands full viewport overlay:
  - Container expands `height: 100vh; overflow-y: auto`.
  - Button toggles text to `"CLOSE"`.
  - Background: Solid Dark Pine (`#0f1f10`).
  - Top padding: `144px`, bottom padding: `80px`.
  - Nav items: Large accordion triggers (`font-size: 32px`, `font-weight: 500`), with children expanding downward on click (`height: auto`).

---

## 5. Motion Catalogue & Interaction Dynamics

### 5.1 Global Animation Principles & Engine
Alethia's motion is driven by **Framer Motion spring physics** combined with **CSS transforms** and **ScrollTrigger-style scrub timelines**:
- No generic `linear` or standard `ease-in-out` transitions.
- High-tension, critically damped springs for snappy UI responses (`stiffness: 380 - 420`, `damping: 28 - 32`).
- Smooth inertia scrolling with a subtle lerp factor (`~0.08 - 0.10`), eliminating abrupt wheel stops.

---

### 5.2 Unique Motion Patterns Catalogue

#### Pattern 1: Hero Text Mask & Word Stagger Reveal
- **Trigger:** Window load (tied to preloader water/curtain lift).
- **Implementation:** Text split into lines/words (masked container `overflow: hidden`).
- **Initial State:** `transform: translateY(105%)`, `opacity: 0`.
- **Target State:** `transform: translateY(0%)`, `opacity: 1`.
- **Duration / Easing:** Spring physics (`stiffness: 280, damping: 26, mass: 1`). Stagger delay: `0.06s` per word line.
- **Visual Feel:** Heavy, cinematic unmasking from beneath the baseline.

#### Pattern 2: Pinned 01–04 and 01–05 Scroll Lists
- **Trigger:** Scroll scrub (`onEnter`, `onLeaveBack`).
- **Layout Behavior:**
  - The left column (Title + Category Badge) remains `sticky` with `top: 140px` for the entire height of the section.
  - The right column scrolls vertically.
- **Active State Transition:**
  - Non-active row: `opacity: 0.35`, background transparent, number badge muted grey outline.
  - Active row (when reaching vertical center `45% - 55%` of viewport):
    - Background morphs to pure white (`#ffffff`) with `box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06)`.
    - Pill number badge turns solid Lime Accent (`#c6f19d`).
    - Title text darkens to `#0f1f10`.
    - Transition: `duration: 0.35s`, `ease: [0.16, 1, 0.3, 1]`.

#### Pattern 3: Technology 3D Mineral Scrub ("Rock Section")
- **Trigger:** Pinned scroll scrub (`pin: true, scrub: 0.8`).
- **Duration of Pin:** `~2.5× viewport height` (`250vh`).
- **Motion Mechanism:**
  - Background WebM/canvas video of the geological mineral model scrubs forward frame-by-frame with scroll delta.
  - Left tech cards swap simultaneously:
    - Card 1 (`[Nature-Based Solutions]`) fades out at 40% scroll (`opacity: 1 -> 0, translateY: -20px`).
    - Card 2 (`[Supply Chain Solutions]`) enters from below at 45% scroll (`opacity: 0 -> 1, translateY: 20px -> 0`).
  - Parallax amount: Foreground data chips move at `1.25×` scroll speed relative to the mineral background.

#### Pattern 4: Continuous Ticker / Marquee
- **Location:** `/our-company` partner & certification strip.
- **Direction:** Infinite leftward scroll (`translateX(0) -> translateX(-50%)`).
- **Velocity:** `~40px per second` (desktop) / `28px per second` (mobile).
- **Gap:** `10px` between square `448px × 448px` cards.
- **Hover Interaction:** Smooth deceleration and pause on cursor hover (`animation-play-state: paused`).

#### Pattern 5: Button Micro-Interactions (Magnetic & Fill)
- **Trigger:** Hover & focus.
- **Normal State:** Lime accent fill (`#c6f19d`), dark pine text (`#0f1f10`), `border-radius: 5px`.
- **Hover State:**
  - Subtle upward displacement: `transform: translateY(-2px)`.
  - Icon translation: Chevron / Arrow slides `+3px` horizontally.
  - Box-shadow bloom: `0 4px 20px rgba(198, 241, 157, 0.4)`.
  - Transition: `spring(stiffness: 450, damping: 25)`.

#### Pattern 6: Ambient Background Video Loops
- **Assets:** `loop1.webm`, `loop2.webm`, `scan.webm`, `CLOUDS_no fade.webm`.
- **Playback Properties:** `autoplay, loop, muted, playsinline, preload="none"`.
- **Optimization:** Overlayed with `opacity: 0.75` and linear vertical gradient mask (`linear-gradient(180deg, #0f1f10 0%, rgba(15, 31, 16, 0) 100%)`) to ensure zero text contrast degradation.

---

## 6. Component Interaction States

| Component | Default State | Hover State | Active / Click State | Focus-Visible State |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Button ("Let's Talk")** | Background `#c6f19d`, text `#0f1f10`, pill radius `5px`. | Background `#ffffff`, shadow `0 0 20px rgba(198, 241, 157, 0.5)`. | Scale `0.97`, shadow collapsed. | `outline: 2px solid #c6f19d; outline-offset: 2px`. |
| **Ghost Nav Links** | Text `#ffffff`, opacity `0.85`. | Text `#c6f19d`, opacity `1.0`. | Scale `0.98`. | White focus ring with `2px` offset. |
| **List Row Item (01–05)** | Muted border, text opacity `0.5`. | Opacity `0.8`, subtle X-shift (`+4px`). | Solid white card, lime badge, text opacity `1.0`. | Keyboard focus indicator on card boundary. |
| **Article Card** | Border `1px solid rgba(255,255,255,0.1)`. | Image scale `1.04`, border color `#c6f19d`. | Opacity `0.9`. | Outline `2px solid #c6f19d`. |
| **Form Inputs (/contact)** | Background `rgba(255,255,255,0.06)`, border `1px solid rgba(255,255,255,0.15)`. | Border color `rgba(255,255,255,0.3)`. | Background `rgba(255,255,255,0.1)`. | Border color `#c6f19d`, box-shadow `0 0 0 1px #c6f19d`. |

---

## 7. Responsive Breakpoint Matrix

| Element / Section | Desktop (1440px) | Tablet (768px) | Mobile (390px) |
| :--- | :--- | :--- | :--- |
| **Header Navigation** | Horizontal link bar + dropdowns + Right CTA | Horizontal link bar (condensed gap) | Full-screen slide-down drawer with large accordion |
| **Hero Section** | Giant H1 `120px` + Split Subtitle + Dual CTAs | H1 `72px` + Stacked Subtitle | H1 `32px` + Stacked CTA buttons (100% width) |
| **Numbered Steps** | Sticky left heading (pinned) + scrolling right cards | Pinned heading + 1-column cards | Native vertical stack; no pinning |
| **Rock Tech Panels** | Pinned scroll scrub with 3D model frame control | Pinned scroll scrub with static fallback frame | Stacked cards with static WebP illustrations |
| **Ticker Strip** | Continuous loop with `448×448` cards | Continuous loop with `355×355` cards | Continuous loop with `280×280` cards |
| **Footer Layout** | 4-column link grid + Newsletter + Large Wordmark | 2-column link grid | 1-column vertical accordion stack |

---

## 8. Performance & SEO Audit

### 8.1 Media Assets & Optimization
- **Video Encodings:** WebM primary with VP9 codec (`loop1.webm`, `loop2.webm`, `scan.webm`) + MP4 fallback for Safari/iOS.
- **Image Formats:** WebP and AVIF with responsive `srcset` (`scale-down-to=512`, `scale-down-to=1024`, `width=1792`).
- **Decoding:** All non-hero images carry `decoding="async"` and `loading="lazy"`.

### 8.2 Semantic & SEO Hierarchy
- **Heading Integrity:** Exactly one `<h1>` per page.
- **Metadata:** Comprehensive OpenGraph (`og:title`, `og:description`, `og:image`) and Twitter card tags.
- **Canonical URLs:** Self-referencing canonical tag present on all subpages.
- **Accessibility:** Text elements use relative units (`calc(var(...) * scale)`); buttons maintain keyboard `tabindex="0"`.

---

## 9. Reference Archive & Audit Verification

All raw reference screenshots across 1440px, 768px, and 390px viewports, together with full-length video recordings, are archived in the workspace:

```
docs/reference/
├── alethia_home_inspection_1792624269832.webp   (Slow scroll recording - Home)
├── alethia_subpages_walkthrough_1792625606129.webp (Multi-page walkthrough recording)
├── home/
│   ├── alethia_home_1440_1792624337774.png
│   ├── alethia_home_1440_loaded_1792624342869.png
│   ├── alethia_home_768_1792625183301.png
│   └── alethia_home_390_1792625285625.png
├── our-company/
│   ├── our_company_1440_1792625635316.png
│   ├── our_company_768_1792625653670.png
│   └── our_company_390_1792625676301.png
├── solutions-nature-based/
│   ├── nature_based_1440_1792625738994.png
│   ├── nature_based_768_1792625811765.png
│   └── nature_based_390_1792625911531.png
├── solutions-supply-chain/
│   ├── supply_chain_1440_1792626151951.png
│   ├── supply_chain_768_1792626267961.png
│   └── supply_chain_390_1792626327180.png
├── our-tech-amrv/
│   ├── amrv_1440_1792626453910.png
│   ├── amrv_768_1792626501386.png
│   └── amrv_390_1792626536626.png
├── our-tech-blockchain/
│   ├── blockchain_1440_1792626621506.png
│   ├── blockchain_768_1792626677576.png
│   └── blockchain_390_1792626760641.png
├── contact/
│   ├── contact_1440_1792626874097.png
│   ├── contact_768_1792626888520.png
│   └── contact_390_1792626900856.png
├── resources-news-and-media/
│   ├── news_media_1440_1792626946059.png
│   ├── news_media_768_1792627013883.png
│   └── news_media_390_1792627186398.png
├── resources-case-studies/
│   ├── case_studies_1440_1792627349957.png
│   ├── case_studies_768_1792627400532.png
│   └── case_studies_390_1792627451542.png
└── article/
    ├── article_1440_1792627602647.png
    ├── article_768_1792627686934.png
    └── article_390_1792627786728.png
```

---
*Ready for user review before proceeding to subsequent implementation phases.*
