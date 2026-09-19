import type { Metadata } from "next";
import Link from "next/link";
import { HomeSearch, FavoritesSection } from "@/components/home/HomeSections";
import { RecentTools } from "@/components/RecentTools";
import { ToolCard } from "@/components/tools/ToolCard";
import { CATEGORIES, TOOLS } from "@/lib/catalog";
import { CATEGORY_PATHS } from "@/lib/constants";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Travel Tools & Calculators",
  description:
    "Free travel calculators for fuel costs, road trips, budgets, currency conversion, time zones, packing lists and trip planning. No account required.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Travel Utility — Travel Tools & Calculators",
    description:
      "Free travel calculators for fuel costs, road trips, budgets, currency conversion, time zones and packing.",
    url: siteUrl(),
  },
};

const POPULAR = [
  "road-trip-cost-calculator",
  "fuel-cost-calculator",
  "travel-budget-calculator",
  "currency-converter",
  "packing-list-generator",
  "time-zone-converter",
];

export default function HomePage() {
  const popular = POPULAR.map((slug) => TOOLS.find((tool) => tool.slug === slug)).filter(
    (tool): tool is (typeof TOOLS)[number] => Boolean(tool),
  );

  return (
    <div className="page-shell py-10 sm:py-14">
      <section
        aria-labelledby="hero-heading"
        className="overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#fffdf8_0%,#e4f3f2_58%,#f8e6d8_100%)] px-6 py-12 text-center shadow-[0_18px_50px_rgba(28,36,48,0.08)] sm:px-12 sm:py-16"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-strong">Free travel utilities</p>
        <h1 id="hero-heading" className="mt-3 text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Travel Tools &amp; Calculators
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
          Simple tools to plan trips, calculate travel costs, convert currencies and prepare for your journey.
        </p>
        <div className="mx-auto mt-8 max-w-xl">
          <HomeSearch />
        </div>
        <Link
          href="/tools"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-strong"
        >
          Browse all tools
        </Link>
      </section>

      <section aria-labelledby="popular-heading" className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 id="popular-heading" className="text-2xl font-semibold tracking-tight text-ink">Popular tools</h2>
          <Link href="/tools" className="hidden text-sm font-medium text-brand hover:underline sm:inline">
            View all
          </Link>
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((tool) => (
            <li key={tool.slug} className="h-full">
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="categories-heading" className="mt-12">
        <h2 id="categories-heading" className="text-2xl font-semibold tracking-tight text-ink">Categories</h2>
        <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <Link
                href={CATEGORY_PATHS[category.id]}
                className="flex h-full flex-col rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(28,36,48,0.06)] transition hover:-translate-y-0.5 hover:border-brand"
              >
                <h3 className="text-base font-semibold text-ink">{category.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                <span className="mt-4 text-sm font-medium text-brand">View category</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-3xl border border-border bg-surface p-6">
          <RecentTools />
        </div>
        <div className="rounded-3xl border border-border bg-surface p-6">
          <FavoritesSection />
        </div>
      </div>
    </div>
  );
}
