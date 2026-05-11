"use client";

import { useEffect, useRef, useState } from "react";
import { IconArrowRight, IconChevronDown } from "@tabler/icons-react";

type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | "Opera" | "Brave";
type Variant = "dark" | "light";

const ALL_BROWSERS: Browser[] = ["Chrome", "Firefox", "Safari", "Edge", "Opera", "Brave"];

const BROWSER_ICONS: Record<Browser, string> = {
  Chrome: "https://svgl.app/library/chrome.svg",
  Firefox: "https://svgl.app/library/firefox.svg",
  Safari: "https://svgl.app/library/safari.svg",
  Edge: "https://svgl.app/library/edge.svg",
  Opera: "https://svgl.app/library/opera.svg",
  Brave: "https://svgl.app/library/brave.svg",
};

const BROWSER_STORE_LINKS: Record<Browser, string | null> = {
  Chrome: "https://chromewebstore.google.com/detail/wideplayer-for-x/edehifeemiobccenpkodalpkmmngdkgh",
  Firefox: "https://addons.mozilla.org/pl/firefox/addon/wideplayer/",
  Safari: null,
  Edge: "https://microsoftedge.microsoft.com/addons/detail/wideplayer-for-x/ejbhlmgehocbfnpolalkbgonfeggkohi",
  Opera: null,
  Brave: "https://chromewebstore.google.com/detail/wideplayer-for-x/edehifeemiobccenpkodalpkmmngdkgh",
};

function detectBrowser(): Browser {
  if (typeof window === "undefined") return "Chrome";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("OPR/") || ua.includes("Opera/")) return "Opera";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  if ((navigator as Navigator & { brave?: { isBrave?: () => Promise<boolean> } }).brave) {
    return "Brave";
  }
  return "Chrome";
}

const styles: Record<
  Variant,
  {
    primary: string;
    disabledPrimary: string;
    divider: string;
    trigger: string;
    menu: string;
  }
> = {
  dark: {
    primary:
      "button-gradient text-white rounded-l-lg px-5 py-4 text-sm shadow-xl shadow-primary/18 hover:brightness-105 md:px-6 md:text-base",
    disabledPrimary:
      "bg-ink/70 text-white/70 rounded-l-lg px-5 py-4 text-sm shadow-xl shadow-primary/10 cursor-not-allowed md:px-6 md:text-base",
    divider: "bg-white/18",
    trigger:
      "button-gradient text-white rounded-r-lg px-4 py-4 shadow-xl shadow-primary/18 hover:brightness-105",
    menu: "left-0 bg-white text-ink",
  },
  light: {
    primary:
      "button-gradient text-white rounded-l-lg pl-5 pr-4 py-4 md:pl-6 md:pr-5 text-sm md:text-base shadow-2xl shadow-primary/18 hover:brightness-105",
    disabledPrimary:
      "bg-white/75 text-ink/45 rounded-l-lg pl-5 pr-4 py-4 md:pl-6 md:pr-5 text-sm md:text-base shadow-2xl cursor-not-allowed",
    divider: "bg-white/25",
    trigger:
      "button-gradient text-white rounded-r-lg px-4 py-4 shadow-2xl shadow-primary/18 hover:brightness-105",
    menu: "left-0 bg-white text-ink",
  },
};

export default function BrowserInstallButton({
  variant = "dark",
  location,
}: {
  variant?: Variant;
  location: "hero" | "cta";
}) {
  const [browser, setBrowser] = useState<Browser>("Chrome");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrowser(detectBrowser());
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLink = BROWSER_STORE_LINKS[browser];
  const otherBrowsers = ALL_BROWSERS.filter((b) => b !== browser);
  const s = styles[variant];

  return (
    <div className="relative z-50 inline-flex items-stretch" ref={dropdownRef}>
      {currentLink ? (
        <a
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
          data-umami-event="Install click"
          data-umami-event-browser={browser}
          data-umami-event-location={location}
          className={`${s.primary} inline-flex items-center gap-3 font-bold transition-all active:scale-95 whitespace-nowrap`}
        >
          <img src={BROWSER_ICONS[browser]} alt="" width={20} height={20} />
          <span>Add to {browser}</span>
          <IconArrowRight size={18} stroke={2.3} />
        </a>
      ) : (
        <button
          type="button"
          disabled
          aria-disabled="true"
          data-umami-event-browser={browser}
          data-umami-event-location={location}
          className={`${s.disabledPrimary} inline-flex items-center gap-3 font-bold whitespace-nowrap`}
        >
          <img src={BROWSER_ICONS[browser]} alt="" width={20} height={20} className="opacity-55" />
          <span>{browser} coming soon</span>
        </button>
      )}

      <div className={`w-px self-stretch ${s.divider}`} />

      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        aria-label="Choose browser"
        aria-expanded={dropdownOpen}
        data-umami-event="Browser menu toggle"
        data-umami-event-browser={browser}
        data-umami-event-location={location}
        className={`${s.trigger} inline-flex items-center font-bold transition-all active:scale-95`}
      >
        <IconChevronDown
          size={18}
          stroke={2.5}
          className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div
          className={`absolute top-full ${s.menu} z-[200] mt-3 w-full min-w-[240px] rounded-2xl border border-ink/10 shadow-2xl overflow-hidden`}
        >
          <p className="px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-ink-muted">
            Choose browser
          </p>
          {otherBrowsers.map((b) => {
            const hasLink = Boolean(BROWSER_STORE_LINKS[b]);
            return (
              <button
                key={b}
                type="button"
                onClick={() => {
                  if (!hasLink) return;
                  setBrowser(b);
                  setDropdownOpen(false);
                }}
                disabled={!hasLink}
                aria-disabled={!hasLink}
                data-umami-event={hasLink ? "Browser selected" : undefined}
                data-umami-event-browser={b}
                data-umami-event-location={location}
                className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold transition-colors ${
                  hasLink
                    ? "text-ink hover:bg-soft cursor-pointer"
                    : "text-ink/40 cursor-not-allowed"
                }`}
              >
                <img
                  src={BROWSER_ICONS[b]}
                  alt=""
                  width={18}
                  height={18}
                  className={!hasLink ? "opacity-40" : ""}
                />
                <span className="flex-1 text-left">{b}</span>
                {!hasLink && (
                  <span className="text-[9px] uppercase tracking-widest font-bold bg-ink/10 text-ink/50 px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
