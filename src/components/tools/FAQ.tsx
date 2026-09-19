import type { ToolFaq } from "@/lib/types";

export function FAQ({ faqs }: { faqs: ToolFaq[] }) {
  if (faqs.length === 0) {
    return null;
  }
  return (
    <section aria-labelledby="faq-heading" className="no-print rounded-[1.75rem] border border-border bg-surface p-6 sm:p-7">
      <h2 id="faq-heading" className="text-xl font-semibold tracking-tight text-ink">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
        {faqs.map((faq) => (
          <details key={faq.question} className="group px-4 py-3">
            <summary className="cursor-pointer list-none text-sm font-medium text-ink marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {faq.question}
                <span aria-hidden="true" className="text-muted transition group-open:rotate-180">
                  v
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm leading-7 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
