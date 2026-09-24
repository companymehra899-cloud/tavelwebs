import type { ToolFaq } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";

export function FAQ({ faqs }: { faqs: ToolFaq[] }) {
  if (faqs.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="faq-heading" className="no-print rounded-2xl border border-border bg-surface p-6 sm:p-7">
      <h2 id="faq-heading" className="flex items-center gap-2 text-lg font-bold tracking-tight text-ink">
        <Icon name="info" size={18} className="text-accent" />
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group bg-surface">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-ink marker:content-none hover:bg-surface-muted">
              {faq.question}
              <Icon name="chevron-down" size={16} className="shrink-0 text-muted transition group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 text-sm leading-7 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
