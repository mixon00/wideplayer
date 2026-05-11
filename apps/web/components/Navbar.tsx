import { IconArrowRight } from "@tabler/icons-react";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#platforms", label: "Platforms" },
  { href: "/#open-source", label: "Open source" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-paper/78 apple-blur border-b border-ink/5">
      <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="WidePlayer" className="w-7 h-7" />
            <span className="text-2xl font-headline tracking-tight font-semibold italic text-ink">
              WidePlayer
            </span>
          </a>
        </div>

        <div className="hidden lg:flex items-center gap-11">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[13px] font-semibold text-ink transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="/#install"
          data-umami-event="Nav CTA click"
          data-umami-event-location="navbar"
          className="button-gradient inline-flex items-center gap-2 rounded-xl px-4 py-3 text-[12px] font-bold text-white shadow-lg shadow-primary/15 transition-all hover:brightness-105 active:scale-95 md:px-5"
        >
          <span>Get WidePlayer</span>
          <IconArrowRight size={14} stroke={2.2} />
        </a>
      </div>
    </nav>
  );
}
