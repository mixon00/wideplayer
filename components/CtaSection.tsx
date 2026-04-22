"use client";

import { useState, useEffect, useRef } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Opera" | "Brave";

const ALL_BROWSERS: Browser[] = ["Chrome", "Firefox", "Safari", "Edge", "Opera", "Brave"];

const BROWSER_ICONS: Record<Browser, string> = {
  Chrome: "https://svgl.app/library/chrome.svg",
  Firefox: "https://svgl.app/library/firefox.svg",
  Safari: "https://svgl.app/library/safari.svg",
  Edge: "https://svgl.app/library/edge.svg",
  Opera: "https://svgl.app/library/opera.svg",
  Brave: "https://svgl.app/library/brave.svg",
};

const BROWSER_STORE_LINKS: Record<Browser, string> = {
  Chrome: "https://chromewebstore.google.com/detail/wideplayer-for-x/edehifeemiobccenpkodalpkmmngdkgh",
  Firefox: "https://addons.mozilla.org/pl/firefox/addon/wideplayer/",
  Safari: "#",
  Edge: "#",
  Opera: "#",
  Brave: "https://chromewebstore.google.com/detail/wideplayer-for-x/edehifeemiobccenpkodalpkmmngdkgh",
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
              <a
                href={BROWSER_STORE_LINKS[browser]}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cream text-earth-green pl-6 pr-5 py-4 md:pl-8 md:pr-6 md:py-5 rounded-l-full text-base md:text-xl font-bold hover:bg-bright-green transition-all active:scale-95 shadow-2xl flex items-center space-x-3 cursor-pointer whitespace-nowrap"
              >
                <img src={BROWSER_ICONS[browser]} alt={browser} width={20} height={20} />
                <span>Add to {browser}</span>
              </a>

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
                  {otherBrowsers.map((b) => {
                    const hasLink = BROWSER_STORE_LINKS[b] !== "#";
                    return (
                      <button
                        key={b}
                        onClick={() => {
                          if (!hasLink) return;
                          setBrowser(b);
                          setDropdownOpen(false);
                        }}
                        disabled={!hasLink}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold transition-colors ${hasLink ? "text-earth-green hover:bg-warm-neutral cursor-pointer" : "text-earth-green/40 cursor-default"}`}
                      >
                        <img src={BROWSER_ICONS[b]} alt={b} width={18} height={18} className={!hasLink ? "opacity-40" : ""} />
                        <span className="flex-1 text-left">{b}</span>
                        {!hasLink && (
                          <span className="text-[9px] uppercase tracking-widest font-bold bg-earth-green/10 text-earth-green/50 px-2 py-0.5 rounded-full">
                            Coming soon
                          </span>
                        )}
                      </button>
                    );
                  })}
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
