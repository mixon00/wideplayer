import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "Where does WidePlayer work?",
    a: "WidePlayer works on supported in-feed videos on X.com and Mastodon. Bluesky support is in progress. LinkedIn is planned.",
  },
  {
    q: "Which platforms are supported right now?",
    a: "X.com and Mastodon are supported today. Bluesky is the next platform in progress. LinkedIn is still on the roadmap.",
  },
  {
    q: "Why doesn't it appear on every video?",
    a: "Some X layouts and embedded players are still unsupported. WidePlayer skips videos it cannot enhance safely instead of forcing a broken layout.",
  },
  {
    q: "What's the difference between Auto and Manual mode?",
    a: "Auto mode expands supported videos as you scroll. Manual mode leaves videos at their normal size until you use the player control.",
  },
  {
    q: "Can I control how wide videos get?",
    a: "Yes. Open options to set the preferred width separately for each supported platform. Active players preview the change while you drag, then save the final value when you release it.",
  },
  {
    q: "Does WidePlayer collect any data?",
    a: "No. The browser extension does not collect, transmit, or sell any user data. It only stores your local extension settings, such as mode and preferred width, on your device.",
  },
  {
    q: "Do you use analytics on this website?",
    a: "Only on this website. The site uses cookieless Umami analytics to understand anonymous page traffic. It does not use cookies, does not identify visitors, and is separate from the WidePlayer extension, which collects no data.",
  },
  {
    q: "Is WidePlayer open source?",
    a: "Yes. The project is open source and available on GitHub. The extension is built in public so the code can be reviewed.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-3xl mx-auto">
        <h1 className="font-headline text-5xl md:text-7xl text-ink mb-16 tracking-tight">
          FAQ
        </h1>
        <div className="divide-y divide-ink/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none text-ink font-semibold text-lg md:text-xl select-none">
                {q}
                <span className="ml-6 shrink-0 text-2xl font-light transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-ink-muted font-light leading-relaxed">
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
