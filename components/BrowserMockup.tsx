"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface PlayerRect {
  top: number;
  height: number;
  left: number;
  right: number;
  containerWidth: number;
}

export default function BrowserMockup() {
  const [isWide, setIsWide] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<PlayerRect>({ top: 0, height: 0, left: 0, right: 0, containerWidth: 0 });

  const measure = useCallback(() => {
    if (!spacerRef.current || !containerRef.current) return;
    const s = spacerRef.current.getBoundingClientRect();
    const c = containerRef.current.getBoundingClientRect();
    setRect({
      top: s.top - c.top,
      height: s.height,
      left: s.left - c.left,
      right: c.right - s.right,
      containerWidth: c.width,
    });
    setHasMeasured(true);
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (spacerRef.current) ro.observe(spacerRef.current);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measure]);

  // Expand player by 90% in both dimensions (proportional), centered
  const baseWidth = rect.containerWidth - rect.left - rect.right;
  const wDelta = (baseWidth * 1.2) / 2;
  const hDelta = (rect.height * 1.2) / 2;
  const wideLeft = Math.max(0, rect.left - wDelta);
  const wideRight = Math.max(0, rect.right - wDelta);
  const wideTop = Math.max(0, rect.top - hDelta);
  const wideHeight = rect.height * 2.2;

  return (
    <div className="relative max-w-5xl mx-auto mt-20">
      {/* ── Browser chrome shell ── */}
      <div className="browser-frame rounded-2xl bg-white p-3 border border-earth-green/10">

        {/* Traffic lights + URL */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="px-6 py-1 rounded-md text-[10px] font-mono border" style={{ background: "#EFF3F4", borderColor: "#EFF3F4", color: "#536471" }}>
            x.com/home
          </div>
          <div style={{ opacity: 0.4 }}>
            <span className="material-symbols-outlined text-sm">more_horiz</span>
          </div>
        </div>

        {/* ── 3-column layout — relative container for the player overlay ── */}
        <div
          ref={containerRef}
          className="relative flex rounded-lg overflow-hidden"
          style={{ background: "#FFFFFF", border: "1px solid #EFF3F4" }}
        >

          {/* ── LEFT NAV COLUMN ── */}
          <div className="w-1/3 flex flex-col px-5 py-5 gap-4" style={{ borderRight: "1px solid #EFF3F4" }}>
            {/* X logo shape */}
            <div className="w-7 h-7 rounded mb-2" style={{ background: "#0F1419" }} />
            {/* Nav items: icon + label line */}
            {[
              { w: "58%", active: true },
              { w: "68%" },
              { w: "74%" },
              { w: "52%" },
              { w: "63%" },
              { w: "70%" },
              { w: "45%" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-lg shrink-0"
                  style={{ background: item.active ? "#0F1419" : "#EFF3F4" }}
                />
                <div
                  className="h-2.5 rounded"
                  style={{ width: item.w, background: item.active ? "#0F1419" : "#CFD9DE" }}
                />
              </div>
            ))}
            {/* Post button */}
            <div className="mt-3 h-9 w-full rounded-full" style={{ background: "#1D9BF0" }} />
          </div>

          {/* ── CENTER FEED COLUMN ── */}
          <div className="w-1/3 flex flex-col" style={{ borderRight: "1px solid #EFF3F4" }}>
            {/* Tab bar */}
            <div className="flex px-4 shrink-0" style={{ borderBottom: "1px solid #EFF3F4" }}>
              <div className="py-3 mr-5">
                <div className="h-2.5 w-10 rounded-full" style={{ background: "#0F1419" }} />
                <div className="h-0.5 w-10 rounded-full mt-2" style={{ background: "#1D9BF0" }} />
              </div>
              <div className="py-3">
                <div className="h-2.5 w-14 rounded-full" style={{ background: "#CFD9DE" }} />
              </div>
            </div>

            {/* Tweet card 1 */}
            <TweetCard avatarColor="#CFD9DE" lines={[0.75, 1, 0.82]} />

            {/* Tweet card 2 — holds the invisible player spacer */}
            <div className="mx-3 my-2 p-3 flex gap-2 shrink-0" style={{ borderRadius: "16px", border: "1px solid #EFF3F4" }}>
              <div className="w-7 h-7 rounded-full shrink-0 mt-0.5" style={{ background: "#CFD9DE" }} />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="h-2 rounded" style={{ width: "65%", background: "#0F1419", opacity: 0.15 }} />
                <div className="h-1.5 rounded" style={{ width: "85%", background: "#EFF3F4" }} />
                {/* invisible spacer that the player overlay matches */}
                <div ref={spacerRef} className="w-full" style={{ aspectRatio: "16/9" }} />
                <div className="flex gap-3 pt-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-1.5 w-4 rounded" style={{ background: "#EFF3F4" }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Tweet card 3 */}
            <TweetCard avatarColor="#CFD9DE" lines={[0.7, 1, 0.6, 0.8]} />

            {/* Tweet card 4 */}
            <TweetCard avatarColor="#EFF3F4" lines={[0.8, 1, 0.75]} />
          </div>

          {/* ── RIGHT SIDEBAR COLUMN ── */}
          <div className="w-1/3 flex flex-col px-4 py-4 gap-4" style={{ background: "#FFFFFF" }}>
            {/* Search bar shape */}
            <div className="h-8 rounded-full shrink-0" style={{ background: "#EFF3F4" }} />

            {/* Trends card */}
            <div className="p-4 space-y-3.5 shrink-0" style={{ background: "#F7F9F9", borderRadius: "16px" }}>
              <div className="h-3 w-16 rounded" style={{ background: "#0F1419", opacity: 0.8 }} />
              {[
                { cat: "55%", label: "70%", count: "35%" },
                { cat: "50%", label: "60%", count: "30%" },
                { cat: "60%", label: "75%", count: "40%" },
                { cat: "48%", label: "65%", count: "28%" },
              ].map((t, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-1.5 rounded" style={{ width: t.cat, background: "#CFD9DE" }} />
                  <div className="h-2 rounded" style={{ width: t.label, background: "#0F1419", opacity: 0.7 }} />
                  <div className="h-1.5 rounded" style={{ width: t.count, background: "#CFD9DE" }} />
                </div>
              ))}
            </div>

            {/* Who to follow card */}
            <div className="p-4 space-y-3 shrink-0" style={{ background: "#F7F9F9", borderRadius: "16px" }}>
              <div className="h-3 w-20 rounded" style={{ background: "#0F1419", opacity: 0.8 }} />
              {["#CFD9DE", "#B9C9D4", "#CFD9DE"].map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full shrink-0" style={{ background: color }} />
                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="h-2 rounded" style={{ width: "70%", background: "#0F1419", opacity: 0.6 }} />
                    <div className="h-1.5 rounded" style={{ width: "50%", background: "#CFD9DE" }} />
                  </div>
                  <div className="h-6 w-12 rounded-full shrink-0" style={{ background: "#0F1419" }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── PLAYER OVERLAY ── */}
          <div
            className={`absolute z-20 rounded-xl overflow-hidden ${hasInteracted ? "transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" : ""}`}
            style={{
              top: isWide ? wideTop : rect.top,
              height: isWide ? wideHeight : rect.height,
              left: isWide ? wideLeft : rect.left,
              right: isWide ? wideRight : rect.right,
              background: "#0f0f0f",
              visibility: hasMeasured ? "visible" : "hidden",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-600/30 to-neutral-950" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-lg">
                <span className="material-symbols-outlined text-white text-xl">play_arrow</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-2.5 left-3 right-3 h-1 rounded-full bg-white/20">
              <div className="h-full w-2/5 rounded-full bg-white/70" />
            </div>
          </div>

        </div>
      </div>

      {/* ── Toggle bar ── */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center bg-ui-bg p-4 rounded-2xl shadow-2xl border border-earth-green/10 space-x-6">
        <span className="text-xs font-bold text-earth-green/40 uppercase tracking-widest whitespace-nowrap">
          Normal View
        </span>
        <button
          onClick={() => { setHasInteracted(true); setIsWide((p) => !p); }}
          className="group/t relative flex items-center w-24 h-10 bg-warm-neutral rounded-full p-1 cursor-pointer"
          aria-label={isWide ? "Switch to normal view" : "Switch to wide player"}
        >
          <div className="absolute inset-0 bg-bright-green rounded-full opacity-0 group-hover/t:opacity-10 transition-opacity" />
          <div
            className={`w-8 h-8 bg-earth-green rounded-full flex items-center justify-center text-cream shadow-md transition-all duration-500 ${
              isWide ? "translate-x-14" : "translate-x-0"
            }`}
          >
            <span className="material-symbols-outlined text-sm">settings_ethernet</span>
          </div>
        </button>
        <span className="text-xs font-bold text-earth-green uppercase tracking-widest whitespace-nowrap">
          Wide Player
        </span>
      </div>
    </div>
  );
}

/* ── Reusable tweet card skeleton ── */
function TweetCard({
  avatarColor,
  lines,
}: {
  avatarColor: string;
  lines: number[];
}) {
  return (
    <div
      className="mx-3 my-2 p-3 flex gap-2 shrink-0"
      style={{ borderRadius: "16px", border: "1px solid #EFF3F4" }}
    >
      <div
        className="w-7 h-7 rounded-full shrink-0 mt-0.5"
        style={{ background: avatarColor }}
      />
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="h-2 rounded" style={{ width: "70%", background: "#0F1419", opacity: 0.15 }} />
        {lines.map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded"
            style={{ width: `${w * 100}%`, background: "#EFF3F4" }}
          />
        ))}
        <div className="flex gap-3 pt-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-1.5 w-4 rounded" style={{ background: "#EFF3F4" }} />
          ))}
        </div>
      </div>
    </div>
  );
}
