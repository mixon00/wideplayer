import BrowserMockup from "./BrowserMockup";
import BrowserInstallButton from "./BrowserInstallButton";
import ProductHuntBadge from "./ProductHuntBadge";
import { IconShieldCheck } from "@tabler/icons-react";

export default function HeroSection() {
  return (
    <header
      id="how"
      className="relative pt-28 md:pt-36 pb-20 md:pb-24 px-5"
    >
      <div className="absolute right-[-16rem] top-12 h-[720px] w-[720px] rounded-full bg-earth-green/10 blur-2xl" />
      <div className="absolute right-[10%] bottom-[-18rem] h-[520px] w-[520px] rounded-full bg-soft-bronze/10 blur-2xl" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="max-w-xl text-left">
          {/* Animated badge */}
          <div className="inline-flex items-center space-x-2 bg-white/65 px-4 py-1.5 rounded-full mb-9 border border-earth-green/10 shadow-sm shadow-earth-green/5">
            <span className="w-1.5 h-1.5 bg-bright-green rounded-full animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-earth-green/55">
              New on X · Version 1.0.2
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-headline text-[3.45rem] md:text-[5.6rem] lg:text-[5.9rem] leading-[0.96] text-earth-green mb-7 tracking-tight text-balance">
            Finally, your feed without the{" "}
            <span className="italic text-soft-bronze">squeeze.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-text max-w-lg font-light leading-relaxed mb-8">
            WidePlayer enlarges in-feed videos on X. No fullscreen, no layout
            break. Just scroll and watch wider.
          </p>

          <div className="flex flex-col items-start gap-5">
            <BrowserInstallButton variant="dark" location="hero" />

            <div className="flex items-center gap-2 text-sm text-muted-text">
              <IconShieldCheck size={17} stroke={1.9} className="text-earth-green/70" />
              <span>Private by design</span>
              <span className="text-earth-green/25">·</span>
              <span>No data collected</span>
            </div>

            <ProductHuntBadge />
          </div>
        </div>

        {/* Interactive browser mockup */}
        <div className="relative lg:-mr-36">
          <BrowserMockup />
        </div>
      </div>
    </header>
  );
}
