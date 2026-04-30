
export default function Footer() {
  return (
    <footer className="py-20 md:py-24 px-5 md:px-6 border-t border-earth-green/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Brand column — spans 2 cols on desktop */}
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-5">
            <img src="/logo.svg" alt="WidePlayer" className="w-6 h-6" />
            <span className="text-xl font-headline italic font-bold">
              WidePlayer
            </span>
          </div>
          <p className="text-sm text-muted-text font-light max-w-sm mb-8 leading-relaxed">
            A focused tool for X power users. WidePlayer brings wider, immersive
            video to your feed, without ever leaving it. Built with love and
            coffee.
          </p>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="max-w-6xl mx-auto pt-14 flex flex-col md:flex-row justify-between items-center text-[9px] font-bold uppercase tracking-[0.18em] text-earth-green/30">
        <p>
          © 2026 WidePlayer · Made by{" "}
          <a
            href="https://x.com/mat_misztoft"
            target="_blank"
            rel="noopener noreferrer"
            className="text-earth-green hover:text-earth-green/60 transition-colors"
          >
            @mat_misztoft
          </a>
          , for anyone tired of postage-stamp video.
        </p>
        <a
          href="/faq"
          className="mt-4 md:mt-0 hover:text-earth-green/60 transition-colors"
        >
          FAQ
        </a>
      </div>
    </footer>
  );
}
