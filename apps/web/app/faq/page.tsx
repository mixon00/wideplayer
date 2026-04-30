import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "Where does WidePlayer work?",
    a: "On supported in-feed videos on x.com.",
  },
  {
    q: "Why doesn't it appear on every video?",
    a: "Some X layouts are still unsupported. WidePlayer skips videos it cannot enhance safely instead of forcing the UI into a broken state.",
  },
  {
    q: "What's the difference between Auto and Manual mode?",
    a: "Auto mode expands supported videos automatically. Manual mode leaves videos alone until you use the per-video control on the player.",
  },
  {
    q: "Do width changes apply immediately?",
    a: "Yes. While you drag the width slider in the popup, active players preview the change live before the final value is saved.",
  },
  {
    q: "Does WidePlayer collect any data?",
    a: "No. The browser extension does not collect, transmit, or sell any user data. It only stores your local extension settings, such as mode and preferred width, on your device.",
  },
  {
    q: "Do you use analytics on this website?",
    a: "Only on this website. The site uses cookieless Umami analytics to understand anonymous page traffic. It does not use cookies, does not identify visitors, and is separate from the WidePlayer extension, which collects no data.",
  },
];

export default function FaqPage() {
  return (
    <main>
      <Navbar />
      <section className="pt-44 pb-32 px-6 max-w-3xl mx-auto">
        <h1 className="font-headline text-5xl md:text-7xl text-earth-green mb-16 tracking-tight">
          FAQ
        </h1>
        <div className="divide-y divide-earth-green/10">
          {faqs.map(({ q, a }) => (
            <details key={q} className="group py-6">
              <summary className="flex items-center justify-between cursor-pointer list-none text-earth-green font-semibold text-lg md:text-xl select-none">
                {q}
                <span className="ml-6 shrink-0 text-2xl font-light transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-muted-text font-light leading-relaxed">
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
