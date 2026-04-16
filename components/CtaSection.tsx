"use client";

import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  IconChevronDown,
  IconBrandChrome,
  IconBrandFirefox,
  IconBrandSafari,
  IconBrandEdge,
  IconBrandOpera,
  IconBrowser,
} from "@tabler/icons-react";

type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Opera" | "Brave";

const ALL_BROWSERS: Browser[] = ["Chrome", "Firefox", "Safari", "Edge", "Opera", "Brave"];

const BROWSER_ICONS: Record<Browser, React.ComponentType<{ size?: number; stroke?: number }>> = {
  Chrome: IconBrandChrome,
  Firefox: IconBrandFirefox,
  Safari: IconBrandSafari,
  Edge: IconBrandEdge,
  Opera: IconBrandOpera,
  Brave: IconBrowser,
};

const BROWSER_STORE_LINKS: Record<Browser, string> = {
  Chrome: "#",
  Firefox: "#",
  Safari: "#",
  Edge: "#",
  Opera: "#",
  Brave: "#",
};

function detectBrowser(): Browser {
  if (typeof window === "undefined") return "Chrome";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  // Brave exposes a specific API
  if ((navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave) return "Brave";
  return "Chrome";
}

export default function CtaSection() {
  const [browser, setBrowser] = useState<Browser>("Chrome");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const otherBrowsers = ALL_BROWSERS.filter((b) => b !== browser);

  return (
    <section id="install" className="py-40 px-6">
      <div className="max-w-6xl mx-auto bg-earth-green text-cream rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-32 relative text-center">
        {/* Decorative circles — own overflow+radius so dropdown is never clipped */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10 rounded-[4rem]">
          <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-cream rounded-full" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] border-[20px] border-cream rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Headline */}
          <h2 className="font-headline text-4xl md:text-8xl mb-6 md:mb-10 leading-none">
            Ready for <br />the{" "}
            <span className="italic text-bright-green">big</span> picture?
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-2xl text-cream/70 mb-10 md:mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            Watch videos on X the way they deserve. Wider, without fullscreen,
            without breaking your feed.
          </p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Split button: primary + dropdown */}
            <div className="relative flex items-stretch" ref={dropdownRef}>
              {/* Primary: Add to [Browser] */}
              <button
                className="bg-cream text-earth-green pl-6 pr-5 py-4 md:pl-8 md:pr-6 md:py-5 rounded-l-full text-base md:text-xl font-bold hover:bg-bright-green transition-all active:scale-95 shadow-2xl flex items-center space-x-3 cursor-pointer whitespace-nowrap"
              >
                {React.createElement(BROWSER_ICONS[browser], { size: 20, stroke: 1.5 })}
                <span>Add to {browser}</span>
              </button>

              {/* Divider */}
              <div className="w-px bg-earth-green/20 self-stretch" />

              {/* Dropdown trigger */}
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                aria-label="Choose browser"
                className="bg-cream text-earth-green px-4 py-4 md:py-5 rounded-r-full text-xl font-bold hover:bg-bright-green transition-all active:scale-95 shadow-2xl flex items-center cursor-pointer"
              >
                <IconChevronDown
                  size={18}
                  stroke={2.5}
                  className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-full min-w-[220px] bg-cream rounded-2xl shadow-2xl overflow-hidden z-50 border border-earth-green/10">
                  <p className="px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-text">
                    Other browsers
                  </p>
                  {otherBrowsers.map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        setBrowser(b);
                        setDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-earth-green text-[15px] font-semibold hover:bg-warm-neutral transition-colors cursor-pointer"
                    >
                      {React.createElement(BROWSER_ICONS[b], { size: 18, stroke: 1.5 })}
                      <span>{b}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Browser support */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
            <span>Chrome</span>
            <span>Firefox</span>
            <span>Safari</span>
            <span>Edge</span>
            <span>Opera</span>
            <span>Brave</span>
          </div>
        </div>
      </div>
    </section>
  );
}
