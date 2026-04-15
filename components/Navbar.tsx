export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] bg-cream/60 apple-blur border-b border-earth-green/5">
      <div className="flex justify-between items-center px-6 md:px-12 py-5 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img src="/logo.svg" alt="WidePlayer" className="w-8 h-8" />
            <span className="text-xl font-headline tracking-tight font-semibold italic">
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
          className="bg-earth-green text-cream px-6 py-2.5 rounded-full text-[13px] font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-earth-green/10 cursor-pointer"
        >
          Get the Plugin
        </a>
      </div>
    </nav>
  );
}
