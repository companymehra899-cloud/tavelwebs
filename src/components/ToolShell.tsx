import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FavoriteButton } from "@/components/tools/FavoriteButton";
import { FAQ } from "@/components/tools/FAQ";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolErrorBoundary } from "@/components/ToolErrorBoundary";
import { RecordRecent } from "@/components/RecentTools";
import type { ToolMeta } from "@/lib/catalog";
import { breadcrumbJsonLd, faqJsonLd, JsonLd, toolJsonLd } from "@/lib/seo";
import type { ReactNode } from "react";

export function ToolShell({ tool, children }: { tool: ToolMeta; children: ReactNode }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: tool.shortTitle },
  ];

  return (
    <div className="page-shell max-w-4xl py-8 sm:py-10">
      <JsonLd data={toolJsonLd(tool)} />
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={faqJsonLd(tool.faqs)} />
      <RecordRecent slug={tool.slug} />
      <Breadcrumb items={breadcrumbs} />
      <div className="mt-5 overflow-hidden rounded-[2rem] border border-border bg-surface p-6 shadow-[0_16px_40px_rgba(28,36,48,0.07)] sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-strong">{tool.categoryLabel}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">{tool.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">{tool.description}</p>
          </div>
          <FavoriteButton slug={tool.slug} title={tool.title} />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <div className="no-print">
          <AdSlot placement="tool-top" />
        </div>
        <ToolErrorBoundary toolName={tool.title}>{children}</ToolErrorBoundary>
        <div className="no-print">
          <AdSlot placement="result-bottom" />
        </div>

        <section aria-labelledby="about-heading" className="rounded-[1.75rem] border border-border bg-surface p-6 sm:p-7">
          <h2 id="about-heading" className="text-xl font-semibold text-ink">
            About this tool
          </h2>
          <div className="mt-4 space-y-4">
            {tool.explanation.map((section) => (
              <div key={section.heading}>
                <h3 className="text-sm font-semibold text-ink">{section.heading}</h3>
                <p className="mt-1 text-sm leading-7 text-muted">{section.body}</p>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-soft/70 p-4">
              <h3 className="text-sm font-semibold text-ink">Formula and methodology</h3>
              <p className="mt-1 font-mono text-xs leading-6 text-muted">{tool.formula}</p>
            </div>
          </div>
        </section>

        <div className="no-print">
          <AdSlot placement="content" />
        </div>
        <FAQ faqs={tool.faqs} />
        <RelatedTools slug={tool.slug} />
        <p className="no-print text-sm text-muted">
          Need something else? <Link href="/tools" className="text-brand hover:underline">Browse all travel tools</Link>.
        </p>
      </div>
    </div>
  );
}
