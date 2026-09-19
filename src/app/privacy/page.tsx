import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Travel Utility handles personal data and local storage.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "1 January 2026";

export default function PrivacyPage() {
  return (
    <article className="page-shell max-w-3xl py-10 sm:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-xs text-muted">Last updated: {UPDATED}</p>
      <div className="mt-6 space-y-5 text-sm text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground">What we collect</h2>
          <p className="mt-2">
            Travel Utility has no user accounts and no database of personal information. Calculator inputs are
            processed in your browser and are not sent to us unless a tool explicitly contacts an API, such as
            currency rates or location lookup.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Local storage</h2>
          <p className="mt-2">
            We use your browser&apos;s local storage for preferences (units, currency, language), favourites, recently
            used tools, checklists, packing lists and countdowns. This information stays on your device and can be
            cleared at any time through your browser settings.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">External services</h2>
          <p className="mt-2">
            Currency conversion uses a public European Central Bank reference feed. Location lookup, when used,
            sends the place name you type to an OpenStreetMap Nominatim service. Do not enter sensitive personal
            information into these fields.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Analytics and advertising</h2>
          <p className="mt-2">
            The site includes an analytics abstraction and ad placement components that are disabled by default.
            Optional analytics and advertising are only activated if you consent through the cookie preferences
            banner. Essential storage required to operate the site does not require consent.
          </p>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">Your rights</h2>
          <p className="mt-2">
            Because we do not store personal data on our servers, most access and deletion requests are handled by
            clearing your browser storage. If you believe we hold information about you, contact us and we will
            respond in line with applicable law, including the GDPR and UK GDPR.
          </p>
        </section>
      </div>
    </article>
  );
}
