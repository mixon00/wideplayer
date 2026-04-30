import { IconArrowRight } from "@tabler/icons-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-cream/70 apple-blur border-b border-earth-green/5">
      <div className="flex justify-between items-center px-5 md:px-8 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="WidePlayer" className="w-7 h-7" />
            <span className="text-lg font-headline tracking-tight font-semibold italic">
              WidePlayer
            </span>
          </a>
        </div>

        {/* Nav links — desktop only */}
        <div className="hidden lg:flex items-center space-x-12">
        </div>

        {/* CTA button */}
        <a
          href="/#install"
          className="inline-flex items-center gap-2 bg-earth-green text-cream px-5 py-2.5 rounded-full text-[12px] font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-earth-green/10 cursor-pointer"
        >
          <span>Get WidePlayer</span>
          <IconArrowRight size={14} stroke={2.2} />
        </a>
      </div>
    </nav>
  );
}
