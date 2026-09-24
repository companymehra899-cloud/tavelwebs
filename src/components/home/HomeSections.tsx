"use client";

import Link from "next/link";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useSearch } from "@/components/search/SearchProvider";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import { CATEGORY_PATHS } from "@/lib/constants";
import { TOOL_MAP, type ToolMeta } from "@/lib/catalog";

const HERO_CHIPS = [
  "fuel-cost-calculator",
  "road-trip-cost-calculator",
  "currency-converter",
  "travel-budget-calculator",
  "packing-list-generator",
];

const POPULAR_ACCENTS = [
  "border-sky-200 bg-sky-50 text-sky-700",
  "border-cyan-200 bg-cyan-50 text-cyan-700",
  "border-indigo-200 bg-indigo-50 text-indigo-700",
  "border-emerald-200 bg-emerald-50 text-emerald-700",
  "border-amber-200 bg-amber-50 text-amber-700",
  "border-violet-200 bg-violet-50 text-violet-700",
];

export function HomeHero() {
  const { t } = usePreferences();
  const { openSearch } = useSearch();

  return (
    <section className="relative overflow-hidden">
      <div className="page-shell grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="animate-rise">
          <span className="eyebrow inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3 py-1.5 text-accent-strong">
            <Icon name="sparkle" size={13} />
            {t("home.heroBadge")}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {t("home.heroTitle")}
            <span className="mt-1 block text-accent">{t("home.heroTitleAccent")}</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted">{t("home.heroSubtitle")}</p>

          <button
            type="button"
            onClick={openSearch}
            className="group mt-8 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-left shadow-[var(--shadow)] transition hover:border-accent/40"
          >
            <Icon name="search" size={20} className="text-muted" />
            <span className="flex-1 text-sm text-muted sm:text-base">{t("home.searchPlaceholder")}</span>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-accent px-3.5 text-xs font-semibold text-white transition group-hover:bg-accent-strong">
              {t("home.searchButton")}
              <Icon name="arrow-right" size={14} />
            </span>
          </button>

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{t("home.popularLabel")}</span>
            {HERO_CHIPS.map((slug) => {
              const tool = TOOL_MAP[slug];
              if (!tool) return null;
              return (
                <Link
                  key={slug}
                  href={`/tools/${slug}`}
                  className="rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted transition hover:border-accent/40 hover:text-accent-strong"
                >
                  {tool.shortTitle}
                </Link>
              );
            })}
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="animate-rise relative mx-auto hidden w-full max-w-xl lg:block">
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] border border-brand-strong/40 bg-[linear-gradient(150deg,#0b1b33_0%,#12294a_55%,#0e3556_100%)] shadow-[0_40px_90px_rgba(5,15,32,0.35)]">
        <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(125,211,252,0.10)" strokeWidth="1" />
            </pattern>
            <linearGradient id="route" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
          <rect width="400" height="320" fill="url(#grid)" />
          <path
            d="M52 250 C 120 210, 130 130, 205 118 S 320 96, 352 58"
            fill="none"
            stroke="rgba(56,189,248,0.25)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M52 250 C 120 210, 130 130, 205 118 S 320 96, 352 58"
            fill="none"
            stroke="url(#route)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="7 7"
          />
          <circle cx="52" cy="250" r="7" fill="#0b1b33" stroke="#38bdf8" strokeWidth="3" />
          <circle cx="352" cy="58" r="7" fill="#0b1b33" stroke="#22d3ee" strokeWidth="3" />
        </svg>

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur">
          <Icon name="route" size={16} className="text-sky-300" />
          <span className="text-xs font-semibold text-white/90">Paris → Milan</span>
        </div>

        <div className="absolute bottom-5 left-5 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-200/80">Distance</p>
          <p className="mt-1 text-2xl font-bold text-white">1,245 km</p>
        </div>
        <div className="absolute bottom-16 right-5 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sky-200/80">Trip cost</p>
          <p className="mt-1 text-2xl font-bold text-white">€198.10</p>
        </div>
        <div className="absolute right-6 top-24 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-cyan-300 backdrop-blur">
          <Icon name="suitcase" size={22} />
        </div>
      </div>
    </div>
  );
}

function PopularCard({ tool, index }: { tool: ToolMeta; index: number }) {
  const accent = POPULAR_ACCENTS[index % POPULAR_ACCENTS.length];
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group flex h-full items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]"
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accent}`}>
        <Icon name={resolveIcon(tool.icon)} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-accent-strong">
          {tool.shortTitle}
        </span>
        <span className="mt-1 block line-clamp-2 text-xs leading-5 text-muted">{tool.description}</span>
      </span>
      <Icon name="arrow-right" size={16} className="mt-1 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}

export function PopularTools() {
  const { t } = usePreferences();
  const popular = ["road-trip-cost-calculator", "fuel-cost-calculator", "currency-converter", "travel-budget-calculator", "packing-list-generator", "time-zone-converter"]
    .map((slug) => TOOL_MAP[slug])
    .filter(Boolean) as ToolMeta[];

  return (
    <section aria-labelledby="popular-heading" className="page-shell">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">{t("home.popularLabel")}</p>
          <h2 id="popular-heading" className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("home.popular")}
          </h2>
        </div>
        <Link href="/tools" className="hidden items-center gap-1 text-sm font-semibold text-accent hover:text-accent-strong sm:inline-flex">
          {t("home.viewAll")}
          <Icon name="arrow-right" size={15} />
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((tool, index) => (
          <li key={tool.slug} className="h-full">
            <PopularCard tool={tool} index={index} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const SECTIONS: {
  id: string;
  labelKey: string;
  featured: string;
  sides: string[];
  categoryHref: string;
  accent: "sky" | "indigo" | "cyan" | "emerald";
}[] = [
  {
    id: "road-trips",
    labelKey: "home.sectionRoad",
    featured: "road-trip-cost-calculator",
    sides: ["fuel-cost-calculator", "fuel-toll-calculator", "ev-charging-cost-calculator"],
    categoryHref: CATEGORY_PATHS["road-trips"],
    accent: "sky",
  },
  {
    id: "budget",
    labelKey: "home.sectionMoney",
    featured: "travel-budget-calculator",
    sides: ["currency-converter", "travel-money-calculator", "cost-per-person-calculator"],
    categoryHref: CATEGORY_PATHS["travel-budget"],
    accent: "emerald",
  },
  {
    id: "time",
    labelKey: "home.sectionTime",
    featured: "time-zone-converter",
    sides: ["jet-lag-calculator", "flight-time-calculator", "layover-calculator", "trip-duration-calculator"],
    categoryHref: CATEGORY_PATHS["travel-time"],
    accent: "indigo",
  },
  {
    id: "planning",
    labelKey: "home.sectionPlan",
    featured: "packing-list-generator",
    sides: ["travel-checklist", "trip-countdown"],
    categoryHref: CATEGORY_PATHS["travel-planning"],
    accent: "cyan",
  },
];

const ACCENT_CLASSES: Record<string, { icon: string; wash: string; text: string }> = {
  sky: { icon: "bg-sky-50 text-sky-600 border-sky-200", wash: "from-sky-100/70", text: "text-sky-700" },
  indigo: { icon: "bg-indigo-50 text-indigo-600 border-indigo-200", wash: "from-indigo-100/70", text: "text-indigo-700" },
  cyan: { icon: "bg-cyan-50 text-cyan-600 border-cyan-200", wash: "from-cyan-100/70", text: "text-cyan-700" },
  emerald: { icon: "bg-emerald-50 text-emerald-600 border-emerald-200", wash: "from-emerald-100/70", text: "text-emerald-700" },
};

function FeaturedToolCard({ tool, accent }: { tool: ToolMeta; accent: string }) {
  const { t } = usePreferences();
  const colors = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.sky;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface p-6 shadow-[var(--shadow)]"
    >
      <div className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${colors.wash} to-transparent blur-2xl`} />
      <span className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border ${colors.icon}`}>
        <Icon name={resolveIcon(tool.icon)} size={24} />
      </span>
      <p className={`relative mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${colors.text}`}>{tool.categoryLabel}</p>
      <h3 className="relative mt-2 text-xl font-bold tracking-tight text-ink">{tool.title}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
      <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:text-accent-strong">
        {t("tools.openTool")}
        <Icon name="arrow-right" size={16} className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function SideToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="hover-lift group flex items-center gap-3.5 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-sm)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon name={resolveIcon(tool.icon)} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-ink">{tool.shortTitle}</span>
        <span className="block truncate text-xs text-muted">{tool.categoryLabel}</span>
      </span>
      <Icon name="arrow-right" size={15} className="shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent" />
    </Link>
  );
}

export function CategoryShowcase() {
  const { t } = usePreferences();
  return (
    <div className="space-y-16">
      {SECTIONS.map((section) => {
        const featured = TOOL_MAP[section.featured];
        const sides = section.sides.map((slug) => TOOL_MAP[slug]).filter(Boolean) as ToolMeta[];
        if (!featured) return null;
        return (
          <section key={section.id} aria-labelledby={`section-${section.id}`} className="page-shell">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">{t("home.browseByCategory")}</p>
                <h2 id={`section-${section.id}`} className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  {t(section.labelKey)}
                </h2>
              </div>
              <Link href={section.categoryHref} className="hidden items-center gap-1 text-sm font-semibold text-accent hover:text-accent-strong sm:inline-flex">
                {t("home.viewAll")}
                <Icon name="arrow-right" size={15} />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <FeaturedToolCard tool={featured} accent={section.accent} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-3 lg:content-start">
                {sides.map((tool) => (
                  <SideToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function FavoritesSection() {
  const { favorites, t } = usePreferences();
  const items = favorites.map((slug) => TOOL_MAP[slug]).filter(Boolean) as ToolMeta[];

  return (
    <section aria-labelledby="favorites-heading" className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
      <h2 id="favorites-heading" className="flex items-center gap-2 text-base font-semibold text-ink">
        <Icon name="heart" size={17} className="text-accent" />
        {t("home.favorites")}
      </h2>
      {items.length === 0 ? (
        <div className="mt-4 flex flex-1 flex-col items-start gap-3">
          <p className="text-sm text-muted">{t("home.noFavorites")}</p>
          <Link href="/tools" className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-accent-soft px-3.5 text-xs font-semibold text-accent-strong">
            {t("home.exploreTools")}
            <Icon name="arrow-right" size={14} />
          </Link>
        </div>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-2">
          {items.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/tools/${tool.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent-soft px-3.5 py-2 text-xs font-medium text-accent-strong"
              >
                <Icon name={resolveIcon(tool.icon)} size={14} />
                {tool.shortTitle}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
