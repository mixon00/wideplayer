import {
  IconArrowsMaximize,
  IconCircleCheck,
  IconSparkles,
  IconDeviceDesktop,
  IconEye,
} from "@tabler/icons-react";

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
                  <IconArrowsMaximize size={40} stroke={1.5} className="text-soft-bronze" />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-bright-green rounded-full flex items-center justify-center text-earth-green animate-bounce">
                    <IconArrowsMaximize size={20} stroke={2} />
                  </div>
                </div>
              </div>
            </div>

            {/* Text column */}
            <div className="lg:w-1/2 order-1 lg:order-2 space-y-6">
              <h2 className="font-headline text-4xl md:text-6xl italic leading-tight">
                Feed stays intact. <br />Video gets wider.
              </h2>
              <p className="text-xl text-muted-text font-light leading-relaxed">
                Videos in your feed are trapped in narrow columns. WidePlayer
                moves the player into a wider overlay, centered in your
                viewport, while the tweet layout stays exactly as it was.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center space-x-3">
                  <IconCircleCheck size={20} stroke={2} className="text-bright-green" />
                  <span className="text-earth-green font-medium">
                    Feed layout preserved while watching
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <IconCircleCheck size={20} stroke={2} className="text-bright-green" />
                  <span className="text-earth-green font-medium">
                    Auto mode, activates as you scroll
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
                Small plugin. <br />Big difference.
              </h2>
              <p className="text-xl text-muted-text font-light leading-relaxed">
                WidePlayer moves the original video. No copies, no duplicates.
                Auto mode widens each video as it enters your viewport. Manual
                mode puts an Expand button on every supported player.
              </p>
              {/* Lives in your scroll info box */}
              <div className="bg-warm-neutral/40 p-8 rounded-3xl border border-earth-green/5 flex items-start space-x-6">
                <div className="p-3 bg-white rounded-2xl shadow-sm flex-shrink-0">
                  <IconSparkles size={32} stroke={1.5} className="text-soft-bronze" />
                </div>
                <div>
                  <h4 className="font-bold text-earth-green mb-1">
                    Lives in your scroll
                  </h4>
                  <p className="text-sm text-muted-text">
                    Enabled by default. Supported videos widen as you scroll
                    into view and restore cleanly as you move on. Zero clicks
                    needed.
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
                      <IconDeviceDesktop size={80} stroke={1} className="text-earth-green" />
                    </div>
                  </div>
                </div>

                {/* Testimonial card */}
                <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border border-earth-green/5 flex items-center space-x-4 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-bright-green/20 flex items-center justify-center flex-shrink-0">
                    <IconEye size={20} stroke={2} className="text-earth-green" />
                  </div>
                  <p className="text-xs font-semibold italic text-earth-green">
                    &quot;Finally I can actually see what&apos;s happening in those clips.&quot;
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
