"use client";

import { useState } from "react";
import {
  IconBell,
  IconBookmark,
  IconBrandBluesky,
  IconBrandLinkedin,
  IconBrandMastodon,
  IconBrandX,
  IconChartBar,
  IconHeart,
  IconHome,
  IconMail,
  IconMaximize,
  IconMessageCircle,
  IconPlayerPlayFilled,
  IconRepeat,
  IconSearch,
  IconShare3,
  IconUserCircle,
  IconUsers,
  IconVolume,
} from "@tabler/icons-react";

const navIcons = [IconBrandX, IconHome, IconSearch, IconBell, IconMail, IconBookmark, IconUsers, IconUserCircle];

const platformBadges = [
  { name: "X.com", status: "Available now", icon: IconBrandX, className: "bg-black text-white" },
  { name: "Mastodon", status: "Coming soon", icon: IconBrandMastodon, className: "bg-violet text-white" },
  { name: "Bluesky", status: "Coming soon", icon: IconBrandBluesky, className: "bg-sky text-white" },
  { name: "LinkedIn", status: "Coming soon", icon: IconBrandLinkedin, className: "bg-[#0a66c2] text-white" },
];

export default function BrowserMockup() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="relative mx-auto w-full max-w-[680px] lg:w-[660px]">
      <div className="browser-frame overflow-hidden rounded-[1.4rem] border border-ink/10 bg-white">
        <div className="relative grid min-h-[570px] grid-cols-[3.4rem_minmax(0,1fr)] md:grid-cols-[3.4rem_minmax(0,1fr)_9.2rem]">
          <aside className="flex flex-col items-center gap-6 bg-ink px-3 py-6 text-white">
            {navIcons.map((Icon, index) => (
              <Icon
                key={index}
                size={22}
                stroke={index === 0 ? 1.5 : 2}
                className={index === 0 ? "mb-2" : "opacity-95"}
              />
            ))}
          </aside>

          <section className="min-w-0 border-r border-ink/8 bg-white">
            <div className="grid grid-cols-2 border-b border-ink/8 text-center text-[11px] font-bold text-ink">
              <div className="relative py-5">
                For you
                <span className="absolute bottom-0 left-1/2 h-0.5 w-16 -translate-x-1/2 rounded-full bg-primary" />
              </div>
              <div className="py-5 text-ink-muted">Following</div>
            </div>

            <Post
              author="National Parks"
              handle="@nationalparks"
              copy="Morning light in the mountains."
              avatar="bg-[linear-gradient(135deg,#ca7839,#195d3d)]"
              primary
              expanded={isEnabled}
            />
            <Post
              author="Tech Explorers"
              handle="@TechExplorers"
              copy="Tiny details, big impact."
              avatar="bg-[linear-gradient(135deg,#111827,#ff7a18)]"
            />
          </section>

          <aside className="hidden bg-white px-5 py-9 md:block">
            <h3 className="mb-5 text-sm font-black text-ink">What&apos;s happening</h3>
            <div className="grid gap-5 text-[11px]">
              {[
                ["Trending", "AI at Work", "15.2K posts"],
                ["Trending", "Design Inspo", "8,908 posts"],
                ["Trending", "Built in Public", "2,341 posts"],
              ].map(([label, title, count]) => (
                <div key={title}>
                  <p className="text-ink-muted">{label}</p>
                  <p className="mt-1 font-black text-ink">{title}</p>
                  <p className="mt-1 text-ink-muted">{count}</p>
                </div>
              ))}
              <a href="#platforms" className="font-bold text-primary">
                Show more
              </a>
            </div>
          </aside>

        </div>
      </div>

      <div className="relative z-20 mx-auto -mt-12 grid w-[min(92%,31rem)] grid-cols-4 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_70px_-34px_rgba(7,8,74,0.45)]">
        {platformBadges.map(({ name, status, icon: Icon, className }) => (
          <div key={name} className="grid gap-2 border-r border-ink/8 px-3 py-4 text-center last:border-r-0">
            <span className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${className}`}>
              <Icon size={19} />
            </span>
            <span className="text-[11px] font-black text-ink">{name}</span>
            <span className="text-[10px] font-medium text-ink-muted">{status}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <label
          className="group inline-flex cursor-pointer items-center gap-4 rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-[0_18px_48px_-34px_rgba(7,8,74,0.42)] transition-all hover:border-primary/25"
        >
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(event) => setIsEnabled(event.currentTarget.checked)}
            className="pointer-events-none absolute h-0 w-0 opacity-0"
          />
          <span className="grid text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              WidePlayer
            </span>
            <span className="text-sm font-black text-ink">
              {isEnabled ? "Extension enabled" : "Extension disabled"}
            </span>
          </span>
          <span
            className={`relative h-8 w-16 rounded-full p-1 transition-colors ${
              isEnabled ? "button-gradient" : "bg-ink/12"
            }`}
          >
            <span
              className={`block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                isEnabled ? "translate-x-8" : "translate-x-0"
              }`}
            />
          </span>
        </label>
      </div>
    </div>
  );
}

function Post({
  author,
  handle,
  copy,
  avatar,
  primary = false,
  expanded = false,
}: {
  author: string;
  handle: string;
  copy: string;
  avatar: string;
  primary?: boolean;
  expanded?: boolean;
}) {
  return (
    <article className="border-b border-ink/8 p-5">
      <div className="mb-3 flex items-start gap-3">
        <div className={`h-9 w-9 shrink-0 rounded-full ${avatar}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[12px]">
            <strong className="text-ink">{author}</strong>
            <span className="truncate text-ink-muted">{handle} · 3h</span>
          </div>
          <p className="mt-0.5 text-[12px] font-medium text-ink">{copy}</p>
        </div>
        <span className="text-ink-muted">...</span>
      </div>

      {primary ? (
        <HeroPlayerSlot expanded={expanded} />
      ) : (
        <div className="ml-12">
          <InlinePlayer />
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <IconMessageCircle size={15} /> 24
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconRepeat size={15} /> 17
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconHeart size={15} /> 1.2K
        </span>
        <span className="inline-flex items-center gap-1.5">
          <IconChartBar size={15} /> 48K
        </span>
        <IconShare3 size={15} />
      </div>
    </article>
  );
}

function InlinePlayer() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-ink">
      <div className="aspect-video bg-[linear-gradient(145deg,#071228_0%,#0d2744_40%,#1b6b8d_41%,#06101f_100%)]" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 text-white">
        <div className="mb-3 h-0.5 rounded-full bg-white/25">
          <div className="h-full w-[64%] rounded-full bg-white" />
        </div>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <IconPlayerPlayFilled size={15} />
          <IconVolume size={15} />
          <span className="ml-auto">0:00 / 0:15</span>
          <IconMaximize size={15} />
        </div>
      </div>
    </div>
  );
}

function HeroPlayerSlot({ expanded }: { expanded: boolean }) {
  return (
    <div className="relative h-[16.75rem]">
      <div
        className={`pointer-events-none absolute top-1 z-20 overflow-hidden rounded-xl bg-ink transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          expanded
            ? "left-[-1.35rem] right-[-9.7rem] h-[16.5rem] shadow-[0_26px_70px_-36px_rgba(7,8,74,0.58)]"
            : "left-12 right-0 h-[13.35rem] shadow-none"
        }`}
      >
        <div
          className="h-full bg-[linear-gradient(145deg,#0e162f_0%,#152d4f_26%,#f3a23b_27%,#1d3557_38%,#ef7d22_39%,#56330f_56%,#12162f_100%)]"
        />
        <PlayerControls />
      </div>
    </div>
  );
}

function PlayerControls() {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/38 to-transparent p-4 text-white">
      <div className="mb-3 h-0.5 rounded-full bg-white/25">
        <div className="h-full w-[64%] rounded-full bg-white" />
      </div>
      <div className="flex items-center gap-3 text-[11px] font-semibold">
        <IconPlayerPlayFilled size={15} />
        <IconVolume size={15} />
        <span className="ml-auto">0:00 / 0:15</span>
        <IconMaximize size={15} />
      </div>
    </div>
  );
}
