import {
  IconRefresh,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import BrowserInstallButton from "./BrowserInstallButton";

export default function CtaSection() {
  return (
    <section id="install" className="scroll-mt-24 bg-white px-5 py-16 md:py-24">
      <div className="max-w-6xl mx-auto bg-earth-green text-cream rounded-2xl md:rounded-[1.75rem] px-6 py-16 md:px-24 md:py-20 relative text-center overflow-visible shadow-[0_28px_90px_-60px_rgba(27,59,37,0.55)]">
        {/* Decorative circles — own overflow+radius so dropdown is never clipped */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-2xl md:rounded-[1.75rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(74,222,128,0.16),transparent_48%)]" />
          <div className="absolute -top-28 -left-28 w-80 md:w-96 h-80 md:h-96 border-[28px] md:border-[36px] border-cream/10 rounded-full" />
          <div className="absolute -bottom-48 -right-48 w-[460px] md:w-[600px] h-[460px] md:h-[600px] border-[16px] md:border-[22px] border-cream/10 rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Headline */}
          <h2 className="font-headline text-5xl md:text-7xl lg:text-[5.8rem] mb-6 md:mb-8 leading-[0.95] text-balance">
            Ready for <br />the{" "}
            <span className="italic text-bright-green">big</span> picture?
          </h2>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-cream/70 mb-10 md:mb-12 max-w-xl mx-auto font-light leading-relaxed text-balance">
            Watch videos on X the way they deserve. Wider, without fullscreen,
            without breaking your feed.
          </p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <BrowserInstallButton variant="light" location="cta" />
          </div>

          {/* Browser support */}
          <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm text-cream/68">
            <span className="inline-flex items-center gap-2">
              <IconSparkles size={15} stroke={1.8} />
              Lightweight
            </span>
            <span className="inline-flex items-center gap-2">
              <IconShieldCheck size={15} stroke={1.8} />
              Private
            </span>
            <span className="inline-flex items-center gap-2">
              <IconRefresh size={15} stroke={1.8} />
              Always improving
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
