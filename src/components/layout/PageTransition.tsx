"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { gsap } from "@/lib/gsap";
import { useScrollStore } from "@/store/scroll";

interface PageTransitionContextType {
  navigateWithWave: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigateWithWave: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const waveTopRef = useRef<SVGPathElement>(null);
  const reducedMotion = useScrollStore((state) => state.reducedMotion);

  const navigateWithWave = (href: string) => {
    // 1. Reduced motion: immediate navigation
    if (reducedMotion) {
      router.push(href);
      return;
    }

    if (isTransitioning) return;
    setIsTransitioning(true);

    const panel = panelRef.current;
    if (!panel) {
      router.push(href);
      setIsTransitioning(false);
      return;
    }

    // MOMENT 6 Wave Wipe: 0.7s total timeline
    // 0.0s -> 0.35s: Panel rises from 100% to 0% (midpoint router.push)
    // 0.35s -> 0.70s: Panel exits from 0% to -100%
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(panel, { y: "130%", opacity: 0, pointerEvents: "none" });
        setIsTransitioning(false);
      },
    });

    gsap.set(panel, { y: "130%", opacity: 1, pointerEvents: "auto" });

    // Rise over viewport
    tl.to(panel, {
      y: "0%",
      duration: 0.35,
      ease: "power3.inOut",
      onComplete: () => {
        router.push(href);
      },
    });

    // Exit upward revealing new page
    tl.to(panel, {
      y: "-130%",
      duration: 0.35,
      ease: "power3.inOut",
      delay: 0.08,
    });
  };

  return (
    <PageTransitionContext.Provider value={{ navigateWithWave, isTransitioning }}>
      {/* Wave Wipe Overlay */}
      <div
        ref={panelRef}
        aria-hidden="true"
        className={`fixed inset-0 z-[85] pointer-events-none will-change-transform bg-[#0A9AD9] ${
          isTransitioning ? "opacity-100" : "opacity-0 translate-y-[130%]"
        }`}
      >
        {/* Decorative Wave Crest on Top Edge */}
        <div className="absolute -top-12 left-0 right-0 w-full h-14 overflow-hidden pointer-events-none">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full fill-[#0A9AD9]"
          >
            <path
              ref={waveTopRef}
              d="M0,0 C150,90 350,-40 500,40 C650,110 900,-30 1200,40 L1200,120 L0,120 Z"
            />
          </svg>
        </div>

        {/* Ocean Surface Foam Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#6EC6F0] opacity-80" />
      </div>

      {children}
    </PageTransitionContext.Provider>
  );
}

/**
 * Custom Link wrapper that triggers the MOMENT 6 Wave Wipe on navigation.
 * Standard keyboard (Enter/Space) and middle-click (new tab) work natively.
 */
interface TransitionLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function TransitionLink({ href, children, className = "", onClick, ...props }: TransitionLinkProps) {
  const { navigateWithWave } = usePageTransition();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Allow default browser behavior for modified clicks (Ctrl, Cmd, Shift, Alt, middle-click)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    // Only intercept internal relative or same-origin paths
    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      if (onClick) onClick(e);
      navigateWithWave(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
