import {
  IconBrandGithub,
  IconCode,
  IconGitFork,
  IconHeart,
  IconLicense,
  IconShieldCheck,
  IconStar,
  IconUsers,
} from "@tabler/icons-react";
import BrowserInstallButton from "./BrowserInstallButton";

const GITHUB_REPO = "mixon00/wideplayer";

type GitHubRepo = {
  description: string | null;
  forks_count: number;
  full_name: string;
  html_url: string;
  language: string | null;
  license: { spdx_id: string | null } | null;
  stargazers_count: number;
  visibility?: string;
};

const fallbackRepo: GitHubRepo = {
  description: "A browser extension that makes in-feed videos wider without going fullscreen.",
  forks_count: 0,
  full_name: GITHUB_REPO,
  html_url: `https://github.com/${GITHUB_REPO}`,
  language: "TypeScript",
  license: { spdx_id: "MIT" },
  stargazers_count: 0,
  visibility: "public",
};

async function getGitHubRepo(): Promise<GitHubRepo> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return fallbackRepo;

    return (await response.json()) as GitHubRepo;
  } catch {
    return fallbackRepo;
  }
}

function formatCount(count: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: count >= 1000 ? 1 : 0,
    notation: count >= 1000 ? "compact" : "standard",
  }).format(count);
}

function formatVisibility(visibility?: string) {
  if (!visibility) return "Public";
  return visibility.charAt(0).toUpperCase() + visibility.slice(1);
}

const openItems = [
  { icon: IconCode, title: "Transparent", copy: "Code is public and reviewable." },
  { icon: IconShieldCheck, title: "Privacy first", copy: "We don't collect or share any data." },
  { icon: IconUsers, title: "Community driven", copy: "Built with feedback from real users." },
  { icon: IconHeart, title: "Always free", copy: "Open source today. Never pay-to-play." },
];

export default async function CtaSection() {
  const repo = await getGitHubRepo();
  const repoDescription =
    repo.description ?? "A browser extension that makes in-feed videos wider without going fullscreen.";
  const repoLicense = repo.license?.spdx_id ? `${repo.license.spdx_id} License` : "No license";
  const repoLanguage = repo.language ?? "Code";
  const repoUrl = repo.html_url;

  return (
    <section id="open-source" className="bg-paper px-5 py-10 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-7 overflow-hidden rounded-[1.55rem] bg-ink p-7 text-white shadow-[0_28px_90px_-54px_rgba(7,8,74,0.65)] md:grid-cols-[0.95fr_1.05fr] md:p-11">
          <div>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.28em] text-white/80">
              Open source
            </p>
            <h2 className="mb-4 font-headline text-4xl font-semibold leading-tight md:text-5xl">
              Open source by design.
            </h2>
            <p className="max-w-md text-sm font-medium leading-relaxed text-white/78 md:text-base">
              WidePlayer is built in the open, for everyone. No tracking. No analytics.
              Just a better way to watch in-feed videos.
            </p>

            <div className="mt-8 grid gap-4 text-[12px] sm:grid-cols-2">
              {openItems.map(({ icon: Icon, title, copy }) => (
                <div key={title} className="flex gap-3">
                  <Icon size={24} stroke={1.7} className="shrink-0 text-white" />
                  <div>
                    <p className="font-black">{title}</p>
                    <p className="mt-1 leading-relaxed text-white/66">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="self-center rounded-2xl border border-white/12 bg-white p-6 text-ink shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <IconBrandGithub size={30} />
                <div>
                  <h3 className="text-lg font-black">{repo.full_name}</h3>
                  <p className="text-[12px] font-bold text-ink-muted">{repoDescription}</p>
                </div>
              </div>
              <span className="rounded-full bg-soft px-3 py-1 text-[11px] font-black text-ink-muted">
                {formatVisibility(repo.visibility)}
              </span>
            </div>

            <div className="mb-7 flex flex-wrap gap-5 text-[12px] font-bold text-ink-muted">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                {repoLanguage}
              </span>
              <span className="inline-flex items-center gap-2">
                <IconLicense size={15} />
                {repoLicense}
              </span>
              <span className="inline-flex items-center gap-2">
                <IconStar size={15} />
                {formatCount(repo.stargazers_count)}
              </span>
              <span className="inline-flex items-center gap-2">
                <IconGitFork size={15} />
                {formatCount(repo.forks_count)}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="GitHub link click"
                data-umami-event-location="open-source"
                className="button-gradient inline-flex items-center justify-center gap-3 rounded-xl px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/18"
              >
                <IconBrandGithub size={20} />
                View on GitHub
              </a>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-xl border border-ink/12 bg-white px-5 py-3 text-sm font-black text-ink transition-colors hover:border-primary/30 hover:text-primary"
              >
                <IconStar size={20} />
                Star the project
              </a>
            </div>
          </div>
        </div>

        <div
          id="install"
          className="mt-5 grid items-center gap-6 overflow-visible rounded-[1.55rem] bg-[linear-gradient(135deg,#efe9ff_0%,#fff7f2_52%,#7a55ff_100%)] px-7 py-7 shadow-[0_18px_70px_-52px_rgba(7,8,74,0.45)] md:grid-cols-[1fr_auto] md:px-12"
        >
          <div>
            <h2 className="text-3xl font-black leading-tight text-ink md:text-4xl">
              Ready to watch{" "}
              <span className="font-headline italic font-semibold text-orange">wider</span>{" "}
              in-feed videos?
            </h2>
            <p className="mt-3 max-w-lg text-sm font-medium leading-relaxed text-ink">
              Install WidePlayer for X.com now and the best in-feed experience is one click away.
            </p>
          </div>
          <div className="grid gap-3">
            <BrowserInstallButton variant="light" location="cta" />
            <a
              href="https://github.com/mixon00/wideplayer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-6 py-3 text-sm font-black text-ink shadow-sm transition-colors hover:text-primary"
            >
              <IconStar size={20} />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
