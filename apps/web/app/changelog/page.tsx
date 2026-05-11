import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog | WidePlayer",
  description: "Product updates, fixes, and improvements in WidePlayer.",
};

const releases = [
  {
    version: "1.0.2",
    date: "April 17, 2026",
    groups: [
      {
        title: "Fixed",
        items: [
          "Firefox submission metadata now correctly declares no data collection.",
          "Firefox release builds include the data consent fields required by AMO.",
        ],
      },
    ],
  },
  {
    version: "1.0.1",
    date: "April 17, 2026",
    groups: [
      {
        title: "Fixed",
        items: [
          "Firefox development builds can now be installed temporarily without a background script error.",
        ],
      },
    ],
  },
  {
    version: "1.0.0",
    date: "April 9, 2026",
    groups: [
      {
        title: "Improved",
        items: [
          "Manual expand and collapse controls now hide after pointer inactivity.",
          "Controls stay visible while a video is paused, so the player is easier to manage.",
        ],
      },
    ],
  },
  {
    version: "0.3.12",
    date: "April 9, 2026",
    groups: [
      {
        title: "Fixed",
        items: [
          "Expanded videos now shift toward the horizontal center of the viewport instead of staying anchored to the original in-feed box.",
        ],
      },
    ],
  },
  {
    version: "0.3.11",
    date: "April 9, 2026",
    groups: [
      {
        title: "Improved",
        items: [
          "The popup is now the primary place for quick settings.",
          "The About & Help page now includes FAQ and recent update notes.",
          "User-facing copy now refers to X.com consistently.",
        ],
      },
    ],
  },
  {
    version: "0.3.6",
    date: "April 7, 2026",
    groups: [
      {
        title: "Improved",
        items: [
          "Manual expand and collapse now animate smoothly.",
          "Clicking outside an expanded player now collapses it.",
        ],
      },
    ],
  },
  {
    version: "0.3.3",
    date: "April 4, 2026",
    groups: [
      {
        title: "Improved",
        items: [
          "Width changes from the popup and options page now preview live on active players.",
          "Final width settings are saved only when the slider change is committed.",
        ],
      },
    ],
  },
  {
    version: "0.3.2",
    date: "April 4, 2026",
    groups: [
      {
        title: "Improved",
        items: [
          "Videos now expand more progressively while moving through the viewport.",
          "Overlay positioning reacts to scrolling and resizing while keeping the feed layout reserved.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-4xl px-6 pb-28 pt-44">
        <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-primary">
          Changelog
        </p>
        <h1 className="mb-5 font-headline text-5xl font-semibold leading-tight text-ink md:text-7xl">
          What changed in WidePlayer.
        </h1>
        <p className="mb-16 max-w-2xl text-base font-medium leading-relaxed text-ink-muted md:text-lg">
          Product updates, fixes, and small improvements. Written for users, not
          for commit history.
        </p>

        <div className="grid gap-8">
          {releases.map((release) => (
            <article
              key={release.version}
              className="rounded-2xl border border-ink/10 bg-white p-6 shadow-[0_18px_54px_-44px_rgba(7,8,74,0.4)] md:p-8"
            >
              <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-2xl font-black text-ink">
                  Version {release.version}
                </h2>
                <p className="text-sm font-bold text-ink-muted">{release.date}</p>
              </div>

              <div className="grid gap-7">
                {release.groups.map((group) => (
                  <section key={group.title}>
                    <h3 className="mb-3 text-[11px] font-black uppercase tracking-[0.22em] text-primary">
                      {group.title}
                    </h3>
                    <ul className="grid gap-3">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-xl bg-soft px-4 py-3 text-sm font-medium leading-relaxed text-ink"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
