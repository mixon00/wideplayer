import { IconBrandGithub, IconBrandX, IconHeart } from "@tabler/icons-react";

const footerLinks = [
  { href: "/#how", label: "How it works" },
  { href: "/#platforms", label: "Platforms" },
  { href: "/#open-source", label: "Open source" },
  { href: "/changelog", label: "Changelog" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer id="faq" className="bg-paper px-5 pb-8 pt-3">
      <div className="mx-auto grid max-w-6xl gap-8 border-t border-ink/8 pt-6 md:grid-cols-[1fr_auto_auto] md:items-start">
        <div>
          <div className="mb-3 flex items-center space-x-2">
            <img src="/logo.svg" alt="WidePlayer" className="h-7 w-7" />
            <span className="font-headline text-2xl font-semibold italic text-ink">
              WidePlayer
            </span>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-ink-muted">
            Wider in-feed video across platforms you use. Open source. Privacy
            first. Always free.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[12px] font-bold text-ink md:flex-nowrap">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href} className="whitespace-nowrap hover:text-primary">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex gap-5 md:justify-end">
          <a
            href="https://github.com/mixon00/wideplayer"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WidePlayer on GitHub"
            className="text-ink transition-colors hover:text-primary"
          >
            <IconBrandGithub size={24} />
          </a>
          <a
            href="https://x.com/mat_misztoft"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WidePlayer author on X"
            className="text-ink transition-colors hover:text-primary"
          >
            <IconBrandX size={24} />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 text-[11px] font-medium text-ink-muted md:flex-row md:items-center md:justify-end">
        <p>© 2026 WidePlayer</p>
        <p className="inline-flex items-center gap-1">
          Made with <IconHeart size={13} className="fill-orange text-orange" /> and open source.
        </p>
      </div>
    </footer>
  );
}
