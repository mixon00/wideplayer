export default function CtaSection() {
  return (
    <section id="install" className="py-40 px-6">
      <div className="max-w-6xl mx-auto bg-earth-green text-cream rounded-[4rem] p-12 md:p-32 relative overflow-hidden text-center">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-cream rounded-full" />
          <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] border-[20px] border-cream rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Headline */}
          <h2 className="font-headline text-5xl md:text-8xl mb-10 leading-none">
            Ready for <br />the{" "}
            <span className="italic text-bright-green">big</span> picture?
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-cream/70 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
            Join 15,000+ creators and watchers who refuse to settle for tiny
            windows.
          </p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Primary button */}
            <button className="bg-cream text-earth-green px-12 py-5 rounded-full text-xl font-bold hover:bg-bright-green transition-all active:scale-95 shadow-2xl flex items-center space-x-3 cursor-pointer">
              <span className="material-symbols-outlined">add_box</span>
              <span>Add to Chrome</span>
            </button>

            {/* Avatar stack */}
            <div className="flex items-center -space-x-3">
              <div className="w-12 h-12 rounded-full border-4 border-earth-green bg-soft-bronze/60 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-cream text-lg">
                  person
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-earth-green bg-muted-text/60 flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-cream text-lg">
                  person
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-earth-green bg-bright-green text-earth-green flex items-center justify-center text-[10px] font-bold">
                15k+
              </div>
            </div>
          </div>

          {/* Browser support */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
            <span>Safari</span>
            <span>Firefox</span>
            <span>Arc Browser</span>
            <span>Edge</span>
          </div>
        </div>
      </div>
    </section>
  );
}
