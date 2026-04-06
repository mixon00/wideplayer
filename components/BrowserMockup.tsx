"use client";

import { useState } from "react";

export default function BrowserMockup() {
  const [isWide, setIsWide] = useState(false);

  return (
    <div className="relative max-w-5xl mx-auto mt-20 group">
      {/* Browser frame */}
      <div className="browser-frame rounded-2xl bg-white p-3 border border-earth-green/10 overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <div className="bg-warm-neutral/50 px-6 py-1 rounded-md text-[10px] text-muted-text font-mono border border-earth-green/5">
            youtube.com/watch?v=wide-player-demo
          </div>
          <div className="flex items-center space-x-3 opacity-40">
            <span className="material-symbols-outlined text-sm">more_horiz</span>
          </div>
        </div>

        {/* Video area */}
        <div className="relative bg-[#0f0f0f] rounded-lg aspect-video flex flex-col items-center justify-center overflow-hidden">
          {/* Animated video box */}
          <div
            className="absolute inset-0 flex transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={
              isWide
                ? { width: "100%", left: 0, transform: "translateX(0)" }
                : { width: "70%", left: "50%", transform: "translateX(-50%)" }
            }
          >
            {/* Video placeholder — gradient instead of external image */}
            <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-950 opacity-90" />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="material-symbols-outlined text-white text-3xl">
                  play_arrow
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar panel — appears on group hover (CSS only) */}
          <div className="absolute right-4 top-10 bottom-10 w-48 bg-white/5 rounded-lg border border-white/10 p-4 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 hidden md:block">
            <div className="h-4 w-2/3 bg-white/20 rounded mb-3" />
            <div className="h-3 w-full bg-white/10 rounded mb-2" />
            <div className="h-3 w-4/5 bg-white/10 rounded mb-2" />
          </div>
        </div>
      </div>

      {/* Toggle bar — floats below the frame */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center bg-ui-bg p-4 rounded-2xl shadow-2xl border border-earth-green/10 space-x-6">
        <span className="text-xs font-bold text-earth-green/40 uppercase tracking-widest whitespace-nowrap">
          Normal View
        </span>

        <button
          onClick={() => setIsWide((prev) => !prev)}
          className="group/toggle relative flex items-center w-24 h-10 bg-warm-neutral rounded-full p-1 transition-all cursor-pointer"
          aria-label={isWide ? "Switch to normal view" : "Switch to wide player"}
        >
          <div className="absolute inset-0 w-full h-full bg-bright-green rounded-full opacity-0 group-hover/toggle:opacity-10 transition-opacity" />
          <div
            className={`w-8 h-8 bg-earth-green rounded-full flex items-center justify-center text-cream shadow-md transition-all duration-500 ${
              isWide ? "translate-x-14" : "translate-x-0"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              settings_ethernet
            </span>
          </div>
        </button>

        <span className="text-xs font-bold text-earth-green uppercase tracking-widest whitespace-nowrap">
          Wide Player
        </span>
      </div>
    </div>
  );
}
