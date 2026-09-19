import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How Travel Utility uses cookies and local storage, and how to change your preferences.",
  alternates: { canonical: "/cookies" },
};

const UPDATED = "1 January 2026";

export default function CookiesPage() {
  return (
    <article className="page-shell max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Cookie Policy</h1>
      <p className="mt-2 text-xs text-muted">Last updated: {UPDATED}</p>
      <div className="mt-6 space-y-5 text-sm text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">Essential storage</h2>
          <p className="mt-2">
            Essential local storage remembers your unit, currency and language preferences and keeps your tools
            working. It does not require consent because the site cannot function without it.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Optional analytics</h2>
          <p className="mt-2">
            Analytics helps us understand which tools are useful. It is disabled until you opt in through the cookie
            preferences banner. You can change your choice at any time using the preferences button.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Optional advertising</h2>
          <p className="mt-2">
            Advertising slots are present in the layout but remain empty and inactive unless you consent. We do not
            display fake adverts.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Managing your preferences</h2>
          <p className="mt-2">
            Use the Cookie preferences control at the bottom of the page to accept or reject optional categories.
            You can also clear all locally stored data through your browser settings.
          </p>
        </section>
      </div>
    </article>
  );
}
