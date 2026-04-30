import { IconCircleCheck, IconSparkles } from "@tabler/icons-react";

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 md:py-28 bg-white border-y border-earth-green/5">
      <div className="max-w-5xl mx-auto px-5 md:px-6">
        <div className="grid gap-20 md:gap-24">

          {/* Row 1 — Video left, text right */}
          <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-24">
            {/* Video column */}
            <div className="order-2 lg:order-1">
              <div className="video-card w-full rounded-xl overflow-hidden border border-earth-green/10 bg-white p-2">
                <video
                  src="/expand_demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  style={{ display: "block", width: "calc(100% + 2px)", marginLeft: "-1px" }}
                />
              </div>
            </div>

            {/* Text column */}
            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl italic leading-[1.03] text-balance">
                Feed stays intact. <br />Video gets wider.
              </h2>
              <p className="text-base md:text-lg text-muted-text font-light leading-relaxed max-w-md">
                Videos in your feed are trapped in narrow columns. WidePlayer
                moves the player into a wider overlay, centered in your
                viewport, while the tweet layout stays exactly as it was.
              </p>
              <ul className="space-y-3 pt-2">
                <li className="flex items-center space-x-3">
                  <IconCircleCheck size={17} stroke={2} className="text-bright-green" />
                  <span className="text-sm text-earth-green font-semibold">
                    Feed layout preserved while watching
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <IconCircleCheck size={17} stroke={2} className="text-bright-green" />
                  <span className="text-sm text-earth-green font-semibold">
                    Auto mode, activates as you scroll
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2 — Text left, video right */}
          <div className="grid lg:grid-cols-2 items-center gap-12 lg:gap-24">
            {/* Text column */}
            <div className="space-y-6">
              <h2 className="font-headline text-4xl md:text-5xl lg:text-6xl italic leading-[1.03] text-balance">
                Small extension. <br />Big difference.
              </h2>
              <p className="text-base md:text-lg text-muted-text font-light leading-relaxed max-w-md">
                WidePlayer moves the original video. No copies, no duplicates.
                Auto mode widens each video as it enters your viewport. Manual
                mode puts an Expand button on every supported player.
              </p>
              <div className="bg-cream/70 p-6 rounded-2xl border border-earth-green/5 flex items-start space-x-5 max-w-md">
                <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0">
                  <IconSparkles size={24} stroke={1.5} className="text-soft-bronze" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-earth-green mb-1">
                    Lives in your scroll
                  </h4>
                  <p className="text-xs md:text-sm text-muted-text leading-relaxed">
                    Enabled by default. Supported videos widen as you scroll
                    into view and restore cleanly as you move on. Zero clicks
                    needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Video column */}
            <div>
              <div className="video-card w-full rounded-xl overflow-hidden border border-earth-green/10 bg-white p-2">
                <video
                  src="/auto_expand_demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-lg"
                  style={{ display: "block", width: "calc(100% + 2px)", marginLeft: "-1px" }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
