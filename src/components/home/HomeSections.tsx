"use client";

import Link from "next/link";
import { usePreferences } from "@/components/providers/PreferencesProvider";
import { useSearch } from "@/components/search/SearchProvider";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import { CATEGORY_PATHS } from "@/lib/constants";
import { TOOL_MAP, type ToolMeta } from "@/lib/catalog";
import { HOME_FAQS } from "@/lib/faq";

const HERO_CHIPS = [
  "fuel-cost-calculator",
  "road-trip-cost-calculator",
  "currency-converter",
  "travel-budget-calculator",
  "packing-list-generator",
];

const POPULAR_ACCENTS = [
  { icon: "bg-[#e8f0fa] text-[#0c3c78]", bar: "from-[#0c3c78] to-[#0c6ebd]", glow: "group-hover:shadow-[0_16px_32px_rgba(12,60,120,0.16)]" },
  { icon: "bg-[#fff4e0] text-[#c47a00]", bar: "from-[#f5a623] to-[#f7c14a]", glow: "group-hover:shadow-[0_16px_32px_rgba(245,166,35,0.18)]" },
  { icon: "bg-[#e3f1fb] text-[#0c6ebd]", bar: "from-[#0c6ebd] to-[#1a8fd4]", glow: "group-hover:shadow-[0_16px_32px_rgba(12,110,189,0.16)]" },
  { icon: "bg-[#e8f7ef] text-[#1a7a4c]", bar: "from-[#1a7a4c] to-[#34a06a]", glow: "group-hover:shadow-[0_16px_32px_rgba(26,122,76,0.16)]" },
  { icon: "bg-[#fdecea] text-[#c2410c]", bar: "from-[#c2410c] to-[#ea580c]", glow: "group-hover:shadow-[0_16px_32px_rgba(194,65,12,0.16)]" },
  { icon: "bg-[#eee8fa] text-[#5b4aa8]", bar: "from-[#5b4aa8] to-[#7c6bc4]", glow: "group-hover:shadow-[0_16px_32px_rgba(91,74,168,0.16)]" },
];

export function HomeHero() {
  const { t } = usePreferences();
  const { openSearch } = useSearch();

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#0c3c78_0%,#0a5a9c_55%,#eef2f6_100%)]">
      <div className="page-shell py-10 sm:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{t("home.heroBadge")}</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {t("home.heroTitle")} {t("home.heroTitleAccent")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">{t("home.heroSubtitle")}</p>
        </div>

        <div className="mx-auto mt-8 max-w-3xl rounded bg-white p-5 shadow-[0_16px_40px_rgba(8,41,82,0.22)] sm:p-7">
          <button type="button" onClick={openSearch} className="grid w-full gap-3 text-left sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end">
            <span className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-brand">From</span>
              <span className="flex min-h-12 items-center gap-2 rounded border border-border bg-surface-muted px-3 text-sm text-muted">
                <Icon name="route" size={16} className="text-accent" />
                {t("home.searchPlaceholder")}
              </span>
            </span>
            <span className="hidden h-12 w-12 items-center justify-center rounded bg-brand-soft text-brand sm:flex">
              <Icon name="arrow-right" size={18} />
            </span>
            <span className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.14em] text-brand">To</span>
              <span className="flex min-h-12 items-center gap-2 rounded border border-border bg-surface-muted px-3 text-sm text-muted">
                <Icon name="globe" size={16} className="text-accent" />
                {t("home.searchPlaceholder")}
              </span>
            </span>
            <span className="inline-flex min-h-12 items-center justify-center rounded bg-accent px-6 text-sm font-bold text-white hover:bg-accent-strong">
              {t("home.searchButton")}
            </span>
          </button>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{t("home.popularLabel")}</span>
            {HERO_CHIPS.map((slug) => {
              const tool = TOOL_MAP[slug];
              if (!tool) return null;
              return (
                <Link key={slug} href={`/tools/${slug}`} className="text-sm font-medium text-accent hover:underline">
                  {tool.shortTitle}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PopularCard({ tool, index }: { tool: ToolMeta; index: number }) {
  const accent = POPULAR_ACCENTS[index % POPULAR_ACCENTS.length];
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-5 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-1 hover:border-accent/30 ${accent.glow}`}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent.bar}`} />
      <span className="flex items-start justify-between gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent.icon}`}>
          <Icon name={resolveIcon(tool.icon)} size={22} />
        </span>
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted">
          {tool.categoryLabel}
        </span>
      </span>
      <span className="mt-4 text-base font-bold tracking-tight text-ink group-hover:text-accent-strong">{tool.shortTitle}</span>
      <span className="mt-1.5 line-clamp-2 flex-1 text-sm leading-6 text-muted">{tool.description}</span>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Open tool
        <Icon name="arrow-right" size={15} className="transition group-hover:translate-x-1" />
      </span>
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

const ACCENT_CLASSES: Record<string, { icon: string; bar: string; text: string; glow: string }> = {
  sky: {
    icon: "bg-[#e8f0fa] text-[#0c3c78]",
    bar: "from-[#0c3c78] to-[#0c6ebd]",
    text: "text-[#0c3c78]",
    glow: "group-hover:shadow-[0_16px_32px_rgba(12,60,120,0.16)]",
  },
  emerald: {
    icon: "bg-[#e8f7ef] text-[#1a7a4c]",
    bar: "from-[#1a7a4c] to-[#34a06a]",
    text: "text-[#1a7a4c]",
    glow: "group-hover:shadow-[0_16px_32px_rgba(26,122,76,0.16)]",
  },
  indigo: {
    icon: "bg-[#eee8fa] text-[#5b4aa8]",
    bar: "from-[#5b4aa8] to-[#7c6bc4]",
    text: "text-[#5b4aa8]",
    glow: "group-hover:shadow-[0_16px_32px_rgba(91,74,168,0.16)]",
  },
  cyan: {
    icon: "bg-[#e3f1fb] text-[#0c6ebd]",
    bar: "from-[#0c6ebd] to-[#1a8fd4]",
    text: "text-[#0c6ebd]",
    glow: "group-hover:shadow-[0_16px_32px_rgba(12,110,189,0.16)]",
  },
};

function FeaturedToolCard({ tool, accent }: { tool: ToolMeta; accent: string }) {
  const { t } = usePreferences();
  const colors = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.sky;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-1 hover:border-accent/30 ${colors.glow}`}
    >
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${colors.bar}`} />
      <span className={`relative mt-1 flex h-14 w-14 items-center justify-center rounded-xl ${colors.icon}`}>
        <Icon name={resolveIcon(tool.icon)} size={26} />
      </span>
      <p className={`relative mt-5 text-[0.68rem] font-bold uppercase tracking-[0.16em] ${colors.text}`}>{tool.categoryLabel}</p>
      <h3 className="relative mt-2 text-xl font-bold tracking-tight text-ink group-hover:text-accent-strong">{tool.title}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-6 text-muted">{tool.description}</p>
      <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        {t("tools.openTool")}
        <Icon name="arrow-right" size={16} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function SideToolCard({ tool, accent }: { tool: ToolMeta; accent: string }) {
  const colors = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.sky;
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={`group flex items-center gap-3.5 overflow-hidden rounded-xl border border-border bg-white p-4 shadow-[var(--shadow-sm)] transition duration-200 hover:-translate-y-0.5 hover:border-accent/30 ${colors.glow}`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}>
        <Icon name={resolveIcon(tool.icon)} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-ink group-hover:text-accent-strong">{tool.shortTitle}</span>
        <span className="mt-0.5 block truncate text-xs text-muted">{tool.categoryLabel}</span>
      </span>
      <Icon name="arrow-right" size={15} className="shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-accent" />
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
                  <SideToolCard key={tool.slug} tool={tool} accent={section.accent} />
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
    <section aria-labelledby="favorites-heading" className="flex h-full flex-col rounded border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
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

export function HomeFaq() {
  const { t } = usePreferences();

  return (
    <section aria-labelledby="home-faq-heading" className="page-shell mt-16">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-accent">{t("home.faqEyebrow")}</p>
          <h2 id="home-faq-heading" className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {t("home.faqTitle")}
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">{t("home.faqSubtitle")}</p>
        </div>
        <div className="divide-y divide-border overflow-hidden rounded border border-border bg-surface shadow-[var(--shadow-sm)]">
          {HOME_FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-ink marker:content-none transition hover:bg-surface-muted">
                {faq.question}
                <Icon name="chevron-down" size={16} className="shrink-0 text-muted transition group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
