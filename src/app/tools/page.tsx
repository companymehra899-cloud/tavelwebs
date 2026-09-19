import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";

export const metadata: Metadata = {
  title: "Travel Tools",
  description:
    "Browse every Travel Utility tool grouped by category: road trip costs, travel budgets, time zones and travel planning.",
  alternates: { canonical: "/tools" },
};

export default async function ToolsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return (
    <div className="page-shell py-10 sm:py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-strong">Directory</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Travel Tools</h1>
        <p className="mt-3 text-sm leading-7 text-muted">Every tool works immediately, with no account required.</p>
      </div>
      <div className="mt-8">
        <ToolsExplorer initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
