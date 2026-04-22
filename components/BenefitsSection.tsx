import { IconCircleCheck, IconSparkles } from "@tabler/icons-react";

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col space-y-16">

          {/* Row 1 — Video left, text right */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            {/* Video column */}
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
                <video
                  src="/expand_demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ display: "block", width: "calc(100% + 2px)", marginLeft: "-1px" }}
                />
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

          {/* Row 2 — Text left, video right */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            {/* Text column */}
            <div className="lg:w-1/2 space-y-6">
              <h2 className="font-headline text-4xl md:text-6xl italic leading-tight">
                Small extension. <br />Big difference.
              </h2>
              <p className="text-xl text-muted-text font-light leading-relaxed">
                WidePlayer moves the original video. No copies, no duplicates.
                Auto mode widens each video as it enters your viewport. Manual
                mode puts an Expand button on every supported player.
              </p>
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

            {/* Video column */}
            <div className="lg:w-1/2">
              <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
                <video
                  src="/auto_expand_demo.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
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
