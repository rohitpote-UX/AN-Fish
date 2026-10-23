"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export function FallbackPoster() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subtle CSS parallax translation
  const translateY = Math.min(scrollY * 0.18, 120);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-transparent"
    >

      {/* Hero poster with CSS parallax */}
      <div
        className="absolute right-[-2vw] sm:right-[4vw] top-[14vh] sm:top-[18vh] w-[85vw] sm:w-[55vw] max-w-[850px] aspect-square transition-transform duration-100 ease-out drop-shadow-[0_20px_50px_rgba(10,154,217,0.35)]"
        style={{
          transform: `translate3d(0, ${translateY}px, 0) rotate(-6deg)`,
        }}
      >
        <picture>
          <source srcSet="/media/hero/hero-poster.avif" type="image/avif" />
          <img
            src="/media/hero/hero-poster.png"
            alt="AN Fish World Hero Bluefin Tuna"
            className="w-full h-full object-contain pointer-events-none select-none"
            loading="eager"
          />
        </picture>
      </div>

      {/* Film grain overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
}
