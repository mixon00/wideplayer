export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-40 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col space-y-32">

          {/* Row 1 — Expand card left, text right */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            {/* Image column */}
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="relative h-[400px] w-full bg-warm-neutral rounded-[3rem] overflow-hidden flex items-center justify-center border border-earth-green/5">
                <div className="relative w-48 h-64 bg-cream border-4 border-earth-green rounded-xl flex items-center justify-center shadow-2xl transition-all duration-700 hover:w-[350px]">
                  <span className="material-symbols-outlined text-4xl text-soft-bronze">
                    open_in_full
                  </span>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-bright-green rounded-full flex items-center justify-center text-earth-green animate-bounce">
                    <span className="material-symbols-outlined">expand</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="lg:w-1/2 order-1 lg:order-2 space-y-6">
              <h2 className="font-headline text-4xl md:text-6xl italic leading-tight">
                Screen physics, <br />re-imagined.
              </h2>
              <p className="text-xl text-muted-text font-light leading-relaxed">
                Why are videos stuck in 2012? WidePlayer introduces{" "}
                <span className="text-earth-green font-medium">
                  Elastic Layouts
                </span>
                —it intelligently pushes the UI boundaries aside, giving your
                content the room it actually deserves.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-bright-green">
                    check_circle
                  </span>
                  <span className="text-earth-green font-medium">
                    Edge-to-edge immersion
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <span className="material-symbols-outlined text-bright-green">
                    check_circle
                  </span>
                  <span className="text-earth-green font-medium">
                    Smart comment-blocking
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2 — Text left, image right */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            {/* Text column */}
            <div className="lg:w-1/2 space-y-6">
              <h2 className="font-headline text-4xl md:text-6xl italic leading-tight">
                Small plugin. <br />Big feelings.
              </h2>
              <p className="text-xl text-muted-text font-light leading-relaxed">
                We don&apos;t just resize boxes. We curate an experience. Every
                transition is buttery smooth, designed to feel like a native
                part of the operating system you already love.
              </p>
              {/* Pixel Perfect info box */}
              <div className="bg-warm-neutral/40 p-8 rounded-3xl border border-earth-green/5 flex items-start space-x-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm flex-shrink-0">
                  <span className="material-symbols-outlined text-soft-bronze text-3xl">
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-earth-green mb-1">
                    Pixel Perfect
                  </h4>
                  <p className="text-sm text-muted-text">
                    Zero flicker. Zero lag. Just pure, unadulterated cinematic
                    joy on every page refresh.
                  </p>
                </div>
              </div>
            </div>

            {/* Image column */}
            <div className="lg:w-1/2 relative">
              <div className="relative h-[450px] w-full">
                {/* Desk image placeholder */}
                <div className="absolute inset-0 w-full h-full rounded-[3rem] shadow-2xl border border-white/20 bg-gradient-to-br from-warm-neutral via-cream to-soft-bronze/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4 opacity-30">
                      <span className="material-symbols-outlined text-8xl text-earth-green">
                        desktop_mac
                      </span>
                    </div>
                  </div>
                </div>

                {/* Testimonial card */}
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-earth-green/5 flex items-center space-x-4 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-bright-green/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-earth-green">
                      visibility
                    </span>
                  </div>
                  <p className="text-xs font-semibold italic text-earth-green">
                    &quot;It literally changed how I watch tutorials.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
