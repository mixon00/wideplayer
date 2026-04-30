import {
  IconArrowsMaximize,
  IconEye,
  IconFocus2,
} from "@tabler/icons-react";

const steps = [
  {
    icon: IconFocus2,
    title: "Detects videos",
    copy: "When an in-feed video appears on X, WidePlayer prepares a wider view.",
  },
  {
    icon: IconArrowsMaximize,
    title: "Expands smartly",
    copy: "Click to expand, or let Auto mode do it for you as you scroll.",
  },
  {
    icon: IconEye,
    title: "Watch without disruption",
    copy: "Enjoy a wider player while the rest of your feed stays right where it is.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-white px-5 pb-24 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.26em] text-earth-green/70">
            How it works
          </p>
          <h2 className="font-headline text-4xl leading-none text-earth-green md:text-5xl">
            Simple by design.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="rounded-xl border border-earth-green/10 bg-cream/45 p-8 shadow-[0_24px_70px_-50px_rgba(27,59,37,0.35)]"
            >
              <div className="mb-10 flex h-16 w-16 items-center justify-center rounded-full bg-warm-neutral text-earth-green">
                <Icon size={34} stroke={1.65} />
              </div>
              <h3 className="mb-5 text-lg font-semibold text-earth-green">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-text">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
