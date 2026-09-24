import type { Metadata } from "next";
import { CategoryShowcase, FavoritesSection, HomeHero, PopularTools } from "@/components/home/HomeSections";
import { RecentTools } from "@/components/RecentTools";
import { Icon } from "@/components/ui/Icon";
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

const VALUES = [
  { icon: "bolt" as const, title: "Instant answers", body: "Every calculator runs in your browser and responds the moment you type." },
  { icon: "shield" as const, title: "No account needed", body: "No sign-up, no tracking walls. Favourites and history stay on your device." },
  { icon: "globe" as const, title: "Built for Europe", body: "Metric and imperial units, live ECB reference rates and IANA time zones." },
];

export default function HomePage() {
  return (
    <div className="pb-4">
      <HomeHero />

      <div className="mt-6">
        <PopularTools />
      </div>

      <div className="mt-16">
        <CategoryShowcase />
      </div>

      <section className="page-shell mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <RecentTools />
        </div>
        <FavoritesSection />
      </section>

      <section className="page-shell mt-16">
        <div className="grid gap-4 rounded-[1.75rem] border border-border bg-surface p-6 sm:grid-cols-3 sm:p-8">
          {VALUES.map((value) => (
            <div key={value.title} className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-strong">
                <Icon name={value.icon} size={20} />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-ink">{value.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{value.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
