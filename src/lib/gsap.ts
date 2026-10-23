"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Guard client-side execution to avoid SSR hydration divergence
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Attempt dynamic registration for premium GSAP plugins if present in bundle
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { SplitText } = require("gsap/SplitText");
    if (SplitText) gsap.registerPlugin(SplitText);
  } catch {
    // SplitText optional club plugin
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DrawSVGPlugin } = require("gsap/DrawSVGPlugin");
    if (DrawSVGPlugin) gsap.registerPlugin(DrawSVGPlugin);
  } catch {
    // DrawSVGPlugin optional club plugin
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MorphSVGPlugin } = require("gsap/MorphSVGPlugin");
    if (MorphSVGPlugin) gsap.registerPlugin(MorphSVGPlugin);
  } catch {
    // MorphSVGPlugin optional club plugin
  }
}

export { gsap, ScrollTrigger };
export default gsap;
