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
      "bg-earth-green text-cream rounded-l-md px-6 py-4 text-base shadow-xl shadow-earth-green/15 hover:opacity-95",
    disabledPrimary:
      "bg-earth-green/70 text-cream/70 rounded-l-md px-6 py-4 text-base shadow-xl shadow-earth-green/10 cursor-not-allowed",
    divider: "bg-cream/18",
    trigger:
      "bg-earth-green text-cream rounded-r-md px-4 py-4 shadow-xl shadow-earth-green/15 hover:opacity-95",
    menu: "left-0 bg-cream text-earth-green",
  },
  light: {
    primary:
      "bg-cream text-earth-green rounded-l-full pl-6 pr-5 py-4 md:pl-7 md:pr-6 text-sm md:text-base shadow-2xl hover:bg-bright-green",
    disabledPrimary:
      "bg-cream/75 text-earth-green/45 rounded-l-full pl-6 pr-5 py-4 md:pl-7 md:pr-6 text-sm md:text-base shadow-2xl cursor-not-allowed",
    divider: "bg-earth-green/20",
    trigger:
      "bg-cream text-earth-green rounded-r-full px-4 py-4 shadow-2xl hover:bg-bright-green",
    menu: "left-0 bg-cream text-earth-green",
  },
};

export default function BrowserInstallButton({ variant = "dark" }: { variant?: Variant }) {
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
    <div className="relative inline-flex items-stretch" ref={dropdownRef}>
      {currentLink ? (
        <a
          href={currentLink}
          target="_blank"
          rel="noopener noreferrer"
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
          className={`absolute top-full ${s.menu} mt-3 w-full min-w-[240px] rounded-2xl border border-earth-green/10 shadow-2xl overflow-hidden z-50`}
        >
          <p className="px-4 pt-3 pb-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-text">
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
                className={`w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold transition-colors ${
                  hasLink
                    ? "text-earth-green hover:bg-warm-neutral cursor-pointer"
                    : "text-earth-green/40 cursor-not-allowed"
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
  );
}
