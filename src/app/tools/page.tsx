import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { CATEGORIES } from "@/lib/catalog";
import type { ToolCategoryId } from "@/lib/types";

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
      <div className="max-w-3xl">
        <p className="eyebrow text-accent">Directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Travel Tools</h1>
        <p className="mt-3 text-sm leading-7 text-muted">Every tool works immediately, with no account required.</p>
      </div>
      <div className="mt-8">
        <ToolsExplorer initialQuery={q ?? ""} initialCategory={initialCategory} />
      </div>
    </div>
  );
}
