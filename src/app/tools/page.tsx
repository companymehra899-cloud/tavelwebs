import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { CATEGORIES } from "@/lib/catalog";
import type { ToolCategoryId } from "@/lib/types";
import { HERO_IMAGE } from "@/lib/images";

export const metadata: Metadata = {
  title: "Travel Tools",
  description:
    "Browse every Travel Utility tool grouped by category: road trip costs, travel budgets, time zones and travel planning.",
  alternates: { canonical: "/tools" },
};

const VALID: ToolCategoryId[] = CATEGORIES.map((category) => category.id);

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const initialCategory = VALID.includes(category as ToolCategoryId) ? (category as ToolCategoryId) : "all";

  return (
    <div className="page-shell py-10 sm:py-12">
      <div className="relative mb-8 overflow-hidden rounded-xl">
        <img src={HERO_IMAGE} alt="" className="h-40 w-full object-cover sm:h-52" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="eyebrow text-white/80">Directory</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Travel Tools</h1>
        </div>
      </div>
      <p className="max-w-3xl text-sm leading-7 text-muted">Every tool works immediately, with no account required.</p>
      <div className="mt-8">
        <ToolsExplorer initialQuery={q ?? ""} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
