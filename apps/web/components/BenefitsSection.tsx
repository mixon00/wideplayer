import {
  IconAdjustmentsHorizontal,
  IconArrowsMaximize,
  IconListDetails,
} from "@tabler/icons-react";

const benefits = [
  {
    icon: IconArrowsMaximize,
    title: "Wider without distraction",
    copy: "Videos expand inside the feed so you never lose your place or context.",
    iconClass: "bg-lilac text-primary",
  },
  {
    icon: IconListDetails,
    title: "Auto mode",
    copy: "Auto-detects in-feed videos and widens them as you scroll.",
    iconClass: "bg-orange/14 text-orange",
  },
  {
    icon: IconAdjustmentsHorizontal,
    title: "Control when you want",
    copy: "Prefer manual control? Use the Expand button on any supported player.",
    iconClass: "bg-mint/18 text-[#0c9f60]",
  },
];

export default function BenefitsSection() {
  return (
    <section className="relative bg-paper px-5 pb-12 pt-20 md:pt-24">
      <div className="dot-field absolute left-12 top-28 h-36 w-36 opacity-80" />
      <div className="dot-field absolute bottom-8 right-20 h-28 w-32 opacity-50" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
            Keep the feed. Enjoy more.
          </p>
          <h2 className="font-headline text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Feed stays intact. <span className="italic">Video gets wider.</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, copy, iconClass }) => (
            <article
              key={title}
              className="rounded-2xl border border-ink/10 bg-white p-7 shadow-[0_24px_72px_-54px_rgba(7,8,74,0.42)]"
            >
              <div className={`mb-8 flex h-14 w-14 items-center justify-center rounded-2xl ${iconClass}`}>
                <Icon size={31} stroke={1.8} />
              </div>
              <h3 className="mb-3 text-lg font-black text-ink">{title}</h3>
              <p className="text-sm font-medium leading-relaxed text-ink-muted">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
