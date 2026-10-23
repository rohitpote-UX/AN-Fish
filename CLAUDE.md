# AN Fish World — Project Guidelines & Architecture

## Overview
Awwwards-calibre website for "AN Fish World", a fresh-fish retail brand from Karad, Maharashtra, India.
Concept: **THE DIVE**. Scroll = depth into the sea. Brand voice: warm, Marathi-first, family-like ("लाडकी").

## Tech Stack
- Next.js (App Router, TypeScript strict, Tailwind CSS)
- GSAP + ScrollTrigger + @gsap/react useGSAP
- Framer Motion (framer-motion) for UI state transitions
- Three.js with @react-three/fiber and @react-three/drei
- Lenis smooth scroll synced with GSAP ticker
- Zustand for shared scroll & depth state
- next-intl (Marathi default 'mr', English 'en')
- Zod for form and API payload validation
- detect-gpu for WebGL capability checks

## Theme Tokens
- `--ink: #05080C`
- `--abyss: #02111F`
- `--deep: #063A63`
- `--brand: #0A9AD9` (Logo blue)
- `--lagoon: #6EC6F0`
- `--foam: #E9F7FF`
- `--white: #FFFFFF`

## Animation Division of Labour
- **GSAP**: scroll-linked timelines, pinning, text reveals, SVG draw/morph, page wipe.
- **Framer Motion**: mount/unmount, layout animations, drawers, accordions, micro-interactions.
- **R3F**: everything inside WebGL canvas only.
- Clean up on unmount; respect `prefers-reduced-motion`.

## Placeholders
Strict rule: NEVER invent client facts. Always import from `@/data/placeholders`.
