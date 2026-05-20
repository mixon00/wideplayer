import {
  IconBrandBluesky,
  IconBrandLinkedin,
  IconBrandMastodon,
  IconBrandX,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react";

const platforms = [
  {
    name: "X.com",
    copy: "Widen in-feed video on X. Enjoy a better view today.",
    status: "Supported",
    available: true,
    icon: IconBrandX,
    iconClass: "bg-black text-white",
  },
  {
    name: "Mastodon",
    copy: "Widen supported native videos and YouTube cards on Mastodon instances.",
    status: "Supported",
    available: true,
    icon: IconBrandMastodon,
    iconClass: "bg-violet text-white",
  },
  {
    name: "Bluesky",
    copy: "Bluesky support is being worked on next.",
    status: "In progress",
    available: false,
    icon: IconBrandBluesky,
    iconClass: "bg-sky text-white",
  },
  {
    name: "LinkedIn",
    copy: "LinkedIn support is on the roadmap.",
    status: "Planned",
    available: false,
    icon: IconBrandLinkedin,
    iconClass: "bg-[#0a66c2] text-white",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="platforms" className="bg-paper px-5 pb-6 pt-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 text-center">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
            Platforms
          </p>
          <h2 className="font-headline text-4xl font-semibold leading-tight text-ink md:text-5xl">
            More platforms. Same experience.
          </h2>
        </div>

        <div className="relative grid gap-5 md:grid-cols-4">
          <div className="absolute left-[14%] right-[14%] top-1/2 hidden border-t border-dashed border-ink/22 md:block" />

          {platforms.map(({ name, copy, status, available, icon: Icon, iconClass }) => (
            <article
              key={name}
              className={`relative rounded-xl border bg-white p-6 shadow-[0_18px_54px_-44px_rgba(7,8,74,0.4)] ${
                available ? "border-mint" : "border-ink/10"
              }`}
            >
              {available && (
                <span className="mb-4 inline-flex rounded-full bg-mint/12 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-[#0c9f60]">
                  Available now
                </span>
              )}
              <span className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}>
                <Icon size={22} />
              </span>
              <h3 className="mb-2 text-base font-black text-ink">{name}</h3>
              <p className="mb-7 text-sm font-medium leading-relaxed text-ink-muted">{copy}</p>
              <p className="flex items-center gap-2 text-[12px] font-bold text-ink-muted">
                {available ? (
                  <IconCircleCheck size={15} className="text-[#0c9f60]" />
                ) : (
                  <IconCircleDashed size={15} />
                )}
                {status}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
