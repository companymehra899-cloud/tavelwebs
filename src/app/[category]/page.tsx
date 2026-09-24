import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/catalog";
import { ToolCard } from "@/components/tools/ToolCard";

export const dynamicParams = false;

const VALID = ["road-trips", "travel-calculators", "currency", "travel-planning"];

export function generateStaticParams() {
  return VALID.map((slug) => ({ category: slug }));
}

function categoryForSlug(slug: string) {
  if (slug === "road-trips") return CATEGORIES.find((cat) => cat.id === "road-trips");
  if (slug === "currency") return CATEGORIES.find((cat) => cat.id === "currency");
  if (slug === "travel-planning") return CATEGORIES.find((cat) => cat.id === "travel-planning");
  if (slug === "travel-calculators") return CATEGORIES.find((cat) => cat.id === "travel-budget");
  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryForSlug(category);
  if (!meta) return {};
  return {
    title: category === "travel-calculators" ? "Travel Calculators" : meta.label,
    description:
      category === "travel-calculators"
        ? "Budget, daily spend, cost per person and travel-time calculators."
        : meta.description,
    alternates: { canonical: `/${category}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  if (!VALID.includes(slug)) {
    notFound();
  }
  const meta = categoryForSlug(slug);
  const tools = TOOLS.filter((tool) =>
    slug === "travel-calculators"
      ? tool.category === "travel-budget" || tool.category === "travel-time"
      : tool.category === meta?.id,
  );
  const heading = slug === "travel-calculators" ? "Travel Calculators" : meta?.label ?? "Tools";

  return (
    <div className="page-shell py-10 sm:py-12">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span aria-hidden="true"> / </span>
        <span className="font-semibold text-ink">{heading}</span>
      </nav>
      <p className="eyebrow mt-5 text-accent">Category</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{heading}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{meta?.description}</p>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <li key={tool.slug} className="h-full">
            <ToolCard tool={tool} />
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">
        Looking for something else? <Link href="/tools" className="text-brand hover:underline">Browse all travel tools</Link>.
      </p>
    </div>
  );
}
