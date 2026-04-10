import BrowserMockup from "./BrowserMockup";

export default function HeroSection() {
  return (
    <header
      id="how"
      className="relative pt-44 pb-32 px-6 max-w-6xl mx-auto text-center"
    >
      {/* Animated badge */}
      <div className="inline-flex items-center space-x-2 bg-warm-neutral/50 px-4 py-1.5 rounded-full mb-8 border border-earth-green/5">
        <span className="w-2 h-2 bg-bright-green rounded-full animate-pulse" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-earth-green/60">
          Now live on X · v1.0.0
        </span>
      </div>

      {/* Main headline */}
      <h1 className="font-headline text-5xl md:text-8xl leading-[1.0] text-earth-green mb-8 tracking-tight">
        Finally, your feed without the{" "}
        <span className="italic text-soft-bronze">squeeze.</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-muted-text max-w-2xl mx-auto font-light leading-snug mb-16">
        WidePlayer enlarges in-feed videos on X. No fullscreen, no layout
        break. Just scroll and watch wider.
      </p>

      {/* Interactive browser mockup */}
      <BrowserMockup />
    </header>
  );
}
