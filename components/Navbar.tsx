export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-cream/60 apple-blur border-b border-earth-green/5">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="WidePlayer" className="w-8 h-8" />
          <span className="text-xl font-headline tracking-tight font-semibold italic">
            WidePlayer
          </span>
        </div>

        {/* Nav links — desktop only */}
        <div className="hidden lg:flex items-center space-x-12">
          <a
            href="#how"
            className="text-[13px] font-medium text-muted-text hover:text-earth-green transition-colors"
          >
            Interactive Demo
          </a>
          <a
            href="#benefits"
            className="text-[13px] font-medium text-muted-text hover:text-earth-green transition-colors"
          >
            Why it&apos;s better
          </a>
          <a
            href="#install"
            className="text-[13px] font-medium text-muted-text hover:text-earth-green transition-colors"
          >
            Add Extension
          </a>
        </div>

        {/* CTA button */}
        <button className="bg-earth-green text-cream px-6 py-2.5 rounded-full text-[13px] font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-earth-green/10 cursor-pointer">
          Get the Plugin
        </button>
      </div>
    </nav>
  );
}
