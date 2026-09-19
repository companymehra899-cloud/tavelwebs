import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Travel Utility calculators and tools.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "1 January 2026";

export default function TermsPage() {
  return (
    <article className="page-shell max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Terms of Use</h1>
      <p className="mt-2 text-xs text-muted">Last updated: {UPDATED}</p>
      <div className="mt-6 space-y-5 text-sm text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Estimates only</h2>
          <p className="mt-2">
            All results are estimates based on the values you enter. Fuel prices, toll costs, electricity prices,
            exchange rates and travel times change frequently and may differ from the figures you see here. Do not
            rely on a single estimate for financial decisions.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">No professional advice</h2>
          <p className="mt-2">
            The tools and content do not constitute professional, legal, medical, financial or travel advice. Jet
            lag suggestions are general guidance only. For legal, visa or health questions, consult official sources
            or a qualified professional.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Acceptable use</h2>
          <p className="mt-2">
            You agree to use the site lawfully and not to attempt to disrupt, overload or misuse the service or its
            external data sources.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Third-party data</h2>
          <p className="mt-2">
            Currency rates and location lookups rely on third-party services. We do not guarantee their accuracy,
            availability or continued operation. Where data cannot be retrieved, the site shows an unavailable
            state rather than substitute values.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Limitation of liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, we are not liable for any loss arising from use of the site or
            reliance on its estimates.
          </p>
        </section>
      </div>
    </article>
  );
}
