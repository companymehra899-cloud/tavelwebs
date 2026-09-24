import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FavoriteButton } from "@/components/tools/FavoriteButton";
import { FAQ } from "@/components/tools/FAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolErrorBoundary } from "@/components/ToolErrorBoundary";
import { RecordRecent } from "@/components/RecentTools";
import { Icon, resolveIcon } from "@/components/ui/Icon";
import type { ToolMeta } from "@/lib/catalog";
import { CATEGORY_PATHS } from "@/lib/constants";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, toolJsonLd } from "@/lib/seo";
import type { ReactNode } from "react";

export function ToolShell({ tool, children }: { tool: ToolMeta; children: ReactNode }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: tool.categoryLabel, href: CATEGORY_PATHS[tool.category] },
    { label: tool.shortTitle },
  ];

  return (
    <div className="page-shell max-w-6xl py-8 sm:py-10">
      <JsonLd data={toolJsonLd(tool)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqJsonLd(tool.faqs)} />
      <RecordRecent slug={tool.slug} />
      <Breadcrumb items={breadcrumbs} />

      <header className="mt-5 flex flex-wrap items-start justify-between gap-5">
        <div className="flex items-start gap-4">
          <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white sm:flex">
            <Icon name={resolveIcon(tool.icon)} size={24} />
          </span>
          <div>
            <p className="eyebrow text-accent">{tool.categoryLabel}</p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{tool.title}</h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-7 text-muted">{tool.description}</p>
          </div>
        </div>
        <FavoriteButton slug={tool.slug} title={tool.title} />
      </header>

      <div className="mt-7 space-y-3">
        <div className="no-print">
          <AdSlot placement="tool-top" />
        </div>

        <ToolErrorBoundary toolName={tool.title}>{children}</ToolErrorBoundary>

        <div className="no-print">
          <AdSlot placement="result-bottom" />
        </div>

        <section aria-labelledby="about-heading" className="mt-4 grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:grid-cols-2">
          <div>
            <h2 id="about-heading" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
              <Icon name="info" size={18} className="text-accent" />
              About this tool
            </h2>
            <div className="mt-4 space-y-4">
              {tool.explanation.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-sm font-semibold text-ink">{section.heading}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-accent/15 bg-accent-soft/60 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="calculator" size={15} className="text-accent-strong" />
              Formula and methodology
            </h3>
            <p className="mt-2 font-mono text-xs leading-6 text-muted">{tool.formula}</p>
          </div>
        </section>

        <div className="no-print">
          <AdSlot placement="content" />
        </div>
        <FAQ faqs={tool.faqs} />
        <RelatedTools slug={tool.slug} />
        <p className="no-print text-sm text-muted">
          Need something else?{" "}
          <Link href="/tools" className="font-semibold text-accent hover:text-accent-strong">
            Browse all travel tools
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
