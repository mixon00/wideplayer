import BrowserMockup from "./BrowserMockup";
import BrowserInstallButton from "./BrowserInstallButton";
import {
  IconBrandBluesky,
  IconBrandGithub,
  IconBrandMastodon,
  IconBrandX,
  IconChevronRight,
  IconCode,
  IconLock,
  IconShieldCheck,
} from "@tabler/icons-react";

export default function HeroSection() {
  return (
    <header
      id="how"
      className="relative overflow-visible px-5 pb-16 pt-28 md:pb-20 md:pt-36"
    >
      <div className="brand-sweep absolute -right-56 top-72 h-[520px] w-[520px] rotate-[-36deg] rounded-[7rem] opacity-95" />
      <div className="absolute -right-40 top-[21rem] h-[420px] w-[520px] rotate-[-36deg] rounded-[6rem] bg-paper" />

      <div className="relative mx-auto grid max-w-7xl items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-xl pt-16 text-left lg:pt-20">
          <div className="mb-9 inline-flex items-center rounded-full border border-violet/30 bg-white px-4 py-1.5 shadow-sm shadow-primary/5">
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-primary">
              New: wider video, same feed.
            </span>
          </div>

          <h1 className="mb-7 text-[3.15rem] font-black leading-[0.95] tracking-[-0.045em] text-ink text-balance md:text-[4.35rem] lg:text-[4.55rem]">
            Wider in-feed video across the platforms{" "}
            <span className="font-headline italic font-semibold tracking-normal text-orange">
              you use.
            </span>
          </h1>

          <p className="mb-7 max-w-lg text-base font-medium leading-relaxed text-ink md:text-lg">
            WidePlayer makes in-feed videos wider without going fullscreen. Keep
            your place in the feed while your videos get the space they deserve.
          </p>

          <div className="mb-9 grid gap-3 text-sm font-bold text-ink">
            <span className="inline-flex items-center gap-3">
              <IconBrandX size={20} className="rounded bg-black p-0.5 text-white" />
              Available now for X.com
            </span>
            <span className="inline-flex items-center gap-3">
              <IconBrandMastodon size={20} className="rounded bg-violet p-0.5 text-white" />
              Available now for Mastodon
            </span>
            <span className="inline-flex items-center gap-3">
              <IconBrandBluesky size={20} className="rounded bg-sky p-0.5 text-white" />
              Bluesky in progress. LinkedIn planned.
            </span>
            <span className="inline-flex items-center gap-3">
              <IconShieldCheck size={20} className="rounded bg-mint p-0.5 text-white" />
              Privacy first. No data collected.
            </span>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <BrowserInstallButton variant="dark" location="hero" />
            <a
              href="https://github.com/mixon00/wideplayer"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="GitHub link click"
              data-umami-event-location="hero"
              className="inline-flex items-center gap-3 rounded-xl border border-ink/12 bg-white px-6 py-4 text-sm font-black text-ink shadow-sm transition-all hover:border-primary/30 hover:text-primary active:scale-95 md:text-base"
            >
              <IconBrandGithub size={22} />
              View on GitHub
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-3 text-[12px] font-medium text-ink">
            <span className="inline-flex items-center gap-2">
              <IconCode size={16} className="text-primary" />
              Open source
            </span>
            <span className="inline-flex items-center gap-2">
              <IconLock size={16} className="text-primary" />
              No data collection
            </span>
            <a href="#open-source" className="inline-flex items-center gap-2 hover:text-primary">
              Privacy first
              <IconChevronRight size={14} />
            </a>
          </div>
        </div>

        <div className="relative lg:-mr-10">
          <BrowserMockup />
        </div>
      </div>
    </header>
  );
}
