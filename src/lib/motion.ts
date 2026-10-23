/**
 * AN Fish World — Shared Motion Tokens
 * Extracted strictly from /docs/design-spec.md (Section 5: Motion Catalogue)
 * Unified single source of truth for GSAP timelines and Framer Motion transitions.
 */

export const motionTokens = {
  // GSAP String Eases
  ease: {
    water: "power3.out",
    drift: "sine.inOut",
    snap: "expo.out",
    calm: "expo.out",
    cardMorph: "power3.out",
  },

  // Animation Durations (seconds)
  duration: {
    fast: 0.3,
    base: 0.7,
    slow: 1.2,
    cardMorph: 0.35,
  },

  // Framer Motion Cubic-Bezier Equivalents [x1, y1, x2, y2]
  framerEase: {
    water: [0.33, 1, 0.68, 1] as const, // Power3.out
    drift: [0.37, 0, 0.63, 1] as const, // Sine.inOut
    snap: [0.16, 1, 0.3, 1] as const,   // Expo.out
    calm: [0.16, 1, 0.3, 1] as const,   // Calm confident curve
    cardMorph: [0.16, 1, 0.3, 1] as const, // Pattern 2 active row
  },

  // Spring Physics Presets (Framer Motion)
  spring: {
    // Dropdown panels, modal sheet, drawer
    ui: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
    // Hero text mask and word stagger reveal (Pattern 1)
    textUnmask: {
      type: "spring" as const,
      stiffness: 280,
      damping: 26,
      mass: 1,
      stagger: 0.06,
    },
    // Button micro-interaction hover (Pattern 5)
    buttonHover: {
      type: "spring" as const,
      stiffness: 450,
      damping: 25,
      mass: 1,
    },
  },

  // Pre-composed Framer Motion Transition Presets
  framerTransitions: {
    waterFast: {
      duration: 0.3,
      ease: [0.33, 1, 0.68, 1],
    },
    waterBase: {
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1],
    },
    waterSlow: {
      duration: 1.2,
      ease: [0.33, 1, 0.68, 1],
    },
    drift: {
      duration: 1.2,
      ease: [0.37, 0, 0.63, 1],
    },
    snap: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
    cardMorph: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1],
    },
    uiSpring: {
      type: "spring",
      stiffness: 400,
      damping: 30,
    },
    buttonHoverSpring: {
      type: "spring",
      stiffness: 450,
      damping: 25,
    },
  },

  // Ticker / Marquee Velocities (px/second)
  marquee: {
    desktopSpeed: 40, // 40px/s
    mobileSpeed: 28,  // 28px/s
    gap: 10,          // 10px between cards
  },

  // Lenis Smooth Scroll Config
  smoothScroll: {
    lerp: 0.08, // Inertia factor (0.08 - 0.10)
    smoothWheel: true,
  },
} as const;

export const ease = motionTokens.ease;
export const duration = motionTokens.duration;
export const framerEase = motionTokens.framerEase;
export const spring = motionTokens.spring;
export const framerTransitions = motionTokens.framerTransitions;
export const marquee = motionTokens.marquee;
export const smoothScroll = motionTokens.smoothScroll;

