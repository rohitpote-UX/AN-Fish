"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "./Eyebrow";

export interface CardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  tag?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
  external?: boolean;
  meta?: React.ReactNode;
  className?: string;
  isMarathi?: boolean;
}

export function Card({
  title,
  description,
  tag,
  imageSrc,
  imageAlt = "Card media",
  href,
  external = false,
  meta,
  className,
  isMarathi = false,
}: CardProps) {
  const content = (
    <article
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-white border border-[#0F1F10]/08 hover:border-[#0A9AD9] shadow-sm hover:shadow-[0_12px_32px_rgba(10,154,217,0.12)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] p-6 sm:p-7 h-full cursor-pointer",
        className
      )}
    >
      {/* Optional Top Image with 1.04 hover zoom */}
      {imageSrc && (
        <div className="relative w-full h-48 sm:h-56 -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 mb-6 overflow-hidden bg-[#F5F4F2]">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>
      )}

      {/* Card Header & Tag */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          {tag && (
            <Eyebrow variant="blue" radius="tag">
              {tag}
            </Eyebrow>
          )}
          {href && (
            <div className="w-8 h-8 rounded-full bg-[#F5F4F2] group-hover:bg-[#0A9AD9] text-[#0F1F10] group-hover:text-white flex items-center justify-center transition-all duration-200 shrink-0">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3
          className={cn(
            "text-xl sm:text-2xl font-bold text-[#0F1F10] group-hover:text-[#0A9AD9] transition-colors duration-200 tracking-tight leading-snug",
            isMarathi ? "font-marathi-display" : "font-latin-display"
          )}
        >
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p
            className={cn(
              "mt-2 text-sm text-[#0F1F10]/70 leading-relaxed line-clamp-3",
              isMarathi ? "font-marathi-body" : "font-sans"
            )}
          >
            {description}
          </p>
        )}
      </div>

      {/* Card Footer / Meta */}
      {meta && (
        <div className="mt-6 pt-4 border-t border-[#0F1F10]/06 font-mono-accent text-xs text-[#0F1F10]/50 flex items-center justify-between">
          {meta}
        </div>
      )}
    </article>
  );

  if (href) {
    if (external || href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
